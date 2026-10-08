// ZUNO HLS relay: deploy as a SEPARATE Cloudflare Worker. Only serves registered Supabase server IDs.
const DB="https://tpvcbhcneysphrdspslx.supabase.co";
const KEY="sb_publishable_K1XLljhfdZ4UdkGQRdeOYQ_exm8QdbQ";
const ALLOWED_HOST=/^(?:[a-z0-9-]+\.)*streamrpt\.xyz$/i;
const idOk=s=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
function checkUrl(s,originHost){const u=new URL(s);if(u.protocol!=="https:"||u.username||u.password||!ALLOWED_HOST.test(u.hostname)||u.hostname!==originHost||u.port)throw Error("Nguồn không được phép");return u}
function rewrite(text,base,id,requestUrl,originHost){const root=new URL(requestUrl);const relay=url=>{try{const u=checkUrl(new URL(url,base).href,originHost);return root.origin+"/hls/"+id+"?resource="+encodeURIComponent(u.href)}catch{return url}};
 return text.split(/\r?\n/).map(line=>{if(!line.trim())return line;if(line.trimStart().startsWith("#"))return line.replace(/URI="([^"]+)"/g,(_,u)=>'URI="'+relay(u)+'"');return relay(line.trim())}).join("\n")}
export default{async fetch(request){const u=new URL(request.url);if(request.method==="OPTIONS")return new Response(null,{headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,HEAD,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Range"}});const m=u.pathname.match(/^\/hls\/([0-9a-f-]+)$/i);if(!m||!idOk(m[1])||!["GET","HEAD"].includes(request.method))return new Response("Not found",{status:404});try{
 const lookup=await fetch(DB+"/rest/v1/servers?id=eq."+encodeURIComponent(m[1])+"&select=url&limit=1",{headers:{apikey:KEY,Authorization:"Bearer "+KEY},cf:{cacheTtl:30}});
 if(!lookup.ok)throw Error("Không tra cứu được server");const rows=await lookup.json();if(!rows.length)return new Response("Server không tồn tại",{status:404});
 const source=checkUrl(rows[0].url,new URL(rows[0].url).hostname);const target=u.searchParams.has("resource")?checkUrl(u.searchParams.get("resource"),source.hostname):source;
 const upstream=await fetch(target.href,{method:request.method,redirect:"manual",headers:{"Accept":"*/*","User-Agent":"ZUNO-Cinema-HLS-Relay/1.0",...(request.headers.has("Range")?{"Range":request.headers.get("Range")}:{})}});
 if(upstream.status>=300&&upstream.status<400)return new Response("Nguồn chuyển hướng không được hỗ trợ",{status:502});
 const headers=new Headers({"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,HEAD,OPTIONS","Cache-Control":"private, max-age=15","Access-Control-Expose-Headers":"Content-Length,Content-Range,Accept-Ranges","X-Content-Type-Options":"nosniff"});
 const ct=upstream.headers.get("content-type")||"";const playlist=/\.m3u8(?:$|\?)/i.test(target.href)||/mpegurl/i.test(ct);
 if(playlist&&upstream.ok&&request.method==="GET"){const body=await upstream.text();if(body.length>3e6)return new Response("Playlist quá lớn",{status:502});headers.set("Content-Type","application/vnd.apple.mpegurl; charset=utf-8");return new Response(rewrite(body,target.href,m[1],request.url,source.hostname),{status:upstream.status,headers})}
 headers.set("Content-Type",ct||"application/octet-stream");for(const h of ["content-length","accept-ranges","content-range"])if(upstream.headers.has(h))headers.set(h,upstream.headers.get(h));return new Response(upstream.body,{status:upstream.status,headers});
 }catch(e){return new Response("Proxy error: "+e.message,{status:502,headers:{"Access-Control-Allow-Origin":"*"}})}}};
