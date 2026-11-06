"use strict";
(() => {
  const rect = (x,y,w,h,cls="panel",rx=6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
  const text = (x,y,value,size=12,cls="") => `<text x="${x}" y="${y}" font-size="${size}" class="${cls}">${value}</text>`;
  const line = (x,y,w) => `<path d="M${x} ${y}h${w}" stroke="#65715e" stroke-width="3" stroke-linecap="round"/>`;
  const wire = (x,y,w) => `<path d="M${x} ${y}h${w}" class="wire"/><path d="m${x+w-8} ${y-6} 8 6-8 6" fill="none" stroke="#c9a86a" stroke-width="2"/>`;
  const bars = (x,y,widths) => widths.map((h,i)=>rect(x+i*26,y-h,16,h,"bar",3)).join("");
  const calendar = (x,y) => Array.from({length:28},(_,i)=>rect(x+i%7*18,y+Math.floor(i/7)*18,13,13,i%8===0?"bar":"panel",2)).join("");
  const projects = {
    flexit: {
      name:"FlexiT", badge:"PROTOTYPE", caption:"Registrer tid → send måneden → vurder i kalender → godkjenn",
      graphic: rect(20,28,130,228,"panel",18)+rect(30,48,110,188,"paper",10)+text(43,76,"FlexiT",18,"paper-text")+text(43,102,"Arbeidsdag",11,"paper-text")+text(43,133,"07:45",27,"paper-text")+rect(42,151,86,27,"bar",5)+text(55,169,"STOPP",12,"paper-text")+text(43,202,"+02:15 fleks",11,"paper-text")+text(43,221,"Send måned ↗",10,"paper-text")+wire(166,138,62)+rect(247,36,354,206)+text(266,62,"Lederpanel",17)+text(266,83,"Oktober 2026 · Godkjenning",10,"dim")+calendar(267,102)+rect(414,99,165,120)+text(426,121,"Ansatt 105118",12)+line(426,138,100)+text(426,158,"Fleksitid   +12:40",11)+text(426,178,"Fravær       0 dager",11)+`<g class="approved">${rect(426,190,138,19,"bar",4)}${text(448,204,"✓ GODKJENT",10,"paper-text")}</g>`+text(24,279,"01 / ANSATT",11,"gold")+text(247,279,"02 / LEDER",11,"gold")
    },
    utgifter: {
      name:"Utgiftsanalyse",badge:"SIMULASJON",caption:"Fiktive fakturalinjer → tjenesteområder → innsikt over tid",
      graphic:rect(20,42,142,196)+text(35,69,"Fakturagrunnlag",13)+[0,1,2,3,4].map(i=>text(35,101+i*25,`201${i+6}   •   DEMO`,11,"dim")).join("")+wire(176,139,51)+rect(245,29,356,225)+text(262,55,"Kommunens utgifter",16)+text(262,76,"2016–2025 · Fiktive data",10,"dim")+rect(262,90,148,47)+text(272,108,"DRIFTSUTGIFTER",9,"dim")+text(272,129,"86,4 mill. kr",19,"gold")+rect(422,90,160,47)+text(433,108,"TJENESTEOMRÅDER",9,"dim")+text(433,129,"6 kategorier",17)+bars(269,223,[36,53,43,67,79])+`<path d="M441 222 466 205 487 212 510 174 536 181 575 152" class="trace"/>`+text(20,279,"01 / DATAGRUNNLAG",11,"gold")+text(245,279,"02 / ØKONOMISK OVERSIKT",11,"gold")
    },
    eiendom: {
      name:"Eiendomsskatt",badge:"2010—2026",caption:"Fiktive grunnkretser → tidslinje → simulert skatteinntekt",
      graphic:rect(20,37,230,214)+text(37,62,"Simulert kommune",14)+Array.from({length:12},(_,i)=>`<path d="M${39+i%4*47} ${83+Math.floor(i/4)*47}l36 -5 7 32-32 9-11-20Z" fill="${['#506947','#839b63','#a9b27b','#c9a86a'][i%4]}" stroke="#111310" stroke-width="3" class="pulse"/>`).join("")+wire(263,137,36)+rect(316,37,285,214)+text(335,64,"Eiendomsskatt",17)+text(335,94,"12,8 mill. kr",27,"gold")+text(335,116,"Scenario · 4,0 ‰",11,"dim")+`<path d="M335 211 365 203 394 207 425 177 455 167 485 174 515 152 575 137" class="trace"/>`+text(335,235,"2010",10,"dim")+text(548,235,"2026",10,"gold")+text(20,279,"01 / GRUNNKRETSER",11,"gold")+text(316,279,"02 / UTVIKLING",11,"gold")
    },
    invoice: {
      name:"InvoiceFlowAI",badge:"KONSEPTVISNING",caption:"Illustrert arbeidsflyt · Import → analyse → kontroll → oversikt",
      graphic:rect(20,56,120,166,"paper",5)+text(33,83,"FAKTURA",13,"paper-text")+line(34,104,78)+line(34,119,56)+line(34,146,78)+line(34,161,56)+text(33,201,"12 500 kr",18,"paper-text")+`<path d="M25 95h110" stroke="#78a47a" stroke-width="3" class="cursor"/>`+wire(152,139,49)+rect(216,89,104,104)+text(242,136,"AI",32,"gold")+text(230,163,"ANALYSE",10,"dim")+wire(332,139,49)+rect(396,41,205,202)+text(413,69,"Fakturakontroll",15)+["Leverandør","Fakturadato","Beløp og mva"].map((t,i)=>text(414,103+i*31,t,12)+text(572,103+i*31,"✓",13,"gold")).join("")+`<g class="approved">${rect(414,189,169,32,"bar",5)}${text(436,209,"Klar for gjennomgang",11,"paper-text")}</g>`+text(20,279,"01 / IMPORT",11,"gold")+text(216,279,"02 / ANALYSE",11,"gold")+text(396,279,"03 / KONTROLL",11,"gold")
    }
  };
  const params = new URLSearchParams(location.search);
  const key = params.get("project") || "invoice";
  const project = projects[key] || projects.invoice;
  document.title = `${project.name} · Animert presentasjon`;
  document.getElementById("preview").innerHTML = `<header class="preview-head"><div class="brand">${key === "flexit" ? '<img src="assets/flexit-mark.svg" alt="">' : ''}${project.name}</div><span class="badge">${project.badge}</span></header><svg viewBox="0 0 620 300" role="img" aria-label="${project.caption}">${project.graphic}</svg><p class="caption">${project.caption}</p>`;
  const toggle = document.getElementById("motion");
  let manualPause = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let offscreen = false;
  const sync = () => {
    document.body.classList.toggle("is-paused", manualPause || offscreen || document.hidden);
    toggle.setAttribute("aria-pressed", String(manualPause));
    toggle.textContent = manualPause ? "Spill animasjon" : "Pause animasjon";
  };
  toggle.addEventListener("click", () => { manualPause = !manualPause; sync(); });
  if (params.get("embed") === "1") {
    document.querySelector(".controls").hidden = true;
    document.querySelector(".badge").hidden = true;
  }
  addEventListener("message", e => {
    if (e.origin !== location.origin || e.source !== parent || e.data?.type !== "portfolio-motion") return;
    offscreen = !e.data.visible;
    manualPause = Boolean(e.data.paused);
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  sync();
})();
