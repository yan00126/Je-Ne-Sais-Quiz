// Serves a web export on :8081 with the cross-origin headers expo-sqlite's WASM build needs.
const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2];
const types={'.html':'text/html','.js':'application/javascript','.wasm':'application/wasm','.css':'text/css','.png':'image/png','.ttf':'font/ttf','.json':'application/json','.ico':'image/x-icon'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  let f=path.join(root,p);
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){ if(fs.existsSync(f+'.html')) f=f+'.html'; else f=path.join(root,'index.html'); }
  res.setHeader('Cross-Origin-Embedder-Policy','credentialless');
  res.setHeader('Cross-Origin-Opener-Policy','same-origin');
  res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(8081,()=>console.log('up'));
