import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const dir = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const argv = process.argv.slice(2);
const option = (name, fallback) => {
  const i = argv.indexOf(name);
  return i < 0 ? fallback : argv[i + 1];
};
const cloudCI = argv.includes('--cloud-ci');
const remote = cloudCI || argv.includes('--remote-diagnostic');
const diagnosticTLS = remote && argv.includes('--diagnostic-proxy-tls');
const diagnosticFps = remote ? Number(option('--remote-fps-limit',0)) : 0;
const softwareWebGL = argv.includes('--software-webgl');
const full = argv.includes('--full');
const target = option('--url', 'https://zhoujintian111.github.io/?assembly=comm-backplate&v=assembly-20261003-r9');
const out = path.resolve(option('--output', path.join(dir, 'results', new Date().toISOString().replace(/[:.]/g, '-'))));
fs.mkdirSync(out, { recursive: true });
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const report = {
  started: new Date().toISOString(), url: target, mode: full ? 'full (smoke first)' : 'smoke',
  environment: { platform: process.platform, os: os.release(), node: process.version,
    execution: cloudCI ? 'GitHub Actions云端验收；不代表用户电脑运行情况' : remote ? '远程诊断；不代表用户电脑验收' : '执行此命令的本机',
    githubActions: process.env.GITHUB_ACTIONS==='true', runId:cloudCI?process.env.GITHUB_RUN_ID:null,
    sourceCommit:cloudCI?process.env.GITHUB_SHA:null, sourceRef:cloudCI?process.env.GITHUB_REF:null,
    headless: argv.includes('--headless'), requestedBrowser: 'Google Chrome', softwareWebGL, diagnosticProxyTLSException:diagnosticTLS,diagnosticFpsLimit:diagnosticFps||null },
  checks: [], screenshots: [], errors: [], warnings: [], assets: [], model: {}
};
const row = (id, item, status, evidence) => {
  const entry = { id, item, status, evidence };
  report.checks.push(entry);
  fs.writeFileSync(path.join(out,'progress.json'),JSON.stringify(report,null,2));
  console.log(`[${status}] ${id} ${item}`);
  return entry;
};
const tracked = () => {
  try {
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }).trim();
    const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
    return Object.fromEntries(files.filter(p => !p.startsWith('tests/3d-acceptance/')).map(p => [p, fs.existsSync(path.join(root,p)) ? sha(fs.readFileSync(path.join(root,p))) : null]));
  } catch { return null; }
};
const baseline = tracked();
const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function saveReport() {
  report.finished = new Date().toISOString();
  report.overall = report.checks.some(c=>c.status==='失败'||c.status==='受阻') ? '未通过' : report.checks.some(c=>c.status==='待核实') ? '有待核实项' : '已执行项目通过';
  fs.writeFileSync(path.join(out,'report.json'), JSON.stringify(report,null,2));
  const checks = report.checks.map(c=>`<tr><td>${esc(c.id)}</td><td>${esc(c.item)}</td><td>${esc(c.status)}</td><td><pre>${esc(typeof c.evidence==='string'?c.evidence:JSON.stringify(c.evidence,null,2))}</pre></td></tr>`).join('');
  const shots = report.screenshots.map(s=>`<figure><figcaption>${esc(s.title)}</figcaption><a href="${esc(s.file)}"><img src="${esc(s.file)}" loading="lazy"></a></figure>`).join('');
  fs.writeFileSync(path.join(out,'report.html'), `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>三维验收</title><style>body{font:15px system-ui;max-width:1300px;margin:24px auto;padding:16px;background:#f7f9fc;color:#152333}table{border-collapse:collapse;width:100%;background:white}td,th{border:1px solid #ccd5dd;padding:9px;text-align:left}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}img{max-width:100%;border:1px solid #bbc4ce}figure{margin:28px 0}figcaption{font-weight:600;margin-bottom:8px}</style><h1>三维验收：${esc(report.overall)}</h1><p>${esc(report.environment.execution)} · ${esc(report.environment.platform)} · ${esc(report.environment.browserVersion||'浏览器未启动')}</p><p><a href="${esc(target)}">被测网页</a> · ${esc(report.started)}</p><p>画面与模型证据只验证网页表达；不等同于实车安装、电气安全或物料实测验收。待核实项不能算通过。</p><table><tr><th>编号</th><th>验收点</th><th>结果</th><th>证据/限制</th></tr>${checks}</table>${shots}<h2>错误与警告</h2><pre>${esc(JSON.stringify({errors:report.errors,warnings:report.warnings},null,2))}</pre><p><a href="report.json">完整模型数据及机器可读报告</a></p></html>`);
  fs.writeFileSync(path.join(dir,'latest-result.txt'), out + os.EOL);
  console.log(`REPORT: ${path.join(out,'report.html')}`);
}
let browser, context, page;
async function shot(name, title, frame) {
  const file = `${name}.png`;
  const canvas=frame?frame.locator('canvas').filter({visible:true}).first():null;
  const box=canvas&&await canvas.count()?await canvas.boundingBox():null;
  const iframeBox=frame?await (await frame.frameElement()).boundingBox():null;
  const viewport=page.viewportSize();
  const pixels=await page.screenshot({ path: path.join(out,file), fullPage: true, timeout: 30000 });
  report.screenshots.push({file,title,frame:frame?.url()});
  if(frame) {
    if(box) {
      const canvasFile = `${name}-canvas.png`;
      const {PNG}=require('pngjs'),source=PNG.sync.read(pixels);
      const x=Math.floor(Math.max(0,box.x,iframeBox?.x||0)),y=Math.floor(Math.max(0,box.y,iframeBox?.y||0));
      const width=Math.floor(Math.min(box.x+box.width,viewport.width,source.width,iframeBox?iframeBox.x+iframeBox.width:Infinity)-x);
      const height=Math.floor(Math.min(box.y+box.height,viewport.height,source.height,iframeBox?iframeBox.y+iframeBox.height:Infinity)-y);
      if(width<=0||height<=0)throw new Error('画布不在当前可见区域');
      const crop=new PNG({width,height});
      for(let iy=0;iy<height;iy++)source.data.copy(crop.data,iy*width*4,((y+iy)*source.width+x)*4,((y+iy)*source.width+x+width)*4);
      fs.writeFileSync(path.join(out,canvasFile),PNG.sync.write(crop));
      report.screenshots.push({file:canvasFile,title:`${title}（画布）`,frame:frame.url()});
    }
  }
  console.log(`SCREENSHOT: ${file}`);
  fs.writeFileSync(path.join(out,'progress.json'),JSON.stringify(report,null,2));
}
async function activeFrame() {
  const iframe = page.locator('iframe.view-frame.is-active');
  await iframe.waitFor({state:'visible',timeout:30000});
  return (await iframe.elementHandle()).contentFrame();
}
async function ready(frame) {
  await frame.waitForFunction(() => {
    const list = window.__acceptanceGL || [];
    return !!window.aikoAssemblyGuide && list.some(s=>s.draws>20 && s.canvas.width>100 && s.canvas.height>100 && !s.gl.isContextLost());
  }, null, {timeout:30000});
  return frame.evaluate(() => (window.__acceptanceGL||[]).map(s=>{
    const gl=s.gl, ext=gl.getExtension('WEBGL_debug_renderer_info');
    return { width:s.canvas.width,height:s.canvas.height,drawCalls:s.draws,contextLost:gl.isContextLost(),
      vendor:ext?gl.getParameter(ext.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR),
      renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),version:gl.getParameter(gl.VERSION)};
  }));
}
try {
  let playwright;
  try { playwright=require('playwright'); }
  catch(e) {
    if(!process.env.ACCEPTANCE_PLAYWRIGHT_MODULES) throw new Error('未安装测试依赖。请在测试目录执行 npm install，或双击 run-chrome.cmd。');
    playwright=require(path.join(process.env.ACCEPTANCE_PLAYWRIGHT_MODULES,'playwright'));
  }
  const chromePath=option('--chrome-path',process.env.CHROME_PATH);
  report.environment.browserSelection=chromePath?{executablePath:chromePath}:{channel:'chrome'};
  browser=await playwright.chromium.launch({...(chromePath?{executablePath:chromePath}:{channel:'chrome'}),headless:argv.includes('--headless'),timeout:20000,
    ...(softwareWebGL?{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}: {})});
  report.environment.browserVersion=browser.version();
  context=await browser.newContext({viewport:{width:1600,height:1050},deviceScaleFactor:1,ignoreHTTPSErrors:diagnosticTLS});
  if(diagnosticTLS)report.warnings.push('仅此远程诊断因网络代理证书启用了ignoreHTTPSErrors；本机默认不启用，未验证HTTPS证书。');
  if(diagnosticFps)report.warnings.push(`远程软件渲染诊断的requestAnimationFrame上限为${diagnosticFps}帧/秒；保留真实时间，不评判用户电脑性能或动画流畅度。本机默认不限帧。`);
  await context.addInitScript(({fps}) => {
    if(fps>0){
      const native=requestAnimationFrame.bind(window),cancel=cancelAnimationFrame.bind(window);
      const last=new WeakMap(),pending=new Map();let serial=0;
      window.requestAnimationFrame=function(callback){
        const id=++serial,state={nativeId:0};pending.set(id,state);
        const pump=time=>{
          if(!pending.has(id))return;
          if(time-(last.get(callback)??-Infinity)>=1000/fps){pending.delete(id);last.set(callback,time);callback(time);}
          else state.nativeId=native(pump);
        };
        state.nativeId=native(pump);return id;
      };
      window.cancelAnimationFrame=function(id){const state=pending.get(id);if(state){cancel(state.nativeId);pending.delete(id);}};
    }
    window.__acceptanceGL=[];
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){
      const gl=original.call(this,type,...args);
      if(gl&&/^webgl2?$/.test(type)&&!window.__acceptanceGL.some(s=>s.gl===gl)){
        const state={canvas:this,gl,draws:0};window.__acceptanceGL.push(state);
        for(const key of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']){
          if(typeof gl[key]!=='function')continue;const fn=gl[key];
          gl[key]=function(...a){const result=fn.apply(this,a);state.draws++;return result;};
        }
      }
      return gl;
    };
  },{fps:diagnosticFps});
  page=await context.newPage();page.setDefaultTimeout(12000);
  page.on('pageerror',e=>report.errors.push({type:'pageerror',message:e.message}));
  page.on('console',msg=>{if(msg.type()==='error')report.errors.push({type:'console',message:msg.text(),location:msg.location()});});
  page.on('requestfailed',request=>report.errors.push({type:'requestfailed',url:request.url(),message:request.failure()?.errorText}));
  const assets=[];
  page.on('response',response=>{
    if(response.status()>=400)report.errors.push({type:'http',url:response.url(),status:response.status()});
    if(/\.(js|html)(\?|$)/.test(response.url()))assets.push(response.body().then(b=>report.assets.push({url:response.url(),status:response.status(),sha256:sha(b)})).catch(()=>{}));
  });
  await page.goto(target,{waitUntil:'domcontentloaded',timeout:45000});
  let frame=await activeFrame();
  const webgl=await ready(frame);report.model.webgl=webgl;
  await frame.evaluate(()=>window.aikoAssemblyGuide.selectBoard('comm-backplate'));
  await page.waitForTimeout(800);
  await shot('00-smoke','最小测试：当前版本真实WebGL模型',frame);
  row('K1-render','当前版本模型加载、真实WebGL绘制与截图','通过',{frame:frame.url(),webgl});
  if(cloudCI)row('K1-environment','Google Chrome在GitHub Actions中执行',process.env.GITHUB_ACTIONS==='true'?'通过':'待核实',report.environment);
  else row('K1-machine','用户电脑Google Chrome验收',remote?'待核实':'通过',report.environment);
  const expectedFrame=new URL(target).searchParams.get('v')||'assembly-20261003-r9';
  row('K1-version','当前目标版本入口',frame.url().includes(expectedFrame)?'通过':'待核实',frame.url());
  if(full) {
    if(argv.includes('--labels-only')||argv.includes('--board-labels-only')){
      const {runLabels}=await import('./label-checks.mjs');await runLabels({page,context,frame,report,row,shot,ready,activeFrame,target,boardOnly:argv.includes('--board-labels-only')});
    }else{
      const {runFull}=await import('./full-checks.mjs');
      await runFull({page,context,frame,report,row,shot,ready,activeFrame,target,semanticControls:remote&&argv.includes('--semantic-controls'),detailsOnly:argv.includes('--details-only'),repairOnly:argv.includes('--repair-only')});
    }
  }
  await Promise.allSettled(assets);
} catch(error) {
  report.errors.push({type:'harness',message:error.message,stack:error.stack});
  const loaded=report.checks.some(c=>c.id==='K1-render'&&c.status==='通过');
  row(loaded?'full-stop':'K1-stop',loaded?'完整检查中断（最小测试已通过）':full?'最小测试未通过；完整检查停止':'最小测试','受阻',error.message);
  if(page) await shot('00-failure','受阻时的实际画面').catch(e=>report.warnings.push(e.message));
  for(const [id,item] of [['K3','交互与三种状态'],['K4','确认布局与尺寸'],['K5','螺丝、卡扣、线缆与标注']]) {
    if(!report.checks.some(c=>c.id.startsWith(id))) row(id,item,'待核实','最小测试/执行受阻，未获得足够证据。');
  }
} finally {
  if(context) await context.close().catch(()=>{});
  if(browser) await browser.close().catch(()=>{});
  const after=tracked();
  row('K2','原网站及原脚本保持不变',baseline&&after?(JSON.stringify(baseline)===JSON.stringify(after)?'通过':'失败'):'待核实',baseline&&after?'执行前后所有原有已跟踪文件SHA-256比较':'当前目录未提供git基线；脚本没有网站写入或发布操作。');
  if(report.errors.length&&!report.checks.some(c=>c.status==='受阻')) row('runtime-errors','运行期错误','失败',report.errors);
  saveReport();
  process.exitCode=report.checks.some(c=>c.status==='失败'||c.status==='受阻')?1:0;
}
