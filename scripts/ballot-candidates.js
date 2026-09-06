(() => {
  'use strict';
  const cfg = window.SITE_CONFIG || {};
  const ballot = cfg.googleForms?.vote || {};
  const url = ballot.embedUrl || ballot.formUrl || '';
  const safeUrl = String(url).replace(/&/g,'&amp;').replace(/"/g,'&quot;');

  const style = document.createElement('style');
  style.textContent = `
  .ballot-launch-card{margin:28px 0;padding:28px;border:1px solid var(--line);border-radius:26px;background:linear-gradient(135deg,var(--surface-strong),var(--surface));box-shadow:var(--shadow)}
  .ballot-launch-card .ballot-row{display:flex;align-items:center;justify-content:space-between;gap:24px}.ballot-launch-card h3{margin:4px 0 7px;font:600 clamp(22px,3vw,32px)/1.1 'Space Grotesk',sans-serif}.ballot-launch-card p{margin:0;color:var(--muted);max-width:58ch}.open-ballot{border:0;border-radius:14px;padding:13px 18px;background:var(--yellow);color:#18170f;font-weight:800;cursor:pointer;white-space:nowrap;box-shadow:0 10px 28px rgba(244,214,94,.15)}
  .ballot-modal{position:fixed;inset:0;z-index:9999;background:rgba(4,5,6,.72);backdrop-filter:blur(14px);padding:18px;display:grid;place-items:center}.ballot-modal[hidden]{display:none}.ballot-modal-panel{width:min(1100px,100%);height:min(900px,100%);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:28px;background:var(--paper);box-shadow:0 40px 120px rgba(0,0,0,.55)}.ballot-modal-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 18px;border-bottom:1px solid var(--line)}.ballot-modal-head strong{font-family:'Space Grotesk',sans-serif}.ballot-close{width:38px;height:38px;border:1px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font-size:24px;cursor:pointer}.ballot-frame{width:100%;flex:1;border:0;background:#fff}
  .candidate-extra{display:grid;gap:10px;margin-top:13px}.candidate-extra-block{padding:10px 11px;border:1px solid var(--line);border-radius:13px;background:var(--surface)}.candidate-extra-label{display:block;margin-bottom:4px;color:var(--faint);font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.candidate-extra-value{color:var(--muted);font-size:12px;line-height:1.45}.candidate-priorities{display:flex;flex-wrap:wrap;gap:6px}.candidate-priority{padding:5px 8px;border-radius:999px;background:var(--yellow-soft);color:var(--ink);font-size:10px;font-weight:700}
  @media(max-width:650px){.ballot-launch-card .ballot-row{align-items:flex-start;flex-direction:column}.open-ballot{width:100%}.ballot-modal{padding:8px}.ballot-modal-panel{height:100%;border-radius:20px}}
  `;
  document.head.appendChild(style);

  function candidateFor(card){
    const name = card.querySelector('h3')?.textContent?.trim();
    return (cfg.election?.candidates || []).find(c => String(c.name||'').trim() === name);
  }
  function enhanceCandidates(){
    document.querySelectorAll('.candidate-card').forEach(card => {
      if(card.dataset.enhanced) return;
      const c = candidateFor(card);
      if(!c) return;
      card.dataset.enhanced='1';
      const statement = card.querySelector('p');
      if(!String(c.statement||'').trim() && statement) statement.remove();
      const fields=[
        ['Bio',c.bio],['Slogan',c.slogan],['Experience',c.experience],
        ['Activities',Array.isArray(c.activities)?c.activities.join(', '):c.activities],
        ['Fun fact',c.funFact]
      ].filter(([,v])=>v!=null && String(v).trim());
      const priorities=Array.isArray(c.priorities)?c.priorities.filter(Boolean):[];
      if(!fields.length && !priorities.length) return;
      const extra=document.createElement('div'); extra.className='candidate-extra';
      fields.forEach(([label,value])=>{const box=document.createElement('div');box.className='candidate-extra-block';box.innerHTML='<span class="candidate-extra-label"></span><div class="candidate-extra-value"></div>';box.querySelector('.candidate-extra-label').textContent=label;box.querySelector('.candidate-extra-value').textContent=value;extra.appendChild(box);});
      if(priorities.length){const box=document.createElement('div');box.className='candidate-extra-block';const label=document.createElement('span');label.className='candidate-extra-label';label.textContent='Priorities';const list=document.createElement('div');list.className='candidate-priorities';priorities.forEach(v=>{const tag=document.createElement('span');tag.className='candidate-priority';tag.textContent=v;list.appendChild(tag)});box.append(label,list);extra.appendChild(box);}
      card.appendChild(extra);
    });
  }

  function ensureModal(){
    let modal=document.getElementById('ballotModal');
    if(modal) return modal;
    modal=document.createElement('div');modal.id='ballotModal';modal.className='ballot-modal';modal.hidden=true;
    modal.innerHTML='<div class="ballot-modal-panel" role="dialog" aria-modal="true" aria-label="Official ballot"><div class="ballot-modal-head"><strong>Official Student Council Ballot</strong><button class="ballot-close" type="button" aria-label="Close ballot">×</button></div><iframe class="ballot-frame" title="Official Student Council Ballot" allowfullscreen></iframe></div>';
    const close=()=>{modal.hidden=true;document.body.style.overflow='';};
    modal.querySelector('.ballot-close').onclick=close;
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
    document.body.appendChild(modal);return modal;
  }
  function openBallot(){
    if(!url || url.includes('YOUR_')) return;
    const modal=ensureModal(),frame=modal.querySelector('iframe');
    if(frame.src!==url) frame.src=url;
    modal.hidden=false;document.body.style.overflow='hidden';
  }
  function enhanceBallot(){
    document.querySelectorAll('.google-embed-card').forEach(card=>{
      const frame=card.querySelector('iframe[title*="Ballot"]');
      if(!frame || card.dataset.ballotEnhanced) return;
      card.dataset.ballotEnhanced='1';
      const launch=document.createElement('section');launch.className='ballot-launch-card';
      launch.innerHTML='<div class="ballot-row"><div><span class="eyebrow">Official ballot</span><h3>Ready to cast your vote?</h3><p>Review the candidates, then open the official ballot when you are ready.</p></div><button class="open-ballot" type="button">Open Ballot</button></div>';
      launch.querySelector('button').onclick=openBallot;card.replaceWith(launch);
    });
  }
  function run(){enhanceBallot();enhanceCandidates();}
  run();
  new MutationObserver(run).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.BASC_BALLOT={open:openBallot};
})();