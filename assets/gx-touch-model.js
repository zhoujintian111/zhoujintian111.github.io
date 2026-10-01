// Standard GX Touch 50, BPP900455050. Geometry: official Rev02 drawing, metres.
export const gxTouchSpec=Object.freeze({width:.1282,height:.0871,depth:.0124,floorY:.663,centerAboveFloor:1.45,wallX:.514,centerZ:.663,frameHoleWidth:.116,frameHoleHeight:.0526});
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
 // Included frame fits within the screen silhouette. Frame thickness is illustrative.
 box(mount,.001,.006,.1281,-.0005,.0405,0);box(mount,.001,.006,.1281,-.0005,-.0405,0);
 box(mount,.001,.081,.005,-.0005,0,.0615);box(mount,.001,.081,.005,-.0005,0,-.0615);
 const fixings=[];
 for(const y of [-.0263,.0263])for(const z of [-.058,.058]){const screw=new THREE.Mesh(new THREE.CylinderGeometry(.0035,.0021,.002,20),silver);screw.rotation.z=Math.PI/2;screw.position.set(-.0012,y,z);mount.add(screw);fixings.push(screw);}
 const points=[new THREE.Vector3(.001,-.031,-.012),new THREE.Vector3(.034,-.031,-.012),new THREE.Vector3(.054,-.055,-.012),new THREE.Vector3(.06,-.145,-.012)];
 const cable=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.002,8,false),black);cable.name='Combined display cable — concealed continuation to Cerbo';group.add(cable);
 group.position.set(spec.wallX,spec.floorY+spec.centerAboveFloor,spec.centerZ);
 return {group,display,mount,body,face,cable,fixings,spec};
}
