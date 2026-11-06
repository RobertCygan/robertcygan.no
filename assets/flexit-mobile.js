"use strict";
(() => {
  const container = document.getElementById('android-demo');
  if (!container) return;
  container.innerHTML = `<div class="android-device"><div class="android-screen"><div class="android-status"><span>9:41</span><span aria-label="Android, full dekning og batteri">LTE ▰</span></div><div class="android-brand"><img src="assets/flexit-logo.png" alt="FlexiT"><div><small>MIN ARBEIDSDAG</small><strong>Ansatt 105118</strong></div></div><div class="android-body"><p class="android-date">Demodag · 22. oktober 2026</p><h3 class="android-title">God morgen 👋</h3><div class="android-session"><small id="app-work-status" role="status">Klar til å starte</small><div class="timer" id="app-timer" role="timer" aria-label="Registrert arbeidstid">00:00:00</div><small>Arbeidstid i denne økten</small><div class="android-actions"><button type="button" class="start" id="app-start">▶ Start</button><button type="button" class="stop" id="app-stop" disabled>■ Stopp</button></div></div><details id="app-absence" open><summary>Fravær</summary><div class="absence-panel"><div class="absence-options" aria-label="Fraværstype">${['Ferie','Avspasering','Sykefravær','Permisjon','Sykt barn','Tjenestereise'].map((name,i)=>`<button type="button" data-absence="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div><label for="absence-date">Dato<input id="absence-date" type="date" value="2026-10-22"></label><button type="button" class="absence-save" id="absence-save">Registrer ferie</button><p class="android-message" id="absence-message" role="status"></p></div></details></div><div class="android-bottom"></div></div></div><div class="android-copy"><div class="android-kicker">01 / Android-appen</div><h2 id="android-title">Fra arbeidsdag<br>til lederens oversikt.</h2><p>Start og stopp arbeidstiden rett i appen. Registrer fravær, følg fleksitiden og få oversikt over måneden før den går til godkjenning.</p><ol><li>Trykk <strong>Start</strong> for å prøve tidsregistreringen.</li><li>Åpne <strong>Fravær</strong> og velg fraværstype.</li><li>Utforsk kalenderen og godkjenningen i lederpanelet.</li></ol><p><a href="#app">02 / Se lederpanelet ↓</a></p><p class="demo-note">Interaktiv prototype med oppdiktede data. Registreringene i appvisningen er en demonstrasjon.</p></div>`;
  const start = document.getElementById('app-start'), stop = document.getElementById('app-stop');
  const timer = document.getElementById('app-timer'), status = document.getElementById('app-work-status');
  let started = null, elapsed = 0, tick = null, absence = 'Ferie';
  function update() {
    const seconds = Math.floor((elapsed + (started ? Date.now() - started : 0)) / 1000);
    timer.textContent = [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
  }
  start.addEventListener('click', () => {
    started=Date.now();start.disabled=true;stop.disabled=false;status.textContent='På jobb · Økten er startet';tick=setInterval(update,500);update();
  });
  stop.addEventListener('click', () => {
    if(started)elapsed+=Date.now()-started;started=null;clearInterval(tick);start.disabled=false;stop.disabled=true;status.textContent='Økten er stoppet og registrert';update();
  });
  container.querySelectorAll('[data-absence]').forEach(button => button.addEventListener('click', () => {
    absence=button.dataset.absence;container.querySelectorAll('[data-absence]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.getElementById('absence-save').textContent='Registrer '+absence.toLowerCase();
  }));
  document.getElementById('absence-save').addEventListener('click', () => {
    const input=document.getElementById('absence-date');if(!input.value){input.reportValidity();return;}
    const date=new Date(input.value+'T12:00:00').toLocaleDateString('nb-NO');
    document.getElementById('absence-message').textContent=`${absence} registrert i demonstrasjonen for ${date}.`;
  });
  addEventListener('pagehide', () => clearInterval(tick));
})();
