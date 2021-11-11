self.worker=(()=>{"use strict";var t={190:(t,e,i)=>{i.r(e),i.d(e,{CacheStrategyBase:()=>I,addStrategy:()=>C,enableLogging:()=>V,init:()=>O,initFromManifest:()=>j,onClientMessage:()=>x,sendToClient:()=>b,status:()=>_,strategies:()=>E,version:()=>M});class r{constructor(t,e,i){this.major=t,this.minor=e,this.fix=i,this._major,this._minor,this._fix}static validate(t){if("number"!=typeof t)throw Error("Not a valid number given")}asString(){return`${this.major}.${this.minor}.${this.fix}`}get major(){return this._major}get minor(){return this._minor}get fix(){return this._fix}set major(t){r.validate(t),this._major=t}set minor(t){r.validate(t),this._minor=t}set fix(t){r.validate(t),this._fix=t}compare(t){return this.major>t.major?1:this.major<t.major?-1:this.minor>t.minor?1:this.minor<t.minor?-1:this.fix>t.fix?1:this.fix<t.fix?-1:0}static extractGroups(t){const e=t.match(/(\d+)\.(\d+)\.(\d+)/),i=e[1],r=e[2],s=e[3];return{major:Number(i),minor:Number(r),fix:Number(s)}}}class s extends r{constructor(t,e,i,r,s){super(t,e,i),this.prefix=r,this.delimiter=s||"-",this._prefix,this._delimiter}static fromStringWithDelimiter(t,e="-"){const i=t.split(e);if(i.length<2)throw Error("string does not include a delimiter");const r=i[1],n=i[0];return s.fromString(r,n,e)}static fromString(t,e,i){var{major:r,minor:n,fix:a}=super.extractGroups(t);return new s(r,n,a,e,i)}set delimiter(t){if("string"!=typeof t)throw Error("Delimiter must be of type string");this._delimiter=t}get delimiter(){return this._delimiter}set prefix(t){if("string"!=typeof t)throw Error("Prefix must be of type string");this._prefix=t}get prefix(){return this._prefix}compare(t){if(this.prefix!==t.prefix)throw new Error("Comparing different types of prefixes");if(this.delimiter!==t.delimiter)throw new Error("Comparing different types of delimiters");return super.compare(t)}asString(){return`${this.prefix}${this.delimiter}${super.asString()}`}}const n=new Map;let a=!1;class o{log(t){a&&console.log(t)}error(t){a&&console.error(t)}static enable(){a=!0}static setlogger(t,e){n.set(t,e)}static getLogger(t="default"){const e=n.get(t);if(e)return e;const i=new o;return o.setlogger(t,i),i}}class c{static async create({version:t}){return await(new c).open({version:t})}static async cleanup(t){o.getLogger().log("Clear outdated for current version: "+t.asString());const e=(await self.caches.keys()).filter((function(e){o.getLogger().log("Cache: "+e);try{return 0!==s.fromStringWithDelimiter(e,t.delimiter).compare(t)}catch(t){return!1}})).map((function(t){return o.getLogger().log("Delete: "+t),self.caches.delete(t)}));return await Promise.all(e)}async open({version:t}){return this.cache=await self.caches.open(t),this}async get(t){return await this.cache.match(t)}async truncate(t){const e=t||await self.caches.keys();return await Promise.all(e.map(self.caches.delete.bind(self.caches))),this}async put(t,e){return"HEAD"===t.method||"POST"===t.method||await this.cache.put(t,e.clone()),this}async delete(t){return await this.cache.delete(t),this}}class l{constructor(t){this._version=void 0,this._matcher=t}get version(){return this._version}static isOffline(){return!navigator.onLine}matches(t){return Array.isArray(this._matcher)?this._matcher.includes(t):this._matcher instanceof RegExp?this._matcher.test(t):"function"==typeof this._matcher?this._matcher(t):"string"==typeof this._matcher&&t.startsWith(this._matcher)}async fetchVersion(){throw new Error("must be implemented by strategy")}isInitialRequest(t){throw new Error("must be implemented by strategy")}async init(){this.cache?l.isOffline()||await this.reinitialize():(this._version=await this.fetchVersion(),this.cache=await c.create({version:this.version.asString()}))}async reinitialize(){const t=this.version&&this.version.asString();this._version=await this.fetchVersion(),t!==this.version.asString()&&(this.cache=await c.create({version:this.version.asString()})),await c.cleanup(this.version)}async applyStrategy(t){if(!(t&&t instanceof self.Request))throw new Error("request is required");const e=this.getCache();return l.isOffline()?await this.handleOffline(e,t):await this.handleOnline(e,t)}async handleOnline(t,e){if("only-if-cached"===e.cache&&"same-origin"!==e.mode)return;let i=await t.get(e);return i||(i=await self.fetch(e),t.put(e,i)),i}async handleOffline(t,e){return t?await t.get(e):new self.Response("<h1>Please ensure that you're online</h1>")}getCache(){return this.cache}}class h{static async fetchManifest(t="manifest.json"){manifestPath=`${window.location.origin}/${t}`;const e=await self.fetch(manifestPath);return await e.json()}static async loadFromManifest(t="manifest.json"){const e=await h.fetchManifest(t);return e["sap.app"]&&e["sap.app"].serviceWorker?e["sap.app"].serviceWorker.config:[]}}class u extends l{constructor(t){super(t.url),this.rootUrl=t.manifestRootUrl||t.url,this.initialRequestEndings=t.initialRequestEndings||["/index.html"]}isInitialRequest(t){return this.initialRequestEndings.some((e=>t.endsWith(e)))}getVersionFromJson(t={}){const e=t["sap.app"];if(e&&e.applicationVersion&&e.applicationVersion.version)return s.fromString(e.applicationVersion.version,"app");throw Error("Cannot get version from manifest")}async fetchVersion(){const t=await h.fetchManifest(`${this.rootUrl}/manifest.json`);return this.getVersionFromJson(t)}}class f extends l{constructor(t){super(t.url),this.rootUrl=t.url}isInitialRequest(t){return t.endsWith("/sap-ui-core.js")}async waitForVersionJSON(t){const e=await self.fetch(`${t}/sap-ui-version.json`);return await e.json()}getVersionFromJson(t={}){return s.fromString(t.version,"resources")}async fetchVersion(){const t=await this.waitForVersionJSON(this.rootUrl);return this.getVersionFromJson(t)}}class g extends l{constructor(t){super(t.url),this._isInitial=!0,this.name=t.name||"STATIC"}async fetchVersion(){return s.fromString("0.0.0",this.name)}isInitialRequest(t){return this._isInitial&&(this._isInitial=!1),this._isInitial}}class p extends l{constructor(t){super(t.url),this._isInitial=!0,this._timeInMs=t.timeInMs}async fetchVersion(){return s.fromString("0.0.0","TIMED")}isExpired(){return(new Date).getTime()-this.lastAccessTime<this._timeInMs}async handleOnline(t,e){let i=await t.get(e);return i&&!this.isExpired()||(i=await self.fetch(e),t.put(e,i)),this.lastAccessTime=(new Date).getTime(),i}isInitialRequest(t){return this._isInitial&&(this._isInitial=!1),this._isInitial}}class m extends l{constructor(t){super(t.url),this._isInitial=!0}async fetchVersion(){return s.fromString("0.0.0","NETWORKUPDATE")}async handleOnline(t,e){let i=await t.get(e);return i?self.fetch(e).then((i=>{t.put(e,i)})):(i=await self.fetch(e),t.put(e,i)),i}isInitialRequest(t){return this._isInitial&&(this._isInitial=!1),this._isInitial}}class d extends l{constructor(t){super(t.urls),this.aUrls=t.urls,this.sVersion=t.version,this._isInitial=!0}isInitialRequest(t){return this._isInitial&&(this._isInitial=!1),this._isInitial}async fetchVersion(){return s.fromString(this.sVersion,"PRE")}async init(){await super.init();const t=this.aUrls.map((t=>this.handleOnline(this.getCache(),t)));await Promise.all(t)}}class y{constructor(){this.strategies=[]}addStrategy(t){t.priority=t.priority||0,this.strategies.push(t),t.priority&&this.strategies.sort(((t,e)=>t.priority===e.priority?0:e.priority>t.priority?1:-1))}static async ensureStrategyIsInitialized(t){t._version||(o.getLogger().log("Strategy init called"),await t.init())}getStrategy(t){return this.strategies.find((e=>{if(e.matches(t))return e}))}async applyStrategy(t){const e=this.getStrategy(t.url);return e?(e.isInitialRequest(t.url)&&await e.init(),await y.ensureStrategyIsInitialized(e),e.applyStrategy(t)):self.fetch(t)}static create(){return new y}}class w{constructor(){this.clientMessageHandler=void 0}setClientMessageHandler(t){o.getLogger().log("client message handler set"),this.clientMessageHandler=t}async sentMessageToClient2(t,e){return new Promise((function(i,r){var s=new MessageChannel;s.port1.onmessage=function(t){t.data.error?r(t.data.error):i(t.data)},t.postMessage("SW Says: '"+e+"'",[s.port2])}))}async sendMessageToClient(t,e){return t.postMessage({msg:e})}async sendMessageToAllClients(t){const e=(await clients.matchAll()).map((e=>this.sendMessageToClient(e,t)));return await Promise.all(e)}handleClientMessage(t,e){this.clientMessageHandler?this.clientMessageHandler(t,e):o.getLogger().log("Unhandled Client message received: "+t.data)}static create(){return new w}}const S=y.create(),v=w.create(),_={};self.addEventListener("install",(t=>{self.skipWaiting()})),self.addEventListener("activate",(t=>{self.clients.claim()})),self.addEventListener("fetch",(t=>{o.getLogger().log("FETCH "+t.request.url),t.respondWith(async function(){try{const e=t.request;return await S.applyStrategy(e)}catch(t){throw o.getLogger().error("Error in fetch: ",t),t}}())})),self.addEventListener("message",(t=>{v.handleClientMessage(t,_)}));const x=v.setClientMessageHandler.bind(v),b=v.sendMessageToAllClients.bind(v),C=S.addStrategy.bind(S),I=l,E={CacheAllStrategy:g,UI5ResourceCacheStrategy:f,ApplicationCacheStrategy:u,PreCacheStrategy:d,CacheWithExpirationStrategy:p,CacheNetworkUpdateStrategy:m},M="0.0.1",j=async(t={})=>{const e=await h.loadFromManifest(t.manifestUrl);await O(e)},O=async t=>{const e=t.map((t=>{const e=Object.assign({},t),i=e.type;if(!i)throw new Error('type not specified. Must be a function, an instance of CacheStrategyBase or one of ["application", "ui5resource", "static", "precache", "networkupdate"]');let r;if(delete e.type,"object"==typeof i)r=i;else if("function"==typeof i&&i.constructor)r=new i(e);else if("string"==typeof i)switch(i.toLowerCase()){case"application":r=new u(e);break;case"ui5resource":r=new f(e);break;case"static":r=new g(e);break;case"precache":r=new d(e);break;case"networkupdate":r=new m(e);break;case"expiration":r=new p(e);break;default:throw new Error(`Cannot find strategy: ${i}. Allowed values are: ["application", "ui5resource", "static", "precache", "networkupdate"]`)}if(r instanceof I)return e.priority&&(r.priority=e.priority),S.addStrategy(r),r.init();throw new Error("Strategy must be of type CacheStrategyBase")}));await Promise.all(e);const i=t.map((t=>{if("string"==typeof t.type)return t.type}));_.init=i},V=()=>{o.enable()}}},e={};function i(r){if(e[r])return e[r].exports;var s=e[r]={exports:{}};return t[r](s,s.exports,i),s.exports}return i.d=(t,e)=>{for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(190)})();