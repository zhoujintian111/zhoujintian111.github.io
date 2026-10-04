// Actual model/controller and parent integration checks. Renderer/DOM are stubs;
// passing here is not evidence of browser WebGL rendering or physical site fit.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const load=p=>import(pathToFileURL(path.join(base,p)));
const THREEActual=await load('dist/assets/vendor/three/build/three.module.min.js');
const model=await load('dist/assets/gx-touch-model.js');
const data=await load('dist/assets/upgrade-data.js');
const assemblyData=await load('dist/assets/assembly-guide-data.js');
const gxData=await load('dist/assets/gx-guide-data.js');
const {createAssemblyInspector}=await load('dist/assets/assembly-inspector.js');
const messages=[],errors=[];
class Element {
 constructor(tag='div'){this.tag=tag;this.listeners={};this.style={};this.dataset={};this.children=[];this.hidden=false;this.className='';this.attributes={};this.innerHTML='';this.textContent='';this.clientWidth=1280;this.clientHeight=720;this.offsetWidth=260;this.offsetHeight=50;this.parent=null;this.classList={add:(...names)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...names])].join(' ');},remove:(...names)=>{this.className=this.className.split(' ').filter(n=>!names.includes(n)).join(' ');},toggle:(name,on)=>{const has=this.className.split(' ').includes(name);if(on??!has)this.classList.add(name);else this.classList.remove(name);}};}
 addEventListener(type,fn,options){(this.listeners[type]??=[]).push({fn,once:options?.once});}
 removeEventListener(type,fn){this.listeners[type]=(this.listeners[type]||[]).filter(x=>x.fn!==fn);}
 dispatch(type,event={}){for(const item of [...(this.listeners[type]||[])]){item.fn(event);if(item.once)this.removeEventListener(type,item.fn);}}
 dispatchEvent(event){this.dispatch(event.type,event);return true;}
 click(){this.dispatch('click');}
 getAttribute(key){return this.attributes[key];}setAttribute(key,value){this.attributes[key]=String(value);}removeAttribute(key){delete this.attributes[key];}
 appendChild(child){child.parent=this;this.children.push(child);return child;}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
 getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight};}
 getContext(){const gradient={addColorStop(){}};return new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100}),getImageData:()=>({data:new Uint8ClampedArray(4)})},{get:(t,k)=>k in t?t[k]:(()=>{})});}
 querySelectorAll(selector){return this.children.filter(o=>selector==='button'?o.tag==='button':selector.startsWith('.')?selector.slice(1).split('.').every(c=>o.className.split(' ').includes(c)):selector.startsWith('[data-')?Object.hasOwn(o.dataset,selector.slice(6,-1).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())):false);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
class Controls extends THREEActual.EventDispatcher {constructor(camera){super();this.camera=camera;this.target=new THREEActual.Vector3();this.mouseButtons={LEFT:THREEActual.MOUSE.ROTATE,RIGHT:THREEActual.MOUSE.PAN};}update(){this.camera.lookAt(this.target);this.camera.updateMatrixWorld(true);}}
class Renderer {constructor(){this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};}setPixelRatio(){}setSize(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);}}
class TextureLoader {async loadAsync(){return new THREEActual.Texture();}}
class FakeImage {async decode(){return this;}addEventListener(){}}
const THREE={...THREEActual,WebGLRenderer:Renderer,TextureLoader,PMREMGenerator:class{fromScene(){return {texture:null};}}};
function environment(){
 const nodes=new Map(),document=new Element(),window=new Element();document.hidden=false;document.documentElement={};document.fonts={load:async()=>[]};document.activeElement=null;
 const get=key=>{if(!nodes.has(key))nodes.set(key,new Element());return nodes.get(key);};document.getElementById=id=>get('#'+id);document.createElement=tag=>new Element(tag);document.querySelector=s=>get(s);document.querySelectorAll=()=>[];
 for(const id of ['#aiko-interior-four-cameras-v02','#aiko-old-system-routing-fix'])get(id).querySelector=s=>get(s);
 const modes=['all','pv','signal','dimension','replacement'].map(mode=>{const el=new Element();el.dataset.mode=mode;return el;});get('#aiko-old-system-routing-fix').querySelectorAll=s=>s==='.a3-mode'?modes:[];
 let now=0,id=0;const raf=new Map();class FakeDate extends Date{static now(){return now;}}
 const box={THREE,OrbitControls:Controls,...model,...data,...assemblyData,...gxData,document,window,Image:FakeImage,Event:class{constructor(type){this.type=type;}},Date:FakeDate,performance:{now:()=>now},devicePixelRatio:1,location:{origin:'https://test.invalid'},parent:{postMessage:m=>messages.push(m)},ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){this.fn();}},requestAnimationFrame(fn){raf.set(++id,fn);return id;},cancelAnimationFrame(i){raf.delete(i);},getComputedStyle:()=>({color:'rgb(240,240,240)',getPropertyValue:()=>''}),setTimeout:()=>1,clearTimeout(){},console:{...console,error:(...a)=>errors.push(a.join(' '))}};
 vm.createContext(box);
 return {box,nodes,document,window,get,advance(ms){for(let dt=0;dt<ms;dt+=100){now+=Math.min(100,ms-dt);const pending=[...raf.values()];raf.clear();pending.forEach(fn=>fn(now));}}};
}
const gx=environment();
let controller=read('dist/assets/gx-assembly-controller.js').replace(/^import .*;\n/gm,'').replace(/export /g,'');
vm.runInContext(controller,gx.box,{timeout:10000});
let sceneCode=read('dist/assets/views/gx-new.html').match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*;\n/gm,'');
sceneCode=sceneCode.replace(/const \{makeGxTouch,gxTouchSpec\}=await import\([^;]+;/,'const {makeGxTouch,gxTouchSpec}=globalThis;');
sceneCode=sceneCode.replace(/const \{createGxAssemblyGuide\}=await import\([^;]+;/,'');
sceneCode=sceneCode.replace('window.aikoGxScene={scene,camera,','window.aikoGxScene={scene,camera,renderer,');
sceneCode=sceneCode.replace('    start().catch((error) => {','    globalThis.sceneReady=start(); globalThis.sceneReady.catch((error) => {');
vm.runInContext(sceneCode,gx.box,{timeout:15000});await gx.box.sceneReady;
assert(gx.window.aikoGxScene,`GX scene failed: ${gx.get('[data-loading]').textContent}`);
const a=gx.window.aikoGxScene,guide=gx.window.aikoAssemblyGuide;
const presentationBefore={background:a.scene.background,fog:a.scene.fog,exposure:a.renderer.toneMappingExposure};
const presentationRestored=()=>{assert.equal(a.scene.background,presentationBefore.background);assert.equal(a.scene.fog,presentationBefore.fog);assert.equal(a.renderer.toneMappingExposure,presentationBefore.exposure);assert(!a.scene.getObjectByName('Installation neutral lighting').visible);};
gx.box.location.pathname='/assets/views/gx-new.html';gx.get('[data-view][aria-selected="true"]').dataset.view='gx-installation';vm.runInContext(read('dist/assets/view-language.js'),gx.box,{timeout:5000});
assert(guide,'GX scene did not register assembly API');
const command=(command,value,origin='https://test.invalid')=>gx.window.dispatch('message',{origin,data:{type:'aiko-assembly-command',command,value}});
const spec=assemblyData.getAssemblyGuide('gx-touch50');
const expectedSteps=['isolate-cerbo','check-kit','confirm-position-route','prepare-front-mount','route-display-cable','fix-frame','fit-gx-ferrite','seat-display','fit-hdmi-ferrite','connect-display','inspect-restore-cover','power-check'];
assert.deepEqual(spec.steps.map(s=>s.id),expectedSteps);
assert.deepEqual(spec.parts.map(p=>p.id).sort(),['display','frame','frame-screws','display-cable','ferrite-gx','ferrite-hdmi','hdmi-plug','usb-plug','cover'].sort());
function checkEnglish(value,path='guide'){
 if(!value||typeof value!=='object')return;
 if('en' in value&&typeof value.en==='string'){assert(value.en.length,`Empty ${path} English`);assert(!/\p{Script=Han}/u.test(value.en),`Chinese in ${path} English`);}
 for(const [key,item] of Object.entries(value))if(typeof item==='object')checkEnglish(item,path+'.'+key);
}
checkEnglish(spec);
const visible=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
const descendants=root=>{const all=[];root.traverse(o=>all.push(o));return all;};
const state=objects=>{a.scene.updateMatrixWorld(true);return objects.map(o=>({id:o.uuid,position:o.position.toArray(),rotation:o.quaternion.toArray(),scale:o.scale.toArray(),visible:o.visible,matrix:o.matrixWorld.elements.slice(),drawRange:o.geometry?{...o.geometry.drawRange}:null}));};
const near=(value,expected,label,tol=1e-6)=>assert(Math.abs(value-expected)<=tol,`${label}: ${value} != ${expected}`);
const worldPoint=o=>o.getWorldPosition(new THREEActual.Vector3());
const allObjects=descendants(a.world),before=state(allObjects);
const materialState=new Map(allObjects.filter(o=>o.material).map(o=>[o,{reference:o.material,props:(Array.isArray(o.material)?o.material:[o.material]).map(m=>({opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite}))}]));
const cameraBefore={position:a.camera.position.toArray(),target:a.controls.target.toArray(),fov:a.camera.fov,minDistance:a.controls.minDistance,maxDistance:a.controls.maxDistance,minPolarAngle:a.controls.minPolarAngle,maxPolarAngle:a.controls.maxPolarAngle,enablePan:a.controls.enablePan};
const restored=()=>{presentationRestored();assert.deepEqual(state(allObjects),before,'Guide did not restore actual scene geometry/visibility/draw ranges');for(const [object,saved] of materialState){assert.equal(object.material,saved.reference,'Guide leaked replacement material');assert.deepEqual((Array.isArray(object.material)?object.material:[object.material]).map(m=>({opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite})),saved.props,'Guide mutated shared material');}};
const cameraRestored=()=>{for(const [k,v] of Object.entries(cameraBefore))assert.deepEqual(k==='position'?a.camera.position.toArray():k==='target'?a.controls.target.toArray():k==='fov'?a.camera.fov:a.controls[k],v,`Camera/orbit ${k} not restored`);};
// Dimensions and mounting relationships come from the confirmed standard GX unit,
// original TV/front wall geometry, and the 1450 mm user requirement.
near(a.gxTouch.group.position.y-model.gxTouchSpec.floorY,1.45,'GX centre height above finished floor');
near(a.gxTouch.group.position.x,.514,'GX mounting plane changed');
const tvBox=new THREEActual.Box3().setFromObject(a.installationReferences.tvBody),gxBox=new THREEActual.Box3().setFromObject(a.gxTouch.body);
assert(gxBox.min.z>tvBox.max.z,'GX no longer sits to the right of the TV on the same front wall');
assert.equal(a.gxTouch.fixings.length,4,'Included frame requires four front fixings');
const ys=a.gxTouch.fixings.map(o=>o.position.y),zs=a.gxTouch.fixings.map(o=>o.position.z);
near(Math.max(...ys)-Math.min(...ys),.0692,'Frame hole vertical spacing');near(Math.max(...zs)-Math.min(...zs),.1102,'Frame hole horizontal spacing');
assert(a.gxTouch.fixings.every(o=>o.position.x<=.003),'Frame screws incorrectly placed behind wall');
assert(!descendants(a.gxTouch.group).some(o=>/wing.?nut|rear.?nut/i.test(o.name)),'Rear fixing nuts were invented');
// The included frame is a ring with real bores, not a solid rectangle with painted holes.
const frameClear=(y,z)=>{const mount=a.gxTouch.mount,origin=mount.localToWorld(new THREEActual.Vector3(-.02,y,z)),axis=new THREEActual.Vector3(1,0,0).transformDirection(mount.matrixWorld);return new THREEActual.Raycaster(origin,axis,0,.04).intersectObject(mount,true).length===0;};
assert(frameClear(0,0),'Frame window is filled');
for(const [width,height] of [[.1102,.0692],[.116,.0526]])for(const y of [-height/2,height/2])for(const z of [-width/2,width/2])assert(frameClear(y,z),'Frame fixing bore is blocked');
assert(!frameClear(.039,0),'Frame upper bar is absent');
assert(!visible(a.assembly.route),'Hidden cable route is visible in normal view');
assert.equal(a.assembly.ferrites.length,2,'Both HDMI cable ferrites must be shown');
const [gxFerrite,hdmiFerrite]=a.assembly.ferrites;
const hdmiPart=a.assembly.parts['hdmi-plug'][0],usbPart=a.assembly.parts['usb-plug'][0];
assert.equal(descendants(hdmiPart).filter(o=>o.name==='HDMI contact').length,19,'HDMI contact count');
assert.equal(descendants(usbPart).filter(o=>o.name==='USB-A contact').length,4,'USB-A contact count');
const usbSheet=usbPart.getObjectByName('USB-A top shell with retention windows');assert(usbSheet);
assert.equal(usbSheet.geometry.parameters.shapes.holes.length,2,'USB retention windows missing');
for(const ferrite of a.assembly.ferrites){assert.equal(descendants(ferrite).filter(o=>o.name==='Ferrite half-core with open cable groove').length,2);assert(ferrite.getObjectByName('Snap latch tongue'));assert(ferrite.getObjectByName('Snap latch catch'));}
const ferriteGxPoint=worldPoint(gxFerrite),ferriteHdmiPoint=worldPoint(hdmiFerrite),displayPoint=worldPoint(a.gxTouch.group),hdmiPoint=worldPoint(hdmiPart),usbPoint=worldPoint(usbPart);
assert(ferriteGxPoint.distanceTo(displayPoint)<ferriteGxPoint.distanceTo(hdmiPoint),'First ferrite belongs near the screen');
assert(ferriteHdmiPoint.distanceTo(hdmiPoint)<ferriteHdmiPoint.distanceTo(usbPoint),'Second ferrite was fitted to the USB branch');
assert(ferriteHdmiPoint.distanceTo(hdmiPoint)<ferriteHdmiPoint.distanceTo(displayPoint),'Second ferrite belongs near the HDMI plug');
const routePoints=a.assembly.routePoints;
assert(routePoints[0].y<tvBox.min.y,'Concealed route must begin in the battery-bay area below the TV');
assert(routePoints.some(p=>p.y>tvBox.min.y&&p.y<tvBox.max.y&&p.z>tvBox.min.z&&p.z<tvBox.max.z&&p.x>tvBox.max.x),'Route does not pass behind the TV');
assert(routePoints.at(-1).distanceTo(displayPoint)<.06,'Concealed route does not terminate at GX rear lead');

// Controller paths and controls must operate actual objects, not only metadata.
assert(!guide.snapshot().available);command('select','gx-touch50','https://untrusted.invalid');assert(!guide.snapshot().available,'Untrusted origin activated GX guide');
command('select','gx-touch50');assert.equal(guide.snapshot().boardId,'gx-touch50');assert.equal(guide.snapshot().mode,'normal');assert.equal(guide.snapshot().stepCount,12);restored();
command('mode','exploded');assert.equal(a.scene.background.getHex(),0xe1e1e1);assert.equal(a.scene.fog,null);assert.equal(a.renderer.toneMappingExposure,.90);assert(a.scene.getObjectByName('Installation neutral lighting').visible);assert.notDeepEqual(state(allObjects),before,'Explosion did not move actual GX geometry');
command('mode','normal');restored();assert(!visible(a.assembly.route));
command('mode','animation');assert(!guide.snapshot().playing,'Entering GX assembly auto-played');
for(let step=0;step<spec.steps.length;step++){command('step',step);assert.equal(guide.snapshot().step,step);command('progress',.5);near(guide.snapshot().stepProgress,.5,'Within-step scrub');command('progress',1);near(guide.snapshot().stepProgress,1,'Completed scrub');}
command('step',4);command('progress',1);assert(visible(a.assembly.route),'Routing step does not reveal the concealed path');command('step',10);command('progress',1);assert(!visible(a.assembly.route),'Restoring the cover leaves the route visible');
command('step',5);command('progress',0);const start=state(a.gxTouch.fixings);command('progress',.5);const middle=state(a.gxTouch.fixings);command('progress',1);const end=state(a.gxTouch.fixings);assert.notDeepEqual(start,middle,'Frame fastening has no intermediate motion');assert.notDeepEqual(middle,end,'Frame fastening snaps to its final pose');
command('progress',-1);near(guide.snapshot().stepProgress,0,'Progress lower bound');command('progress',2);near(guide.snapshot().stepProgress,1,'Progress upper bound');
command('replay-step');assert.equal(guide.snapshot().step,5);near(guide.snapshot().stepProgress,0,'Replay did not restart current operation');gx.advance(900);assert(guide.snapshot().stepProgress>0&&guide.snapshot().stepProgress<1,'Playback is not progressive');if(guide.snapshot().playing)command('play');const paused=state(allObjects),pausedSnapshot=guide.snapshot();gx.advance(7000);assert.deepEqual(state(allObjects),paused,'Paused GX animation moved');near(guide.snapshot().stepProgress,pausedSnapshot.stepProgress,'Paused progress drift');
command('replay-step');gx.advance(20000);assert.equal(guide.snapshot().step,5,'Replay advanced into another operation');assert(!guide.snapshot().playing);near(guide.snapshot().stepProgress,1,'Replay did not finish');
command('play');gx.document.hidden=true;gx.document.dispatch('visibilitychange');assert(!guide.snapshot().playing,'Hidden page did not pause');gx.document.hidden=false;gx.document.dispatch('visibilitychange');assert(!guide.snapshot().playing,'Returning to page resumed playback');
command('exit');assert(!guide.snapshot().available&&!guide.snapshot().playing);restored();cameraRestored();gx.advance(1000);restored();cameraRestored();
// Every detail mode must restore visibility, material identity and transforms.
for(let step=0;step<spec.steps.length;step++){command('select','gx-touch50');command('mode','animation');command('step',step);command('progress',.5);command('exit');restored();cameraRestored();}
// Real raycasts and canvas pointer events must resolve labels/parts without changing the operation.
const gxCanvas=gx.get('[data-canvas]'),gxStage=gx.get('[data-stage]');
const pointer=(type,x,y,extra={})=>gxCanvas.dispatch(type,{clientX:x,clientY:y,pointerId:21,button:0,isPrimary:true,...extra});
const labelCenter=id=>{guide.updateLabels();a.scene.updateMatrixWorld(true);const sprite=guide.geometry.labels.children.find(o=>o.isSprite&&visible(o)&&o.userData.assemblyPart===id);assert(sprite,`Missing visible label ${id}`);const b=sprite.userData.assemblyLabel.screenBox;return [b.x+b.width/2,b.y+b.height/2];};
const clickAt=point=>{pointer('pointerdown',...point);pointer('pointerup',...point);};
let labelPickCases=0,physicalPickCases=0;
for(const [width,height,iframeHeight] of [[1280,720,840],[812,350,520],[375,450,620]]){
 gxCanvas.clientWidth=gxStage.clientWidth=width;gxCanvas.clientHeight=gxStage.clientHeight=height;gx.window.innerWidth=width;gx.window.innerHeight=iframeHeight;a.camera.aspect=width/height;a.camera.updateProjectionMatrix();
 for(const language of ['zh','en']){
  gx.window.dispatch('message',{origin:'https://test.invalid',data:{type:'aiko-language',language}});command('select','gx-touch50');command('mode','exploded');gx.advance(100);
  const partIds=guide.geometry.labels.children.filter(o=>o.isSprite&&visible(o)&&o.userData.assemblyPart).map(o=>o.userData.assemblyPart);
  for(const id of partIds){const point=labelCenter(id);clickAt(point);assert.equal(guide.snapshot().partId,id,`Canvas label click ${width}/${language}/${id}`);assert.equal(guide.snapshot().mode,'exploded');labelPickCases++;}
  for(const sprite of guide.geometry.labels.children.filter(o=>o.isSprite&&visible(o))){
   const tag=sprite.userData.assemblyLabel,b=tag.screenBox;assert(b.x>=0&&b.y>=0&&b.x+b.width<=width+.01&&b.y+b.height<=height+.01,`Label clipped at real canvas ${width}x${height}`);
   const center=sprite.getWorldPosition(new THREEActual.Vector3()),up=new THREEActual.Vector3(0,1,0).applyQuaternion(a.camera.quaternion).multiplyScalar(sprite.scale.y/2);
   const top=center.clone().add(up).project(a.camera),bottom=center.clone().sub(up).project(a.camera);near(Math.abs(top.y-bottom.y)*height/2,tag.pixelHeight,'Real canvas label pixel height',.01);
   if(language==='en')assert(!/\p{Script=Han}/u.test(tag.text),'Chinese in English GX pick label');
  }
  command('exit');restored();cameraRestored();
 }
}
// Physical part picks: raycast actual exposed meshes in their installed/exploded poses.
gxCanvas.clientWidth=gxStage.clientWidth=1280;gxCanvas.clientHeight=gxStage.clientHeight=720;gx.window.innerWidth=1280;gx.window.innerHeight=840;a.camera.aspect=1280/720;a.camera.updateProjectionMatrix();
command('select','gx-touch50');command('mode','exploded');gx.advance(100);
for(const id of ['display','frame','frame-screws','hdmi-plug','usb-plug']){
 let found=false;
 for(const object of guide.geometry.parts[id]){
  for(const mesh of descendants(object).filter(o=>o.isMesh&&visible(o)&&o.userData.assemblyPart===id)){
   // A frame/washer's bounding-box centre is its hole. Pick actual surface triangles.
   const geometry=mesh.geometry,positions=geometry.attributes.position,index=geometry.index;
   const count=index?index.count:positions.count;
   for(let i=0;i<count-2;i+=Math.max(3,Math.floor(count/120/3)*3)){
    const point=new THREEActual.Vector3();for(let j=0;j<3;j++)point.add(new THREEActual.Vector3().fromBufferAttribute(positions,index?index.getX(i+j):i+j));point.multiplyScalar(1/3).applyMatrix4(mesh.matrixWorld).project(a.camera);
    clickAt([(point.x+1)*640,(1-point.y)*360]);
    if(guide.snapshot().partId===id){found=true;physicalPickCases++;break;}
   }if(found)break;
  }if(found)break;
 }assert(found,`Actual GX part not selectable: ${id}`);
}
// Dragging away and back, cancellation, right-button input and stale pointerup are not clicks.
const targetPoint=labelCenter('frame-screws');command('part','frame');
pointer('pointerdown',...targetPoint);pointer('pointermove',targetPoint[0]+12,targetPoint[1]);pointer('pointermove',...targetPoint);pointer('pointerup',...targetPoint);assert.equal(guide.snapshot().partId,'frame');
pointer('pointerdown',...targetPoint);pointer('pointercancel',...targetPoint);pointer('pointerup',...targetPoint);assert.equal(guide.snapshot().partId,'frame');
pointer('pointerdown',...targetPoint,{button:2});pointer('pointerup',...targetPoint,{button:2});assert.equal(guide.snapshot().partId,'frame');
pointer('pointerup',...targetPoint);assert.equal(guide.snapshot().partId,'frame');
// Selecting a label while a step plays must not reset, advance, pause or restart it.
command('step',9);command('progress',.62);command('play');const running=guide.snapshot();clickAt(labelCenter('usb-plug'));const picked=guide.snapshot();assert.equal(picked.partId,'usb-plug');for(const key of ['step','stepProgress','mode','playing'])assert.equal(picked[key],running[key],`Part click changed ${key}`);command('play');
command('step',10);command('progress',0);assert(guide.geometry.labels.children.some(o=>o.isSprite&&o.userData.assemblyPart==='display-cable'));
command('progress',1);assert(!guide.geometry.labels.children.some(o=>o.isSprite&&o.userData.assemblyPart==='display-cable'),'Hidden route retained a stale G04 label');
// Hidden parents and zero draw ranges cannot receive physical picks.
command('part','cover');const hiddenRay=new THREEActual.Raycaster();hiddenRay.setFromCamera(new THREEActual.Vector2(0,0),a.camera);
const originalIntersections=hiddenRay.intersectObjects.bind(hiddenRay);hiddenRay.intersectObjects=(objects,recursive)=>recursive?[{object:guide.geometry.parts['display-cable'][0],distance:1}]:[];
assert.equal(guide.pickPart(hiddenRay),false);assert.equal(guide.snapshot().partId,'cover');hiddenRay.intersectObjects=originalIntersections;
command('exit');restored();cameraRestored();
// Once exited, the original physical GX entry still activates its guide.
const displayCenter=new THREEActual.Box3().setFromObject(a.gxTouch.body).getCenter(new THREEActual.Vector3());a.camera.position.copy(displayCenter).add(new THREEActual.Vector3(-.4,.02,0));a.controls.target.copy(displayCenter);a.controls.update();
clickAt([640,360]);assert(guide.snapshot().available,'Original GX click entry stopped working');assert.equal(guide.snapshot().mode,'normal');command('exit');
a.camera.position.fromArray(cameraBefore.position);a.controls.target.fromArray(cameraBefore.target);a.camera.fov=cameraBefore.fov;a.camera.updateProjectionMatrix();a.controls.update();restored();cameraRestored();

// Actual inspector renders both languages for every step and each part.
globalThis.document=gx.document;let language='zh';const container=new Element(),sent=[];
const inspector=createAssemblyInspector({container,getLanguage:()=>language,send:(...args)=>sent.push(args)});let uiCases=0;
for(language of ['zh','en']){
 gx.window.dispatch('message',{origin:'https://test.invalid',data:{type:'aiko-language',language}});command('select','gx-touch50');inspector.setEligible(true,'gx-touch50');
 for(const mode of ['normal','exploded','animation']){command('mode',mode);for(const step of mode==='animation'?spec.steps.map((_,i)=>i):[0]){if(mode==='animation')command('step',step);for(const part of spec.parts){command('part',part.id);inspector.update(guide.snapshot());assert(container.innerHTML.includes('gx-touch50'));if(language==='en')assert(!/\p{Script=Han}/u.test(container.innerHTML),`Chinese in English GX inspector ${mode}/${step}/${part.id}`);if(mode==='animation'){assert(container.innerHTML.includes('data-assembly-progress'));assert(container.innerHTML.includes('data-assembly-command="replay-step"'));assert(container.innerHTML.includes('/ 12'));}uiCases++;}}}command('exit');
}
inspector.reset();delete globalThis.document;
// A language change during the guide must survive exit; saved Chinese view labels
// cannot be restored over an English parent interface.
gx.window.dispatch('message',{origin:'https://test.invalid',data:{type:'aiko-language',language:'zh'}});command('select','gx-touch50');command('mode','animation');command('step',5);gx.window.dispatch('message',{origin:'https://test.invalid',data:{type:'aiko-language',language:'en'}});command('exit');
assert(!/\p{Script=Han}/u.test(gx.get('[data-view-name]').textContent+gx.get('[data-view-note]').textContent),'Exiting after switching to English restored stale Chinese scene labels');

// Integrate the real parent app with both guide families. The iframe bridge
// dispatches messages to actual GX/electrical controllers, while DOM is simulated.
const electrical=environment();
const roundedSource=read('dist/assets/vendor/three/examples/jsm/geometries/RoundedBoxGeometry.js').replace("from 'three'",`from '${pathToFileURL(path.join(base,'dist/assets/vendor/three/build/three.module.min.js')).href}'`);
electrical.box.RoundedBoxGeometry=(await import('data:text/javascript;base64,'+Buffer.from(roundedSource).toString('base64'))).RoundedBoxGeometry;
electrical.box.RoomEnvironment=THREEActual.Group;
let electricalCode=read('dist/assets/views/electrical-new.html').match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm,'');
vm.runInContext(electricalCode,electrical.box,{timeout:15000});
assert(electrical.window.aikoAssemblyGuide,`Electrical scene failed: ${electrical.get('.a3-error').textContent}`);
const appIds=new Map(),appWindow=new Element(),detailTabs=new Element();let appDocument;
class AppElement extends Element {
 constructor(tag='div'){
  super(tag);
  if(tag==='iframe'){
   this.contentWindow={postMessage:message=>{
    const runtime=this.src?.includes('gx-new.html')?gx:this.src?.includes('electrical-new.html')?electrical:null;
    if(runtime)runtime.window.dispatch('message',{origin:'https://test.invalid',data:message});
   },addEventListener:(type,fn,options)=>gx.window.addEventListener(type,fn,options)};
  }
 }
}
appDocument={documentElement:{},activeElement:null,title:'',getElementById:id=>{if(!appIds.has(id))appIds.set(id,new AppElement());return appIds.get(id);},createElement:tag=>new AppElement(tag),querySelector:selector=>selector==='.detail-tabs'?detailTabs:selector.startsWith('#')?appDocument.getElementById(selector.slice(1)):null,querySelectorAll:()=>[]};
for(const [id,key,values]of [['languageSwitch','language',['zh','en']],['versionSwitch','version',['old','new']]])for(const value of values){const button=new AppElement('button');button.dataset[key]=value;appDocument.getElementById(id).appendChild(button);}
appDocument.getElementById('stageStatus').parentElement={hidden:false};
globalThis.document=appDocument;
const appSandbox={...data,...assemblyData,...gxData,createAssemblyInspector,document:appDocument,window:appWindow,location:{origin:'https://test.invalid',search:'?assembly=gx-touch50'},URLSearchParams,localStorage:{getItem:()=> 'en',setItem(){}},requestAnimationFrame:fn=>fn(),setTimeout:()=>1,clearTimeout(){},console};
vm.createContext(appSandbox);vm.runInContext(read('dist/app.js').replace(/^import .*;\n/gm,''),appSandbox,{timeout:5000});
const stack=appDocument.getElementById('frameStack'),appInspector=appDocument.getElementById('assemblyInspector');
assert.equal(stack.children.length,1,'GX deep link started duplicate frames');
assert(stack.children[0].src.includes('gx-new.html'),'GX deep link opened electrical scene');
function loadLatest({delayGx=false}={}){
 const frame=stack.children.at(-1),runtime=frame.src.includes('gx-new.html')?gx:frame.src.includes('electrical-new.html')?electrical:null;
 if(runtime)runtime.box.parent.postMessage=message=>{messages.push(message);appWindow.dispatch('message',{origin:'https://test.invalid',source:frame.contentWindow,data:message});};
 if(runtime===gx&&!delayGx){frame.contentWindow.aikoAssemblyGuide=guide;frame.contentWindow.aikoGxScene=a;}
 frame.dispatch('load');
 return frame;
}
const gxFrame=loadLatest({delayGx:true});assert(!guide.snapshot().available,'GX selected before asynchronous scene-ready');
gxFrame.contentWindow.aikoAssemblyGuide=guide;gxFrame.contentWindow.aikoGxScene=a;gx.window.dispatch('aiko-scene-ready');
assert.equal(guide.snapshot().boardId,'gx-touch50');assert(guide.snapshot().available,'GX deep link did not activate after scene-ready');assert(!/\p{Script=Han}/u.test(appInspector.innerHTML),'English deep link retained Chinese');
const clickInspector=(command,value)=>appInspector.dispatch('click',{target:{closest:()=>({disabled:false,dataset:{assemblyCommand:command,value}})}});
clickInspector('mode','animation');assert(detailTabs.hidden&&appDocument.getElementById('detailBody').hidden,'Ordinary details overlap GX guide');
appInspector.dispatch('change',{target:{matches:s=>s==='[data-assembly-step-select]',value:'8'}});assert.equal(guide.snapshot().step,8);
appInspector.dispatch('input',{target:{matches:s=>s==='[data-assembly-progress]',value:'45'}});near(guide.snapshot().stepProgress,.45,'Parent progress not forwarded');
clickInspector('replay-step');near(guide.snapshot().stepProgress,0,'Parent replay not forwarded');assert.equal(guide.snapshot().step,8);
for(const [i,language]of ['zh','en'].entries()){appDocument.getElementById('languageSwitch').children[i].click();assert.equal(guide.snapshot().language,language);if(language==='en')assert(!/\p{Script=Han}/u.test(appInspector.innerHTML));}
// A stale electrical frame may not overwrite the active GX inspector.
const beforeStale=appInspector.innerHTML;appWindow.dispatch('message',{origin:'https://test.invalid',source:{},data:{type:'aiko-assembly-state',available:false}});assert.equal(appInspector.innerHTML,beforeStale);
let transitionCases=0;
for(const id of ['constant-aiko','constant-ja','constant-jk','comm-backplate']){
 clickInspector('select',id);assert(!guide.snapshot().available&&!guide.snapshot().playing,'Leaving GX did not stop/restore guide');restored();
 assert(stack.children.at(-1).src.includes('electrical-new.html'),'Electrical target did not change scene');loadLatest();
 const eg=electrical.window.aikoAssemblyGuide;assert.equal(eg.snapshot().boardId,id);assert.equal(stack.querySelectorAll('.view-frame.is-active').length,1,'Two active frames can swallow state messages');
 clickInspector('mode','animation');clickInspector('play');assert(eg.snapshot().playing);
 clickInspector('select','gx-touch50');assert(!eg.snapshot().available&&!eg.snapshot().playing,'Electrical guide keeps playing after switching to GX');assert(stack.children.at(-1).src.includes('gx-new.html'));loadLatest();
 assert.equal(guide.snapshot().boardId,'gx-touch50');assert.equal(guide.snapshot().mode,'normal');assert(!guide.snapshot().playing);assert.equal(stack.querySelectorAll('.view-frame.is-active').length,1);
 clickInspector('mode','animation');clickInspector('play');assert(guide.snapshot().playing);transitionCases++;
}
clickInspector('exit');assert(!guide.snapshot().available&&!guide.snapshot().playing);assert(!detailTabs.hidden&&!appDocument.getElementById('detailBody').hidden);restored();
clickInspector('select','gx-touch50');clickInspector('mode','animation');clickInspector('play');appDocument.getElementById('versionSwitch').children[0].click();assert(!guide.snapshot().available&&!guide.snapshot().playing,'Old-version switch left GX playback active');assert(stack.children.at(-1).src.includes('gx-old.html'));assert(appInspector.hidden);restored();
delete globalThis.document;
assert.equal(errors.length,0,errors.join('\n'));
console.log(JSON.stringify({gxAssembly:'passed',steps:spec.steps.length,parts:spec.parts.length,geometry:'1450 mm centre, right of TV on original front wall, four front screws 110.2 × 69.2 mm, two ferrites; normal hidden route',animation:'progress, pause, replay and all-step restoration',integration:'asynchronous GX deep link, all five guide targets, cross-scene cleanup, language and old-version navigation',transitionCases,uiCases,labelPickCases,physicalPickCases,webglVisualQA:'not performed by this geometry and DOM harness'},null,2));
