// Installation illustration layered over the locked vehicle source.
// Cable clearance, ferrite envelope and explanatory connector inset are not drilling data.
export const gxAssemblyStepIds=Object.freeze(['isolate-cerbo','check-kit','confirm-position-route','prepare-front-mount','route-display-cable','fix-frame','fit-gx-ferrite','seat-display','fit-hdmi-ferrite','connect-display','inspect-restore-cover','power-check']);
export function createGxAssemblyGuide(THREE,context){
 const {scene,world,camera,controls,canvas,stage,gxTouch,wallGraphic,tvBody,tvScreen,gxDimensions,viewName,viewNote,presentation,cancelCameraTween,prepareInterior}=context;
 const ids=['display','frame','frame-screws','display-cable','ferrite-gx','ferrite-hdmi','hdmi-plug','usb-plug','cover'];
 const stepParts=[[],ids.slice(0,8),['display','display-cable','cover'],['frame','frame-screws','cover'],['display-cable','cover'],['frame','frame-screws'],['display','display-cable','ferrite-gx'],['display','frame'],['ferrite-hdmi','hdmi-plug','display-cable'],['hdmi-plug','usb-plug'],['display-cable','cover'],['display']];
 const V=(x,y,z)=>new THREE.Vector3(x,y,z),clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n)},phase=(p,a,b)=>ease((p-a)/(b-a));
 const layer=new THREE.Group();layer.name='GX installation explanation';layer.visible=false;world.add(layer);
 const black=new THREE.MeshStandardMaterial({color:0x171b20,roughness:.48,metalness:.1});
 const silver=new THREE.MeshStandardMaterial({color:0xa8b0b5,roughness:.38,metalness:.7});
 const gray=new THREE.MeshStandardMaterial({color:0x585e62,roughness:.8});
 const orange=new THREE.MeshBasicMaterial({color:0xff5a00,depthTest:false});
 const box=(parent,w,h,d,x,y,z,mat=black)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;};
 const profile=(kind,w,h,Path=THREE.Shape)=>{const p=new Path(),x=w/2,y=h/2;
   if(kind==='hdmi'){p.moveTo(-x,y);p.lineTo(x,y);p.lineTo(x,-y*.35);p.lineTo(x*.72,-y);p.lineTo(-x*.72,-y);p.lineTo(-x,-y*.35);p.closePath();}
   else {p.moveTo(-x,-y);p.lineTo(x,-y);p.lineTo(x,y);p.lineTo(-x,y);p.closePath();}return p;};
 const axialShape=(parent,shape,length,x,y=0,z=0,material=silver)=>{const m=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:length,bevelEnabled:false,curveSegments:16}),material);m.rotation.y=Math.PI/2;m.position.set(x,y,z);parent.add(m);return m;};
 const roundedBody=(parent,w,h,length,x)=>{const p=new THREE.Shape(),r=.0018,a=w/2,b=h/2;p.moveTo(-a+r,-b);p.lineTo(a-r,-b);p.quadraticCurveTo(a,-b,a,-b+r);p.lineTo(a,b-r);p.quadraticCurveTo(a,b,a-r,b);p.lineTo(-a+r,b);p.quadraticCurveTo(-a,b,-a,b-r);p.lineTo(-a,-b+r);p.quadraticCurveTo(-a,-b,-a+r,-b);return axialShape(parent,p,length,x,0,0,black);};
 const line=(parent,points,material=orange)=>{const o=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);o.renderOrder=30;parent.add(o);return o;};
 const tube=(parent,points,radius=.0018)=>{const curve=new THREE.CatmullRomCurve3(points,false,'centripetal');const m=new THREE.Mesh(new THREE.TubeGeometry(curve,100,radius,8,false),black);parent.add(m);return m;};
 // Labels are screen-sized callouts; their leaders track the actual moving part.
 const labelEntries=[];
 const viewport=()=>{const rect=canvas?.getBoundingClientRect?.();const height=rect?.height||stage?.clientHeight||720;return {height,width:rect?.width||stage?.clientWidth||Math.round(height*camera.aspect)};};
 const label=(parent,text,anchor,side='auto',partId=null)=>{
   const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d'),maxWidth=Math.max(118,Math.min(264,viewport().width*.38)),fontSize=14;
   ctx.font='600 28px Arial';
   const words=/\p{Script=Han}/u.test(text)?[...text]:text.split(' '),join=/\p{Script=Han}/u.test(text)?'':' ',lines=[];let row='';
   for(const word of words){const next=row?row+join+word:word;if(row&&ctx.measureText(next).width>(maxWidth-24)*2){lines.push(row);row=word;}else row=next;}if(row)lines.push(row);
   const pixelWidth=Math.min(maxWidth,Math.max(118,...lines.map(t=>ctx.measureText(t).width/2+24))),pixelHeight=lines.length*19+12;
   canvas.width=Math.ceil(pixelWidth*2);canvas.height=pixelHeight*2;
   const selected=!!partId&&state.partId===partId;
   ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle=selected?'rgba(0,0,0,.82)':'rgba(0,0,0,.66)';ctx.fillRect(0,0,canvas.width,canvas.height);
   ctx.strokeStyle=selected?'#ff5a00':'rgba(255,255,255,.18)';ctx.lineWidth=selected?4:2;ctx.strokeRect(1,1,canvas.width-2,canvas.height-2);
   ctx.fillStyle='#ff5a00';ctx.fillRect(0,0,selected?12:6,canvas.height);ctx.fillStyle='#ffffff';ctx.font='600 '+fontSize*2+'px Arial';ctx.textAlign='left';ctx.textBaseline='middle';lines.forEach((t,i)=>ctx.fillText(t,20,24+i*38));
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
   const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));sprite.name=text;sprite.userData.assemblyLabel={partId,text,pixelWidth,pixelHeight};if(partId){sprite.userData.assemblyPart=partId;sprite.userData.assemblyBoardId='gx-touch50';}sprite.renderOrder=42;parent.add(sprite);
   const leader=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(0,0,0),V(0,0,0)]),new THREE.LineBasicMaterial({color:0xff5a00,transparent:true,opacity:.90,depthTest:false,depthWrite:false,toneMapped:false}));leader.name='Leader · '+text;leader.renderOrder=41;parent.add(leader);
   labelEntries.push({sprite,leader,anchor:typeof anchor==='function'?anchor:()=>anchor.clone(),side,pixelWidth,pixelHeight,partId});return sprite;
 };
 const labels=new THREE.Group();layer.add(labels);
 const template=new THREE.Group();template.name='Front fixing pattern 1 — reference only';layer.add(template);
 // Hole centres are the official front-frame pattern. The vehicle wall is not cut by this drawing.
 for(const screw of gxTouch.fixings){const p=gxTouch.group.position.clone().add(screw.position);p.x-=.004;const ring=new THREE.Mesh(new THREE.RingGeometry(.003,.004,24),orange);ring.rotation.y=-Math.PI/2;ring.position.copy(p);ring.renderOrder=25;template.add(ring);}
 const sp=gxTouch.spec,tc=gxTouch.group.position;
 line(template,[V(tc.x-.005,tc.y-sp.frameHoleHeight/2,tc.z-sp.frameHoleWidth/2),V(tc.x-.005,tc.y+sp.frameHoleHeight/2,tc.z-sp.frameHoleWidth/2),V(tc.x-.005,tc.y+sp.frameHoleHeight/2,tc.z+sp.frameHoleWidth/2),V(tc.x-.005,tc.y-sp.frameHoleHeight/2,tc.z+sp.frameHoleWidth/2),V(tc.x-.005,tc.y-sp.frameHoleHeight/2,tc.z-sp.frameHoleWidth/2)]);
 // Hidden normal routing. X places the route behind the graphic and the TV, not on its screen.
 // Sub-millimetre placement is visual separation only, not a verified wall-cavity dimension.
 const routePoints=[V(.517,1.03,0),V(.517,1.25,0),V(.517,1.72,0),V(.517,2.02,0),V(.517,2.105,.10),V(.517,2.105,.40),V(.517,2.105,.59),V(.517,2.085,.65),V(.515,2.082,.651)];
 const route=tube(layer,routePoints);route.name='Concealed route: battery bay → behind graphic → behind TV → GX';route.userData.routeRole='concealed-display-cable';
 const ferrite=(name,position)=>{
   const group=new THREE.Group();group.name=name;group.position.copy(position);group.userData.illustrativeEnvelope=true;layer.add(group);
   const lower=new THREE.Group(),hinge=new THREE.Group();group.add(lower,hinge);hinge.position.set(.010,0,0);
   const half=(parent,upper)=>{
     const start=upper?0:Math.PI,end=start+Math.PI,offset=upper?-.010:0;
     const ringHalf=(outer,inner,length,material,name,along=0)=>{const shape=new THREE.Shape();shape.absarc(0,0,outer,start,end,false);shape.lineTo(inner*Math.cos(end),inner*Math.sin(end));shape.absarc(0,0,inner,end,start,true);shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:length,bevelEnabled:false,curveSegments:24});geo.translate(0,0,-length/2);geo.rotateX(Math.PI/2);const m=new THREE.Mesh(geo,material);m.name=name;m.position.set(offset,along,0);parent.add(m);return m;};
     ringHalf(.009,.0078,.023,black,'Plastic half-shell');
     ringHalf(.0077,.0028,.019,gray,'Ferrite half-core with open cable groove');
     for(const y of [-.0105,.0105])ringHalf(.0089,.0028,.002,black,'End retaining rim',y);
     // End ribs, a tangent hinge and opposite latch remain visible when the shell opens.
     for(const y of [-.007,.007])ringHalf(.0093,.009,.0012,black,'Moulded shell rib',y);
     for(const y of [-.0075,.0075]){const knuckle=new THREE.Mesh(new THREE.CylinderGeometry(.0015,.0015,.004,16),black);knuckle.position.set(offset+.010,y,0);knuckle.name='Hinge knuckle';parent.add(knuckle);}
     const latch=box(parent,.003,.006,.002,offset-.0095,0,upper?.001:-.001);latch.name=upper?'Snap latch tongue':'Snap latch catch';
   };
   half(lower,false);half(hinge,true);group.rotation.x=Math.PI/2;
   group.userData.hinge=hinge;return group;
 };
 const ferriteGx=ferrite('Snap-on ferrite — GX end',V(.517,2.091,.626));ferriteGx.userData.endpoint='gx';
 const screenTail=tube(layer,[V(.515,2.082,.651),V(.518,2.087,.642),V(.517,2.091,.626),V(.517,2.091,.609)]);screenTail.name='HDMI cable through the GX-end ferrite';
 let screenTailPose='';
 const updateScreenTail=()=>{const signature=[gxTouch.display.position.x,ferriteGx.position.x].join('|');if(signature===screenTailPose)return;screenTailPose=signature;
   const start=V(gxTouch.group.position.x+gxTouch.display.position.x+.001,2.082,.651),end=ferriteGx.position.clone();
   const curve=new THREE.CatmullRomCurve3([start,V(end.x,2.087,.646),end.clone().add(V(0,0,.008)),end.clone().add(V(0,0,-.017))],false,'centripetal');
   screenTail.geometry.dispose();screenTail.geometry=new THREE.TubeGeometry(curve,28,.0018,8,false);
 };
 // Cerbo sockets are a labelled explanatory inset, not another physical Cerbo location.
 const endpointInset=new THREE.Group();endpointInset.name='Cerbo GX MK2 connector detail — illustrative inset';endpointInset.userData.illustrativeInset=true;endpointInset.position.set(.38,1.10,.29);layer.add(endpointInset);
 const panel=box(endpointInset,.004,.098,.164,.008,0,0,new THREE.MeshStandardMaterial({color:0x15465e,roughness:.55}));
 const socketMat=new THREE.MeshStandardMaterial({color:0x060a0e,roughness:.6});
 const gold=new THREE.MeshStandardMaterial({color:0xcab268,metalness:.8,roughness:.32});
 const ports={};
 for(const [kind,z,w,h] of [['hdmi',-.040,.019,.011],['usb',.041,.013,.008]]){
   const group=new THREE.Group();group.name=kind==='hdmi'?'HDMI keyed receptacle':'USB-A receptacle';group.position.set(0,.010,z);endpointInset.add(group);ports[kind]=group;
   const mouth=profile(kind,w+.001,h+.001);mouth.holes.push(profile(kind,w,h,THREE.Path));axialShape(group,mouth,.010,-.004);
   box(group,.001,h-.001,w-.001,.0055,0,0,socketMat);
   box(group,.006,.0012,w-.002,.002,kind==='usb'?-.0015:0,0,socketMat);
 }
 const makePlug=(kind,z)=>{const group=new THREE.Group();group.name=kind==='hdmi'?'GX HDMI plug':'GX USB power plug';group.position.set(-.018,.010,z);endpointInset.add(group);
   group.userData.shapeBasis='Original kit photo; connector envelope remains illustrative';
   const w=kind==='hdmi'?.018:.012,h=kind==='hdmi'?.010:.007,t=.00035;
   roundedBody(group,kind==='hdmi'?.020:.014,.012,.018,-.016);
   for(let i=0;i<4;i++){const rib=new THREE.Mesh(new THREE.CylinderGeometry(.0028-i*.00015,.0028-i*.00015,.0008,20),black);rib.rotation.z=Math.PI/2;rib.position.x=-.017-i*.0012;rib.name='Ribbed strain relief';group.add(rib);}
   if(kind==='hdmi'){
     const shell=profile(kind,w,h);shell.holes.push(profile(kind,w-2*t,h-2*t,THREE.Path));axialShape(group,shell,.012,.002).name='HDMI trapezoidal hollow metal shell';
     box(group,.010,.0018,w-.002,.007,0,0,socketMat);
     for(const [count,y] of [[10,.001],[9,-.001]])for(let i=0;i<count;i++)box(group,.007,.00018,.00045,.009,y,(i-(count-1)/2)*.00145,gold).name='HDMI contact';
   }else{
     for(const side of [-1,1])box(group,.012,h,t,.008,0,side*(w-t)/2,silver);
     box(group,.012,t,w,.008,-(h-t)/2,0,silver);
     // Two actual retention windows in the top metal sheet.
     const top=profile('usb',.012,w);for(const zc of [-.003,.003]){const hole=new THREE.Path();hole.moveTo(-.0011,zc-.0009);hole.lineTo(.0011,zc-.0009);hole.lineTo(.0011,zc+.0009);hole.lineTo(-.0011,zc+.0009);hole.closePath();top.holes.push(hole);}
     const sheet=new THREE.Mesh(new THREE.ExtrudeGeometry(top,{depth:t,bevelEnabled:false}),silver);sheet.rotation.x=-Math.PI/2;sheet.position.set(.008,h/2-t,0);sheet.name='USB-A top shell with retention windows';group.add(sheet);
     box(group,.010,.0012,w-.001,.007,-.001,0,socketMat);
     for(let i=0;i<4;i++)box(group,.007,.00018,.0008,.009,-.00031,(i-1.5)*.0025,gold).name='USB-A contact';
   }
   return group;};
 const hdmiPlug=makePlug('hdmi',-.040),usbPlug=makePlug('usb',.041);
 const tail=tube(endpointInset,[V(-.070,-.035,-.074),V(-.072,-.02,-.05),V(-.067,.010,-.040),V(-.032,.010,-.040)],.002);
 const usbTail=tube(endpointInset,[V(-.070,-.035,-.074),V(-.078,-.022,.015),V(-.065,.010,.041),V(-.032,.010,.041)],.0017);
 endpointInset.updateMatrixWorld(true);hdmiPlug.attach(tail);usbPlug.attach(usbTail);
 const ferriteHdmi=ferrite('Snap-on ferrite — HDMI plug end',V(.38-.055,1.11,.25));ferriteHdmi.rotation.set(0,0,Math.PI/2);ferriteHdmi.userData.endpoint='hdmi';
 const parts={display:[gxTouch.display],frame:[gxTouch.mount],'frame-screws':gxTouch.fixings,'display-cable':[route,screenTail,tail,usbTail],'ferrite-gx':[ferriteGx],'ferrite-hdmi':[ferriteHdmi],'hdmi-plug':[hdmiPlug],'usb-plug':[usbPlug],cover:[wallGraphic]};
 Object.entries(parts).forEach(([id,objects])=>objects.forEach(object=>object.traverse(o=>{o.userData.assemblyPart=id;o.userData.assemblyBoardId='gx-touch50';})));
 const poseObjects=[gxTouch.display,gxTouch.mount,...gxTouch.fixings,ferriteGx,ferriteHdmi,hdmiPlug,usbPlug,endpointInset];
 const initialPose=new Map(poseObjects.map(o=>[o,{position:o.position.clone(),quaternion:o.quaternion.clone(),scale:o.scale.clone(),visible:o.visible}]));
 const ghosts=new Map();
 const ghost=(object,opacity)=>object.traverse(o=>{if(!o.isMesh)return;let record=ghosts.get(o);if(!record){const original=o.material,cloned=(Array.isArray(original)?original:[original]).map(m=>m.clone());record={original,cloned};ghosts.set(o,record);}record.cloned.forEach(m=>{m.transparent=true;m.opacity=opacity;m.depthWrite=false;});o.material=Array.isArray(record.original)?record.cloned:record.cloned[0];});
 const state={available:false,boardId:'gx-touch50',mode:'normal',step:0,stepProgress:0,stepCount:gxAssemblyStepIds.length,playing:false,spread:1,partId:null};
 let language='zh',entry=null,entryVisibility=null,activeVisibility=null,entryPose=null,lastTime=0,lastEmit=0,replayOnly=false,automaticCamera=false,labelSignature='';
 const snapshot=()=>({...state,language,stepId:gxAssemblyStepIds[state.step],partIds:ids.slice(),entryCameraSaved:!!entry,routeVisible:route.visible&&layer.visible,ferriteCount:2,fixingCount:gxTouch.fixings.length,siteMountCount:0,screenCenter:gxTouch.group.position.toArray(),frontFixingPattern:1});
 const emit=()=>{if(typeof parent!=='undefined')parent.postMessage({type:'aiko-assembly-state',...snapshot()},location.origin);};
 const restorePose=()=>{
   presentation?.restore();
   (state.available?initialPose:entryPose||initialPose).forEach((p,o)=>{o.position.copy(p.position);o.quaternion.copy(p.quaternion);o.scale.copy(p.scale);o.visible=p.visible;});
   ghosts.forEach((r,o)=>o.material=r.original);(state.available?activeVisibility:entryVisibility)?.forEach((visible,o)=>o.visible=visible);
   ferriteGx.userData.hinge.rotation.y=0;ferriteHdmi.userData.hinge.rotation.y=0;
   layer.visible=false;gxTouch.cable.visible=false;route.geometry.setDrawRange(0,Infinity);tail.geometry.setDrawRange(0,Infinity);usbTail.geometry.setDrawRange(0,Infinity);
 };
 const clearLabels=()=>{labelSignature='';labelEntries.length=0;for(const o of [...labels.children]){labels.remove(o);if(o.material){o.material.map?.dispose();o.material.dispose();}o.geometry?.dispose();}};
 const localized=(zh,en)=>language==='en'?en:zh;
 const labelNames={
   display:['GX Touch 50屏幕','GX Touch 50 display'],frame:['正面固定框','Front mounting frame'],
   'frame-screws':['固定框螺钉 ×4 · 规格待核','Frame screws ×4 · size TBD'],
   'display-cable':['原厂屏幕组合线','Factory display lead'],'ferrite-gx':['屏幕侧磁环','Display-side ferrite'],
   'ferrite-hdmi':['HDMI侧磁环','HDMI-side ferrite'],'hdmi-plug':['HDMI插头 · 显示','HDMI plug · video'],
   'usb-plug':['USB插头 · 供电','USB plug · power'],cover:['原车可掀装饰画面','Existing liftable cover']
 };
 const isShown=object=>{if(object.geometry?.drawRange?.count===0)return false;for(let o=object;o;o=o.parent)if(!o.visible)return false;return true;};
 const partAnchor=id=>{
   if(id==='display-cable'){
     if(route.visible)return world.localToWorld(routePoints[3].clone());
     return new THREE.Box3().setFromObject(screenTail.visible?screenTail:tail).getCenter(V(0,0,0));
   }
   if(id==='cover')return world.localToWorld(V(.517,1.57,0));
   if(id==='frame-screws'){
     // Use the exposed outer screw head, rather than a screw hidden by the display.
     const heads=gxTouch.fixings.map(screw=>screw.getWorldPosition(V(0,0,0)));
     return heads.reduce((outer,point)=>point.clone().project(camera).x>outer.clone().project(camera).x?point:outer);
   }
   if(id==='frame')return gxTouch.mount.children[0].getWorldPosition(V(0,0,0));
   return parts[id][0].getWorldPosition(V(0,0,0));
 };
 function layoutLabels(){
   if(!labelEntries.length||!state.available||state.mode==='normal')return;
   const {width,height}=viewport(),margin=18,top=60,bottom=height-38,gap=9;
   camera.updateMatrixWorld(true);labels.updateWorldMatrix(true,false);
   const groups={left:[],right:[]};
   labelEntries.forEach(entry=>{
     const anchor=entry.anchor(),ndc=anchor.clone().project(camera);entry.anchorWorld=anchor;entry.depth=Math.max(-.95,Math.min(.995,ndc.z));
     entry.sprite.visible=entry.leader.visible=(!entry.partId||parts[entry.partId].some(isShown))&&Number.isFinite(ndc.x)&&ndc.z<1&&ndc.z>-1;
     if(!entry.sprite.visible)return;
     const side=entry.side==='auto'?(ndc.x<=0?'left':'right'):entry.side;entry.sideNow=side;entry.anchorY=(1-ndc.y)*height/2;
     entry.y=Math.max(top+entry.pixelHeight/2,Math.min(bottom-entry.pixelHeight/2,entry.anchorY));groups[side].push(entry);
   });
   for(const entries of Object.values(groups)){
     entries.sort((a,b)=>a.anchorY-b.anchorY);let previous=top;
     entries.forEach(e=>{e.y=Math.max(e.y,previous+e.pixelHeight/2);previous=e.y+e.pixelHeight/2+gap;});
     const overflow=previous-gap-bottom;if(overflow>0)entries.forEach(e=>e.y-=overflow);
     if(entries.length&&entries[0].y-entries[0].pixelHeight/2<top){let y=top;entries.forEach(e=>{e.y=y+e.pixelHeight/2;y+=e.pixelHeight+gap;});}
     for(const e of entries){
       const left=e.sideNow==='left',x=left?margin+e.pixelWidth/2:width-margin-e.pixelWidth/2;
       const toWorld=(px,py)=>V(px/width*2-1,1-py/height*2,e.depth).unproject(camera);
       const center=toWorld(x,e.y),edge=toWorld(x+(left?1:-1)*e.pixelWidth/2,e.y),elbow=toWorld(x+(left?1:-1)*(e.pixelWidth/2+12),e.y);
       const worldWidth=toWorld(x+e.pixelWidth/2,e.y).distanceTo(toWorld(x-e.pixelWidth/2,e.y)),worldHeight=toWorld(x,e.y+e.pixelHeight/2).distanceTo(toWorld(x,e.y-e.pixelHeight/2));
       e.sprite.position.copy(labels.worldToLocal(center));e.sprite.scale.set(worldWidth,worldHeight,1);
       const pts=[e.anchorWorld,elbow,edge].map(point=>labels.worldToLocal(point.clone())),positions=e.leader.geometry.attributes.position;
       pts.forEach((point,i)=>positions.setXYZ(i,point.x,point.y,point.z));positions.needsUpdate=true;e.leader.geometry.computeBoundingSphere();
       e.sprite.userData.assemblyLabel.screenBox={x:x-e.pixelWidth/2,y:e.y-e.pixelHeight/2,width:e.pixelWidth,height:e.pixelHeight};
     }
   }
 }
 function buildLabels(){
   if(!state.available||state.mode==='normal'){clearLabels();return;}
   const signature=[language,state.mode,state.step,state.partId,state.spread,viewport().width,viewport().height,ids.map(id=>parts[id].some(isShown)?1:0).join('')].join('|');
   if(signature===labelSignature){layoutLabels();return;}clearLabels();labelSignature=signature;
   const p=state.step,exploded=state.mode==='exploded';
   let shown=exploded?ids.slice(0,8):stepParts[p].slice();
   if(state.partId&&!shown.includes(state.partId))shown.push(state.partId);
   shown=shown.filter(id=>parts[id].some(isShown));
   // A code always resolves to one material-list row; no combined G02/G03 tag.
   shown.forEach(id=>{const index=ids.indexOf(id),text='G'+String(index+1).padStart(2,'0')+' · '+localized(...labelNames[id]);
     const side=['display','frame','ferrite-gx'].includes(id)?'left':'right';
     label(labels,text,()=>partAnchor(id),side,id);
   });
   if([2,4,10].includes(p)&&!exploded&&isShown(route)){
     label(labels,localized('电池仓 · FIND YOUR POWER下方','Battery bay · below FIND YOUR POWER'),()=>world.localToWorld(V(.517,1.08,0)),'left');
     label(labels,localized('电视后 → 向右接GX','Behind TV → right to GX'),()=>world.localToWorld(V(.517,2.105,.40)),'left');
   }
   if(p===3&&!exploded)label(labels,localized('① 四孔距110.2 × 69.2 mm','① Four-hole pitch 110.2 × 69.2 mm'),()=>world.localToWorld(V(tc.x-.005,tc.y,tc.z)),'right');
   layoutLabels();
 }
 function poseCamera(){
   if(!automaticCamera)return;cancelCameraTween?.();
   const step=state.step,exploded=state.mode==='exploded';let target,offset,fov=38;
   if(exploded){target=V(.40,2.10,.52);offset=V(-.68,.30,.48);fov=36;}
   else if([0,2,4,10,11].includes(step)){target=V(.514,1.73,.20);offset=V(-2.02,.10,.14);fov=43;}
   else if(step===8||step===9){target=V(.35,1.11,.29);offset=V(-.35,.14,.12);fov=36;}
   else if(step===6){target=V(tc.x-.074,tc.y-.014,tc.z-.020);offset=V(.25,.105,.095);fov=36;}
   else {target=V(tc.x-.048,tc.y,tc.z);offset=V(-.43,.10,.09);fov=36;}
   camera.position.copy(target).add(offset);controls.target.copy(target);camera.fov=fov;camera.updateProjectionMatrix();camera.lookAt(controls.target);camera.updateMatrixWorld(true);
 }
 function isolateLocal(){
   const allowed=new Set();[gxTouch.group,layer].forEach(g=>g.traverse(o=>allowed.add(o)));
   world.traverse(o=>{if((o.isMesh||o.isSprite||o.isLine)&&!allowed.has(o))o.visible=false;});
 }
 function apply(){
   restorePose();if(!state.available||state.mode==='normal'){clearLabels();return;}
   presentation?.setActive(true);
   layer.visible=true;route.visible=true;screenTail.visible=false;template.visible=false;endpointInset.visible=false;ferriteGx.visible=true;ferriteHdmi.visible=false;labels.visible=true;gxDimensions.visible=false;
   const p=state.stepProgress,s=state.step,exploded=state.mode==='exploded',wide=[0,2,4,10,11].includes(s);
   if(!wide||exploded)isolateLocal();else{ghost(wallGraphic,s===10?.18+.82*phase(p,.50,1):.16);ghost(tvBody,.13);ghost(tvScreen,.13);}
   // Both the real covered path and any explanatory projection disappear completely in normal view.
   if(exploded){
     const k=state.spread;gxTouch.display.position.x=-.16*k;gxTouch.mount.position.x=-.060*k;gxTouch.fixings.forEach((o,i)=>o.position.x-=.102*k+i*.004*k);
     ferriteGx.position.x-=.080*k;ferriteGx.userData.hinge.rotation.y=-.75*k;endpointInset.visible=true;ferriteHdmi.visible=true;
     endpointInset.position.add(V(0,1.01,.035));ferriteHdmi.position.add(V(0,1.01,.035));
     route.visible=false;
   }else{
     gxTouch.display.visible=s===0||s>=6;gxTouch.mount.visible=s===0||s>=3;gxTouch.fixings.forEach(o=>o.visible=s===0||s>=5);ferriteGx.visible=s>=6;ferriteHdmi.visible=s>=8;endpointInset.visible=s===0||s>=8;
     if(s===1){gxTouch.display.visible=true;gxTouch.mount.visible=true;gxTouch.fixings.forEach(o=>o.visible=true);gxTouch.display.position.x=-.16;gxTouch.mount.position.x=-.06;gxTouch.fixings.forEach(o=>o.position.x-=.10);ferriteGx.visible=true;ferriteGx.position.x-=.08;route.visible=false;}
     if(s===2){gxDimensions.visible=true;}
     if(s===3){template.visible=true;gxTouch.mount.position.x=-.048;route.visible=false;}
     if(s===4){const length=route.geometry.index.count;route.geometry.setDrawRange(0,Math.floor(length*p/6)*6);}
     if(s===5){route.visible=false;gxTouch.mount.position.x=-.045*(1-phase(p,0,.28));gxTouch.fixings.forEach((o,i)=>o.position.x-=.08*(1-phase(p,.18+i*.15,.43+i*.15)));}
     if(s===6){gxTouch.display.position.x=-.10;ferriteGx.position.x-=.085;ferriteGx.userData.hinge.rotation.y=-(1-phase(p,.18,.82))*1.75;route.visible=false;ghost(gxTouch.mount,.13);gxTouch.fixings.forEach(o=>ghost(o,.13));}
     if(s===7){gxTouch.display.position.x=-.10*(1-phase(p,.08,.88));route.visible=false;ferriteGx.visible=false;}
     if(s===8){route.visible=false;ferriteGx.visible=false;ferriteHdmi.userData.hinge.rotation.y=-(1-phase(p,.15,.82))*1.75;hdmiPlug.position.x-=.045;usbPlug.position.x-=.045;ferriteHdmi.position.x-=.045;}
     if(s===9){route.visible=false;ferriteGx.visible=false;const hdmiOffset=.045*(1-phase(p,.04,.46));hdmiPlug.position.x-=hdmiOffset;ferriteHdmi.position.x-=hdmiOffset;usbPlug.position.x-=.045*(1-phase(p,.53,.94));}
     if(s===10){endpointInset.visible=false;ferriteGx.visible=false;ferriteHdmi.visible=false;route.visible=p<.82;if(p>=.82){ghosts.forEach((r,o)=>o.material=r.original);}}
     if(s===11){endpointInset.visible=false;ferriteGx.visible=false;ferriteHdmi.visible=false;route.visible=false;ghosts.forEach((r,o)=>o.material=r.original);}
   }
   screenTail.visible=ferriteGx.visible&&(exploded||s===1||s===6);if(screenTail.visible)updateScreenTail();
   scene.updateMatrixWorld(true);poseCamera();buildLabels();
   if(viewName)viewName.textContent=localized('GX Touch 50 · 安装指引','GX Touch 50 · installation guide');
   if(viewNote)viewNote.textContent=localized('装配及隐藏走线示意 · 实际固定与净空现场核对','Assembly and concealed-routing illustration · verify fixings and clearance on site');
 }
 const api={
   selectBoard(id){if(id!=='gx-touch50')return false;if(state.available){emit();return true;}
     entry={position:camera.position.clone(),target:controls.target.clone(),quaternion:camera.quaternion.clone(),fov:camera.fov,minDistance:controls.minDistance,maxDistance:controls.maxDistance,minPolarAngle:controls.minPolarAngle,maxPolarAngle:controls.maxPolarAngle,enablePan:controls.enablePan,name:viewName?.textContent,note:viewNote?.textContent};
     entryVisibility=new Map();scene.traverse(o=>entryVisibility.set(o,o.visible));entryPose=new Map(poseObjects.map(o=>[o,{position:o.position.clone(),quaternion:o.quaternion.clone(),scale:o.scale.clone(),visible:o.visible}]));prepareInterior?.();activeVisibility=new Map();scene.traverse(o=>activeVisibility.set(o,o.visible));cancelCameraTween?.();controls.minDistance=.10;controls.maxDistance=6.8;controls.enablePan=true;
     Object.assign(state,{available:true,mode:'normal',step:0,stepProgress:0,playing:false,partId:null});apply();emit();return true;
   },
   setMode(mode){if(!['normal','exploded','animation'].includes(mode))return;if(!state.available)this.selectBoard('gx-touch50');Object.assign(state,{mode,playing:false,partId:null,stepProgress:0});automaticCamera=mode!=='normal';apply();automaticCamera=false;emit();},
   setSpread(value){const n=Number(value);if(!Number.isFinite(n))return;state.spread=clamp(n);if(state.mode==='exploded')apply();emit();},
   goStep(value){const n=Number(value);if(!Number.isFinite(n))return;if(!state.available)this.selectBoard('gx-touch50');Object.assign(state,{mode:'animation',step:Math.max(0,Math.min(state.stepCount-1,Math.round(n))),stepProgress:0,playing:false,partId:null});automaticCamera=true;apply();automaticCamera=false;emit();},
   setProgress(value){const n=Number(value);if(!Number.isFinite(n))return;if(state.mode!=='animation')this.setMode('animation');state.stepProgress=clamp(n);state.playing=false;apply();emit();},
   replayStep(){if(state.mode!=='animation')this.setMode('animation');state.stepProgress=0;state.playing=true;replayOnly=true;automaticCamera=true;lastTime=0;apply();emit();},
   playPause(){if(state.mode!=='animation')this.setMode('animation');if(state.stepProgress===1){if(state.step===state.stepCount-1)state.step=0;state.stepProgress=0;}state.playing=!state.playing;replayOnly=false;automaticCamera=state.playing;lastTime=0;apply();emit();},
   selectPart(id){if(!ids.includes(id))return;state.partId=id;buildLabels();emit();},
   pickPart(raycaster){
     if(!state.available)return false;
     layoutLabels();scene.updateMatrixWorld(true);
     // Labels are drawn above geometry, so their visible sprites receive click priority.
     const labelHits=raycaster.intersectObjects(labels.children.filter(o=>o.isSprite&&o.userData.assemblyPart&&isShown(o)),false);
     const physicalHits=labelHits.length?[]:raycaster.intersectObjects([...new Set(Object.values(parts).flat())],true).filter(hit=>hit.object.isMesh&&isShown(hit.object));
     const hit=labelHits[0]||physicalHits.find(hit=>ids.includes(hit.object.userData.assemblyPart));
     const id=hit?.object.userData.assemblyPart;
     if(!ids.includes(id))return false;
     this.selectPart(id);return true;
   },
   exit(){state.playing=false;state.available=false;state.mode='normal';state.partId=null;state.stepProgress=0;restorePose();clearLabels();if(entry){camera.position.copy(entry.position);camera.quaternion.copy(entry.quaternion);camera.fov=entry.fov;camera.updateProjectionMatrix();controls.target.copy(entry.target);for(const key of ['minDistance','maxDistance','minPolarAngle','maxPolarAngle','enablePan'])controls[key]=entry[key];if(viewName)viewName.textContent=entry.name;if(viewNote)viewNote.textContent=entry.note;controls.update();}entry=null;entryVisibility=null;activeVisibility=null;entryPose=null;automaticCamera=false;window.dispatchEvent(new Event('aiko-gx-view'));emit();},
   tick(now){layoutLabels();if(!state.available||!state.playing){lastTime=now;return;}if(!lastTime){lastTime=now;return;}const dt=Math.min(120,Math.max(0,now-lastTime));lastTime=now;if(state.stepProgress===1){if(replayOnly||state.step===state.stepCount-1){state.playing=false;replayOnly=false;emit();return;}state.step++;state.stepProgress=0;state.partId=null;automaticCamera=true;}state.stepProgress=Math.min(1,state.stepProgress+dt/(state.step===9?7400:state.step===4?6500:5400));apply();if(now-lastEmit>120||state.stepProgress===1){lastEmit=now;emit();}},
   snapshot,updateLabels:layoutLabels,refresh(){if(state.available){buildLabels();emit();}},
   geometry:{parts,labels,route,routePoints,screenTail,ferrites:[ferriteGx,ferriteHdmi],endpointInset,ports,cover:wallGraphic,template,layer,stepIds:gxAssemblyStepIds}
 };
 controls.addEventListener?.('start',()=>{automaticCamera=false;});
 controls.addEventListener?.('change',layoutLabels);
 window.addEventListener('resize',()=>{if(state.available)buildLabels();});
 window.addEventListener('message',event=>{
   if(event.origin!==location.origin)return;
   if(event.data?.type==='aiko-language'){language=event.data.language==='en'?'en':'zh';api.refresh();return;}
   if(event.data?.type!=='aiko-assembly-command')return;const {command,value}=event.data;
   const method={select:'selectBoard',mode:'setMode',spread:'setSpread',step:'goStep',play:'playPause',part:'selectPart',exit:'exit',progress:'setProgress',replay:'replayStep','replay-step':'replayStep'}[command];if(method)api[method](value);
 });
 document.addEventListener?.('visibilitychange',()=>{if(document.hidden&&state.playing){state.playing=false;emit();}});
 window.addEventListener('pagehide',()=>{state.playing=false;});
 restorePose();return api;
}
