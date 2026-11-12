/* Pure playback geometry/state shared by MagicMirror and its local preview. */
(function(root){
 const number=(v,f=0,min=0,max=86400000)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):f;
 const text=(v,max=240)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max):'';
 function glowColor(value){return typeof value==='string'&&/^#[a-f0-9]{6}$/i.test(value.trim())?value.trim().toLowerCase():'#b89a60';}
 function url(value,image=false){try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port)return '';if(image?!['i.scdn.co','mosaic.scdn.co','image-cdn-ak.spotifycdn.com','image-cdn-fa.spotifycdn.com'].includes(u.hostname):u.hostname!=='open.spotify.com')return '';return u.href.length<=2048?u.href:'';}catch{return '';}}
 function normalize(raw,now=Date.now()){
  if(!raw||typeof raw!=='object')return {status:'unavailable',observedAt:now,title:'',artist:'',album:'',imageUrl:'',spotifyUrl:'',durationMs:0,progressMs:0,type:'track',id:''};
  const item=raw.item,api=!!item||Object.hasOwn(raw,'is_playing'),status=api?(item?(raw.is_playing?'playing':'paused'):'idle'):['playing','paused','idle','unavailable','reconnect','limited'].includes(raw.status)?raw.status:'unavailable';
  const artist=api?(item?.artists?.map(a=>text(a.name)).filter(Boolean).join(', ')||item?.show?.name||''):raw.artist;
  const observedAt=number(raw.observedAt,now,0,now+30000),durationMs=number(api?item?.duration_ms:raw.durationMs),progressMs=number(api?raw.progress_ms:raw.progressMs,0,0,durationMs);
  const images=api?(item?.album?.images||item?.images||[]):[];
  return {status,observedAt,title:text(api?item?.name:raw.title),artist:text(artist),album:text(api?item?.album?.name||item?.show?.name:raw.album),imageUrl:url(api?images.find(i=>url(i.url,true))?.url:raw.imageUrl,true),spotifyUrl:url(api?item?.external_urls?.spotify:raw.spotifyUrl),durationMs,progressMs,type:(api?item?.type:raw.type)==='episode'?'episode':'track',id:text(api?item?.id:raw.id,160)};
 }
 function position(snapshot,now=Date.now(),staleSeconds=90){const age=Math.max(0,now-snapshot.observedAt),limit=number(staleSeconds,90,15,3600)*1000,stale=['playing','paused','idle'].includes(snapshot.status)&&age>limit,elapsed=snapshot.status==='playing'?Math.min(age,limit):0,progressMs=Math.min(snapshot.durationMs,Math.max(0,snapshot.progressMs+elapsed));return {progressMs,remainingMs:Math.max(0,snapshot.durationMs-progressMs),fraction:snapshot.durationMs?progressMs/snapshot.durationMs:0,stale,status:stale?'stale':snapshot.status};}
 function layout(width,height,choice='auto'){if(['plaque','sleeve','showcase'].includes(choice))return choice;return height<145||width<245?'plaque':width>=430||height<310?'sleeve':'showcase';}
 function time(ms){const seconds=Math.max(0,Math.floor(Number(ms)/1000)||0);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
 const api={normalize,position,layout,time,url,text,glowColor};if(typeof module==='object'&&module.exports)module.exports=api;else root.MischiefEchoModel=api;
})(typeof globalThis==='object'?globalThis:this);
