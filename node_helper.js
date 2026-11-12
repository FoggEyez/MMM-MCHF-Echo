const NodeHelper=require('node_helper'),{SpotifyClient}=require('./spotify-client.cjs');
const seconds=(value,fallback,min,max)=>Math.max(min,Math.min(max,Number(value)||fallback));
module.exports=NodeHelper.create({
 start(){this.sessions=new Map();},
 socketNotificationReceived(name,payload){
  if(!payload||typeof payload.identifier!=='string'||!/^module_\d+_MMM-MCHF-Echo$|^[A-Za-z][\w-]{0,100}$/.test(payload.identifier))return;
  this.sessions||=new Map();const previous=this.sessions.get(payload.identifier);
  if(name==='ECHO_STOP'){if(previous){previous.stopped=true;clearTimeout(previous.timer);previous.client.destroy();this.sessions.delete(payload.identifier);}return;}
  if(name==='ECHO_VISIBILITY'){if(previous){previous.hidden=payload.hidden===true;if(!previous.busy){clearTimeout(previous.timer);this.poll(previous);}}return;}
  if(name!=='ECHO_START'||previous||payload.config?.source!=='spotify')return;
  const raw=payload.config,config={source:'spotify',clientId:typeof raw.clientId==='string'?raw.clientId:'',clientSecret:typeof raw.clientSecret==='string'?raw.clientSecret:'',refreshToken:typeof raw.refreshToken==='string'?raw.refreshToken:'',credentialsFile:typeof raw.credentialsFile==='string'?raw.credentialsFile:'',pollSeconds:seconds(raw.pollSeconds,10,5,300),idlePollSeconds:seconds(raw.idlePollSeconds,30,15,600),hiddenPollSeconds:seconds(raw.hiddenPollSeconds,60,30,1800)};
  const session={identifier:payload.identifier,config,client:new SpotifyClient(config),hidden:false,stopped:false,busy:false};this.sessions.set(payload.identifier,session);this.poll(session);
 },
 async poll(session){if(session.stopped||session.busy)return;session.busy=true;let wait=session.config.pollSeconds*1000;
  try{const playback=await session.client.playback();if(session.stopped)return;this.sendSocketNotification('ECHO_PLAYBACK',{identifier:session.identifier,playback});if(playback.status!=='playing')wait=session.config.idlePollSeconds*1000;}catch(error){if(session.stopped)return;const status=['limited','reconnect'].includes(error.code)?error.code:'unavailable';this.sendSocketNotification('ECHO_PLAYBACK',{identifier:session.identifier,playback:{status,observedAt:Date.now()}});wait=Math.max(session.config.idlePollSeconds*1000,error.retryAfterMs||0,status==='reconnect'?300000:0);}
  finally{session.busy=false;if(!session.stopped)session.timer=setTimeout(()=>this.poll(session),session.hidden?Math.max(wait,session.config.hiddenPollSeconds*1000):wait);}
 },
 stop(){for(const session of this.sessions?.values()||[]){session.stopped=true;clearTimeout(session.timer);session.client.destroy();}this.sessions?.clear();}
});
