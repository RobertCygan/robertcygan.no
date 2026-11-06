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
      name:"FlexiT", badge:"PROTOTYPE", caption:"Android: Start / Stopp → Fravær → Lederpanel med kalender",
      graphic: `<g class="flexit-phone"><rect x="15" y="17" width="174" height="249" rx="19" fill="#172018" stroke="#827f90"/><rect x="23" y="34" width="158" height="220" rx="12" fill="#f5f4fa"/><rect x="76" y="21" width="52" height="6" rx="3" fill="#424848"/>${text(36,51,'9:41',8,'paper-text')}<image href="assets/flexit-logo.png" x="83" y="40" width="40" height="40"/>${text(38,91,'Arbeidsdag · Android',11,'paper-text')}<g class="flexit-idle">${text(43,122,'Klar til start',15,'paper-text')}${rect(37,136,128,28,'phone-start',7)}${text(82,154,'START',11,'phone-white')}</g><g class="flexit-running">${text(45,122,'07:45:00',23,'paper-text')}${rect(37,136,128,28,'phone-stop',7)}${text(82,154,'STOPP',11,'phone-white')}</g><g class="flexit-absence">${text(37,186,'Fravær ▾',12,'paper-text')}${rect(34,193,134,48,'phone-menu',5)}${text(43,207,'Ferie · Avspasering',10,'paper-text')}${text(43,222,'Sykefravær · Permisjon',9,'paper-text')}${text(43,236,'Sykt barn · Tjenestereise',9,'paper-text')}</g></g>`+wire(201,138,39)+`<g class="flexit-leader">`+rect(255,36,346,206)+text(273,62,'Lederpanel',17)+text(273,83,'Oktober 2026 · Godkjenning',10,'dim')+calendar(273,102)+rect(421,99,158,120)+text(432,121,'Ansatt 105118',12)+line(432,138,100)+text(432,158,'Fleksitid   +12:40',11)+text(432,178,'Fravær       1 dag',11)+`<g class="approved">${rect(432,190,134,19,'bar',4)}${text(452,204,'✓ GODKJENT',10,'paper-text')}</g></g>`+text(24,289,'01 / ANDROID · START / STOPP / FRAVÆR',9,'gold')+text(255,289,'02 / LEDER · KALENDER / GODKJENNING',9,'gold')
    },
    utgifter: {
      name:"Utgiftsanalyse",badge:"SIMULASJON",caption:"Fiktive fakturalinjer → tjenesteområder → innsikt over tid",
      graphic:rect(20,42,142,196)+text(35,69,"Fakturagrunnlag",13)+[0,1,2,3,4].map(i=>text(35,101+i*25,`201${i+6}   •   DEMO`,11,"dim")).join("")+wire(176,139,51)+rect(245,29,356,225)+text(262,55,"Kommunens utgifter",16)+text(262,76,"2016–2025 · Fiktive data",10,"dim")+rect(262,90,148,47)+text(272,108,"DRIFTSUTGIFTER",9,"dim")+text(272,129,"86,4 mill. kr",19,"gold")+rect(422,90,160,47)+text(433,108,"TJENESTEOMRÅDER",9,"dim")+text(433,129,"6 kategorier",17)+bars(269,223,[36,53,43,67,79])+`<path d="M441 222 466 205 487 212 510 174 536 181 575 152" class="trace"/>`+text(20,279,"01 / DATAGRUNNLAG",11,"gold")+text(245,279,"02 / ØKONOMISK OVERSIKT",11,"gold")
    },
    eiendom: {
      name:"Eiendomsskatt",badge:"2010—2026",caption:"Fiktive grunnkretser → tidslinje → simulert skatteinntekt",
      graphic:rect(20,37,260,214)+text(37,62,'Simulert kommune · 3D',14)+TaxMapIllustration(Array.from({length:12},(_,id)=>({id,name:`Grunnkrets ${id+1}`,height:[400,1150,650,1700,300,1250,850,500,1500,750,1050,350][id],color:['#678565','#8c9d70','#b2af78','#d3b47a'][Math.floor(id/3)]})),{small:true}).replace('<svg ', '<svg x="19" y="77" width="258" height="170" ')+wire(290,137,23)+rect(326,37,275,214)+text(343,64,'Eiendomsskatt',17)+text(343,94,'12,8 mill. kr',27,'gold')+text(343,116,'Høyde: skatt per m²',11,'dim')+`<path d="M343 211 365 203 394 207 425 177 455 167 485 174 515 152 575 137" class="trace"/>`+text(343,235,'2010',10,'dim')+text(548,235,'2026',10,'gold')+text(20,279,'01 / GRUNNKRETSER · SØYLEHØYDER',10,'gold')+text(326,279,'02 / UTVIKLING',11,'gold')
    },
    invoice: {
      name:"InvoiceFlowAI",badge:"KONSEPTVISNING",caption:"Illustrert arbeidsflyt · Import → analyse → kontroll → oversikt",
      graphic:rect(20,56,120,166,"paper",5)+text(33,83,"FAKTURA",13,"paper-text")+line(34,104,78)+line(34,119,56)+line(34,146,78)+line(34,161,56)+text(33,201,"12 500 kr",18,"paper-text")+`<path d="M25 95h110" stroke="#78a47a" stroke-width="3" class="cursor"/>`+wire(152,139,49)+rect(216,89,104,104)+text(242,136,"AI",32,"gold")+text(230,163,"ANALYSE",10,"dim")+wire(332,139,49)+rect(396,41,205,202)+text(413,69,"Fakturakontroll",15)+["Leverandør","Fakturadato","Beløp og mva"].map((t,i)=>text(414,103+i*31,t,12)+text(572,103+i*31,"✓",13,"gold")).join("")+`<g class="approved">${rect(414,189,169,32,"bar",5)}${text(436,209,"Klar for gjennomgang",11,"paper-text")}</g>`+text(20,279,"01 / IMPORT",11,"gold")+text(216,279,"02 / ANALYSE",11,"gold")+text(396,279,"03 / KONTROLL",11,"gold")
    }
  };
  const params = new URLSearchParams(location.search);
  const key = params.get("project") || "invoice";
  const project = Object.hasOwn(projects,key) ? projects[key] : projects.invoice;
  document.title = `${project.name} · Animert presentasjon`;
  document.getElementById("preview").innerHTML = `<header class="preview-head"><div class="brand">${key === "flexit" ? '<img src="assets/flexit-logo.png" alt="">' : ''}${project.name}</div><span class="badge">${project.badge}</span></header><svg viewBox="0 0 620 300" role="img" aria-label="${project.caption}">${project.graphic}</svg><p class="caption">${project.caption}</p>`;
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
