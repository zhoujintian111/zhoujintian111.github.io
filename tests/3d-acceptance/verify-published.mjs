import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../..');
const out=path.join(dir,'results/published');fs.mkdirSync(out,{recursive:true});
const base='https://zhoujintian111.github.io/';
const version='assembly-20261004-r11';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['index.html','app.js','styles.css','assets/views/electrical-new.html','assets/views/gx-new.html','assets/gx-assembly-controller.js'];
const report={version,base,runId:process.env.GITHUB_RUN_ID,sourceCommit:process.env.GITHUB_SHA,checks:[],errors:[]};
for(const file of files){
 const url=new URL(file,base);url.searchParams.set('v',version);
 try{
  const response=await fetch(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(30000)});
  const bytes=Buffer.from(await response.arrayBuffer());const expected=sha(fs.readFileSync(path.join(root,file)));const actual=sha(bytes);
  const pass=response.ok&&actual===expected;
  report.checks.push({file,url:url.href,status:response.status,expectedSha256:expected,actualSha256:actual,pass});
  console.log(`${pass?'PASS':'FAIL'} ${file} HTTP ${response.status} ${actual}`);
 }catch(error){report.errors.push({file,message:error.message});}
}
report.passed=report.checks.length===files.length&&report.checks.every(x=>x.pass)&&!report.errors.length;
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
if(!report.passed)process.exitCode=1;
