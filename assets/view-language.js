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
      title:['新电路系统 V1.0 · 三路恒流充电系统','New Electrical System V1.0 · Three-channel constant-current charging'],
      status:['基准已锁定 · 后续修改须另建分支','Baseline locked · later changes require a separate branch'],
      modes:{all:['改造后系统','Upgraded system'],pv:['主线路','Power circuits'],signal:['RS485 / 通讯链路','RS485 / communication'],dimension:['尺寸 / 孔位','Dimensions / holes'],replacement:['V1.0旧件对比','V1.0 original-part comparison']},
      selection:{all:['NEW V1.0','改造后完整装配','Complete upgraded assembly'],pv:['FLOW 01','主功率与光伏线路','Power and PV circuits'],signal:['FLOW 02','完整通讯链路','Complete communication link'],dimension:['CHECK 01','转接板与安装孔位','Adapter plate and mounting holes'],replacement:['BASELINE V1.0','旧件位置对比','Original-part position comparison']}
    }
  };

  const gx={
    'gx-old.html':{title:['Color Control GX · 独立质量样机','Color Control GX · Independent quality model'],meta:['实物正面纹理 + 毫米级硬表面模型','Physical face texture + millimetre hard-surface model'],badge:['未并入全车','Not installed in vehicle'],views:{front:['正面','Front'],left:['左侧 30°','Left 30°'],right:['右侧 30°','Right 30°'],side:['侧面厚度','Side depth']}},
    'gx-new.html':{title:['Ekrano GX · 独立质量样机','Ekrano GX · Independent quality model'],meta:['官方 STEP 几何基准 + 官方正反面实物纹理','Official STEP geometry + official front/rear textures'],badge:['未并入全车','Not installed in vehicle'],views:{hero:['产品视角','Product view'],front:['正面','Front'],left:['左侧 30°','Left 30°'],right:['右侧 30°','Right 30°'],rear:['背面接口','Rear ports'],mount:['安装外廓','Installation envelope']}}
  };

  function applyVehicle(index){
    set('.viz-title',vehicle.title[index]);set('.viz-meta',vehicle.meta[index]);set('.viz-badge',vehicle.badge[index]);set('.scene-key',vehicle.key[index]);set('[data-loading]',vehicle.loading[index]);set('[data-reset]',vehicle.reset[index]);set('[data-status]',vehicle.status[index]);
    qa('[data-view]').forEach(button=>{const copy=vehicle.views[button.dataset.view];if(copy)button.textContent=copy[index]});
    const selected=q('[data-view][aria-selected="true"]')||q('[data-view].active');
    const view=selected&&vehicle.views[selected.dataset.view];if(view)set('[data-view-name]',view[index+2]);
    const toggle=q('[data-toggle-open]');if(toggle)toggle.textContent=index?(toggle.getAttribute('aria-pressed')==='true'?'Switch to travel mode':'Switch to display mode'):(toggle.getAttribute('aria-pressed')==='true'?'切换为行驶收合态':'切换为展示展开态');
  }

  function applyElectrical(index){
    const copy=electrical[page];if(!copy)return;
    set('.a3-head h2',copy.title[index]);set('.a3-status small',copy.status[index]);
    qa('.a3-mode').forEach(button=>{const item=copy.modes[button.dataset.mode];if(item)button.textContent=item[index]});
    const reset=q('[data-action="reset"]');if(reset)direct(reset,index?'Reset view':'复位镜头');
    set('.a3-loading b',index?'Building 3D scene':'正在建立三维场景');set('.a3-guide span',index?'Drag to rotate · wheel to zoom · select a device for details':'拖动旋转 · 滚轮缩放 · 点击设备查看端口');
    const active=q('.a3-mode.is-active');const selection=active&&copy.selection[active.dataset.mode];
    if(selection){set('.a3-selection-id',selection[0]);set('.a3-selection strong',index?selection[2]:selection[1]);}
  }

  function applyGx(index){
    const copy=gx[page];if(!copy)return;
    set('.gx-head h2',copy.title[index]);set('.gx-head p',copy.meta[index]);set('.gx-head .viz-badge',copy.badge[index]);
    qa('[data-view]').forEach(button=>{const item=copy.views[button.dataset.view];if(item)button.textContent=item[index]});
    const active=q('[data-view][aria-pressed="true"]')||q('[data-view].btn-primary');
    if(active){const label=copy.views[active.dataset.view]?.[index];set('[data-note]',index?`${label}: inspect the locked dimensions, finish and installation envelope`:`${label}：核对锁定尺寸、质感与安装外廓`)}
  }

  function apply(){
    const index=language==='en'?1:0;document.documentElement.lang=index?'en':'zh-CN';
    if(page==='vehicle-master.html')applyVehicle(index);
    if(electrical[page])applyElectrical(index);
    if(gx[page])applyGx(index);
  }

  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.data?.type!=='aiko-language')return;
    language=event.data.language==='en'?'en':'zh';apply();
  });
  document.addEventListener('click',()=>setTimeout(apply,0));
})();
