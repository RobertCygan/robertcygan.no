const modal = document.getElementById('cert-modal');
if (modal) {
  const title = document.getElementById('cert-modal-title');
  const status = document.getElementById('cert-status');
  const viewport = document.getElementById('cert-pdf-viewport');
  const canvas = document.getElementById('cert-canvas');
  const missing = document.getElementById('cert-missing');
  const openLink = document.getElementById('cert-modal-open');
  const download = document.getElementById('cert-modal-download');
  const controls = document.getElementById('cert-page-controls');
  let library, pdf, loading, rendering, pageNumber = 1, serial = 0, resizeTimer;
  const loadLibrary = () => library ||= import('./vendor/pdfjs/pdf.min.mjs').then(module => {
    module.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
    return module;
  });
  function clearDocument() {
    serial++;
    rendering?.cancel(); rendering = null;
    loading?.destroy().catch(() => {}); loading = null;
    pdf?.destroy().catch(() => {}); pdf = null;
    canvas.removeAttribute('data-rendered');
    canvas.width = 0; canvas.height = 0;
    clearTimeout(resizeTimer);
  }
  async function renderPage(ticket = serial) {
    if (!pdf || !modal.open) return;
    rendering?.cancel();
    try {
      const page = await pdf.getPage(pageNumber);
      if (ticket !== serial || !modal.open) return;
      const base = page.getViewport({ scale: 1 });
      const width = Math.max(160, viewport.clientWidth - 32);
      const scale = width / base.width;
      const density = Math.min(devicePixelRatio || 1, 2);
      const scaled = page.getViewport({ scale: scale * density });
      canvas.width = Math.ceil(scaled.width); canvas.height = Math.ceil(scaled.height);
      canvas.style.width = `${Math.floor(width)}px`;
      canvas.style.height = `${Math.floor(base.height * scale)}px`;
      const task = page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport: scaled, background: '#fff' });
      rendering = task;
      await task.promise;
      if (ticket !== serial || rendering !== task) return;
      rendering = null;
      canvas.dataset.rendered = 'true';
      document.getElementById('cert-page-number').textContent = `Side ${pageNumber} av ${pdf.numPages}`;
      document.getElementById('cert-prev').disabled = pageNumber === 1;
      document.getElementById('cert-next').disabled = pageNumber === pdf.numPages;
      controls.hidden = pdf.numPages < 2;
      status.textContent = '';
    } catch (error) {
      if (ticket !== serial || error.name === 'RenderingCancelledException') return;
      console.warn('Certificate preview rendering failed:', error);
      status.textContent = 'Kunne ikke vise forhåndsvisningen. Bruk «Åpne PDF» eller «Last ned».';
    }
  }
  async function openCertificate(trigger) {
    clearDocument();
    const ticket = serial;
    title.textContent = trigger.dataset.certTitle || trigger.textContent.trim();
    const path = trigger.getAttribute('href');
    const available = Boolean(path && !trigger.dataset.certMissing);
    missing.hidden = available; viewport.hidden = !available;
    openLink.hidden = !available; download.hidden = !available; controls.hidden = true;
    status.textContent = available ? 'Laster sertifikatet …' : '';
    canvas.setAttribute('aria-label', title.textContent);
    if (!available) document.getElementById('cert-missing-message').textContent = trigger.dataset.certMissing;
    else {
      openLink.href = path; download.href = path; download.download = path.split('/').pop();
    }
    modal.classList.add('open'); modal.showModal();
    document.body.classList.add('cert-modal-open');
    if (!available) return;
    try {
      const pdfjs = await loadLibrary();
      if (ticket !== serial || !modal.open) return;
      loading = pdfjs.getDocument({
        url: new URL(path, document.baseURI).href,
        standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href,
        isEvalSupported: false,
        isImageDecoderSupported: false,
        isOffscreenCanvasSupported: false
      });
      const documentPdf = await loading.promise;
      if (ticket !== serial || !modal.open) { await documentPdf.destroy(); return; }
      loading = null; pdf = documentPdf; pageNumber = 1;
      await renderPage(ticket);
    } catch (error) {
      if (ticket === serial && modal.open) {
        console.warn('Certificate preview loading failed:', error);
        status.textContent = 'Kunne ikke laste forhåndsvisningen. Bruk «Åpne PDF» eller «Last ned».';
      }
    }
  }
  document.querySelectorAll('[data-certificate]').forEach(trigger => trigger.addEventListener('click', event => {
    if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); openCertificate(trigger);
  }));
  modal.querySelectorAll('[data-cert-close]').forEach(button => button.addEventListener('click', () => modal.close()));
  modal.addEventListener('close', () => {
    clearDocument(); modal.classList.remove('open'); document.body.classList.remove('cert-modal-open');
  });
  document.getElementById('cert-prev').addEventListener('click', () => { if (pdf && pageNumber > 1) { pageNumber--; renderPage(); } });
  document.getElementById('cert-next').addEventListener('click', () => { if (pdf && pageNumber < pdf.numPages) { pageNumber++; renderPage(); } });
  addEventListener('resize', () => {
    if (modal.open && pdf) { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => renderPage(), 150); }
  });
}
