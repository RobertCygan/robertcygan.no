"use strict";
(() => {
  // All values below are generated for this portfolio. No source municipal data is embedded.
  const $ = id => document.getElementById(id);
  const number = (n,d=0) => new Intl.NumberFormat("nb-NO",{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
  const money = n => Math.abs(n)>=1e6 ? `${number(n/1e6,1)} mill. kr` : `${number(n)} kr`;
  const colors = ["#d3b47a","#91b397","#809ca7","#b6a1b8","#c48d72","#9ea76a"];
  const kpi = (label,value,note) => `<article class="kpi"><small>${label}</small><b>${value}</b><span>${note}</span></article>`;
  const panel = (title,sub,body,wide=false) => `<section class="panel${wide?' wide':''}"><h2>${title}</h2><p class="sub">${sub}</p>${body}</section>`;
  const sum = rows => rows.reduce((s,r)=>s+r.amount,0);
  function lineChart(points,label) {
    const max = Math.max(...points.map(p=>p.value),1)*1.1;
    const x = i => 55 + i/(points.length-1)*650;
    const y = v => 195-v/max*155;
    const path = points.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
    return `<svg class="chart" viewBox="0 0 750 235" role="img" aria-label="${label}"><title>${label}</title>${[0,.5,1].map(v=>`<path d="M55 ${y(max*v)}H710" stroke="#354033" stroke-width="1"/><text x="48" y="${y(max*v)+4}" text-anchor="end">${number(max*v/1e6,1)} m</text>`).join('')}<path d="${path}L705 195H55Z" fill="#d3b47a" opacity=".07"/><path d="${path}" class="line"/>${points.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.value)}" r="4" fill="#d3b47a"><title>${p.year}: ${money(p.value)}</title></circle>${i%Math.ceil(points.length/6)===0||i===points.length-1?`<text x="${x(i)}" y="219" text-anchor="middle">${p.year}</text>`:''}`).join('')}</svg>`;
  }
  function barChart(rows,interactive=false) {
    const max = Math.max(...rows.map(r=>r.amount),1);
    return `<div class="bar-list">${rows.map((r,i)=>`<${interactive?'button type="button"':'div'} class="bar-row" ${interactive?`data-sector="${i}"`:''}><span>${r.name}</span><div class="track"><div class="fill" style="width:${r.amount/max*100}%"></div></div><span class="bar-value">${money(r.amount)}</span></${interactive?'button':'div'}>`).join('')}</div>`;
  }
  function csvDownload(name,headers,rows) {
    const quote = x => '"'+String(x).replaceAll('"','""')+'"';
    const blob = new Blob(['\uFEFF'+[headers,...rows].map(row=>row.map(quote).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function expenses() {
    const years = Array.from({length:10},(_,i)=>2016+i);
    const sectors = ['Helse og omsorg','Oppvekst','Teknisk drift','Administrasjon','Kultur og fritid','Eiendomsforvaltning'];
    const weights = [2.5,2.05,1.2,.8,.45,1.35];
    const rows=[];
    years.forEach((year,yi)=>{
      for(let month=1;month<=12;month++) sectors.forEach((_,sector)=>{
        for(let supplier=0;supplier<3;supplier++) {
          const amount=Math.round((145000+((month*7+supplier*13+sector*3)%19)*6700)*weights[sector]*(1+yi*.038)*(supplier===0?1.4:.8));
          rows.push({year,month,sector,supplier:sector*3+supplier,amount,id:`DEMO-${year}-${String(month).padStart(2,'0')}-${sector+1}${supplier+1}`});
        }
      });
    });
    $('year').innerHTML='<option value="all">2016–2025 · Alle år</option>'+years.map(y=>`<option value="${y}">${y}</option>`).join('');
    $('year').value='2025';
    $('sector').insertAdjacentHTML('beforeend',sectors.map((s,i)=>`<option value="${i}">${s}</option>`).join(''));
    let view='overview';
    const selected = (allYears=false) => rows.filter(r=>(allYears||$('year').value==='all'||r.year===Number($('year').value))&&($('sector').value==='all'||r.sector===Number($('sector').value)));
    const value = r => r.amount * ($('measure').value==='real'?1.025**(2025-r.year):$('measure').value==='capita'?1/5000:1);
    const total = records => records.reduce((n,r)=>n+value(r),0);
    const supplierName = i => `Demoleverandør ${String(i+1).padStart(2,'0')}`;
    function render() {
      const data=selected();
      const all=selected(true);
      const sectorTotals=sectors.map((name,i)=>({name,amount:total(data.filter(r=>r.sector===i))}));
      const annual=years.map(year=>({year,value:total(all.filter(r=>r.year===year))}));
      const suppliers=Array.from({length:18},(_,i)=>({name:supplierName(i),amount:total(data.filter(r=>r.supplier===i)),count:data.filter(r=>r.supplier===i).length})).filter(r=>r.count).sort((a,b)=>b.amount-a.amount);
      const unit=$('measure').value==='capita'?'Kr per innbygger':$('measure').value==='real'?'Faste 2025-kroner':'Nominelle kroner';
      const period=$('year').value==='all'?'2016–2025':$('year').value;
      $('kpis').innerHTML=kpi('Utgifter i utvalget',money(total(data)),`${period} · ${unit}`)+kpi('Fakturalinjer',number(data.length),'Syntetiske eksempelbilag')+kpi('Leverandører',suppliers.length,'Fiktive leverandørnavn')+kpi('Største tjenesteområde',sectorTotals.reduce((a,b)=>a.amount>b.amount?a:b).name,'Basert på valgte filtre');
      document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
      if(view==='overview'||view==='categories') {
        const parts=sectorTotals.map((r,i)=>({start:sectorTotals.slice(0,i).reduce((s,x)=>s+x.amount,0)/total(data)*100,end:sectorTotals.slice(0,i+1).reduce((s,x)=>s+x.amount,0)/total(data)*100}));
        const donut=`<div class="donut-wrap"><div class="donut" role="img" aria-label="Utgiftsandel per tjenesteområde" data-label="${period}" style="background:conic-gradient(${parts.map((p,i)=>`${colors[i]} ${p.start}% ${p.end}%`).join(',')})"></div><div class="legend">${sectorTotals.map((r,i)=>`<span><i style="background:${colors[i]}"></i>${r.name} · ${number(r.amount/total(data)*100,1)} %</span>`).join('')}</div></div>`;
        $('content').innerHTML='<div class="grid">'+panel('Utgifter etter tjenesteområde','Klikk en rad for å filtrere analysen',barChart(sectorTotals,true))+panel('Fordeling av utgifter',`${period} · ${unit}`,donut)+panel('Utvikling 2016–2025','Valgt tjenesteområde · '+unit,lineChart(annual,'Årlige simulerte utgifter'),true)+(view==='categories'?panel('Tallgrunnlag per år','De samme verdiene som i grafen',`<div class="table-scroll"><table><thead><tr><th>ÅR</th><th class="n">UTGIFTER</th></tr></thead><tbody>${annual.map(r=>`<tr><td>${r.year}</td><td class="n">${money(r.value)}</td></tr>`).join('')}</tbody></table></div>`,true):'')+'</div>';
      } else if(view==='suppliers') {
        $('content').innerHTML='<div class="grid">'+panel('Største leverandører','Topp 8 · Fiktive leverandører',barChart(suppliers.slice(0,8)))+panel('Leverandørregister',`${suppliers.length} leverandører i utvalget`,`<div class="table-scroll"><table><thead><tr><th>LEVERANDØR</th><th class="n">LINJER</th><th class="n">BELØP</th></tr></thead><tbody>${suppliers.map(r=>`<tr><td>${r.name}</td><td class="n">${r.count}</td><td class="n">${money(r.amount)}</td></tr>`).join('')}</tbody></table></div>`)+'</div>';
      } else {
        $('content').innerHTML='<section class="panel"><div class="table-head"><div><h2>Fakturalinjer</h2><p class="sub">Søk i bilagsnummer eller demoleverandør. Eksport følger filtre og søk; beløp i nominelle kroner.</p></div><button id="export" type="button">↓ Last ned CSV</button></div><label>Søk<input id="search" type="search" placeholder="DEMO-2025 eller Demoleverandør 01"></label><p class="sub" id="row-count"></p><div class="table-scroll" id="transactions"></div></section>';
        const filtered=()=>data.filter(r=>(r.id+' '+supplierName(r.supplier)).toLowerCase().includes($('search').value.toLowerCase()));
        const table=()=>{
          const records=filtered();
          $('row-count').textContent=`${records.length} treff · Viser de første ${Math.min(100,records.length)} linjene`;
          $('transactions').innerHTML=`<table><thead><tr><th>BILAG</th><th>LEVERANDØR</th><th>TJENESTEOMRÅDE</th><th class="n">BELØP</th></tr></thead><tbody>${records.slice(0,100).map(r=>`<tr><td>${r.id}</td><td>${supplierName(r.supplier)}</td><td>${sectors[r.sector]}</td><td class="n">${number(r.amount)} kr</td></tr>`).join('')}</tbody></table>${records.length?'':'<p class="empty">Ingen fakturalinjer samsvarer med søket.</p>'}`;
        };
        $('search').addEventListener('input',table);
        $('export').addEventListener('click',()=>csvDownload('utgiftsanalyse-simulerte-data.csv',['Bilag','Leverandør','Tjenesteområde','Beløp NOK'],filtered().map(r=>[r.id,supplierName(r.supplier),sectors[r.sector],r.amount])));
        table();
      }
    }
    ['year','sector','measure'].forEach(id=>$(id).addEventListener('change',render));
    document.querySelector('nav').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){view=b.dataset.view;render();}});
    $('content').addEventListener('click',e=>{const b=e.target.closest('[data-sector]');if(b){$('sector').value=b.dataset.sector;render();}});
    $('reset').addEventListener('click',()=>{$('year').value='2025';$('sector').value='all';$('measure').value='nominal';render();});
    render();
  }
  function tax() {
    const years=Array.from({length:17},(_,i)=>2010+i);
    const districts=Array.from({length:12},(_,i)=>({id:i,name:`Grunnkrets ${String(i+1).padStart(2,'0')}`}));
    $('year').innerHTML=years.map(y=>`<option value="${y}">${y}</option>`).join(''); $('year').value='2026';
    let selected=null,timer=null;
    function records(year) {
      return districts.map(d=>{
        const count=135+d.id*17+Math.round((year-2010)*(1.2+d.id*.1));
        const exempt=8+d.id%5;
        const taxable=count-exempt;
        const basis=Math.round(taxable*(890000+d.id*24000)*(1+(year-2010)*.024));
        const filter=$('exemption').value;
        return {...d,count:filter==='exempt'?exempt:filter==='taxable'?taxable:count,exempt:filter==='taxable'?0:exempt,basis:filter==='exempt'?0:basis,amount:filter==='exempt'?0:basis*Number($('rate').value)/1000};
      });
    }
    function render() {
      const year=Number($('year').value),data=records(year);
      const current=data.filter(r=>selected===null||r.id===selected);
      const total=sum(current),count=current.reduce((s,r)=>s+r.count,0),basis=current.reduce((s,r)=>s+r.basis,0);
      const exemptions=current.reduce((s,r)=>s+r.exempt,0);
      const annual=years.map(y=>({year:y,value:sum(records(y).filter(r=>selected===null||r.id===selected))}));
      const title=selected===null?'Hele den simulerte kommunen':districts[selected].name;
      $('rate-label').textContent=number(Number($('rate').value),1)+' ‰';
      $('kpis').innerHTML=kpi('Simulert eiendomsskatt',money(total),`${year} · ${title}`)+kpi('Eiendommer',number(count),'I valgt utvalg')+kpi('Skattegrunnlag',money(basis),'Fiktivt beregningsgrunnlag')+kpi('Fritatte eiendommer',number(exemptions),`${number(count?exemptions/count*100:0,1)} % av utvalget`);
      const max=Math.max(...data.map(r=>r.amount),1);
      const map=`<svg class="district-map" viewBox="0 0 490 290" aria-label="Skjematisk oversikt over tolv fiktive grunnkretser">${data.map((r,i)=>{
        const x=18+i%4*116,y=14+Math.floor(i/4)*86;
        const color=['#516c53','#688260','#8a9a6f','#acaa7a','#c0b17b','#d3b47a'][Math.min(5,Math.floor(r.amount/max*5))];
        return `<g role="button" tabindex="0" data-district="${i}" aria-label="Velg ${r.name}" aria-pressed="${selected===i}"><path d="M${x+7} ${y+8}l85 -5 17 53-25 17-74-7Z" fill="${color}" stroke="${selected===i?'#fff':'#111512'}" stroke-width="${selected===i?4:3}"/><text x="${x+53}" y="${y+34}" text-anchor="middle">${String(i+1).padStart(2,'0')}</text><text x="${x+53}" y="${y+53}" text-anchor="middle" style="font-size:10px">${number(r.amount/1e6,1)} mill.</text></g>`;
      }).join('')}</svg>`;
      $('content').innerHTML='<div class="grid">'+panel('Grunnkretser · Skjematisk kart','Klikk en krets for å vise dens utvikling. Klikk igjen for hele kommunen.',map+'<div class="map-key">Fiktiv inndeling · ikke et geografisk kart</div>')+panel('Utvikling i eiendomsskatt',`<span class="selection">${title}</span> · 2010–2026`,lineChart(annual,'Simulert eiendomsskatt per år')+'<p class="sub">Valgt promillesats brukes i alle år, slik at scenarioene kan sammenlignes.</p>')+panel('Sammenlign grunnkretser','Alle tall gjelder valgt år og fritaksfilter. Velg en rad for å avgrense analysen.',`<div class="table-scroll"><table><thead><tr><th>GRUNNKRETS</th><th class="n">EIENDOMMER</th><th class="n">SKATTEGRUNNLAG</th><th class="n">EIENDOMSSKATT</th><th class="n">ANDEL</th></tr></thead><tbody>${data.map(r=>`<tr><td><button type="button" data-district="${r.id}" aria-pressed="${selected===r.id}">${r.name}${selected===r.id?' ✓':''}</button></td><td class="n">${number(r.count)}</td><td class="n">${money(r.basis)}</td><td class="n">${money(r.amount)}</td><td class="n">${number(sum(data)?r.amount/sum(data)*100:0,1)} %</td></tr>`).join('')}</tbody></table></div>`,true)+'</div>';
    }
    function stop() { clearInterval(timer);timer=null;$('play').textContent='▶ Spill av år';$('play').setAttribute('aria-pressed','false'); }
    $('play').addEventListener('click',()=>{
      if(timer){stop();return;}
      if($('year').value==='2026'){$('year').value='2010';render();}
      $('play').textContent='Ⅱ Pause';$('play').setAttribute('aria-pressed','true');
      timer=setInterval(()=>{const y=Number($('year').value);if(y>=2026){stop();return;}$('year').value=String(y+1);render();},1200);
    });
    const choose=e=>{const el=e.target.closest('[data-district]');if(!el)return;const id=Number(el.dataset.district);selected=selected===id?null:id;render();};
    $('content').addEventListener('click',choose);
    $('content').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('g[data-district]')){e.preventDefault();choose(e);}});
    $('year').addEventListener('change',()=>{stop();render();});
    $('exemption').addEventListener('change',render); $('rate').addEventListener('input',render);
    $('reset').addEventListener('click',()=>{stop();selected=null;$('year').value='2026';$('exemption').value='all';$('rate').value='4';render();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    render();
  }
  if(document.body.dataset.demo==='tax')tax();else expenses();
})();
