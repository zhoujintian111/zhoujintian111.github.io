import {readElectrical} from './full-checks.mjs';
const shown=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
// Sample the actual scene's generated textures; do not replace or rewrite the scene.
const sample=`const shown=${shown.toString()};
const inspect=(o,mesh,text)=>{const image=mesh.material.map.image,ctx=image.getContext('2d'),background=Array.from(ctx.getImageData(14,image.height-8,1,1).data),pixels=ctx.getImageData(0,0,image.width,image.height).data;let whitePixels=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]===255&&pixels[i+1]===255&&pixels[i+2]===255&&pixels[i+3]===255)whitePixels++;
return {text,background,whitePixels,selected:!!o.userData.annotationSelected,toneMapped:mesh.material.toneMapped};};`;
const electricalExpression=`(()=>{${sample}
const labels=[];scene.traverse(o=>{if(o.userData.annotationCode&&shown(o))labels.push(inspect(o,o.children[0],o.userData.annotationText));});return {labels,background:scene.background.getHex(),snapshot:window.aikoAssemblyGuide.snapshot(),camera:camera.position.toArray()};})()`;
const gxExpression=sample+`const a=window.aikoGxScene;return {labels:a.assembly.labels.children.filter(o=>o.isSprite&&shown(o)).map(o=>inspect(o,o,o.userData.assemblyLabel.text)),background:a.scene.background.getHex(),snapshot:window.aikoAssemblyGuide.snapshot()};`;
export async function runLabels({page,context,frame,report,row,shot,ready,activeFrame,target,boardOnly=false}){
 const mode=async name=>{await page.locator('[data-assembly-command="mode"][data-value="'+name+'"]').click();await frame.waitForFunction(name=>window.aikoAssemblyGuide.snapshot().mode===name,name);await page.waitForTimeout(250);};
 const language=async lang=>{await page.locator('[data-language="'+lang+'"]').click();await frame.waitForFunction(lang=>document.documentElement.lang.startsWith(lang),lang);await page.waitForTimeout(250);};
 const electrical=()=>readElectrical(context,page,frame,electricalExpression);
 const check=(id,result,count)=>{report.model[id]=result;row(id,'实际半透明标签、白色实字及浅灰背景',result.labels.length===count&&result.labels.every(l=>l.background[3]>0&&l.background[3]<255&&l.whitePixels>100&&!l.toneMapped)&&result.background===0xe1e1e1?'通过':'失败',result);};
 if(boardOnly){
  await page.locator('[data-assembly-command="select"][data-value="constant-aiko"]').click();await frame.waitForFunction(()=>window.aikoAssemblyGuide.snapshot().boardId==='constant-aiko');
  const normal=(await electrical()).background;await language('en');await mode('exploded');await shot('04-board-labels-en','恒流板背景修复后的真实爆炸图',frame);check('T4-board',await electrical(),5);
  await mode('normal');const restored=(await electrical()).background;row('T4-normal','恒流板常规背景恢复',restored===normal?'通过':'失败',{normal,restored});
  row('T8-visual','恒流板修复画面清晰度','待核实','取回实际PNG后视觉复核；其他标签沿用前次已通过的截图。');return;
 }
 await mode('exploded');await shot('01-comm-labels-zh','通讯板爆炸图：半透明标签',frame);const comm=await electrical();check('T1-comm',comm,15);
 await page.locator('[data-assembly-command="part"][data-value="fuse-fasteners"]').click();await frame.waitForFunction(()=>window.aikoAssemblyGuide.snapshot().partId==='fuse-fasteners');await shot('02-comm-selected','保险座螺丝标签选中反馈',frame);
 const selected=await electrical();const tag=selected.labels.find(l=>l.selected);row('T2-selected','选中标签仍半透明且强调可辨',!!tag&&tag.background[3]<255&&tag.background[3]>comm.labels[0].background[3]?'通过':'失败',tag);
 await language('en');const before=await electrical();const box=await frame.locator('canvas').first().boundingBox();await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.5+55,box.y+box.height*.5+18,{steps:10});await page.mouse.up();await page.waitForTimeout(500);
 await shot('03-comm-english-rotated','英语及实际旋转后的半透明标签',frame);const english=await electrical();check('T3-en',english,15);row('T3-language','可见标签为英文',english.labels.every(l=>!/[\u3400-\u9fff]/u.test(l.text))?'通过':'失败',english.labels.map(l=>l.text));row('T3-rotate','实际鼠标旋转有效',Math.hypot(...english.camera.map((v,i)=>v-before.camera[i]))>.001?'通过':'失败',{before:before.camera,after:english.camera});
 await page.locator('[data-assembly-command="select"][data-value="constant-aiko"]').click();await frame.waitForFunction(()=>window.aikoAssemblyGuide.snapshot().boardId==='constant-aiko');await mode('exploded');await shot('04-board-labels-en','恒流板爆炸图：一致的半透明标签',frame);check('T4-board',await electrical(),5);
 const url=new URL(target);url.searchParams.set('assembly','gx-touch50');await page.goto(url.href,{waitUntil:'domcontentloaded'});frame=await activeFrame();await ready(frame);await frame.waitForFunction(()=>!!window.aikoGxScene);const normal=await frame.evaluate(()=>window.aikoGxScene.scene.background.getHex());
 await mode('exploded');await shot('05-gx-labels-en','GX爆炸图：半透明底与白字',frame);const gx=await frame.evaluate(new Function(gxExpression));check('T5-GX',gx,8);
 await language('zh');await page.locator('[data-assembly-command="part"][data-value="frame"]').click();await frame.waitForFunction(()=>window.aikoAssemblyGuide.snapshot().partId==='frame');await shot('06-gx-labels-zh-selected','GX中文及选中标签',frame);check('T6-GX-zh',await frame.evaluate(new Function(gxExpression)),8);
 await mode('normal');const restored=await frame.evaluate(()=>window.aikoGxScene.scene.background.getHex());row('T7-normal','常规场景原背景保持并恢复',restored===normal?'通过':'失败',{normal,restored});
 row('T8-visual','半透明覆盖、引线和清晰度','待核实','取回上述实际PNG后人工视觉复核；纹理alpha检查不能证明可读性。');
}
