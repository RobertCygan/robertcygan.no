"""Browser regression checks. Run: python3 -m unittest discover -s tests -v.
Requires Python Playwright and Chromium (CHROMIUM_PATH may select its executable).
The test server is local and never deploys or changes website files.
"""
import csv
import hashlib
import io
import os
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import unittest
from urllib.request import urlopen
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            # Closing a modal intentionally aborts its outstanding iframe requests.
            pass

class PortfolioTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
        cls.thread = Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f'http://127.0.0.1:{cls.server.server_port}'
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox','--enable-unsafe-swiftshader'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce', accept_downloads=True)
        # Public portfolio must remain usable when optional GitHub metadata is unavailable.
        self.context.route('https://api.github.com/**', lambda route: route.abort())
        self.page = self.context.new_page()
        self.page.set_default_timeout(7000)
        self.page.set_default_navigation_timeout(30000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def visit(self, path=''):
        self.page.goto(self.base + '/' + path, wait_until='domcontentloaded')
        self.page.evaluate('() => document.fonts.ready')

    def test_content_and_project_order(self):
        self.visit()
        expect(self.page.locator('.stats-bar')).to_have_count(0)
        expect(self.page.locator('#arbeidserfaring .work-title').filter(has_text='Økonomikonsulent')).to_have_count(2)
        expect(self.page.locator('#arbeidserfaring .work-card').first).to_contain_text('Steigen kommune')
        expect(self.page.locator('#arbeidserfaring .work-card')).to_have_count(12)
        expect(self.page.locator('#arbeidserfaring')).not_to_contain_text('bydel Nordstrand')
        expect(self.page.locator('.contact-card a[href="https://www.gpsi.ai"]')).to_have_text('www.gpsi.ai')
        expect(self.page.locator('#kurs-sertifisering')).not_to_contain_text('SQL Advanced')
        expect(self.page.locator('#kurs-sertifisering')).to_contain_text('KSE – KS Eiendomsskatteforum')
        for skill in ['KOMTEK', 'AGRESSO', 'ELEMENTS', 'Eiendomsskatt', 'Fakturering']:
            expect(self.page.locator('.skills-panel')).to_contain_text(skill)
        titles = self.page.locator('.app-tile-name').all_text_contents()
        self.assertEqual(titles[:3], ['FlexiT – Arbeidstidsregistrering', 'Utgiftsanalyse', 'Eiendomsskatt · 2010–2026'])
        self.assertEqual(titles[-1], 'InvoiceFlowAI')
        self.assertNotIn('REKASS', self.page.locator('#prosjekter').inner_text())
        self.assertTrue(self.page.evaluate("document.fonts.check('500 14px Montserrat')"))

    def test_responsive_alignment(self):
        self.visit()
        for width in [320, 390, 768, 1024, 1280, 1440, 1920, 2180, 2560]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 1000})
                self.page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
                layout = self.page.evaluate('''() => {
                  const rect = s => document.querySelector(s).getBoundingClientRect();
                  return { overflow:document.documentElement.scrollWidth > innerWidth,
                    labels:[...document.querySelectorAll('.hero-sig-label')].map(e=>e.getBoundingClientRect().top),
                    heroLeft:rect('.hero-content').left,
                    sectionLeft:rect('#om-meg').left + parseFloat(getComputedStyle(document.querySelector('#om-meg')).paddingLeft),
                    navRight:rect('.nav-cta').right,
                    sections:[...document.querySelectorAll('body>.section')].map(e=>({left:e.getBoundingClientRect().left,width:e.getBoundingClientRect().width})) };
                }''')
                self.assertFalse(layout['overflow'])
                self.assertLessEqual(max(layout['labels'])-min(layout['labels']), 1)
                self.assertAlmostEqual(layout['heroLeft'], layout['sectionLeft'], delta=1)
                self.assertLessEqual(layout['navRight'], width)
                for section in layout['sections']:
                    self.assertAlmostEqual(section['left'],0,delta=1)
                    self.assertAlmostEqual(section['width'],width,delta=1)
        for path in ['utgiftsanalyse.html', 'eiendomsskatt-simulasjon-2010-2026.html', 'flexit-lederpanel.html', 'invoiceflowai.html']:
            for width in [320, 390, 768]:
                with self.subTest(path=path,width=width):
                    self.page.set_viewport_size({'width':width,'height':850})
                    self.visit(path)
                    self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))

    def test_demos_open_and_close_with_keyboard(self):
        self.visit()
        media = self.page.locator('.app-tile-media')
        media.first.click()
        self.page.frame_locator('#demo-modal-iframe').locator('[data-act="open"]').first.click()
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#demo-modal')).not_to_be_visible()
        for i in range(media.count()):
            with self.subTest(tile=i):
                media.nth(i).focus()
                media.nth(i).press('Enter')
                expect(self.page.locator('#demo-modal')).to_be_visible()
                expect(self.page.locator('#demo-modal')).to_have_attribute('open', '')
                frame = self.page.frame_locator('#demo-modal-iframe')
                expect(frame.locator('body')).not_to_be_empty()
                self.page.keyboard.press('Escape')
                expect(self.page.locator('#demo-modal')).not_to_be_visible()
                expect(media.nth(i)).to_be_focused()

    def test_certificate_tags_and_cards_render_real_pdfs(self):
        self.visit()
        files=['python.pdf','bi.pdf','excel.pdf','cyber.pdf','datascience.pdf']
        for scope in ['.skills-tags','.cert-grid']:
            for filename in files:
                with self.subTest(scope=scope,file=filename):
                    trigger=self.page.locator(f'{scope} a[href="{filename}"]')
                    try:
                        with self.page.expect_response(lambda response: response.url.endswith('/'+filename)) as received:
                            trigger.click()
                        response=received.value
                        self.assertEqual(response.status,200)
                        self.assertEqual(hashlib.sha256(response.body()).hexdigest(),hashlib.sha256((ROOT/filename).read_bytes()).hexdigest())
                        expect(self.page.locator('#cert-modal')).to_be_visible()
                        expect(self.page.locator('#cert-canvas')).to_have_attribute('data-rendered','true',timeout=20000)
                        expect(self.page.locator('#cert-modal-open')).to_have_attribute('href',filename)
                        expect(self.page.locator('#cert-modal-download')).to_have_attribute('download',filename)
                        self.assertGreater(self.page.locator('#cert-canvas').evaluate('e=>e.width'),500)
                        self.assertGreater(self.page.locator('#cert-canvas').evaluate('e=>e.toDataURL().length'),20000)
                    finally:
                        if self.page.locator('#cert-modal').is_visible():
                            self.page.keyboard.press('Escape')
                            expect(self.page.locator('#cert-modal')).not_to_be_visible()
                    expect(trigger).to_be_focused()
        self.page.locator('.skills-tags a[href="python.pdf"]').focus()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('#cert-canvas')).to_have_attribute('data-rendered','true',timeout=20000)
        with self.page.expect_download() as event:
            self.page.locator('#cert-modal-download').click()
        self.assertEqual(Path(event.value.path()).read_bytes(),(ROOT/'python.pdf').read_bytes())

    def test_unpublished_certificate_is_explicit(self):
        self.visit()
        self.page.locator('.skills-tags [data-cert-missing]').click()
        expect(self.page.locator('#cert-missing')).to_be_visible()
        expect(self.page.locator('#cert-missing-message')).to_contain_text('når det er mottatt')
        expect(self.page.locator('#cert-modal-download')).not_to_be_visible()
        expect(self.page.locator('#cert-pdf-viewport')).not_to_be_visible()
        self.page.keyboard.press('Escape')
        for title in ['ACCA · Financial Accounting','ISO/IEC 27001 Lead Auditor']:
            self.page.locator(f'.cert-card[data-cert-title="{title}"]').click()
            expect(self.page.locator('#cert-missing-message')).to_contain_text('ikke publisert')
            self.page.keyboard.press('Escape')

    def test_quote_two_lines_and_gpsi_footer(self):
        self.visit()
        for width in [1280,1440,1920,2180,2560]:
            self.page.set_viewport_size({'width':width,'height':1000})
            self.page.evaluate('() => new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
            lines=self.page.locator('.quote-line').evaluate_all("elements=>elements.map(e=>{const range=document.createRange();range.selectNodeContents(e);return range.getClientRects().length})")
            self.assertEqual(lines,[1,1])
        credit=self.page.locator('.footer-creator')
        expect(credit).to_contain_text('Nettsiden er designet og utviklet av')
        expect(credit).to_contain_text('G-PSI')
        expect(credit).to_have_attribute('href','https://www.gpsi.ai')
        self.assertGreater(credit.locator('img').evaluate('e=>e.naturalWidth'),0)
        center=credit.evaluate('e=>{const r=e.getBoundingClientRect();return r.left+r.width/2}')
        self.assertAlmostEqual(center,1280,delta=1)

    def test_expenses_filters_search_export(self):
        self.visit('utgiftsanalyse.html')
        initial = self.page.locator('.kpi b').first.inner_text()
        expect(self.page.locator('.kpi b').nth(1)).to_have_text('216')
        self.page.locator('#year').select_option('2016')
        self.assertNotEqual(initial,self.page.locator('.kpi b').first.inner_text())
        self.page.locator('#sector').select_option('0')
        expect(self.page.locator('.kpi b').nth(1)).to_have_text('36')
        self.page.locator('#measure').select_option('capita')
        expect(self.page.locator('.kpi').first).to_contain_text('Kr per innbygger')
        self.page.locator('[data-view="categories"]').click()
        expect(self.page.locator('tbody tr')).to_have_count(10)
        self.page.locator('[data-view="suppliers"]').click()
        expect(self.page.locator('tbody tr')).to_have_count(3)
        self.page.locator('[data-view="transactions"]').click()
        self.page.locator('#search').fill('Demoleverandør 01')
        expect(self.page.locator('tbody tr')).to_have_count(12)
        with self.page.expect_download() as event:
            self.page.locator('#export').click()
        exported = list(csv.reader(io.StringIO(Path(event.value.path()).read_text(encoding='utf-8-sig')),delimiter=';'))
        self.assertEqual(len(exported),13)
        self.assertTrue(all(row[1]=='Demoleverandør 01' and row[0].startswith('DEMO-2016') for row in exported[1:]))
        self.page.locator('#search').fill('not-a-supplier')
        expect(self.page.locator('.empty')).to_be_visible()
        self.page.locator('#reset').click()
        expect(self.page.locator('.kpi b').nth(1)).to_have_text('216')

    def test_tax_scenarios_timeline_and_selection(self):
        self.visit('eiendomsskatt-simulasjon-2010-2026.html')
        expect(self.page.locator('#tax-map')).to_have_attribute('data-ready','true', timeout=15000)
        expect(self.page.locator('#tax-map')).to_have_attribute('data-renderer','webgl')
        expect(self.page.locator('#tax-map canvas')).to_be_visible()
        expect(self.page.locator('#view-3d')).to_have_attribute('aria-pressed','true')
        self.page.locator('#height-scale').fill('2')
        expect(self.page.locator('#height-label')).to_have_text('2,0 ×')
        self.page.locator('#map-height').select_option('amount')
        expect(self.page.locator('#map-scale')).to_contain_text('Høyde: Eiendomsskatt')
        self.page.locator('#view-3d').click()
        expect(self.page.locator('#view-3d')).to_have_text('2D')
        self.page.locator('#view-3d').click()
        initial = self.page.locator('.kpi b').first.inner_text()
        self.page.locator('#rate').fill('6')
        self.assertNotEqual(initial,self.page.locator('.kpi b').first.inner_text())
        self.page.locator('#tax-table button[data-district="0"]').focus()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('.selection')).to_have_text('Grunnkrets 01')
        self.page.locator('#exemption').select_option('exempt')
        expect(self.page.locator('.kpi b').first).to_have_text('0 kr')
        self.page.locator('#reset').click()
        expect(self.page.locator('.kpi b').first).to_have_text(initial)
        self.page.locator('#play').click()
        expect(self.page.locator('#year')).to_have_value('2010')
        expect(self.page.locator('#year')).not_to_have_value('2010',timeout=2500)
        self.page.locator('#play').click()
        expect(self.page.locator('#play')).to_have_attribute('aria-pressed','false')
        year=self.page.locator('#year').input_value()
        self.page.wait_for_timeout(1300)
        expect(self.page.locator('#year')).to_have_value(year)

    def test_flexit_calendar_approval_and_persistence(self):
        self.visit('flexit-lederpanel.html')
        self.page.locator('#open-105118').click()
        expect(self.page.locator('#dv-kalender')).to_have_attribute('aria-pressed','true')
        self.page.locator('#dv-liste').click()
        expect(self.page.locator('#dv-liste')).to_have_attribute('aria-pressed','true')
        self.page.locator('#dv-kalender').click()
        self.page.locator('#approve').click()
        expect(self.page.locator('#revoke-ask')).to_be_visible()
        self.page.reload(wait_until='networkidle')
        self.page.locator('#open-105118').click()
        expect(self.page.locator('#revoke-ask')).to_be_visible()

    def test_flexit_android_start_stop_and_absence(self):
        self.visit('flexit-lederpanel.html')
        expect(self.page.locator('#app-absence')).to_have_attribute('open','')
        self.page.locator('#app-start').click()
        expect(self.page.locator('#app-work-status')).to_contain_text('På jobb')
        expect(self.page.locator('#app-timer')).not_to_have_text('00:00:00',timeout=2500)
        self.page.locator('#app-stop').click()
        expect(self.page.locator('#app-work-status')).to_contain_text('stoppet')
        expect(self.page.locator('#app-stop')).to_be_disabled()
        self.page.locator('[data-absence="Sykefravær"]').click()
        self.page.locator('#absence-save').click()
        expect(self.page.locator('#absence-message')).to_contain_text('Sykefravær registrert')
        self.page.locator('.android-copy a[href="#app"]').click()
        expect(self.page.locator('#open-105118')).to_be_visible()

    def test_download_and_anonymous_data(self):
        self.visit('invoiceflowai.html')
        with self.page.expect_download() as event:
            self.page.locator('a[download]').click()
        binary=Path(event.value.path()).read_bytes()
        self.assertEqual(hashlib.sha256(binary).hexdigest(),'667f09daadc95a9200ce4cf2415b62df1fa086a1d46b254fbcd9ff9e99c06bb1')
        for path in ['utgiftsanalyse.html','eiendomsskatt-simulasjon-2010-2026.html','assets/municipal-demo.js','assets/project-preview.js']:
            source=(ROOT/path).read_text().lower()
            for original in ['steigen','ready2.xlsm','basisdata.xlsm','18480101']:
                self.assertNotIn(original,source)
        for path in ['assets/flexit-logo.png','assets/fonts.css','assets/vendor/fontawesome/webfonts/fa-solid-900.woff2']:
            with urlopen(self.base+'/'+path) as response:
                self.assertEqual(response.status,200)

    def test_motion_control_and_mobile_menu(self):
        self.visit()
        expect(self.page.locator('#project-motion')).to_have_attribute('aria-pressed','true')
        self.page.locator('#project-motion').click()
        expect(self.page.locator('#project-motion')).to_have_attribute('aria-pressed','false')
        self.page.locator('#project-motion').click()
        self.page.locator('.app-tile-media').first.scroll_into_view_if_needed()
        frame=self.page.frame_locator('.app-tile-media iframe').first
        expect(frame.locator('body')).to_have_class('is-paused')
        self.page.set_viewport_size({'width':390,'height':844})
        self.page.locator('#hamburger').click()
        expect(self.page.locator('#hamburger')).to_have_attribute('aria-expanded','true')
        self.page.locator('#mobile-menu a[href="#prosjekter"]').click()
        expect(self.page.locator('#hamburger')).to_have_attribute('aria-expanded','false')

if __name__=='__main__':
    unittest.main(verbosity=2)
