import { assemblyGuideData } from './assembly-guide-data.js?v=assembly-20261003-r2';

const copy = {
  zh: { title:'恒流板 1 · 局部装配样板', normal:'常规', exploded:'爆炸图', animation:'装配演示', start:'查看恒流板 1 装配', intro:'按下方安装说明先断电、拆旧，再安装和接线；切换装配演示可逐步查看。', spread:'展开程度', parts:'点选配件，查看用途', quantity:'本处数量', purpose:'装在哪里', note:'安装说明', previous:'上一步', next:'下一步', play:'播放', pause:'暂停', restart:'重新播放', exit:'返回全景', pilot:'先核对右上方一块；其余两块保持原布局。', step:'步骤', source:'Stäubli 官方装配说明', sourceNote:'EVO2 需按实际料号、线材和工具匹配参数。', camera:'可旋转、平移及缩放查看；展开间距仅用于讲解。', index:'A 编号为本图索引，尚未作为实物包装编号。',instructions:'安装说明 · 完整10步',check:'完成检查',view:'画面说明' },
  en: { title:'Board 1 · Assembly sample', normal:'Normal', exploded:'Exploded', animation:'Assembly', start:'Explore board 1 assembly', intro:'Follow the instructions below: isolate, remove the old unit, install and connect. Use Assembly to view each step.', spread:'Explode distance', parts:'Select a part for its purpose', quantity:'Quantity here', purpose:'Installation location', note:'Installation note', previous:'Previous', next:'Next', play:'Play', pause:'Pause', restart:'Replay', exit:'Return to overview', pilot:'Review the upper-right board first. The other two retain their layout.', step:'Step', source:'Stäubli assembly instructions', sourceNote:'Match EVO2 parameters to the exact part, cable and approved tools.', camera:'Rotate, pan and zoom freely. Exploded spacing is illustrative.', index:'A numbers identify parts in this view; packaging labels are not yet assigned.',instructions:'Installation · all 10 steps',check:'Completion check',view:'View note' }
};
const esc = (s='') => String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const local = (value,lang) => typeof value==='object' ? value?.[lang]||'' : value||'';

export function createAssemblyInspector({container, getLanguage, send}) {
  let snapshot = {available:false};
  let eligible = false;
  let lastLayout = '';
  const parts=assemblyGuideData.parts;
  const steps=assemblyGuideData.steps;

  function render() {
    const lang=getLanguage(), c=copy[lang];
    container.hidden=!eligible && !snapshot.available;
    if(container.hidden){container.innerHTML='';lastLayout='';return;}
    if(!snapshot.available){
      container.innerHTML=`<button type="button" class="assembly-entry" data-assembly-command="select">${esc(c.start)} <span>↗</span></button><p class="assembly-caption">${esc(c.pilot)}</p>`;
      lastLayout=''; return;
    }
    const mode=snapshot.mode||'normal';
    const step=Math.max(0,Math.min(steps.length-1,snapshot.step||0));
    const shownParts=mode==='animation'?parts.filter(p=>steps[step].parts.includes(p.id)):parts;
    const selected=shownParts.find(p=>p.id===snapshot.partId)||shownParts[0]||parts[0];
    const stepBody=item=>`<p class="assembly-step-copy">${esc(local(item.text,lang))}</p><ol class="assembly-actions">${(item.actions||[]).map(action=>`<li>${esc(local(action,lang))}</li>`).join('')}</ol><p class="assembly-check"><b>${esc(c.check)}</b>${esc(local(item.check,lang))}</p>${item.viewNote?`<p class="assembly-caption">${esc(c.view)}${lang==='en'?': ':'：'}${esc(local(item.viewNote,lang))}</p>`:''}`;
    // Do not replace an active range input during a drag.
    const layout=[lang,mode,step,snapshot.playing,selected.id].join(':');
    if(layout===lastLayout){
      const slider=container.querySelector('[data-assembly-spread]');
      if(slider && document.activeElement!==slider)slider.value=String(Math.round((snapshot.spread||0)*100));
      const output=container.querySelector('[data-assembly-spread-value]');
      if(output)output.textContent=`${Math.round((snapshot.spread||0)*100)}%`;
      return;
    }
    lastLayout=layout;
    container.innerHTML=`
      <div class="assembly-heading"><strong>${esc(c.title)}</strong><button type="button" data-assembly-command="exit">${esc(c.exit)}</button></div>
      <div class="assembly-modes" role="group" aria-label="${esc(c.title)}">${['normal','exploded','animation'].map(m=>`<button type="button" data-assembly-command="mode" data-value="${m}" aria-pressed="${mode===m}">${esc(c[m])}</button>`).join('')}</div>
      ${mode==='normal'?`<p class="assembly-caption">${esc(c.intro)}</p><h3 class="assembly-step-title">${esc(c.instructions)}</h3><div class="assembly-instructions">${steps.map((item,i)=>`<details ${i===0?'open':''}><summary><span>${String(i+1).padStart(2,'0')}</span>${esc(local(item.title,lang))}</summary>${stepBody(item)}</details>`).join('')}</div>`:''}
      ${mode==='exploded'?`<label class="assembly-range">${esc(c.spread)} <output data-assembly-spread-value>${Math.round((snapshot.spread||0)*100)}%</output><input type="range" min="0" max="100" step="1" value="${Math.round((snapshot.spread||0)*100)}" data-assembly-spread aria-label="${esc(c.spread)}"></label>`:''}
      ${mode==='animation'?`<div class="assembly-progress">${esc(c.step)} ${step+1} / ${steps.length}</div><h3 class="assembly-step-title">${esc(local(steps[step].title,lang))}</h3>${stepBody(steps[step])}<div class="assembly-playback"><button type="button" data-assembly-command="step" data-value="${step-1}" ${step===0?'disabled':''}>← ${esc(c.previous)}</button><button type="button" data-assembly-command="play">${esc(snapshot.playing?c.pause:step===steps.length-1?c.restart:c.play)}</button><button type="button" data-assembly-command="step" data-value="${step+1}" ${step===steps.length-1?'disabled':''}>${esc(c.next)} →</button></div>`:''}
      ${mode!=='normal'&&shownParts.length?`<p class="assembly-caption">${esc(c.parts)}</p><div class="assembly-parts">${shownParts.map((p,i)=>`<button type="button" data-assembly-command="part" data-value="${p.id}" aria-pressed="${p.id===selected.id}"><b>${esc(p.index||'A'+(i+1))}</b>${esc(local(p.name,lang))}</button>`).join('')}</div><div class="assembly-part-detail" aria-live="polite"><h3>${esc(local(selected.name,lang))}</h3><p>${esc(local(selected.spec,lang))}</p><dl><dt>${esc(c.quantity)}</dt><dd>${esc(local(selected.quantity,lang))}</dd><dt>${esc(c.purpose)}</dt><dd>${esc(local(selected.purpose,lang))}</dd><dt>${esc(c.note)}</dt><dd>${esc(local(selected.note,lang))}</dd></dl></div><p class="assembly-caption">${esc(c.camera)}</p><p class="assembly-caption">${esc(c.index)}</p>`:''}
      ${(mode==='animation' && (step===6||step===7)) || selected.id==='mc4' && mode==='exploded'?`<a class="assembly-source" href="https://www.staubli.com/content/dam/ecs/technical-documentation/assembly-instructions/RE/PV_MA273-en.pdf" target="_blank" rel="noopener">${esc(c.source)} ↗</a><p class="assembly-caption">${esc(c.sourceNote)}</p>`:''}`;
  }
  container.addEventListener('click',event=>{
    const button=event.target.closest('[data-assembly-command]');
    if(!button || button.disabled)return;
    const command=button.dataset.assemblyCommand;
    const value=command==='select'?'constant-aiko':command==='step'?Number(button.dataset.value):button.dataset.value;
    send(command,value);
  });
  container.addEventListener('input',event=>{if(event.target.matches('[data-assembly-spread]'))send('spread',Number(event.target.value)/100);});
  return {
    update(next){snapshot=next;render();},
    setEligible(value){eligible=value;render();},
    reset(){snapshot={available:false};eligible=false;render();},
    render,
    get active(){return snapshot.available && snapshot.mode!=='normal';}
  };
}
