(() => {
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  let language='zh';

  const q=selector=>document.querySelector(selector);
  const qa=selector=>[...document.querySelectorAll(selector)];
  const set=(selector,value)=>{const node=q(selector);if(node&&value!=null)node.textContent=value};
  const direct=(node,value,position='after')=>{
    if(!node||value==null)return;
    [...node.childNodes].filter(child=>child.nodeType===Node.TEXT_NODE).forEach(child=>child.remove());
    const text=document.createTextNode(value);
    if(position==='before'&&node.firstChild)node.insertBefore(text,node.firstChild);else node.appendChild(text);
  };

  const vehicle={
    title:['全车总装母版 v1','Full-Vehicle Assembly Master v1'],
    meta:['锁定装入“车身v01” + “车内v1” · 统一尺度 7200 × 2150 × 3000 mm · 光伏组件 1762 × 1134 × 30 mm','Locked Vehicle Body v01 + Interior v1 · Unified scale 7200 × 2150 × 3000 mm · PV module 1762 × 1134 × 30 mm'],
    badge:['内外一体母版','Integrated master'],
    key:['选择固定镜头 · 拖动可微调 · 滚轮缩放','Choose a fixed view · drag to fine-tune · wheel to zoom'],
    loading:['正在装入全车总装母版…','Loading full-vehicle master…'],
    reset:['回到当前固定镜头','Reset current fixed view'],
    status:['车身v01与车内v1按同一毫米坐标装配；切换视角不会改动任一锁定母版。','Vehicle Body v01 and Interior v1 share one millimetre coordinate system; view changes never alter a locked master.'],
    views:{
      'rear-left':['外观1 左后侧','Exterior 1 Rear-left','外观 1 · 左后侧','Exterior 1 · Rear-left'],
      side:['外观2 玻璃侧','Exterior 2 Glass side','外观 2 · 玻璃侧','Exterior 2 · Glass side'],
      roof:['外观3 车顶','Exterior 3 Roof','外观 3 · 车顶','Exterior 3 · Roof'],
      rear:['外观4 尾部','Exterior 4 Rear','外观 4 · 尾部','Exterior 4 · Rear'],
      'rear-forward':['车内1 后部向前','Interior 1 Rear to front','车内 1 · 后部向前','Interior 1 · Rear to front'],
      'module-side':['车内2 组件侧','Interior 2 Module side','车内 2 · 组件侧','Interior 2 · Module side'],
      'tv-side':['车内3 电视侧','Interior 3 TV side','车内 3 · 电视侧','Interior 3 · TV side'],
      'front-diagonal':['车内4 GX与玻璃门','Interior 4 GX & glass door','车内 4 · GX与玻璃门','Interior 4 · GX & glass door'],
      'gx-front':['车内5 GX正面','Interior 5 GX front','车内 5 · GX正面','Interior 5 · GX front']
    }
  };

  const electrical={
    'electrical-old.html':{
      title:['旧系统实车级器件与端子校核','Original-system device and terminal audit'],
      status:['厂家尺寸 · 实物外观 · 端子级线路','Manufacturer dimensions · physical appearance · terminal-level wiring'],
      modes:{all:['旧系统实车','Original system'],pv:['主线路','Power circuits'],signal:['MPPT信号线','MPPT signal'],dimension:['尺寸 / 孔位','Dimensions / holes'],replacement:['改造后预装','Upgrade preview']},
      selection:{all:['SCENE 00','旧系统实车装配','Original-system assembly'],pv:['FLOW 01','主功率与光伏线路','Power and PV circuits'],signal:['FLOW 02','MPPT通信线路','MPPT communication'],dimension:['CHECK 01','外形与安装孔位','Dimensions and mounting holes'],replacement:['TARGET 01','三块恒流板预装','Three-board installation preview']}
    },
    'electrical-new.html':{
      title:['三路恒流 · CM5 原生 RS485','Three-channel constant current · CM5 native RS485'],
      status:['安装方案 · GX屏幕位于电视右侧','Mounting design · GX display right of TV'],
      modes:{all:['改造后系统','Upgraded system'],pv:['主线路','Power circuits'],signal:['RS485 / 通讯链路','RS485 / communication'],dimension:['尺寸 / 孔位','Dimensions / holes'],replacement:['V1.0旧件对比','V1.0 original-part comparison']},
      selection:{all:['UPDATE 2026.09','改造后完整装配','Complete upgraded assembly'],pv:['FLOW 01','主功率与光伏线路','Power and PV circuits'],signal:['FLOW 02','完整通讯链路','Complete communication link'],dimension:['CHECK 01','转接板与安装孔位','Adapter plate and mounting holes'],replacement:['BASELINE V1.0','旧件位置对比','Original-part position comparison']}
    }
  };

  const gx={
    'gx-old.html':{title:['Color Control GX · 独立质量样机','Color Control GX · Independent quality model'],meta:['实物正面纹理 + 毫米级硬表面模型','Physical face texture + millimetre hard-surface model'],badge:['未并入全车','Not installed in vehicle'],views:{front:['正面','Front'],left:['左侧 30°','Left 30°'],right:['右侧 30°','Right 30°'],side:['侧面厚度','Side depth']}},
  };

  function applyVehicle(index){
    set('.viz-title',vehicle.title[index]);set('.viz-meta',vehicle.meta[index]);set('.viz-badge',vehicle.badge[index]);set('.scene-key',vehicle.key[index]);set('[data-loading]',vehicle.loading[index]);set('[data-reset]',vehicle.reset[index]);set('[data-status]',vehicle.status[index]);
    qa('[data-view]').forEach(button=>{const copy=vehicle.views[button.dataset.view];if(copy)button.textContent=copy[index]});
    const selected=q('[data-view][aria-selected="true"]')||q('[data-view].active');
    const view=selected&&vehicle.views[selected.dataset.view];if(view)set('[data-view-name]',view[index+2]);
    const toggle=q('[data-toggle-open]');if(toggle)toggle.textContent=index?(toggle.getAttribute('aria-pressed')==='true'?'Switch to travel mode':'Switch to display mode'):(toggle.getAttribute('aria-pressed')==='true'?'切换为行驶收合态':'切换为展示展开态');
  }


  const electricalText={"安装基准 / mm": "Installation dimensions / mm", "恒流板总成": "Board assembly", "外壳主体": "Enclosure body", "电源 / 信号孔": "Power / signal holes", "Ø16.5 · 电源孔距33": "Ø16.5 · power pitch 33", "恒流板孔距": "Board mounting pitch", "恒流板安装孔": "Board mounting holes", "4×Ø4.5 / Ø7.5深3": "4×Ø4.5 / Ø7.5 depth 3", "转接板": "Adapter plate", "旧MPPT孔位": "Original MPPT pitch", "CM5 机身": "CM5 enclosure", "通讯底板": "Communication plate", "450 × 250 × 4 · 首件方案": "450 × 250 × 4 · first article", "原生串口": "Native serial ports", "RS485 1–3 使用；4 备用": "RS485 CH0–CH2 used; CH3 spare", "结论：旧孔与新孔不直接复用；三块恒流板均通过196 × 150 × 4 mm转接板固定。": "The hole patterns differ; each board uses a 196 × 150 × 4 mm adapter.", "恒流板外壳和MC4按已有图纸显示；本批次实物外形、接头和针脚需复核。": "Enclosure and MC4 follow the available drawing; verify actual connector parts and pin order.", "L 型排布：1号在 Orion 正右方，2号在1号正下方，3号在2号正左方、Orion 正下方。实际孔位和线束长度须首件复核。": "L layout: board 1 right of Orion, board 2 below it, board 3 left of board 2 and below Orion. Verify vehicle fixing points and cable lengths.", "结论：MPPT侧挂槽与恒流板四孔不构成直接复用孔型，预留转接板方案。": "MPPT slots do not match the four-hole board pattern; use an adapter plate.", "正极 / PV＋": "Positive / PV+", "负极 / GND / PV−": "Negative / GND / PV−", "RS485 屏蔽信号": "RS485 shielded data", "VE.Direct 信号": "VE.Direct data", "2026.09 更新 · 首件安装方案": "2026.09 revision · first-article mounting design", "柜体基准 1520 × 1080 mm：现场复测项": "Cabinet reference 1520 × 1080 mm: measure on vehicle", "三维资源加载失败，请重新打开此视图。": "3D resources failed to load. Reopen this view.", "AIKO展车电器仓毫米级三维数字孪生": "AIKO vehicle electrical bay 3D model", "装配显示模式": "Assembly display modes", "可旋转的三维电器仓模型": "Interactive 3D electrical bay"};
  const electricalReverse=Object.fromEntries(Object.entries(electricalText).map(([zh,en])=>[en,zh]));
  function translateElectricalStatic(index){
    const tree=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(tree.nextNode()){
      const node=tree.currentNode;if(node.parentElement?.closest('script,style,.a3-selection,.a3-device-tooltip'))continue;
      const current=node.textContent.trim(),copy=index?electricalText[current]:electricalReverse[current];
      if(copy)node.textContent=node.textContent.replace(current,copy);
    }
    qa('[aria-label]').forEach(node=>{const current=node.getAttribute('aria-label'),copy=index?electricalText[current]:electricalReverse[current];if(copy)node.setAttribute('aria-label',copy)});
    const error=q('.a3-error');if(error?.dataset.errorMessage)error.textContent=(index?'3D resource loading failed: ':'三维资源加载失败：')+error.dataset.errorMessage;
  }

  function applyElectrical(index){
    const copy=electrical[page];if(!copy)return;
    set('.a3-head h2',copy.title[index]);set('.a3-status small',copy.status[index]);
    qa('.a3-mode').forEach(button=>{const item=copy.modes[button.dataset.mode];if(item)button.textContent=item[index]});
    const reset=q('[data-action="reset"]');if(reset)direct(reset,index?'Reset view':'复位镜头');
    const focus=q('[data-action="communication"]');if(focus)focus.textContent=index?'Communication close-up':'通讯区近景';
    const wiring=q('[data-action="cm5-wiring"]');if(wiring)wiring.textContent=index?'CM5 wiring close-up':'CM5 接线近景';
    set('.a3-loading b',index?'Building 3D scene':'正在建立三维场景');set('.a3-guide span',index?'Pan button: drag to move · right-drag / two fingers: pan · wheel / pinch: zoom':'点平移后拖动移画面 · 右键拖动/双指平移 · 滚轮/捏合缩放');
    translateElectricalStatic(index);
    if(page==='electrical-new.html'){
      document.title=index?'Electrical update · 2026.09':'新电路系统 · 2026.09 更新';
      if(!window.aikoSceneInterface){
        set('.a3-selection-id','UPDATE 2026.09');
        set('.a3-selection strong',index?'L-layout constant-current system':'L型三路恒流系统');
        set('.a3-selection p',index?'Three L-layout boards connect independently to CM5; the communications panel uses two 150 mm rails. The GX screen is on the same front white wall, right of the TV, with its centre 1450 mm above the finished floor.':'三块恒流板按L型布局独立接入CM5；通讯板使用两根150 mm导轨。GX屏幕位于电视右侧同一正面白墙，中心距完成地板1450 mm。');
      }
    }
    window.aikoSceneInterface?.refresh();

  }

  function applyGx(index){
    const copy=gx[page];if(!copy)return;
    set('.gx-head h2',copy.title[index]);set('.gx-head p',copy.meta[index]);set('.gx-head .viz-badge',copy.badge[index]);
    qa('[data-view]').forEach(button=>{const item=copy.views[button.dataset.view];if(item)button.textContent=item[index]});
    const active=q('[data-view][aria-pressed="true"]')||q('[data-view].btn-primary');
    if(active){const label=copy.views[active.dataset.view]?.[index];set('[data-note]',index?`${label}: inspect the locked dimensions, finish and installation envelope`:`${label}：核对锁定尺寸、质感与安装外廓`)}
  }

  function applyGxInstallation(index){
    document.title=index?'GX Touch 50 installation':'GX Touch 50升级安装';
    const root=q('#aiko-interior-four-cameras-v02');if(root)root.setAttribute('aria-label',index?'GX Touch 50 installation':'GX Touch 50升级安装');
    const loading=q('[data-loading]');if(loading?.dataset.errorMessage)loading.textContent=(index?'3D view unavailable: ':'三维视图不可用：')+loading.dataset.errorMessage;
    const labels={
      'gx-installation':['GX 安装位置','GX installation','GX Touch 50 · 电视右侧同一正面白墙','GX Touch 50 · same front wall, right of TV'],
      'gx-front':['GX屏幕近景','GX screen close-up','标准版薄屏 · 128.2 × 87.1 × 12.4 mm','Standard slim display · 128.2 × 87.1 × 12.4 mm'],
      'gx-mount':['固定件展开','Mounting detail','原厂固定框 · 展开示意','Included fixing frame · exploded view'],
      'front-diagonal':['GX与玻璃门','GX and glass door','电视右侧 · 车内站立观看','Right of TV · viewed from inside']};
    set('.viz-title',index?'GX Touch 50 · TV-side installation':'GX Touch 50 · 电视右侧安装');
    set('.viz-meta',index?'Same front white wall as TV · centre 1450 mm above interior floor · official fixing frame':'与电视同一正面白墙 · 中心距车内地板1450 mm · 原厂固定方式');
    set('.viz-badge',index?'Upgraded installation':'升级安装');
    set('.scene-key',index?'Drag to rotate · Pan button / right-drag to pan · scroll to zoom':'拖动旋转 · 平移按钮／右键拖动平移 · 滚轮缩放');
    set('[data-status]',index?'Manufacturer illustration; not live data. Verify wall and cable route on the vehicle.':'屏幕读数为厂家产品示意，非实时数据；墙面及走线须现场复测。');
    set('[data-pan]',index?'Pan':'平移');
    qa('[data-view]').forEach(b=>{if(labels[b.dataset.view])b.textContent=labels[b.dataset.view][index]});
    const active=q('[data-view][aria-selected="true"]');
    if(active&&labels[active.dataset.view]){set('[data-view-name]',labels[active.dataset.view][index+2]);set('[data-view-note]',index?'Centre height: 1450 mm from the finished interior floor. HDMI → video; USB → power.':'中心高以车内完成地板为基准：1450 mm。HDMI接视频，USB供电。')}
    if(index&&active&&!labels[active.dataset.view])set('[data-view-note]','Explore the vehicle layout; choose GX screen close-up to inspect the upgraded display.');
    set('[data-canvas]',null);const canvas=q('[data-canvas]');if(canvas)canvas.setAttribute('aria-label',index?'Interactive GX Touch 50 installation':'GX Touch 50升级安装三维图');
    const tabs=q('[role="tablist"]');if(tabs)tabs.setAttribute('aria-label',index?'Installation views':'安装视角');
  }

  function apply(){
    const index=language==='en'?1:0;document.documentElement.lang=index?'en':'zh-CN';
    if(page==='vehicle-master.html'||page==='gx-new.html')applyVehicle(index);
    if(electrical[page])applyElectrical(index);
    if(gx[page]&&page!=='gx-new.html')applyGx(index);
    if(page==='gx-new.html')applyGxInstallation(index);
  }

  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.data?.type!=='aiko-language')return;
    language=event.data.language==='en'?'en':'zh';apply();
  });
  window.addEventListener('aiko-gx-view',apply);
  document.addEventListener('click',()=>setTimeout(apply,0));
  apply();
})();
