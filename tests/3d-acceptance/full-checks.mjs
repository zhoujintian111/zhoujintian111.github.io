import crypto from 'node:crypto';

const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const cameraExpression=`({position:camera.position.toArray(),target:controls.target.toArray(),quaternion:camera.quaternion.toArray(),distance:camera.position.distanceTo(controls.target),fov:camera.fov})`;
const liveSessions=new WeakMap();

// Query actual live Three.js/OrbitControls instances. No paused function,
// response rewrite, scene assignment or synthetic geometry is used.
async function readElectrical(context,page,frame,expression) {
  let cached=liveSessions.get(frame);
  const cdp=cached?.cdp||await context.newCDPSession(page);
  const contexts=[];
  if(!cached)cdp.on('Runtime.executionContextCreated',e=>contexts.push(e.context));
  try {
    if(!cached){
    await cdp.send('Runtime.enable');
    const tree=await cdp.send('Page.getFrameTree');
    const find=node=>node.frame.url===frame.url()?node.frame.id:(node.childFrames||[]).map(find).find(Boolean);
    const frameId=find(tree.frameTree);
    const execution=contexts.find(c=>c.auxData?.frameId===frameId&&c.auxData?.isDefault);
    if(!execution)throw new Error('无法定位电路舱的真实脚本执行上下文');
    const module=await cdp.send('Runtime.evaluate',{expression:"import('../vendor/three/build/three.module.min.js')",contextId:execution.id,awaitPromise:true});
    const controlsModule=await cdp.send('Runtime.evaluate',{expression:"import('../vendor/three/examples/jsm/controls/OrbitControls.js')",contextId:execution.id,awaitPromise:true});
    const prototype=async(objectId,property)=>{
      const p=await cdp.send('Runtime.callFunctionOn',{objectId,functionDeclaration:`function(){return this.${property}.prototype;}`});
      if(!p.result.objectId)throw new Error('无法读取实际类原型：'+property);
      return (await cdp.send('Runtime.queryObjects',{prototypeObjectId:p.result.objectId})).objects.objectId;
    };
    const scenes=await prototype(module.result.objectId,'Scene');
    const controls=await prototype(controlsModule.result.objectId,'OrbitControls');
    cached={cdp,scenes,controls,moduleId:module.result.objectId};liveSessions.set(frame,cached);
    }
    const value=await cdp.send('Runtime.callFunctionOn',{objectId:cached.scenes,functionDeclaration:`function(controlInstances,THREE){
      const scene=this.find(s=>{if(!Array.isArray(s.children))return false;let hit=false;s.traverse(o=>{if(o.userData?.id==='constant-aiko')hit=true;});return hit;});
      if(!scene)throw new Error('运行内存中找不到恒流板场景');
      const controls=controlInstances.find(c=>c.domElement===document.querySelector('canvas'));
      if(!controls)throw new Error('运行内存中找不到当前OrbitControls');
      const camera=controls.object,objects=[];scene.traverse(o=>objects.push(o));
      const byId=id=>objects.find(o=>o.userData.id===id);
      const cc1=byId('constant-aiko'),cc2=byId('constant-ja'),cc3=byId('constant-jk'),orionSmart=byId('orion-smart');
      let world=cc1;while(world.parent&&!world.parent.isScene)world=world.parent;
      const mm=v=>v/100;
      const commRails=objects.filter(o=>/^communication-din-rail(-right)?$/.test(o.name));
      const commClipRecords=objects.filter(o=>o.userData.deviceClip).map(root=>({root,deviceId:root.name.replace(/-din-clip$/,''),railId:root.userData.railId,
        hook:root.getObjectByName('fixed-hook'),spring:root.children.find(o=>o.name==='metal-spring'||o.name==='plastic-flex-foot')}));
      const physical=o=>{for(let p=o;p;p=p.parent)if(p.isSprite||p.userData.annotationCode||p.userData.assemblyLabel)return false;return true;};
      const commParts={};for(const o of objects)if(o.userData.assemblyBoardId==='comm-backplate'&&o.userData.assemblyPart&&physical(o)&&o.parent?.userData.assemblyPart!==o.userData.assemblyPart)(commParts[o.userData.assemblyPart]??=[]).push(o);
      for(const id of ['rail-fasteners','cerbo-fasteners','fuse-fasteners'])commParts[id]??=[];
      const fuse=objects.find(o=>o.userData.powerTopology?.positiveInput),negative=objects.find(o=>o.userData.powerTopology?.mount==='DIN rail');
      const fusePositiveInput=fuse.userData.powerTopology.positiveInput,fusePorts=fuse.userData.powerTopology.positiveOutputs;
      const negativeInput=negative.userData.powerTopology.input,negativePorts=negative.userData.powerTopology.outputs;
      return ${expression};
    }`,arguments:[{objectId:cached.controls},{objectId:cached.moduleId}],returnByValue:true});
    if(value.exceptionDetails)throw new Error(value.exceptionDetails.exception?.description||value.exceptionDetails.text);
    return value.result.value;
  } catch(error) {
    liveSessions.delete(frame);
    await cdp.detach().catch(()=>{});
    throw error;
  }
}

const electricalExpression=`(()=>{
 scene.updateMatrixWorld(true);
 const shown=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
 const point=o=>o?world.worldToLocal(o.getWorldPosition(new THREE.Vector3())).toArray():null;
 const pose=o=>o?({name:o.name,p:o.position.toArray(),q:o.quaternion.toArray(),visible:o.visible,
   material:o.material?{opacity:o.material.opacity}:null,range:o.geometry?{start:o.geometry.drawRange.start,count:Number.isFinite(o.geometry.drawRange.count)?o.geometry.drawRange.count:null}:null}):null;
 const boards=[cc1,cc2,cc3].map(o=>({id:o.userData.id,position:point(o),shown:shown(o)}));
 const rails=commRails.map(o=>{const mesh=o.children.find(c=>c.isMesh);mesh.geometry.computeBoundingBox();const scale=mesh.getWorldScale(new THREE.Vector3());return {
   name:o.name,declaredMm:o.userData.lengthMm,measuredMm:mesh.geometry.boundingBox.getSize(new THREE.Vector3()).x*Math.abs(scale.x)/mm(1),position:point(o),shown:shown(o)};});
 const fixings=Object.fromEntries(['rail-fasteners','cerbo-fasteners','fuse-fasteners'].map(id=>{
   const heads=commParts[id].filter(o=>o.userData.commFixingHead);const shafts=commParts[id].filter(o=>o.userData.commFixingShaft);
   return [id,{heads:heads.map(o=>({position:point(o),shown:shown(o)})),shafts:shafts.map(o=>({preparedMm:o.userData.preparedLengthMm||null,illustrative:!!o.userData.illustrativeLength,lengthBasis:o.userData.lengthBasis}))}];}));
 const clips=commClipRecords.map(r=>({device:r.deviceId,rail:r.railId,kind:r.root.userData.kind,shown:shown(r.root),root:pose(r.root),hook:pose(r.hook),spring:pose(r.spring)}));
 const cables=[];scene.traverse(o=>{if(o.userData.cableName&&o.geometry?.type==='TubeGeometry')cables.push({name:o.userData.cableName,
   start:o.geometry.parameters.path.getPoint(0).toArray(),end:o.geometry.parameters.path.getPoint(1).toArray(),shown:shown(o),color:o.material.color.getHexString()});});
 const circuitChecks=[];
 const endpoint=(name,start,end)=>{const c=cables.find(o=>o.name===name);circuitChecks.push({name,exists:!!c,startError:c?Math.hypot(...c.start.map((v,i)=>v-start.toArray()[i])):null,endError:c?Math.hypot(...c.end.map((v,i)=>v-end.toArray()[i])):null});};
 const input=(name,end)=>{const c=cables.find(o=>o.name===name);circuitChecks.push({name,exists:!!c,endError:c?Math.hypot(...c.end.map((v,i)=>v-end.toArray()[i])):null,scope:'接收端实际接点；母排端待视觉核对'});};
 input('辅助正母线 → 保险座唯一 + IN',fusePositiveInput);input('辅助负母线 → 导轨分线端子单口',negativeInput);
 ['CM5','MOXA','USR-G806w','Cerbo'].forEach((name,i)=>{
   for(const [cableName,port] of [['保险座 + OUT '+(i+1)+' → '+name+' DC+',fusePorts[i]],['导轨分线端子 负极口 '+(i+1)+' → '+name+' DC−',negativePorts[i]]]){
     const c=cables.find(o=>o.name===cableName);circuitChecks.push({name:cableName,exists:!!c,startError:c?Math.hypot(...c.start.map((v,i)=>v-port.toArray()[i])):null,scope:'配电端实际接点；设备端待视觉/厂家端口核实'});
   }
 });
 const canvasRect=controls.domElement.getBoundingClientRect();
 const labels=[];scene.traverse(o=>{if(o.userData.annotationCode){const points=[[-.5,-.1275],[.5,-.1275],[-.5,.1275],[.5,.1275]].map(([x,y])=>new THREE.Vector3(x,y,0).applyMatrix4(o.matrixWorld).project(camera)).map(p=>({x:(p.x+1)*canvasRect.width/2,y:(1-p.y)*canvasRect.height/2}));labels.push({code:o.userData.annotationCode,names:o.userData.annotationNames,text:o.userData.annotationText,language:o.userData.annotationLanguage,shown:shown(o),position:point(o),screenBounds:{left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))}});}if(o.userData.assemblyLabel)labels.push({data:o.userData.assemblyLabel,shown:shown(o)});});
 return {camera:${cameraExpression},boards,orion:point(orionSmart),rails,units:{modelUnitsPerMm:mm(1)},fixings,clips,cables,circuitChecks,labels,canvas:{width:canvasRect.width,height:canvasRect.height,visibleHeight:Math.min(canvasRect.height,innerHeight-canvasRect.top)},
   snapshot:window.aikoAssemblyGuide.snapshot(),partPose:Object.fromEntries(Object.entries(commParts).filter(([id])=>id!=='wiring').map(([id,parts])=>[id,parts.map(pose)]))};
})()`;

export async function runFull({page,context,frame,report,row,shot,ready,activeFrame,target,semanticControls=false,detailsOnly=false,repairOnly=false}) {
  const controlClick=async(locator)=>{
    if(semanticControls){await locator.evaluate(element=>element.click());}
    else await locator.click({noWaitAfter:true,timeout:30000});
  };
  if(semanticControls)report.warnings.push('远程模式切换按钮使用DOM click事件；本机默认鼠标点击。旋转/缩放/平移仍发送真实鼠标输入。');
  const attempt=async(id,item,fn)=>{
    try{return await fn();}catch(e){row(id,item,'待核实',e.message);console.log(`DETAIL: ${e.message}`);report.warnings.push(`${id}: ${e.message}`);return null;}
  };
  const mode=async(name)=>{
    if((await frame.evaluate(()=>window.aikoAssemblyGuide.snapshot())).mode===name)return;
    await controlClick(page.locator(`[data-assembly-command="mode"][data-value="${name}"]`));
    await frame.waitForFunction(name=>window.aikoAssemblyGuide.snapshot().mode===name,name);
    await page.waitForTimeout(350);
  };
  const scrub=async(index,progress)=>{
    await page.locator('[data-assembly-step-select]').selectOption(String(index));
    await frame.waitForFunction(index=>window.aikoAssemblyGuide.snapshot().step===index,index);
    await page.waitForFunction(index=>Number(document.querySelector('.assembly-progress')?.textContent.match(/\d+/)?.[0])===index+1,index);
    await page.locator('[data-assembly-progress]').evaluate((input,value)=>{input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));},Math.round(progress*100));
    await frame.waitForFunction(({index,progress})=>{const s=window.aikoAssemblyGuide.snapshot();return s.step===index&&Math.abs(s.stepProgress-progress)<.02;},{index,progress});
    await page.waitForTimeout(150);
  };
  const model=()=>readElectrical(context,page,frame,electricalExpression);
  const cam=()=>readElectrical(context,page,frame,cameraExpression);
  const drag=async(button,dx,dy)=>{
    const box=await frame.locator('canvas').first().boundingBox();
    if(!box)throw new Error('找不到可操作画布');
    const x=box.x+box.width*.48,y=box.y+box.height*.58;
    await page.mouse.move(x,y);await page.mouse.down({button});
    await page.mouse.move(x+dx,y+dy,{steps:18});await page.mouse.up({button});
    await page.waitForTimeout(900);
  };
  if(!detailsOnly){
  await mode('normal');
  await shot('01-overview-normal','改装后常规全景：三块恒流板L型',frame);
  const initial=await attempt('K4-data','读取电路舱实际模型',model);
  if(initial) {
    report.model.electrical=initial;
    const [a,b,c]=initial.boards.map(b=>b.position),epsilon=.01;
    const correct=initial.boards.length===3&&initial.boards.every(b=>b.shown)&&Math.abs(a[0]-b[0])<epsilon&&Math.abs(b[1]-c[1])<epsilon&&a[1]>b[1]+epsilon&&c[0]<b[0]-epsilon;
    row('K4-L','三块恒流板实际模型为L型',correct?'通过':'失败',{boards:initial.boards,rule:'1右上、2右下、3左下；同列/同行关系来自确认要求'});
    row('K4-rails','两根导轨实际几何各150 mm',initial.rails.length===2&&initial.rails.every(r=>Math.abs(r.measuredMm-150)<.1)?'通过':'失败',{rails:initial.rails,units:initial.units});
    const mapping={negative:'communication-din-rail',cm5:'communication-din-rail',moxa:'communication-din-rail-right',router:'communication-din-rail-right'};
    row('K4-rail-layout','左轨端子/CM5、右轨交换机/路由器',initial.clips.length===4&&initial.clips.every(c=>mapping[c.device]===c.rail)?'通过':'失败',initial.clips.map(({device,rail,kind})=>({device,rail,kind})));
    row('K5-screws','导轨、Cerbo和保险座的固定螺丝几何存在',Object.values(initial.fixings).every(v=>v.heads.length>0)?'通过':'失败',initial.fixings);
    row('K5-power','红线连接保险座、黑线连接独立端子，四路配电接点吻合',initial.circuitChecks.length===10&&initial.circuitChecks.every(c=>c.exists&&(c.startError??c.endError)<1e-5)?'通过':'失败',initial.circuitChecks);
  }
  for(const action of ['rotate','zoom','pan'])await attempt(`K3-${action}`,`${action}鼠标与相机检查`,async()=>{
    await controlClick(frame.locator('[data-action="reset"]'));await page.waitForTimeout(500);
    const before=await cam();
    if(action==='rotate')await drag('left',90,35);
    if(action==='pan')await drag('right',85,-30);
    if(action==='zoom'){
      const box=await frame.locator('canvas').first().boundingBox();await page.mouse.move(box.x+box.width*.5,box.y+box.height*.6);await page.mouse.wheel(0,-450);await page.waitForTimeout(900);
    }
    const after=await cam();
    const dp=after.position.map((v,i)=>v-before.position[i]),dt=after.target.map((v,i)=>v-before.target[i]);
    const ok=action==='rotate'?distance(before.position,after.position)>.02&&distance(before.target,after.target)<.001&&Math.abs(after.distance-before.distance)<.01:
      action==='zoom'?after.distance<before.distance-.02&&distance(before.target,after.target)<.001:
      distance(before.target,after.target)>.02&&distance(before.position,after.position)>.02&&Math.abs(after.distance-before.distance)<.01;
    await shot(`02-${action}`,`实际鼠标操作：${action}`,frame);
    row(`K3-${action}`,action==='rotate'?'旋转':action==='zoom'?'缩放':'平移',ok?'通过':'失败',{before,after,input:action==='pan'?'右键拖动':action==='rotate'?'左键拖动':'滚轮-450'});
  });
  await controlClick(frame.locator('[data-action="reset"]'));
  await frame.evaluate(()=>window.aikoAssemblyGuide.selectBoard('comm-backplate'));
  await mode('exploded');await shot('03-comm-exploded','通讯集成板爆炸图：螺丝、导轨、配件及编号',frame);
  const exploded=await attempt('K3-exploded-data','爆炸图实际姿态取证',model);
  if(exploded){const visible=exploded.labels.filter(l=>l.shown&&l.code);report.model.explodedLabels=visible;row('R10-label-bounds','爆炸图C01–C15全部在实际可见画布内',visible.length===15&&visible.every(l=>l.screenBounds.left>=-1&&l.screenBounds.right<=exploded.canvas.width+1&&l.screenBounds.top>=-1&&l.screenBounds.bottom<=exploded.canvas.visibleHeight+1)?'通过':'失败',{canvas:exploded.canvas,labels:visible});}
  if(initial&&exploded)row('K3-exploded','爆炸图状态和实际零件分离',exploded.snapshot.mode==='exploded'&&hash(initial.partPose)!==hash(exploded.partPose)?'通过':'失败',{normalPoseHash:hash(initial.partPose),explodedPoseHash:hash(exploded.partPose)});
  await mode('normal');await shot('04-comm-normal','通讯集成板复位后的常规状态',frame);
  const restored=await attempt('K3-reset-data','常规复位取证',model);
  if(initial&&restored)row('K3-reset','退出爆炸图后实际零件复位',hash(initial.partPose)===hash(restored.partPose)?'通过':'失败',{initialHash:hash(initial.partPose),restoredHash:hash(restored.partPose)});
  await mode('animation');
  await scrub(2,0);
  const playBefore=await frame.evaluate(()=>window.aikoAssemblyGuide.snapshot());
  const poseBefore=await attempt('K3-play-start','动画起点取证',model);
  await controlClick(page.locator('[data-assembly-command="play"]'));
  await frame.waitForFunction(()=>window.aikoAssemblyGuide.snapshot().stepProgress>.12,null,{timeout:8000});
  await controlClick(page.locator('[data-assembly-command="play"]'));
  await frame.waitForFunction(()=>!window.aikoAssemblyGuide.snapshot().playing);
  const playAfter=await frame.evaluate(()=>window.aikoAssemblyGuide.snapshot());
  const poseAfter=await attempt('K3-play-end','动画运动取证',model);
  await shot('05-comm-animation','通讯板安装动画：实际播放后暂停',frame);
  row('K3-play','安装动画播放、进度前进及零件实际运动',playAfter.stepProgress>playBefore.stepProgress&&poseBefore&&poseAfter&&hash(poseBefore.partPose)!==hash(poseAfter.partPose)?'通过':poseBefore&&poseAfter?'失败':'待核实',{playBefore,playAfter,poseChanged:poseBefore&&poseAfter?hash(poseBefore.partPose)!==hash(poseAfter.partPose):null});
  }else{await mode('animation');}
  // Detailed evidence uses the real step selector and action slider. Each
  // device clip is captured at hook, pivot and spring-return phases.
  const clipEvidence=[];
  for(const index of [3,6,7,8])for(const p of repairOnly?[.55,1]:[.15,.55,1]){
    await scrub(index,p);
    if(repairOnly){const actual=await model();clipEvidence.push({step:index,progress:p,clip:actual.clips.find(c=>({router:3,negative:6,cm5:7,moxa:8})[c.device]===index)});}
    await shot(`06-clip-${index}-${Math.round(p*100)}`,`步骤${index+1} 导轨卡扣：${Math.round(p*100)}%动作`,frame);
  }
  for(const index of repairOnly?[5,9,20]:[5,9,11,12,20,21,22]){
    await scrub(index,index>=20?.8:1);
    await shot(`07-detail-step-${index+1}`,`安装步骤${index+1}：螺丝、卡扣、上墙或接线细节`,frame);
  }
  if(repairOnly)row('R10-clip-opacity','当前卡扣固定钩保持不透明',clipEvidence.length===8&&clipEvidence.every(e=>e.clip?.shown&&e.clip.hook.material.opacity===1)?'通过':'失败',clipEvidence);
  const stepOptions=await page.locator('[data-assembly-step-select] option').evaluateAll(nodes=>nodes.map(o=>({value:o.value,text:o.textContent})));
  report.model.communicationSteps=stepOptions;
  row('K5-clip-visual','四台设备卡扣挂入、压扣和回弹是否清晰正确','待核实','已保存四台设备三阶段截图。几何存在与动作取证不自动证明实物卡扣形状、夹持力或装配适配。');
  row('K5-screw-spec','螺丝完整规格和实车固定适配','待核实','C05模型标注已备M4×16；C13/C15模型轴长是叠层示意，最终长度未确认。GX固定螺丝长度未指定；不能从画面推定。');
  row('K5-RS485','RS485针脚、屏蔽和接地处理','待核实','模型将红/黑/蓝画为A+/B−/信号GND，但防水座针脚、屏蔽收口和设备壳体接地仍需实物/厂家确认。已保存三路接线步骤截图。');
  row('K5-labels','标注遮挡、引线和可读性','待核实','保留全景、爆炸图、卡扣及接线截图供逐项视觉复核；文字存在不等于标注清晰。');
  await mode('normal');
  const gxURL=new URL(target);gxURL.searchParams.set('assembly','gx-touch50');
  await liveSessions.get(frame)?.cdp.detach().catch(()=>{});liveSessions.delete(frame);
  await page.goto(gxURL.href,{waitUntil:'domcontentloaded',timeout:45000});
  frame=await activeFrame();
  report.model.gxWebgl=await ready(frame);
  await frame.waitForFunction(()=>!!window.aikoGxScene,null,{timeout:30000});
  await frame.evaluate(()=>window.aikoAssemblyGuide.selectBoard('gx-touch50'));
  await mode('normal');await shot('08-gx-normal','GX常规安装：电视右侧同一面白墙',frame);
  row('R10-GX-overlay','GX重复信息卡已隐藏，不遮挡视角按钮',await page.locator('.stage-status').isHidden()?'通过':'失败',{hidden:await page.locator('.stage-status').isHidden()});
  const gx=await frame.evaluate(async()=>{
    const THREE=await import('../vendor/three/build/three.module.min.js');
    const a=window.aikoGxScene;a.scene.updateMatrixWorld(true);
    const localBox=o=>{const box=new THREE.Box3().setFromObject(o),inv=a.world.matrixWorld.clone().invert();return box.applyMatrix4(inv);};
    const floor=localBox(a.installationReferences.interiorFloor),tv=localBox(a.installationReferences.tvBody),screen=localBox(a.gxTouch.body),wall=localBox(a.installationReferences.wallGraphic);
    const center=a.world.worldToLocal(a.gxTouch.group.getWorldPosition(new THREE.Vector3()));
    const normal=new THREE.Vector3(0,0,1).transformDirection(a.installationReferences.wallGraphic.matrixWorld);
    const wallPoint=a.installationReferences.wallGraphic.getWorldPosition(new THREE.Vector3());
    const displayWallPoint=a.gxTouch.group.getWorldPosition(new THREE.Vector3());
    const tvMountPoint=a.installationReferences.tvBody.localToWorld(new THREE.Vector3(.026,0,0));
    const tvNormal=new THREE.Vector3(0,0,1).transformDirection(a.installationReferences.tvScreen.matrixWorld);
    const gxNormal=new THREE.Vector3(0,0,1).transformDirection(a.gxTouch.face.matrixWorld);
    const withinWall=b=>b.min.y>=wall.min.y&&b.max.y<=wall.max.y&&b.min.z>=wall.min.z&&b.max.z<=wall.max.z;
    const right=new THREE.Vector3(0,0,1),tvCenter=tv.getCenter(new THREE.Vector3());
    return {center:center.toArray(),floorTop:floor.max.y,heightMm:(center.y-floor.max.y)*1000,
      tv:{min:tv.min.toArray(),max:tv.max.toArray()},screen:{min:screen.min.toArray(),max:screen.max.toArray()},
      rightAxis:right.toArray(),rightOfTv:screen.min.z>tv.max.z,
      gxWallDistanceMm:Math.abs(displayWallPoint.clone().sub(wallPoint).dot(normal))*1000,
      tvWallDistanceMm:Math.abs(tvMountPoint.clone().sub(wallPoint).dot(normal))*1000,
      sameWallFootprints:withinWall(tv)&&withinWall(screen),tvWallNormalDot:tvNormal.dot(normal),gxWallNormalDot:gxNormal.dot(normal),tvInFrontOfWall:tvMountPoint.clone().sub(wallPoint).dot(normal)>=0,
      wallBounds:{min:wall.min.toArray(),max:wall.max.toArray()},
      fixings:a.gxTouch.fixings.map(o=>({position:o.position.toArray(),lengthUnspecified:!!o.userData.lengthUnspecified})),
      labels:a.assembly.labels.children.filter(o=>o.userData.assemblyLabel).map(o=>o.userData.assemblyLabel),
      floorSource:'实际完成地板Mesh上表面，模型单位为米',rightSource:'室内面朝电视墙：+z指向电视右侧，与墙法线及车型坐标同时核对',camera:{position:a.camera.position.toArray(),target:a.controls.target.toArray()}};
  });
  report.model.gx=gx;
  row('K4-GX-height','GX中心距实际地板上表面1450 mm',Math.abs(gx.heightMm-1450)<.1?'通过':'失败',gx);
  row('K4-GX-wall','GX位于电视右侧同一安装墙面',gx.rightOfTv&&gx.gxWallDistanceMm<.1&&gx.sameWallFootprints&&gx.tvWallNormalDot>.999&&gx.gxWallNormalDot>.999&&gx.tvInFrontOfWall?'通过':'失败',{rightOfTv:gx.rightOfTv,gxWallDistanceMm:gx.gxWallDistanceMm,tvBodyRearGapMm:gx.tvWallDistanceMm,sameWallFootprints:gx.sameWallFootprints,wallBounds:gx.wallBounds,normals:[gx.tvWallNormalDot,gx.gxWallNormalDot],rightSource:gx.rightSource,scope:'检验同一有限墙面内的投影、朝向和GX固定平面；TV背部安装件不在此项验证范围，机壳与墙间距按实测记录，不要求TV机壳后面贴墙。'});
  await mode('exploded');await shot('09-gx-exploded','GX爆炸图：屏幕、固定框、螺丝及线缆',frame);
  await mode('animation');
  for(const index of repairOnly?[3,5]:[3,5,6,8,9]){
    await scrub(index,.7);await shot(`10-gx-animation-${index+1}`,`GX安装动画步骤${index+1}`,frame);
  }
  await mode('normal');
  row(detailsOnly?'K3-detail-states':'K3-states',detailsOnly?'通讯板安装细节及GX三种查看状态已截图':'通讯板和GX三种查看状态均已截图','通过',report.screenshots.map(s=>s.file));
}
