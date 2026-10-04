// Standard GX Touch 50, BPP900455050. Geometry: official Rev02 drawing, metres.
export const gxTouchSpec=Object.freeze({width:.1282,height:.0871,depth:.0124,floorY:.663,centerAboveFloor:1.45,wallX:.514,centerZ:.663,frameHoleWidth:.1102,frameHoleHeight:.0692});
export function makeGxTouch(THREE,texture){
 const spec=gxTouchSpec,group=new THREE.Group(),display=new THREE.Group(),mount=new THREE.Group();
 group.name='GX Touch 50 installation';display.name='GX Touch 50 display';mount.name='Included fixing frame';group.add(mount,display);
 const black=new THREE.MeshStandardMaterial({color:0x101215,roughness:.35,metalness:.1}),silver=new THREE.MeshStandardMaterial({color:0x999fa3,metalness:.75,roughness:.35});
 const box=(parent,w,h,d,x,y,z,mat=black)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const shape=new THREE.Shape(),w=spec.width,h=spec.height,r=.003;
 shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:spec.depth,bevelEnabled:false,curveSegments:8});
 const body=new THREE.Mesh(geometry,black);body.rotation.y=-Math.PI/2;display.add(body);
 const face=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,color:0xffffff,transparent:true}));face.rotation.y=-Math.PI/2;face.position.x=-spec.depth-.00005;display.add(face);
 // Rev02 establishes the outline and both hole patterns. Window, corner radius,
 // front-hole diameter and thickness follow the accessory photograph, not measured tooling data.
 const rounded=(width,height,radius,Path=THREE.Shape)=>{const p=new Path(),x=width/2,y=height/2;
   p.moveTo(-x+radius,-y);p.lineTo(x-radius,-y);p.quadraticCurveTo(x,-y,x,-y+radius);p.lineTo(x,y-radius);p.quadraticCurveTo(x,y,x-radius,y);p.lineTo(-x+radius,y);p.quadraticCurveTo(-x,y,-x,y-radius);p.lineTo(-x,-y+radius);p.quadraticCurveTo(-x,-y,-x+radius,-y);return p;};
 const frameShape=rounded(.1281,.087,.0032);
 frameShape.holes.push(rounded(.105,.060,.0022,THREE.Path));
 for(const [pitchX,pitchY,radius] of [[.1102,.0692,.0021],[.116,.0526,.0021]])for(const x of [-pitchX/2,pitchX/2])for(const y of [-pitchY/2,pitchY/2]){const hole=new THREE.Path();hole.absarc(x,y,radius,0,Math.PI*2,true);frameShape.holes.push(hole);}
 const frameMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(frameShape,{depth:.001,bevelEnabled:false,curveSegments:16}),black);
 frameMesh.name='Rounded included frame with open window and eight through holes';frameMesh.rotation.y=-Math.PI/2;frameMesh.userData.illustrativeWindowAndThickness=true;mount.add(frameMesh);
 // Pattern ② has a real Ø7/Ø4.2 stepped opening in the frame, rather than a painted disc.
 frameMesh.geometry.dispose();frameMesh.geometry=new THREE.ExtrudeGeometry(frameShape,{depth:.0006,bevelEnabled:false,curveSegments:16});
 const frontShape=rounded(.1281,.087,.0032);frontShape.holes.push(rounded(.105,.060,.0022,THREE.Path));
 for(const [pitchX,pitchY,radius] of [[.1102,.0692,.0021],[.116,.0526,.0035]])for(const x of [-pitchX/2,pitchX/2])for(const y of [-pitchY/2,pitchY/2]){const hole=new THREE.Path();hole.absarc(x,y,radius,0,Math.PI*2,true);frontShape.holes.push(hole);}
 const frameFront=new THREE.Mesh(new THREE.ExtrudeGeometry(frontShape,{depth:.0004,bevelEnabled:false,curveSegments:16}),black);frameFront.rotation.y=-Math.PI/2;frameFront.position.x=-.0006;frameFront.name='Front frame face with stepped mounting holes';mount.add(frameFront);
 mount.userData.dimensionBasis='Official Rev02: 128.1×87 mm; patterns 110.2×69.2 and 116×52.6 mm. Window, thickness and front-hole diameter illustrative.';
 const fixings=[];
 // Template pattern ①: front screws. Pattern ② belongs to the alternative rear fixing.
 // Heads show the supplied fixing function; shaft length is deliberately not specified.
 for(const y of [-spec.frameHoleHeight/2,spec.frameHoleHeight/2])for(const z of [-spec.frameHoleWidth/2,spec.frameHoleWidth/2]){
   const screw=new THREE.Group();screw.name='Front frame screw';screw.userData.fixingPattern=1;screw.userData.lengthUnspecified=true;
   const headShape=new THREE.Shape();headShape.absarc(0,0,.0028,0,Math.PI*2,false);
   const recess=new THREE.Path(),a=.00165,b=.00038;recess.moveTo(-b,-a);recess.lineTo(b,-a);recess.lineTo(b,-b);recess.lineTo(a,-b);recess.lineTo(a,b);recess.lineTo(b,b);recess.lineTo(b,a);recess.lineTo(-b,a);recess.lineTo(-b,b);recess.lineTo(-a,b);recess.lineTo(-a,-b);recess.lineTo(-b,-b);recess.closePath();headShape.holes.push(recess);
   const head=new THREE.Mesh(new THREE.ExtrudeGeometry(headShape,{depth:.0012,bevelEnabled:true,bevelSize:.00012,bevelThickness:.0001,bevelSegments:2,curveSegments:24}),silver);head.rotation.y=-Math.PI/2;head.position.x=.0003;screw.add(head);
   const floor=new THREE.Mesh(new THREE.CylinderGeometry(.00265,.00265,.0006,24),silver);floor.rotation.z=Math.PI/2;floor.position.x=.0006;screw.add(floor);
   screw.position.set(-.0012,y,z);group.add(screw);fixings.push(screw);
 }
 const points=[new THREE.Vector3(.001,-.031,-.012),new THREE.Vector3(.034,-.031,-.012),new THREE.Vector3(.054,-.055,-.012),new THREE.Vector3(.06,-.145,-.012)];
 const cable=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.002,8,false),black);cable.name='Combined display cable — concealed continuation to Cerbo';cable.visible=false;group.add(cable);
 group.position.set(spec.wallX,spec.floorY+spec.centerAboveFloor,spec.centerZ);
 return {group,display,mount,body,face,cable,fixings,spec};
}
