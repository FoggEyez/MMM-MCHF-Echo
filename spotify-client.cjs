const fs=require('node:fs/promises'),path=require('node:path'),Model=require('./echo-model.js');
class SpotifyClient{
 constructor(config={},options={}){this.config=config;this.fetch=options.fetch||globalThis.fetch;this.now=options.now||Date.now;this.accessToken='';this.expiresAt=0;this.refreshing=null;this.credentials=null;this.abort=new AbortController();}
 async loadCredentials(){
  if(this.credentials)return this.credentials;let file={};
  if(this.config.credentialsFile){if(!path.isAbsolute(this.config.credentialsFile))throw this.error('reconnect');const stat=await fs.lstat(this.config.credentialsFile);if(!stat.isFile()||stat.size>16384||process.platform!=='win32'&&(stat.mode&0o077))throw this.error('reconnect');file=JSON.parse(await fs.readFile(this.config.credentialsFile,'utf8'));}
  const credentials={clientId:file.clientId||file.clientID||this.config.clientId||'',clientSecret:file.clientSecret||this.config.clientSecret||'',refreshToken:file.refreshToken||this.config.refreshToken||''};
  if(!['clientId','refreshToken'].every(key=>typeof credentials[key]==='string'&&credentials[key].length>0&&credentials[key].length<4096))throw this.error('reconnect');
  this.credentials=credentials;return credentials;
 }
 error(code,retryAfterMs=0){const error=Error(code==='limited'?'Spotify is rate limited.':code==='reconnect'?'Reconnect Spotify in the module settings.':'Spotify is unavailable.');error.code=code;error.retryAfterMs=retryAfterMs;return error;}
 async request(url,options={},limit=262144){
  let response;try{response=await this.fetch(url,{...options,redirect:'error',signal:AbortSignal.any([this.abort.signal,AbortSignal.timeout(8000)])});}catch{throw this.error('unavailable');}
  if(response.status===429){const raw=response.headers.get('retry-after'),seconds=Number(raw),wait=Number.isFinite(seconds)?seconds*1000:Date.parse(raw)-this.now();await response.body?.cancel();throw this.error('limited',Math.min(86400000,Math.max(1000,Number.isFinite(wait)?wait:30000)));}
  if(response.status===204)return {response,data:null};
  if(!response.ok){await response.body?.cancel();const error=this.error(response.status===401||response.status===403?'reconnect':'unavailable');error.httpStatus=response.status;throw error;}
  if(Number(response.headers.get('content-length'))>limit){await response.body?.cancel();throw this.error('unavailable');}
  let data,bytes=0,parts=[];try{if(response.body?.getReader){const reader=response.body.getReader();for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>limit){await reader.cancel();throw Error('large response');}parts.push(Buffer.from(value));}data=JSON.parse(Buffer.concat(parts).toString('utf8'));}else{const text=await response.text();if(Buffer.byteLength(text)>limit)throw Error('large response');data=JSON.parse(text);}}catch{throw this.error('unavailable');}return {response,data};
 }
 async refresh(){
  if(this.refreshing)return this.refreshing;
  this.refreshing=(async()=>{const c=await this.loadCredentials(),body=new URLSearchParams({grant_type:'refresh_token',refresh_token:c.refreshToken}),headers={'Content-Type':'application/x-www-form-urlencoded'};
   if(c.clientSecret)headers.Authorization='Basic '+Buffer.from(c.clientId+':'+c.clientSecret).toString('base64');else body.set('client_id',c.clientId);
   let data;try{({data}=await this.request('https://accounts.spotify.com/api/token',{method:'POST',headers,body:body.toString()},16384));}catch(error){if([400,401,403].includes(error.httpStatus))throw this.error('reconnect');throw error;}
   if(typeof data?.access_token!=='string'||!data.access_token||data.access_token.length>8192)throw this.error('reconnect');
   this.accessToken=data.access_token;this.expiresAt=this.now()+Math.max(60,Math.min(86400,Number(data.expires_in)||3600))*1000;
   if(typeof data.refresh_token==='string'&&data.refresh_token.length<4096&&data.refresh_token){c.refreshToken=data.refresh_token;if(this.config.credentialsFile){const file=this.config.credentialsFile,previous=JSON.parse(await fs.readFile(file,'utf8')),temp=file+'.echo-'+process.pid+'.tmp';try{await fs.writeFile(temp,JSON.stringify({...previous,refreshToken:c.refreshToken})+'\n',{mode:0o600,flag:'wx'});await fs.rename(temp,file);}catch{await fs.unlink(temp).catch(()=>{});throw this.error('reconnect');}}}
  })();try{await this.refreshing;}finally{this.refreshing=null;}
 }
 async playback(){
  if(!this.accessToken||this.expiresAt-this.now()<60000)await this.refresh();
  let data;try{({data}=await this.request('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track%2Cepisode',{headers:{Authorization:'Bearer '+this.accessToken}}));}catch(error){if(error.code!=='reconnect')throw error;this.accessToken='';await this.refresh();({data}=await this.request('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track%2Cepisode',{headers:{Authorization:'Bearer '+this.accessToken}}));}
  return Model.normalize(data?{...data,observedAt:this.now()}:{status:'idle',observedAt:this.now()},this.now());
 }
 destroy(){this.abort.abort();this.accessToken='';this.credentials=null;}
}
module.exports={SpotifyClient};
