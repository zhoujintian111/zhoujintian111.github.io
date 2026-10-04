// User-path checks against the actual Three scene and inspector module.
// DOM/rendering are stubbed: these are geometry/state checks, not WebGL QA.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const actual=await import(pathToFileURL(path.join(base,'dist/assets/vendor/three/build/three.module.min.js')));
const roundedSource=fs.readFileSync(path.join(base,'dist/assets/vendor/three/examples/jsm/geometries/RoundedBoxGeometry.js'),'utf8').replace("from 'three'",`from '${pathToFileURL(path.join(base,'dist/assets/vendor/three/build/three.module.min.js')).href}'`);
const {RoundedBoxGeometry}=await import('data:text/javascript;base64,'+Buffer.from(roundedSource).toString('base64'));
const data=await import(pathToFileURL(path.join(base,'dist/assets/upgrade-data.js')));
const communicationData=await import(pathToFileURL(path.join(base,'dist/assets/communication-guide-data.js')));
const assemblyData=await import(pathToFileURL(path.join(base,'dist/assets/assembly-guide-data.js')));
const {assemblyGuideData,getAssemblyGuide}=assemblyData;
const {createAssemblyInspector}=await import(pathToFileURL(path.join(base,'dist/assets/assembly-inspector.js')));
const errors=[],messages=[];
class Element {
  constructor(){this.listeners={};this.dataset={};this.style={};this.children=[];this.hidden=false;this.textContent='';this.innerHTML='';this.offsetWidth=260;this.offsetHeight=46;this.classList={add(){},remove(){},toggle(){}};}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  dispatch(type,event={}){for(const fn of this.listeners[type]||[])fn(event);}
  click(){this.dispatch('click');}
  setAttribute(){} removeAttribute(){} remove(){}
  appendChild(el){this.children.push(el);return el;}
  getBoundingClientRect(){return {left:0,top:0,width:1280,height:690};}
  getContext(){return new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100}),getImageData:()=>({data:new Uint8ClampedArray(4)})},{get:(t,k)=>k in t?t[k]:(()=>{})});}
  querySelector(selector){return nodes.get(selector)||new Element();}
  querySelectorAll(selector){return selector==='.a3-mode'?modes:[];}
}
const modes=['all','pv','signal','dimension','replacement'].map(mode=>{const el=new Element();el.dataset.mode=mode;return el;});
const nodes=new Map(['#aiko-old-system-routing-fix','.a3-canvas','.a3-loading','.a3-error','.a3-selection-id','.a3-selection strong','.a3-selection p','.a3-dimension-panel','.a3-viewport','[data-action="reset"]','[data-action="communication"]','[data-action="cm5-wiring"]'].map(x=>[x,new Element()]));
const document=new Element();Object.assign(document,{getElementById:id=>nodes.get('#'+id),createElement:()=>new Element(),documentElement:{},hidden:false,activeElement:null});
const window=new Element();
class Renderer {constructor(){this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};}setPixelRatio(){}setSize(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);}}
class PMREM {fromScene(){return {texture:null};}}
class Controls extends actual.EventDispatcher {constructor(camera){super();this.camera=camera;this.target=new actual.Vector3();this.mouseButtons={LEFT:actual.MOUSE.ROTATE,RIGHT:actual.MOUSE.PAN};}update(){this.camera.lookAt(this.target);this.camera.updateMatrixWorld(true);}}
let now=0,rafId=0;const frames=new Map();
class FakeDate extends Date {static now(){return now;}}
const THREE={...actual,WebGLRenderer:Renderer,PMREMGenerator:PMREM};
const sandbox={THREE,RoundedBoxGeometry,OrbitControls:Controls,RoomEnvironment:actual.Group,...data,...assemblyData,...communicationData,document,window,devicePixelRatio:1,location:{origin:'https://test.invalid'},parent:{postMessage:m=>messages.push(m)},Date:FakeDate,performance:{now:()=>now},ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){this.fn();}},requestAnimationFrame(fn){frames.set(++rafId,fn);return rafId;},cancelAnimationFrame(id){frames.delete(id);},getComputedStyle:()=>({getPropertyValue:()=>''}),console:{...console,error:(...a)=>errors.push(a.join(' '))}};
let sceneCode=fs.readFileSync(path.join(base,'dist/assets/views/electrical-new.html'),'utf8').match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm,'');
sceneCode=sceneCode.replace("  loading.classList.add('is-done');", "  globalThis.audit={scene,camera,renderer,controls,pickables,cc1,cc2,cc3,mppt1,mppt2,mppt3,orionSmart,setMode,flowGroups,communication,commBack,commRail,commRails,commClipRecords,usrBody,usrDcNegative,commParts,commWireSets,communicationGuide,cm5,netSwitch,usr,cerbo,fuse,negativeDistributor,cm5Terminals,cm5Dc,moxaDc,usrDc,cerboDc,fusePositiveInput,fusePorts,negativeInput,negativePorts,switchPorts,cerboEth,usrLan,cm5Eth1};\n  loading.classList.add('is-done');");
vm.createContext(sandbox);vm.runInContext(sceneCode,sandbox,{timeout:15000});
assert(sandbox.audit,`Scene failed: ${nodes.get('.a3-error').textContent}`);
const a=sandbox.audit,guide=window.aikoAssemblyGuide;
const presentationBefore={background:a.scene.background,fog:a.scene.fog,exposure:a.renderer.toneMappingExposure};
const presentationRestored=()=>{assert.equal(a.scene.background,presentationBefore.background);assert.equal(a.scene.fog,presentationBefore.fog);assert.equal(a.renderer.toneMappingExposure,presentationBefore.exposure);assert(!a.scene.getObjectByName('Installation neutral lighting').visible);};
assert(guide,'Assembly guide was not registered');
const spec=getAssemblyGuide('comm-backplate');
assert.equal(spec.boardId,'comm-backplate');
assert.equal(spec.steps.length,26,'Communications installation requires its detailed 26-step sequence');
const expectedSteps=['isolate-record','check-kit','install-rail','mount-router','mount-cerbo','mount-fuse','clip-negative','clip-cm5','clip-moxa','secure-endstops','place-spacers','mount-plate','connect-feed','power-cm5','power-moxa','power-router','power-cerbo','ethernet-cm5','ethernet-router','ethernet-cerbo','rs485-1','rs485-2','rs485-3','dress-cables','final-inspection','commissioning'];
assert.deepEqual(spec.steps.map(s=>s.id),expectedSteps,'Mounting, power and channel-specific wiring sequence changed');
const expectedParts=['plate','spacers','wall-screws','rail','rail-fasteners','end-stops','cm5','moxa','negative','router','router-fasteners','cerbo','cerbo-fasteners','fuse','fuse-fasteners','wiring'];
assert.deepEqual(spec.parts.map(p=>p.id).sort(),expectedParts.slice().sort());
for(const item of [...spec.parts,...spec.steps])for(const key of ['title','name','text','spec','quantity','purpose','note','check','group','viewNote'])if(item[key]){
 assert(item[key].zh&&item[key].en,`Missing bilingual ${item.id}/${key}`);
 assert(!/\p{Script=Han}/u.test(item[key].en),`Chinese in English ${item.id}/${key}`);
}
for(const step of spec.steps){assert(step.actions.length>=2,`Step ${step.id} lacks detailed actions`);for(const action of step.actions){assert(action.zh&&action.en);assert(!/\p{Script=Han}/u.test(action.en));}assert(step.check.zh&&step.check.en);assert(step.parts.every(id=>expectedParts.includes(id)),`Step ${step.id} points to a missing part`);}
const command=(command,value,origin='https://test.invalid')=>window.dispatch('message',{origin,data:{type:'aiko-assembly-command',command,value}});
const advance=ms=>{for(let elapsed=0;elapsed<ms;elapsed+=100){now+=Math.min(100,ms-elapsed);const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now));}};
const visible=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
const descendants=group=>{const objects=[];group.traverse(o=>objects.push(o));return objects;};
const geometryState=objects=>{a.scene.updateMatrixWorld(true);return objects.map(o=>({id:o.uuid,matrix:o.matrixWorld.elements.slice(),visible:visible(o),drawRange:o.geometry?{...o.geometry.drawRange}:null}));};
const distance=(x,y)=>new actual.Vector3().copy(x).distanceTo(y);
const nearly=(value,expected,message,tolerance=1e-5)=>assert(Math.abs(value-expected)<=tolerance,`${message}: ${value} != ${expected}`);
const boards=[a.cc1,a.cc2,a.cc3],boardObjects=boards.flatMap(descendants),commObjects=descendants(a.communication),cableObjects=Object.values(a.flowGroups).flatMap(descendants);
const originalBoards=geometryState(boardObjects),originalComm=geometryState(commObjects),originalCables=geometryState(cableObjects);
const originalMaterials=new Map([...boardObjects,...commObjects,...cableObjects].filter(o=>o.material).map(o=>[o,{reference:o.material,parameters:(Array.isArray(o.material)?o.material:[o.material]).map(m=>({opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite}))}]));
const materialsRestored=(checkParameters=false)=>{for(const [object,saved] of originalMaterials){assert.equal(object.material,saved.reference,'Temporary fading left a replacement material after exit or guide switch');if(checkParameters)assert.deepEqual((Array.isArray(object.material)?object.material:[object.material]).map(m=>({opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite})),saved.parameters,'Temporary fading mutated the shared original material');}};
const cameraEntry=a.camera.position.toArray(),targetEntry=a.controls.target.toArray();
const restored=()=>{presentationRestored();materialsRestored();assert.deepEqual(geometryState(boardObjects),originalBoards,'Guide changed a completed constant-current board');assert.deepEqual(geometryState(commObjects),originalComm,'Communication geometry did not restore');assert.deepEqual(geometryState(cableObjects),originalCables,'Cable geometry, visibility or draw ranges did not restore');};
const cameraRestored=()=>{assert.deepEqual(a.camera.position.toArray(),cameraEntry);assert.deepEqual(a.controls.target.toArray(),targetEntry);};
assert.equal(a.commParts.spacers.length,6,'Six physical spacers are required');
assert.equal(a.commParts['end-stops'].length,4,'C06 must describe the four actual device clip locations, including the router attachment');
assert.equal(a.commRails.length,2);
for(const rail of a.commRails){const size=new actual.Box3().setFromObject(rail).getSize(new actual.Vector3());nearly(size.x,1.50,'Each rail must remain exactly 150 mm long');}
assert.equal(a.commClipRecords.length,4);
assert.equal(spec.parts.find(p=>p.id==='rail').quantity.en,'2 rails');
assert.equal(spec.parts.find(p=>p.id==='rail-fasteners').quantity.en,'4 sets; 2 per rail');
const railFastenerNuts=a.commParts['rail-fasteners'].filter(o=>o.userData.commRearNut);assert.equal(railFastenerNuts.length,4,'Two rails require four distinct fixing sets');
const routerNuts=[];a.usr.traverse(o=>{if(o.userData.commRearNut)routerNuts.push(o);});assert.equal(routerNuts.length,0,'Superseded router wall-ear rear nuts remain');
a.commBack.geometry.computeBoundingBox();const plateSize=a.commBack.geometry.boundingBox.getSize(new actual.Vector3());nearly(plateSize.x,4.50,'Plate width');nearly(plateSize.y,2.50,'Plate height');nearly(plateSize.z,.04,'Plate thickness');
for(const spacer of a.commParts.spacers){
 assert.equal(spacer.userData.innerDiameterMm,6.2);assert.equal(spacer.userData.outerDiameterMm,15);assert.equal(spacer.userData.heightMm,12);
 const ring=descendants(spacer).find(o=>o.isMesh);ring.geometry.computeBoundingBox();const size=ring.geometry.boundingBox.getSize(new actual.Vector3()),center=ring.geometry.boundingBox.getCenter(new actual.Vector3()).applyMatrix4(ring.matrixWorld);
 nearly(size.x,.15,'Spacer outside diameter X');nearly(size.y,.15,'Spacer outside diameter Y');nearly(size.z,.12,'Spacer height');
 // A view along the bore must pass through without striking a solid cylinder.
 const normal=new actual.Vector3(0,0,1).transformDirection(ring.matrixWorld);const ray=new actual.Raycaster(center.clone().addScaledVector(normal,.3),normal.negate(),0,.6);
 assert.equal(ray.intersectObject(spacer,true).length,0,'Spacer centre is solid instead of a 6.2 mm through bore');
}
const wallNutMeshes=[];a.commParts['wall-screws'].forEach(root=>root.traverse(o=>{if(/nut/i.test(o.name)||o.userData.commRearNut)wallNutMeshes.push(o);}));assert.equal(wallNutMeshes.length,0,'Rear wall nuts were invented');
// Inspect detached hardware itself: installed shafts must not make a genuine bore look solid.
for(const id of ['rail-fasteners','cerbo-fasteners','fuse-fasteners']){
 const nuts=a.commParts[id].filter(o=>o.userData.commRearNut),washers=a.commParts[id].filter(o=>/flat washer/.test(o.name));
 assert.equal(washers.length,nuts.length*2,'Each through fixing needs front and rear washers');
 for(const object of [...nuts,...washers]){object.updateWorldMatrix(true,true);const center=object.getWorldPosition(new actual.Vector3()),axis=new actual.Vector3(0,0,1);const bore=object.userData.commRearNut?axis.transformDirection(object.matrixWorld):new actual.Vector3(0,1,0).transformDirection(object.matrixWorld);const ray=new actual.Raycaster(center.clone().addScaledVector(bore,.3),bore.clone().negate(),0,.6);assert.equal(ray.intersectObject(object,true).length,0,'Nut or washer bore is filled');}
 assert(nuts.every(n=>n.getObjectByName('Blue nylon locking insert')),'Nylon locking insert missing');
}
assert.equal(a.commWireSets.length,11,'Expected feed, four device power pairs, three Ethernet and three RS485 stages');
for(const set of a.commWireSets){assert(set.objects.length,`${set.id} has no actual cable objects`);assert(set.step>=12&&set.step<=22);}
// Endpoints are checked against the actual terminal anchors and approved mapping,
// independently of the animation's cable grouping records.
const realCables=a.pickables.filter(o=>o.userData.cableName&&o.geometry?.type==='TubeGeometry');
const endpoint=(mesh,which)=>mesh.geometry.parameters.path.getPoint(which);
const requireCable=(match,start,end)=>{
 const mesh=realCables.find(match);assert(mesh,'Missing expected cable');
 nearly(distance(endpoint(mesh,0),start),0,`${mesh.userData.cableName} source`,1e-5);
 nearly(distance(endpoint(mesh,1),end),0,`${mesh.userData.cableName} destination`,1e-5);
};
const deviceNames=['CM5','MOXA','USR-G806w','Cerbo'];
[a.cm5Dc,a.moxaDc,a.usrDc,a.cerboDc].forEach((positive,i)=>{
 const negative=i===2?a.usrDcNegative.clone():positive.clone();if(i===3)negative.y+=.06;else if(i<2)negative.x+=[.08,.10][i];
 requireCable(o=>o.userData.cableName===`保险座 + OUT ${i+1} → ${deviceNames[i]} DC+`,a.fusePorts[i],positive);
 requireCable(o=>o.userData.cableName===`导轨分线端子 负极口 ${i+1} → ${deviceNames[i]} DC−`,a.negativePorts[i],negative);
});
requireCable(o=>o.userData.cableName==='CM5 ETH1 → MOXA Port 5',a.cm5Eth1.clone().add(a.cm5.position),a.switchPorts[4]);
requireCable(o=>o.userData.cableName==='MOXA Port 1 → Cerbo Ethernet',a.switchPorts[0],a.cerboEth);
requireCable(o=>o.userData.cableName==='MOXA Port 2 → USR-G806w LAN',a.switchPorts[1],a.usrLan);
// Port anchors are recomputed from the complete sideways shell, so a stale
// front-mounted anchor cannot pass merely because cable and metadata agree.
a.scene.updateMatrixWorld(true);
for(const [label,local,anchor]of [['LAN',[-.26,-.595,.17],a.usrLan],['DC+',[.285,-.595,.16],a.usrDc],['DC−',[.335,-.595,.16],a.usrDcNegative]]){
 const transformed=a.communication.worldToLocal(a.usrBody.localToWorld(new actual.Vector3(...local)));
 nearly(distance(transformed,anchor),0,`USR ${label} does not follow its rotated physical port`);
}
const usrDcSeparation=a.usrDcNegative.clone().sub(a.usrDc);
nearly(usrDcSeparation.length(),.05,'USR terminal pitch changed');nearly(usrDcSeparation.x,0,'Sideways router terminals must run along depth');nearly(usrDcSeparation.y,0,'Router terminal row moved vertically');

for(let channel=0;channel<3;channel++)for(const key of ['a','b','gnd']){
 const core=realCables.find(o=>o.userData.rs485Core===key&&o.userData.cm5Channel===channel);assert(core,`Missing RS485 CH${channel} ${key}`);
 nearly(distance(endpoint(core,1),a.cm5Terminals[channel][key]),0,`RS485 CH${channel}/${key} termination`);
}
assert(!guide.snapshot().available);
command('select','comm-backplate','https://untrusted.invalid');assert(!guide.snapshot().available,'Untrusted origin activated communications');
command('select','comm-backplate');assert.equal(guide.snapshot().boardId,'comm-backplate');assert.equal(guide.snapshot().stepCount,26);assert.equal(guide.snapshot().mode,'normal');assert(guide.snapshot().available);restored();
assert.equal(guide.snapshot().railCount,2);assert.equal(guide.snapshot().deviceClipCount,4);assert.equal(guide.snapshot().endStopCount,0,'Unsupported independent end stops must not be reintroduced');
command('mode','exploded');assert.equal(a.scene.background.getHex(),0xe1e1e1);assert.equal(a.scene.fog,null);assert.equal(a.renderer.toneMappingExposure,.90);assert(a.scene.getObjectByName('Installation neutral lighting').visible);assert.equal(guide.snapshot().mode,'exploded');assert(!guide.snapshot().playing);assert.notDeepEqual(geometryState(commObjects),originalComm,'No actual parts moved in exploded view');assert.deepEqual(geometryState(boardObjects).map(o=>o.matrix),originalBoards.map(o=>o.matrix),'Communications view moved a constant-current board');
assert(a.commWireSets.flatMap(s=>s.objects).filter(o=>o.isMesh).every(o=>!visible(o)),'Exploded equipment retained connected cables');
command('spread',0);assert.deepEqual(geometryState(commObjects).map(o=>o.matrix),originalComm.map(o=>o.matrix),'Collapsed view did not return equipment to actual positions');command('spread',1);
command('mode','normal');restored();
command('mode','animation');assert.equal(guide.snapshot().step,0);assert(!guide.snapshot().playing,'Entering detailed installation must not auto-play');
const staticState=geometryState(commObjects);advance(7000);assert.equal(guide.snapshot().step,0);assert.deepEqual(geometryState(commObjects),staticState,'Idle animation changed geometry');
const unrelatedMatrices=originalBoards.map(o=>o.matrix);
for(let step=0;step<spec.steps.length;step++){
 command('step',step);assert.equal(guide.snapshot().step,step);assert(!guide.snapshot().playing);command('progress',1);nearly(guide.snapshot().stepProgress,1,'Step progress did not reach completion');
 assert.deepEqual(geometryState(boardObjects).map(o=>o.matrix),unrelatedMatrices,'Assembly stage moved a constant-current board');
 for(const set of a.commWireSets){
  const meshObjects=set.objects.filter(o=>o.isMesh&&!o.userData.isCableHitbox);
  if(step>0&&set.step>step)assert(meshObjects.every(o=>!visible(o)),`Future wiring ${set.id} appeared during ${spec.steps[step].id}`);
  else assert(meshObjects.some(visible),`Completed wiring ${set.id} disappeared at ${spec.steps[step].id}`);
 }
}
command('step',11);command('progress',1);assert.deepEqual(geometryState(commObjects).map(o=>o.matrix),originalComm.map(o=>o.matrix),'The completed plate installation does not match its confirmed final geometry');
const assemblyMotions=[[2,'rail'],[3,'router'],[4,'cerbo'],[5,'fuse'],[6,'negative'],[7,'cm5'],[8,'moxa'],[10,'spacers'],[11,'wall-screws']];
for(const [step,id] of assemblyMotions){command('step',step);command('progress',0);const before=geometryState(a.commParts[id]).map(o=>o.matrix);command('progress',1);const after=geometryState(a.commParts[id]).map(o=>o.matrix);assert.notDeepEqual(before,after,`Site installation of ${id} has no physical motion`);}
// Each evidenced device clip remains part of its device. The installation
// sequence must pivot the actual device and flex its own spring before seating.
// Sampling includes the middle of the snap operation rather than testing only
// a translated start/end pose, which previously hid absent attachment detail.
for(const clip of a.commClipRecords){
 command('step',clip.step);
 const deviceRotations=[],springStates=[];
 for(const progress of [0,.2,.4,.6,.8,1]){
  command('progress',progress);a.scene.updateMatrixWorld(true);
  deviceRotations.push(clip.device.quaternion.toArray());
  springStates.push([...clip.spring.position.toArray(),...clip.spring.quaternion.toArray(),...clip.spring.scale.toArray()]);
 }
 assert(new Set(deviceRotations.map(JSON.stringify)).size>1,`${clip.deviceId} does not pivot into the rail`);
 assert(new Set(springStates.map(JSON.stringify)).size>1,`${clip.deviceId} clip has no spring deflection during engagement`);
 command('progress',1);
 assert(visible(clip.root),`${clip.deviceId} attachment is hidden at its completed installation stage`);
}
command('step',9);command('progress',1);
for(const clip of a.commClipRecords)assert(visible(clip.root),`Retention inspection must expose ${clip.deviceId} clip`);
command('mode','normal');restored();command('mode','animation');
// Replay and scrub expose the motion within a step, not merely a static pose.
command('step',2);command('progress',0);const railStart=geometryState(a.commParts.rail);command('progress',.5);const railMid=geometryState(a.commParts.rail);command('progress',1);const railEnd=geometryState(a.commParts.rail);
assert.notDeepEqual(railStart.map(o=>o.matrix),railMid.map(o=>o.matrix),'Rail placement has no intermediate movement');assert.notDeepEqual(railMid.map(o=>o.matrix),railEnd.map(o=>o.matrix),'Rail placement snaps instead of completing the movement');
command('progress',-1);nearly(guide.snapshot().stepProgress,0,'Progress lower bound');command('progress',2);nearly(guide.snapshot().stepProgress,1,'Progress upper bound');
command('replay-step');assert.equal(guide.snapshot().step,2,'Replay changed the selected step');nearly(guide.snapshot().stepProgress,0,'Replay did not restart the current motion');
if(guide.snapshot().playing)command('play');
// Actual TubeGeometry paths must grow from their source while retaining endpoints.
for(const set of a.commWireSets){
 const tubes=set.objects.filter(o=>o.isMesh&&o.geometry?.type==='TubeGeometry');assert(tubes.length,`${set.id} has no actual TubeGeometry cable`);
 const endpoints=tubes.map(o=>({mesh:o,start:o.geometry.parameters.path.getPoint(0).clone(),end:o.geometry.parameters.path.getPoint(1).clone()}));
 command('step',set.step);command('progress',0);const startCounts=tubes.map(o=>o.geometry.drawRange.count);
 command('progress',.5);const middleCounts=tubes.map(o=>o.geometry.drawRange.count);
 assert(middleCounts.some((count,i)=>count>startCounts[i]),`${set.id} does not draw progressively`);
 command('progress',1);const endCounts=tubes.map(o=>o.geometry.drawRange.count);
 assert(middleCounts.some((count,i)=>count<endCounts[i]),`${set.id} is already fully drawn at half progress`);
 for(const {mesh,start,end} of endpoints){nearly(distance(mesh.geometry.parameters.path.getPoint(0),start),0,`${set.id} source drifted`);nearly(distance(mesh.geometry.parameters.path.getPoint(1),end),0,`${set.id} destination drifted`);}
}
command('step',-1);assert.equal(guide.snapshot().step,0);command('step',99);assert.equal(guide.snapshot().step,25);
command('step',2);command('progress',0);command('play');assert(guide.snapshot().playing);advance(700);assert(guide.snapshot().stepProgress>0&&guide.snapshot().stepProgress<1,'Playback lacks within-step progress');command('play');assert(!guide.snapshot().playing);const paused=geometryState(commObjects);const pauseState=guide.snapshot();advance(6000);assert.equal(guide.snapshot().step,pauseState.step);assert.equal(guide.snapshot().stepProgress,pauseState.stepProgress);assert.deepEqual(geometryState(commObjects),paused,'Paused animation moved');
command('play');document.hidden=true;document.dispatch('visibilitychange');assert(!guide.snapshot().playing,'Hidden page playback did not pause');document.hidden=false;document.dispatch('visibilitychange');assert(!guide.snapshot().playing,'Returning to the page auto-played');
command('exit');assert(!guide.snapshot().available&&!guide.snapshot().playing);restored();cameraRestored();advance(6000);restored();
// End-stop, spacer and past-wire fading must restore original material identities.
for(const step of [9,10,14]){
 command('select','comm-backplate');command('mode','animation');command('step',step);command('progress',.5);
 assert([...originalMaterials].some(([object,saved])=>object.material!==saved.reference),`Close-up step ${step} did not activate the explanatory fade`);
 command('select','constant-aiko');restored();materialsRestored(true);command('select','comm-backplate');command('mode','animation');command('step',step);command('progress',.5);command('exit');restored();materialsRestored(true);
}
command('select','comm-backplate');command('mode','animation');command('step',9);command('replay-step');advance(7000);assert.equal(guide.snapshot().step,9,'Replay this step advanced into a different operation');assert.equal(guide.snapshot().stepProgress,1);assert(!guide.snapshot().playing,'Replay this step did not stop at completion');command('exit');restored();
// Crossing between the two guide families restores everything before selection.
for(const id of ['constant-aiko','constant-ja','constant-jk']){
 command('select','comm-backplate');command('mode','animation');command('step',2);command('play');advance(700);command('select',id);assert.equal(guide.snapshot().boardId,id);assert(!guide.snapshot().playing);restored();command('mode','exploded');command('select','comm-backplate');assert.equal(guide.snapshot().boardId,'comm-backplate');assert.equal(guide.snapshot().mode,'normal');assert(!guide.snapshot().playing);restored();command('exit');cameraRestored();
}
for(const mode of ['all','pv','signal','dimension','replacement']){command('select','comm-backplate');command('mode','animation');command('play');a.setMode(mode);assert(!guide.snapshot().available&&!guide.snapshot().playing,`Scene ${mode} left communications assembly active`);advance(1000);a.setMode('all');restored();}
for(const action of ['communication','cm5-wiring']){
 const button=nodes.get(`[data-action="${action}"]`);button.click();const destination={position:a.camera.position.toArray(),target:a.controls.target.toArray()};a.setMode('all');a.camera.position.fromArray(cameraEntry);a.controls.target.fromArray(targetEntry);a.controls.update();
 command('select','comm-backplate');command('mode','exploded');button.click();assert(!guide.snapshot().available&&!guide.snapshot().playing);assert.deepEqual(a.camera.position.toArray(),destination.position,'Exit overwrote destination camera');assert.deepEqual(a.controls.target.toArray(),destination.target);a.setMode('all');restored();a.camera.position.fromArray(cameraEntry);a.controls.target.fromArray(targetEntry);a.controls.update();
}
const canvas=nodes.get('.a3-canvas');
function clickDevice(group,predicate){
 a.camera.position.copy(group.position).add(new actual.Vector3(0,0,8));a.controls.target.copy(group.position);a.controls.update();a.scene.updateMatrixWorld(true);
 for(const mesh of a.pickables.filter(o=>o.userData.deviceRoot===group)){
  const p=mesh.geometry?.attributes.position;if(!p)continue;
  for(let i=0;i<p.count;i+=Math.max(1,Math.floor(p.count/20))){const point=new actual.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld).project(a.camera);if(Math.abs(point.x)>.95||Math.abs(point.y)>.95)continue;const event={clientX:(point.x+1)*640,clientY:(1-point.y)*345,button:0};canvas.dispatch('pointerdown',event);canvas.dispatch('pointerup',event);if(predicate())return true;}
 }
 return false;
}
command('select','comm-backplate');command('mode','normal');assert(clickDevice(a.orionSmart,()=>!guide.snapshot().available),'Selecting unrelated equipment left communications guide active');restored();a.camera.position.fromArray(cameraEntry);a.controls.target.fromArray(targetEntry);a.controls.update();
// Bilingual right-panel paths, including each step's relevant physical parts.
globalThis.document=document;const inspectorContainer=new Element(),sent=[];let language='zh';
let inspectorWrites=0,inspectorMarkup='';Object.defineProperty(inspectorContainer,'innerHTML',{get:()=>inspectorMarkup,set:value=>{inspectorMarkup=value;inspectorWrites++;}});
const inspector=createAssemblyInspector({container:inspectorContainer,getLanguage:()=>language,send:(...args)=>sent.push(args)});
const escaped=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
let uiCases=0;
for(language of ['zh','en']){
 window.dispatch('message',{origin:'https://test.invalid',data:{type:'aiko-language',language}});command('select','comm-backplate');inspector.setEligible(true,'comm-backplate');
 for(const mode of ['normal','exploded','animation']){
  command('mode',mode);
  const steps=mode==='animation'?spec.steps.map((_,i)=>i):[0];
  for(const step of steps){
   if(mode==='animation')command('step',step);
   const parts=mode==='animation'?spec.parts.filter(p=>spec.steps[step].parts.includes(p.id)):spec.parts;
   for(const part of parts.length?parts:[null]){
    if(part)command('part',part.id);inspector.update(guide.snapshot());const html=inspectorContainer.innerHTML;
    assert(html.includes('data-assembly-command="exit"'));assert(html.includes('comm-backplate'),'Communications selector is absent');
    if(language==='en'){assert(!/\p{Script=Han}/u.test(html),`Chinese in English communications ${mode}/${step}/${part?.id}`);assert(!/\p{Script=Han}/u.test(nodes.get('.a3-selection strong').textContent+nodes.get('.a3-selection p').textContent),'Chinese in English selected-part scene label');}
    const displayed=mode==='normal'?spec.steps:mode==='animation'?[spec.steps[step]]:[];
    for(const item of displayed){assert(html.includes(escaped(item.title[language])));for(const action of item.actions)assert(html.includes(escaped(action[language])),`Action absent ${item.id}`);assert(html.includes(escaped(item.check[language])));}
    if(mode==='animation'){assert(html.includes('data-assembly-step-select'));assert(html.includes('data-assembly-progress'));assert(html.includes('data-assembly-command="replay-step"'));assert(html.includes('/ 26'));}
    if(part&&mode!=='normal')assert(html.includes(escaped(part.name[language])));
    assert(!/A11|data-value="tie-mount/.test(html),'Removed cable mount controls returned');uiCases++;
   }
  }
 }
 command('exit');
}
inspectorContainer.dispatch('change',{target:{matches:selector=>selector==='[data-assembly-step-select]',value:'21'}});assert.deepEqual(sent.at(-1),['step',21]);
inspectorContainer.dispatch('input',{target:{matches:selector=>selector==='[data-assembly-progress]',value:'65'}});assert.deepEqual(sent.at(-1),['progress',.65]);
inspectorContainer.dispatch('click',{target:{closest:()=>({disabled:false,dataset:{assemblyCommand:'replay-step'}})}});assert.equal(sent.at(-1)[0],'replay-step');
command('select','comm-backplate');command('mode','animation');command('step',2);
inspector.update({...guide.snapshot(),playing:true,stepProgress:.2});const beforeScrubWrites=inspectorWrites;inspector.update({...guide.snapshot(),playing:false,stepProgress:.3});assert.equal(inspectorWrites,beforeScrubWrites,'Scrubbing while playing replaced the active range control');command('exit');
inspector.reset();assert(inspectorContainer.hidden);

class AppElement extends Element {
 constructor(tag='div'){super();this.tag=tag;this.className='';this.attributes={};this.parent=null;this.contentWindow=tag==='iframe'?{postMessage:(message)=>window.dispatch('message',{origin:'https://test.invalid',data:message})}:undefined;this.classList={add:(...names)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...names])].join(' ');},remove:(...names)=>{this.className=this.className.split(' ').filter(n=>!names.includes(n)).join(' ');},toggle:(name,on)=>{const has=this.className.split(' ').includes(name);if(on??!has)this.classList.add(name);else this.classList.remove(name);}};}
 setAttribute(key,value){this.attributes[key]=String(value);}removeAttribute(key){delete this.attributes[key];}
 appendChild(child){child.parent=this;return super.appendChild(child);}remove(){if(this.parent)this.parent.children=this.parent.children.filter(o=>o!==this);}
 querySelectorAll(selector){return this.children.filter(o=>selector==='button'?o.tag==='button':selector.startsWith('.view-frame')?selector.slice(1).split('.').every(c=>o.className.split(' ').includes(c)):selector.startsWith('[data-')?Object.hasOwn(o.dataset,selector.slice(6,-1).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())):false);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
const appCode=fs.readFileSync(path.join(base,'dist/app.js'),'utf8').replace(/^import .*;\n/gm,'');
const appIds=new Map(),appWindow=new Element(),appDetailTabs=new AppElement();
const appDocument={documentElement:{},activeElement:null,title:'',getElementById:id=>{if(!appIds.has(id))appIds.set(id,new AppElement());return appIds.get(id);},createElement:tag=>new AppElement(tag),querySelector:selector=>selector==='.detail-tabs'?appDetailTabs:selector.startsWith('#')?appDocument.getElementById(selector.slice(1)):null,querySelectorAll:()=>[]};
for(const [id,key,values]of [['languageSwitch','language',['zh','en']],['versionSwitch','version',['old','new']]])for(const value of values){const button=new AppElement('button');button.dataset[key]=value;appDocument.getElementById(id).appendChild(button);}
appDocument.getElementById('stageStatus').parentElement={hidden:false};
globalThis.document=appDocument;
const appSandbox={...data,...assemblyData,...communicationData,createAssemblyInspector,document:appDocument,window:appWindow,location:{origin:'https://test.invalid',search:'?assembly=comm-backplate'},URLSearchParams,localStorage:{getItem:()=> 'en',setItem(){}},requestAnimationFrame:fn=>fn(),setTimeout:()=>1,clearTimeout(){},console};
vm.createContext(appSandbox);vm.runInContext(appCode,appSandbox,{timeout:5000});
const stack=appDocument.getElementById('frameStack');assert.equal(stack.children.length,1,'Communications deep link started duplicate frames');
const frame=stack.children[0];assert(frame.src.includes('electrical-new.html'));
sandbox.parent.postMessage=message=>{messages.push(message);appWindow.dispatch('message',{origin:'https://test.invalid',source:frame.contentWindow,data:message});};
frame.dispatch('load');assert(guide.snapshot().available);assert.equal(guide.snapshot().boardId,'comm-backplate','Communications deep link selected another guide');
const appInspector=appDocument.getElementById('assemblyInspector');
const clickInspector=(command,value)=>appInspector.dispatch('click',{target:{closest:()=>({disabled:false,dataset:{assemblyCommand:command,value}})}});
clickInspector('mode','animation');assert(appDetailTabs.hidden&&appDocument.getElementById('detailBody').hidden,'Ordinary details overlap communications guide');
appInspector.dispatch('change',{target:{matches:selector=>selector==='[data-assembly-step-select]',value:'20'}});assert.equal(guide.snapshot().step,20,'Step dropdown did not reach the first RS485 channel');
appInspector.dispatch('input',{target:{matches:selector=>selector==='[data-assembly-progress]',value:'45'}});nearly(guide.snapshot().stepProgress,.45,'Parent progress slider was not forwarded');
clickInspector('replay-step');assert.equal(guide.snapshot().step,20);nearly(guide.snapshot().stepProgress,0,'Parent replay did not reset current step');
appDocument.getElementById('languageSwitch').children[0].click();assert(appInspector.innerHTML.includes('装配演示'));assert.equal(guide.snapshot().language,'zh');
appDocument.getElementById('languageSwitch').children[1].click();assert(!/\p{Script=Han}/u.test(appInspector.innerHTML),'English mode retains Chinese communication content');assert.equal(guide.snapshot().language,'en');
for(const id of ['constant-aiko','constant-ja','constant-jk','comm-backplate']){
 clickInspector('select',id);assert.equal(guide.snapshot().boardId,id);clickInspector('mode','animation');clickInspector('play');assert(guide.snapshot().playing);clickInspector('select',id==='comm-backplate'?'constant-aiko':'comm-backplate');assert(!guide.snapshot().playing,'Changing guide family left playback active');clickInspector('mode','normal');restored();
}
clickInspector('select','comm-backplate');clickInspector('mode','animation');clickInspector('play');clickInspector('exit');assert(!guide.snapshot().available&&!guide.snapshot().playing);assert(!appDetailTabs.hidden&&!appDocument.getElementById('detailBody').hidden);restored();
clickInspector('select','comm-backplate');clickInspector('mode','animation');clickInspector('play');appDocument.getElementById('versionSwitch').children[0].click();assert(!guide.snapshot().available&&!guide.snapshot().playing,'Original-version navigation did not stop communications playback');assert(stack.children.at(-1).src.includes('electrical-old.html'));assert(appInspector.hidden);restored();
delete globalThis.document;
assert.equal(errors.length,0,errors.join('\n'));
console.log(JSON.stringify({communicationAssembly:'passed',steps:spec.steps.length,parts:spec.parts.length,geometry:'two 150 mm rails, four device-mounted clips, sideways full-size router, six bored 15/6.2/12 mm spacers; full geometry and cable restoration',animation:'intermediate mechanical poses and cable draw ranges; bounded scrub, replay, pause, hidden-page stop',integration:'four guide selectors; communication deep link, language switching and original-version cleanup',uiCases,webglVisualQA:'not performed by this geometry and DOM harness'},null,2));
