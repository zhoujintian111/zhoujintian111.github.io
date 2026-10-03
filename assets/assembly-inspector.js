import { assemblyTargets, getAssemblyGuide } from './assembly-guide-data.js?v=assembly-20261003-r9';

const copy = {
  zh: { title:'装配查看方式', normal:'常规', exploded:'爆炸图', animation:'装配演示', start:'查看局部装配', intro:'按下方安装说明先断电、拆旧，再安装和接线；切换装配演示可逐步查看。', commIntro:'通讯板及配件均现场安装。按步骤查看底板、两根导轨、设备卡扣和各类线缆连接；每一步均可暂停、回放和拖动查看动作。', spread:'展开程度', parts:'点选配件，查看用途', quantity:'本处数量', purpose:'装在哪里', note:'安装说明', previous:'上一步', next:'下一步', play:'播放', pause:'暂停', restart:'重新播放', replayStep:'重看本步', exit:'返回全景', pilot:'选择安装区域，查看对应的配件、安装步骤和接线说明。',boards:'选择安装区域', step:'步骤', jump:'选择步骤', progress:'本步动作', source:'Stäubli 官方装配说明', sourceNote:'EVO2 需按实际料号、线材和工具匹配参数。', sources:'安装资料', camera:'可旋转、平移及缩放查看；展开间距仅用于讲解。', index:'编号与配套物料清单对应；点选编号可核对规格、数量和安装位置。',instructions:'安装说明',check:'完成检查',view:'画面说明' },
  en: { title:'Assembly view', normal:'Normal', exploded:'Exploded', animation:'Assembly', start:'Explore local assembly', intro:'Follow the instructions below: isolate, remove the old unit, install and connect. Use Assembly to view each step.', commIntro:'The panel and its components are installed on site. Follow the steps for the plate, two rails, device clips and cable connections. Pause, replay or scrub each action.', spread:'Explode distance', parts:'Select a part for its purpose', quantity:'Quantity here', purpose:'Installation location', note:'Installation note', previous:'Previous', next:'Next', play:'Play', pause:'Pause', restart:'Replay', replayStep:'Replay this step', exit:'Return to overview', pilot:'Select an installation area for its parts, installation steps and wiring instructions.',boards:'Select installation area', step:'Step', jump:'Choose step', progress:'Step action', source:'Stäubli assembly instructions', sourceNote:'Match EVO2 parameters to the exact part, cable and approved tools.', sources:'Installation references', camera:'Rotate, pan and zoom freely. Exploded spacing is illustrative.', index:'Codes match the companion parts list. Select a code to check its specification, quantity and installation location.',instructions:'Installation',check:'Completion check',view:'View note' }
};
const esc = (s='') => String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const local = (value,lang) => typeof value==='object' ? value?.[lang]||'' : value||'';
const percent=value=>Math.round(Math.min(1,Math.max(0,Number(value)||0))*100);

export function createAssemblyInspector({container, getLanguage, send}) {
  let snapshot = {available:false};
  let eligible = false;
  let lastLayout = '';
  let eligibleBoardId='constant-aiko';

  function syncControls(steps,step,c) {
    for(const [kind,value] of [['spread',snapshot.spread],['progress',snapshot.stepProgress]]){
      const slider=container.querySelector(`[data-assembly-${kind}]`);
      if(slider && document.activeElement!==slider)slider.value=String(percent(value));
      const output=container.querySelector(`[data-assembly-${kind}-value]`);
      if(output)output.textContent=`${percent(value)}%`;
    }
    const play=container.querySelector('[data-assembly-command="play"]');
    if(play)play.textContent=snapshot.playing?c.pause:step===steps.length-1?c.restart:c.play;
  }

  function render() {
    const lang=getLanguage(), c=copy[lang];
    const guide=getAssemblyGuide(snapshot.available?snapshot.boardId:eligibleBoardId);
    const {parts,steps,boardContext}=guide;
    const isCommunication=guide.boardId==='comm-backplate';
    const hasActionControls=isCommunication || guide.boardId==='gx-touch50';
    const boardSelector=`<div class="assembly-modes assembly-targets" role="group" aria-label="${esc(c.boards)}">${assemblyTargets.map(board=>`<button type="button" data-assembly-command="select" data-value="${board.id}" aria-pressed="${snapshot.available && board.id===guide.boardId}">${esc(local(board.shortLabel,lang))}</button>`).join('')}</div>`;
    container.hidden=!eligible && !snapshot.available;
    if(container.hidden){container.innerHTML='';lastLayout='';return;}
    if(!snapshot.available){
      container.innerHTML=`<div class="assembly-heading"><strong>${esc(c.start)}</strong></div>${boardSelector}<p class="assembly-caption">${esc(c.pilot)}</p>`;
      lastLayout=''; return;
    }
    const mode=snapshot.mode||'normal';
    const step=Math.max(0,Math.min(steps.length-1,snapshot.step||0));
    const shownParts=mode==='animation'?parts.filter(p=>(steps[step].parts||[]).includes(p.id)):parts;
    const selected=shownParts.find(p=>p.id===snapshot.partId)||shownParts[0]||parts[0];
    const stepBody=item=>`<p class="assembly-step-copy">${esc(local(item.text,lang))}</p><ol class="assembly-actions">${(item.actions||[]).map(action=>`<li>${esc(local(action,lang))}</li>`).join('')}</ol><p class="assembly-check"><b>${esc(c.check)}</b>${esc(local(item.check,lang))}</p>${item.viewNote?`<p class="assembly-caption">${esc(c.view)}${lang==='en'?': ':'：'}${esc(local(item.viewNote,lang))}</p>`:''}`;
    // Progress updates must not replace the live range control or reset open instructions.
    const layout=[guide.boardId,lang,mode,step,selected?.id].join(':');
    if(layout===lastLayout){syncControls(steps,step,c);return;}
    lastLayout=layout;
    let stepChoices='';
    if(hasActionControls){
      let group='';
      steps.forEach((item,i)=>{
        const nextGroup=local(item.group,lang);
        if(nextGroup!==group){if(group)stepChoices+='</optgroup>';if(nextGroup)stepChoices+=`<optgroup label="${esc(nextGroup)}">`;group=nextGroup;}
        stepChoices+=`<option value="${i}" ${i===step?'selected':''}>${String(i+1).padStart(2,'0')} · ${esc(local(item.title,lang))}</option>`;
      });
      if(group)stepChoices+='</optgroup>';
    }
    const transport=`<div class="assembly-playback"><button type="button" data-assembly-command="step" data-value="${step-1}" ${step===0?'disabled':''}>← ${esc(c.previous)}</button><button type="button" data-assembly-command="play">${esc(snapshot.playing?c.pause:step===steps.length-1?c.restart:c.play)}</button><button type="button" data-assembly-command="step" data-value="${step+1}" ${step===steps.length-1?'disabled':''}>${esc(c.next)} →</button></div>`;
    const detailedControls=hasActionControls?`<label class="assembly-step-select">${esc(c.jump)}<select data-assembly-step-select aria-label="${esc(c.jump)}">${stepChoices}</select></label><div class="assembly-action-controls"><label class="assembly-range">${esc(c.progress)} <output data-assembly-progress-value>${percent(snapshot.stepProgress)}%</output><input type="range" min="0" max="100" step="1" value="${percent(snapshot.stepProgress)}" data-assembly-progress aria-label="${esc(c.progress)}"></label><button type="button" class="assembly-replay" data-assembly-command="replay-step">↻ ${esc(c.replayStep)}</button></div>`:'';
    const sources=(guide.sources||[]).filter(source=>{
      if(mode!=='animation')return true;
      if(source.steps?.length)return source.steps.includes(step);
      if(source.parts?.length)return source.parts.some(id=>(steps[step].parts||[]).includes(id));
      return true;
    });
    const sourcesHtml=hasActionControls && sources.length?`<div class="assembly-sources"><p class="assembly-caption">${esc(c.sources)}</p>${sources.map(source=>`<a class="assembly-source" href="${esc(source.url||source.href)}" target="_blank" rel="noopener">${esc(local(source.label||source.title||source.name,lang))} ↗</a>${source.note?`<p class="assembly-caption">${esc(local(source.note,lang))}</p>`:''}`).join('')}</div>`:'';
    container.innerHTML=`
      <div class="assembly-heading"><strong>${esc(local(boardContext.title,lang))}</strong><button type="button" data-assembly-command="exit">${esc(c.exit)}</button></div>
      ${boardSelector}<p class="assembly-caption">${esc(local(boardContext.communication,lang))}</p>
      <div class="assembly-modes" role="group" aria-label="${esc(c.title)}">${['normal','exploded','animation'].map(m=>`<button type="button" data-assembly-command="mode" data-value="${m}" aria-pressed="${mode===m}">${esc(c[m])}</button>`).join('')}</div>
      ${mode==='normal'?`<p class="assembly-caption">${esc(local(guide.intro,lang)||(isCommunication?c.commIntro:c.intro))}</p><p class="assembly-caption">${esc(local(boardContext.mounting,lang))}</p><h3 class="assembly-step-title">${esc(c.instructions)} · ${lang==='en'?`all ${steps.length} steps`:`完整${steps.length}步`}</h3><div class="assembly-instructions">${steps.map((item,i)=>`<details ${i===0?'open':''}><summary><span>${String(i+1).padStart(2,'0')}</span>${esc(local(item.title,lang))}</summary>${stepBody(item)}</details>`).join('')}</div>`:''}
      ${mode==='exploded'?`<label class="assembly-range">${esc(c.spread)} <output data-assembly-spread-value>${percent(snapshot.spread)}%</output><input type="range" min="0" max="100" step="1" value="${percent(snapshot.spread)}" data-assembly-spread aria-label="${esc(c.spread)}"></label>`:''}
      ${mode==='animation'?`${detailedControls}<div class="assembly-progress">${esc(c.step)} ${step+1} / ${steps.length}</div><h3 class="assembly-step-title">${esc(local(steps[step].title,lang))}</h3>${hasActionControls?transport:''}${stepBody(steps[step])}${!hasActionControls?transport:''}`:''}
      ${mode!=='normal'&&shownParts.length?`<p class="assembly-caption">${esc(c.parts)}</p><div class="assembly-parts">${shownParts.map((p,i)=>`<button type="button" data-assembly-command="part" data-value="${p.id}" aria-pressed="${p.id===selected.id}"><b>${esc(p.index||'A'+(i+1))}</b>${esc(local(p.name,lang))}</button>`).join('')}</div><div class="assembly-part-detail" aria-live="polite"><h3>${esc(selected.index)} · ${esc(local(selected.name,lang))}</h3><p>${esc(local(selected.spec,lang))}</p><dl><dt>${esc(c.quantity)}</dt><dd>${esc(local(selected.quantity,lang))}</dd><dt>${esc(c.purpose)}</dt><dd>${esc(local(selected.purpose,lang))}</dd><dt>${esc(c.note)}</dt><dd>${esc(local(selected.note,lang))}</dd></dl></div><p class="assembly-caption">${esc(c.camera)}</p><p class="assembly-caption">${esc(c.index)}</p>`:''}
      ${!hasActionControls&&((mode==='animation' && (step===6||step===7)) || selected?.id==='mc4' && mode==='exploded')?`<a class="assembly-source" href="https://www.staubli.com/content/dam/ecs/technical-documentation/assembly-instructions/RE/PV_MA273-en.pdf" target="_blank" rel="noopener">${esc(c.source)} ↗</a><p class="assembly-caption">${esc(c.sourceNote)}</p>`:''}${sourcesHtml}`;
  }
  container.addEventListener('click',event=>{
    const button=event.target.closest('[data-assembly-command]');
    if(!button || button.disabled)return;
    const command=button.dataset.assemblyCommand;
    const value=command==='select'?(button.dataset.value||eligibleBoardId):command==='step'?Number(button.dataset.value):button.dataset.value;
    send(command,value);
  });
  container.addEventListener('input',event=>{
    if(event.target.matches('[data-assembly-spread]'))send('spread',Number(event.target.value)/100);
    if(event.target.matches('[data-assembly-progress]'))send('progress',Number(event.target.value)/100);
  });
  container.addEventListener('change',event=>{if(event.target.matches('[data-assembly-step-select]'))send('step',Number(event.target.value));});
  return {
    update(next){snapshot=next;render();},
    setEligible(value,boardId){eligible=value;if(assemblyTargets.some(board=>board.id===boardId))eligibleBoardId=boardId;render();},
    reset(){snapshot={available:false};eligible=false;render();},
    render,
    get active(){return snapshot.available && snapshot.mode!=='normal';}
  };
}
