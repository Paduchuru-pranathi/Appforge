(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{526:function(t,e,s){Promise.resolve().then(s.t.bind(s,3385,23)),Promise.resolve().then(s.t.bind(s,5975,23)),Promise.resolve().then(s.bind(s,749))},749:function(t,e,s){"use strict";s.r(e),s.d(e,{Providers:function(){return v}});var i=s(7437),r=s(300),a=s(7749),n=s(7987),o=s(2996),u=class extends o.l{constructor(t={}){super(),this.config=t,this.#t=new Map}#t;build(t,e,s){let i=e.queryKey,n=e.queryHash??(0,r.Rm)(i,e),o=this.get(n);return o||(o=new a.A({client:t,queryKey:i,queryHash:n,options:t.defaultQueryOptions(e),state:s,defaultOptions:t.getQueryDefaults(i)}),this.add(o)),o}add(t){this.#t.has(t.queryHash)||(this.#t.set(t.queryHash,t),this.notify({type:"added",query:t}))}remove(t){let e=this.#t.get(t.queryHash);e&&(t.destroy(),e===t&&this.#t.delete(t.queryHash),this.notify({type:"removed",query:t}))}clear(){n.Vr.batch(()=>{this.getAll().forEach(t=>{this.remove(t)})})}get(t){return this.#t.get(t)}getAll(){return[...this.#t.values()]}find(t){let e={exact:!0,...t};return this.getAll().find(t=>(0,r._x)(e,t))}findAll(t={}){let e=this.getAll();return Object.keys(t).length>0?e.filter(e=>(0,r._x)(t,e)):e}notify(t){n.Vr.batch(()=>{this.listeners.forEach(e=>{e(t)})})}onFocus(){n.Vr.batch(()=>{this.getAll().forEach(t=>{t.onFocus()})})}onOnline(){n.Vr.batch(()=>{this.getAll().forEach(t=>{t.onOnline()})})}},l=s(7470),c=class extends o.l{constructor(t={}){super(),this.config=t,this.#e=new Set,this.#s=new Map,this.#i=0}#e;#s;#i;build(t,e,s){let i=new l.m({client:t,mutationCache:this,mutationId:++this.#i,options:t.defaultMutationOptions(e),state:s});return this.add(i),i}add(t){this.#e.add(t);let e=h(t);if("string"==typeof e){let s=this.#s.get(e);s?s.push(t):this.#s.set(e,[t])}this.notify({type:"added",mutation:t})}remove(t){if(this.#e.delete(t)){let e=h(t);if("string"==typeof e){let s=this.#s.get(e);if(s){if(s.length>1){let e=s.indexOf(t);-1!==e&&s.splice(e,1)}else s[0]===t&&this.#s.delete(e)}}}this.notify({type:"removed",mutation:t})}canRun(t){let e=h(t);if("string"!=typeof e)return!0;{let s=this.#s.get(e),i=s?.find(t=>"pending"===t.state.status);return!i||i===t}}runNext(t){let e=h(t);if("string"!=typeof e)return Promise.resolve();{let s=this.#s.get(e)?.find(e=>e!==t&&e.state.isPaused);return s?.continue()??Promise.resolve()}}clear(){n.Vr.batch(()=>{this.#e.forEach(t=>{this.notify({type:"removed",mutation:t})}),this.#e.clear(),this.#s.clear()})}getAll(){return Array.from(this.#e)}find(t){let e={exact:!0,...t};return this.getAll().find(t=>(0,r.X7)(e,t))}findAll(t={}){return this.getAll().filter(e=>(0,r.X7)(t,e))}notify(t){n.Vr.batch(()=>{this.listeners.forEach(e=>{e(t)})})}resumePausedMutations(){let t=this.getAll().filter(t=>t.state.isPaused);return n.Vr.batch(()=>Promise.all(t.map(t=>t.continue().catch(r.ZT))))}};function h(t){return t.options.scope?.id}var d=s(9198),f=s(436),p=class{#r;#a;#n;#o;#u;#l;#c;#h;constructor(t={}){this.#r=t.queryCache||new u,this.#a=t.mutationCache||new c,this.#n=t.defaultOptions||{},this.#o=new Map,this.#u=new Map,this.#l=0}mount(){this.#l++,1===this.#l&&(this.#c=d.j.subscribe(async t=>{t&&(await this.resumePausedMutations(),this.#r.onFocus())}),this.#h=f.N.subscribe(async t=>{t&&(await this.resumePausedMutations(),this.#r.onOnline())}))}unmount(){this.#l--,0===this.#l&&(this.#c?.(),this.#c=void 0,this.#h?.(),this.#h=void 0)}isFetching(t){return this.#r.findAll({...t,fetchStatus:"fetching"}).length}isMutating(t){return this.#a.findAll({...t,status:"pending"}).length}getQueryData(t){let e=this.defaultQueryOptions({queryKey:t});return this.#r.get(e.queryHash)?.state.data}ensureQueryData(t){let e=this.defaultQueryOptions(t),s=this.#r.build(this,e),i=s.state.data;return void 0===i?this.fetchQuery(t):(t.revalidateIfStale&&s.isStaleByTime((0,r.KC)(e.staleTime,s))&&this.prefetchQuery(e),Promise.resolve(i))}getQueriesData(t){return this.#r.findAll(t).map(({queryKey:t,state:e})=>[t,e.data])}setQueryData(t,e,s){let i=this.defaultQueryOptions({queryKey:t}),a=this.#r.get(i.queryHash),n=a?.state.data,o=(0,r.SE)(e,n);if(void 0!==o)return this.#r.build(this,i).setData(o,{...s,manual:!0})}setQueriesData(t,e,s){return n.Vr.batch(()=>this.#r.findAll(t).map(({queryKey:t})=>[t,this.setQueryData(t,e,s)]))}getQueryState(t){let e=this.defaultQueryOptions({queryKey:t});return this.#r.get(e.queryHash)?.state}removeQueries(t){let e=this.#r;n.Vr.batch(()=>{e.findAll(t).forEach(t=>{e.remove(t)})})}resetQueries(t,e){let s=this.#r;return n.Vr.batch(()=>(s.findAll(t).forEach(t=>{t.reset()}),this.refetchQueries({type:"active",...t},e)))}cancelQueries(t,e={}){let s={revert:!0,...e};return Promise.all(n.Vr.batch(()=>this.#r.findAll(t).map(t=>t.cancel(s)))).then(r.ZT).catch(r.ZT)}invalidateQueries(t,e={}){return n.Vr.batch(()=>(this.#r.findAll(t).forEach(t=>{t.invalidate()}),t?.refetchType==="none")?Promise.resolve():this.refetchQueries({...t,type:t?.refetchType??t?.type??"active"},e))}refetchQueries(t,e={}){let s={...e,cancelRefetch:e.cancelRefetch??!0};return Promise.all(n.Vr.batch(()=>this.#r.findAll(t).filter(t=>!t.isDisabled()&&!t.isStatic()).map(t=>{let e=t.fetch(void 0,s);return s.throwOnError||(e=e.catch(r.ZT)),"paused"===t.state.fetchStatus?Promise.resolve():e}))).then(r.ZT)}fetchQuery(t){let e=this.defaultQueryOptions(t);void 0===e.retry&&(e.retry=!1);let s=this.#r.build(this,e);return s.isStaleByTime((0,r.KC)(e.staleTime,s))?s.fetch(e):Promise.resolve(s.state.data)}prefetchQuery(t){return this.fetchQuery(t).then(r.ZT).catch(r.ZT)}fetchInfiniteQuery(t){return t._type="infinite",this.fetchQuery(t)}prefetchInfiniteQuery(t){return this.fetchInfiniteQuery(t).then(r.ZT).catch(r.ZT)}ensureInfiniteQueryData(t){return t._type="infinite",this.ensureQueryData(t)}resumePausedMutations(){return f.N.isOnline()?this.#a.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#r}getMutationCache(){return this.#a}getDefaultOptions(){return this.#n}setDefaultOptions(t){this.#n=t}setQueryDefaults(t,e){this.#o.set((0,r.Ym)(t),{queryKey:t,defaultOptions:e})}getQueryDefaults(t){let e=[...this.#o.values()],s={};return e.forEach(e=>{(0,r.to)(t,e.queryKey)&&Object.assign(s,e.defaultOptions)}),s}setMutationDefaults(t,e){this.#u.set((0,r.Ym)(t),{mutationKey:t,defaultOptions:e})}getMutationDefaults(t){let e=[...this.#u.values()],s={};return e.forEach(e=>{(0,r.to)(t,e.mutationKey)&&Object.assign(s,e.defaultOptions)}),s}defaultQueryOptions(t){if(t._defaulted)return t;let e={...this.#n.queries,...this.getQueryDefaults(t.queryKey),...t,_defaulted:!0};return e.queryHash||(e.queryHash=(0,r.Rm)(e.queryKey,e)),void 0===e.refetchOnReconnect&&(e.refetchOnReconnect="always"!==e.networkMode),void 0===e.throwOnError&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.queryFn===r.CN&&(e.enabled=!1),e}defaultMutationOptions(t){return t?._defaulted?t:{...this.#n.mutations,...t?.mutationKey&&this.getMutationDefaults(t.mutationKey),...t,_defaulted:!0}}clear(){this.#r.clear(),this.#a.clear()}},y=s(8038),m=s(5925),g=s(2265);function v(t){let{children:e}=t,[s]=(0,g.useState)(()=>new p({defaultOptions:{queries:{retry:1,staleTime:3e4},mutations:{retry:0}}}));return(0,i.jsxs)(y.aH,{client:s,children:[e,(0,i.jsx)(m.x7,{position:"top-right",toastOptions:{duration:4e3,style:{background:"#1e1b4b",color:"#e0e7ff",border:"1px solid #4338ca"}}})]})}},3385:function(){},5975:function(t){t.exports={style:{fontFamily:"'__Inter_f367f3', '__Inter_Fallback_f367f3'",fontStyle:"normal"},className:"__className_f367f3",variable:"__variable_f367f3"}},622:function(t,e,s){"use strict";var i=s(2265),r=Symbol.for("react.element"),a=Symbol.for("react.fragment"),n=Object.prototype.hasOwnProperty,o=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function l(t,e,s){var i,a={},l=null,c=null;for(i in void 0!==s&&(l=""+s),void 0!==e.key&&(l=""+e.key),void 0!==e.ref&&(c=e.ref),e)n.call(e,i)&&!u.hasOwnProperty(i)&&(a[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps)void 0===a[i]&&(a[i]=e[i]);return{$$typeof:r,type:t,key:l,ref:c,props:a,_owner:o.current}}e.Fragment=a,e.jsx=l,e.jsxs=l},7437:function(t,e,s){"use strict";t.exports=s(622)},7749:function(t,e,s){"use strict";s.d(e,{A:function(){return u},z:function(){return l}});var i=s(300),r=s(7987),a=s(1640),n=s(9024);function o(t,{pages:e,pageParams:s}){let i=e.length-1;return e.length>0?t.getNextPageParam(e[i],e,s[i],s):void 0}var u=class extends n.F{#d;#f;#p;#y;#m;#g;#n;#v;constructor(t){super(),this.#v=!1,this.#n=t.defaultOptions,this.setOptions(t.options),this.observers=[],this.#m=t.client,this.#y=this.#m.getQueryCache(),this.queryKey=t.queryKey,this.queryHash=t.queryHash,this.#f=h(this.options),this.state=t.state??this.#f,this.scheduleGc()}get meta(){return this.options.meta}get queryType(){return this.#d}get promise(){return this.#g?.promise}setOptions(t){if(this.options={...this.#n,...t},t?._type&&(this.#d=t._type),this.updateGcTime(this.options.gcTime),this.state&&void 0===this.state.data){let t=h(this.options);void 0!==t.data&&(this.setState(c(t.data,t.dataUpdatedAt)),this.#f=t)}}optionalRemove(){this.observers.length||"idle"!==this.state.fetchStatus||this.#y.remove(this)}setData(t,e){let s=(0,i.oE)(this.state.data,t,this.options);return this.#b({data:s,type:"success",dataUpdatedAt:e?.updatedAt,manual:e?.manual}),s}setState(t){this.#b({type:"setState",state:t})}cancel(t){let e=this.#g?.promise;return this.#g?.cancel(t),e?e.then(i.ZT).catch(i.ZT):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return this.#f}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some(t=>!1!==(0,i.TD)(t.options.enabled,this))}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===i.CN||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0&&this.observers.some(t=>"static"===(0,i.KC)(t.options.staleTime,this))}isStale(){return this.getObserversCount()>0?this.observers.some(t=>t.getCurrentResult().isStale):void 0===this.state.data||this.state.isInvalidated}isStaleByTime(t=0){return void 0===this.state.data||"static"!==t&&(!!this.state.isInvalidated||!(0,i.Kp)(this.state.dataUpdatedAt,t))}onFocus(){let t=this.observers.find(t=>t.shouldFetchOnWindowFocus());t?.refetch({cancelRefetch:!1}),this.#g?.continue()}onOnline(){let t=this.observers.find(t=>t.shouldFetchOnReconnect());t?.refetch({cancelRefetch:!1}),this.#g?.continue()}addObserver(t){this.observers.includes(t)||(this.observers.push(t),this.clearGcTimeout(),this.#y.notify({type:"observerAdded",query:this,observer:t}))}removeObserver(t){this.observers.includes(t)&&(this.observers=this.observers.filter(e=>e!==t),this.observers.length||(this.#g&&(this.#v||this.#C()?this.#g.cancel({revert:!0}):this.#g.cancelRetry()),this.scheduleGc()),this.#y.notify({type:"observerRemoved",query:this,observer:t}))}getObserversCount(){return this.observers.length}#C(){return"paused"===this.state.fetchStatus&&"pending"===this.state.status}invalidate(){this.state.isInvalidated||this.#b({type:"invalidate"})}async fetch(t,e){var s;if("idle"!==this.state.fetchStatus&&this.#g?.status()!=="rejected"){if(void 0!==this.state.data&&e?.cancelRefetch)this.cancel({silent:!0});else if(this.#g)return this.#g.continueRetry(),this.#g.promise}if(t&&this.setOptions(t),!this.options.queryFn){let t=this.observers.find(t=>t.options.queryFn);t&&this.setOptions(t.options)}let r=new AbortController,n=t=>{Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(this.#v=!0,r.signal)})},u=()=>{let t=(0,i.cG)(this.options,e),s=(()=>{let t={client:this.#m,queryKey:this.queryKey,meta:this.meta};return n(t),t})();return(this.#v=!1,this.options.persister)?this.options.persister(t,s,this):t(s)},l=(()=>{let t={fetchOptions:e,options:this.options,queryKey:this.queryKey,client:this.#m,state:this.state,fetchFn:u};return n(t),t})(),c="infinite"===this.#d?(s=this.options.pages,{onFetch:(t,e)=>{let r=t.options,a=t.fetchOptions?.meta?.fetchMore?.direction,n=t.state.data?.pages||[],u=t.state.data?.pageParams||[],l={pages:[],pageParams:[]},c=0,h=async()=>{let e=!1,h=s=>{(0,i.I4)(s,()=>t.signal,()=>e=!0)},d=(0,i.cG)(t.options,t.fetchOptions),f=async(s,r,a)=>{if(e)return Promise.reject(t.signal.reason);if(null==r&&s.pages.length)return Promise.resolve(s);let n=(()=>{let e={client:t.client,queryKey:t.queryKey,pageParam:r,direction:a?"backward":"forward",meta:t.options.meta};return h(e),e})(),o=await d(n),{maxPages:u}=t.options,l=a?i.Ht:i.VX;return{pages:l(s.pages,o,u),pageParams:l(s.pageParams,r,u)}};if(a&&n.length){let t="backward"===a,e={pages:n,pageParams:u},s=(t?function(t,{pages:e,pageParams:s}){return e.length>0?t.getPreviousPageParam?.(e[0],e,s[0],s):void 0}:o)(r,e);l=await f(e,s,t)}else{let t=s??n.length;do{let t=0===c?u[0]??r.initialPageParam:o(r,l);if(c>0&&null==t)break;l=await f(l,t),c++}while(c<t)}return l};t.options.persister?t.fetchFn=()=>t.options.persister?.(h,{client:t.client,queryKey:t.queryKey,meta:t.options.meta,signal:t.signal},e):t.fetchFn=h}}):this.options.behavior;c?.onFetch(l,this),this.#p=this.state,("idle"===this.state.fetchStatus||this.state.fetchMeta!==l.fetchOptions?.meta)&&this.#b({type:"fetch",meta:l.fetchOptions?.meta}),this.#g=(0,a.Mz)({initialPromise:e?.initialPromise,fn:l.fetchFn,onCancel:t=>{t instanceof a.p8&&t.revert&&this.setState({...this.#p,fetchStatus:"idle"}),r.abort()},onFail:(t,e)=>{this.#b({type:"failed",failureCount:t,error:e})},onPause:()=>{this.#b({type:"pause"})},onContinue:()=>{this.#b({type:"continue"})},retry:l.options.retry,retryDelay:l.options.retryDelay,networkMode:l.options.networkMode,canRun:()=>!0});try{let t=await this.#g.start();if(void 0===t)throw Error(`${this.queryHash} data is undefined`);return this.setData(t),this.#y.config.onSuccess?.(t,this),this.#y.config.onSettled?.(t,this.state.error,this),t}catch(t){if(t instanceof a.p8){if(t.silent)return this.#g.promise;if(t.revert){if(void 0===this.state.data)throw t;return this.state.data}}throw this.#b({type:"error",error:t}),this.#y.config.onError?.(t,this),this.#y.config.onSettled?.(this.state.data,t,this),t}finally{this.scheduleGc()}}#b(t){this.state=(e=>{switch(t.type){case"failed":return{...e,fetchFailureCount:t.failureCount,fetchFailureReason:t.error};case"pause":return{...e,fetchStatus:"paused"};case"continue":return{...e,fetchStatus:"fetching"};case"fetch":return{...e,...l(e.data,this.options),fetchMeta:t.meta??null};case"success":let s={...e,...c(t.data,t.dataUpdatedAt),dataUpdateCount:e.dataUpdateCount+1,...!t.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return this.#p=t.manual?s:void 0,s;case"error":let i=t.error;return{...e,error:i,errorUpdateCount:e.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:e.fetchFailureCount+1,fetchFailureReason:i,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...e,isInvalidated:!0};case"setState":return{...e,...t.state}}})(this.state),r.Vr.batch(()=>{this.observers.forEach(t=>{t.onQueryUpdate()}),this.#y.notify({query:this,type:"updated",action:t})})}};function l(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:(0,a.Kw)(e.networkMode)?"fetching":"paused",...void 0===t&&{error:null,status:"pending"}}}function c(t,e){return{data:t,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function h(t){let e="function"==typeof t.initialData?t.initialData():t.initialData,s=void 0!==e,i=s?"function"==typeof t.initialDataUpdatedAt?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:s?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:s?"success":"pending",fetchStatus:"idle"}}},5925:function(t,e,s){"use strict";let i,r;s.d(e,{x7:function(){return td},ZP:function(){return tf}});var a,n=s(2265);let o={data:""},u=t=>{if("object"==typeof window){let e=(t?t.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return e.nonce=window.__nonce__,e.parentNode||(t||document.head).appendChild(e),e.firstChild}return t||o},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,h=/\n+/g,d=(t,e)=>{let s="",i="",r="";for(let a in t){let n=t[a];"@"==a[0]?"i"==a[1]?s=a+" "+n+";":i+="f"==a[1]?d(n,a):a+"{"+d(n,"k"==a[1]?"":e)+"}":"object"==typeof n?i+=d(n,e?e.replace(/([^,])+/g,t=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,e=>/&/.test(e)?e.replace(/&/g,t):t?t+" "+e:e)):a):null!=n&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=d.p?d.p(a,n):a+":"+n+";")}return s+(e&&r?e+"{"+r+"}":r)+i},f={},p=t=>{if("object"==typeof t){let e="";for(let s in t)e+=s+p(t[s]);return e}return t},y=(t,e,s,i,r)=>{var a;let n=p(t),o=f[n]||(f[n]=(t=>{let e=0,s=11;for(;e<t.length;)s=101*s+t.charCodeAt(e++)>>>0;return"go"+s})(n));if(!f[o]){let e=n!==t?t:(t=>{let e,s,i=[{}];for(;e=l.exec(t.replace(c,""));)e[4]?i.shift():e[3]?(s=e[3].replace(h," ").trim(),i.unshift(i[0][s]=i[0][s]||{})):i[0][e[1]]=e[2].replace(h," ").trim();return i[0]})(t);f[o]=d(r?{["@keyframes "+o]:e}:e,s?"":"."+o)}let u=s&&f.g?f.g:null;return s&&(f.g=f[o]),a=f[o],u?e.data=e.data.replace(u,a):-1===e.data.indexOf(a)&&(e.data=i?a+e.data:e.data+a),o},m=(t,e,s)=>t.reduce((t,i,r)=>{let a=e[r];if(a&&a.call){let t=a(s),e=t&&t.props&&t.props.className||/^go/.test(t)&&t;a=e?"."+e:t&&"object"==typeof t?t.props?"":d(t,""):!1===t?"":t}return t+i+(null==a?"":a)},"");function g(t){let e=this||{},s=t.call?t(e.p):t;return y(s.unshift?s.raw?m(s,[].slice.call(arguments,1),e.p):s.reduce((t,s)=>Object.assign(t,s&&s.call?s(e.p):s),{}):s,u(e.target),e.g,e.o,e.k)}g.bind({g:1});let v,b,C,w=g.bind({k:1});function O(t,e){let s=this||{};return function(){let i=arguments;function r(a,n){let o=Object.assign({},a),u=o.className||r.className;s.p=Object.assign({theme:b&&b()},o),s.o=/ *go\d+/.test(u),o.className=g.apply(s,i)+(u?" "+u:""),e&&(o.ref=n);let l=t;return t[0]&&(l=o.as||t,delete o.as),C&&l[0]&&C(o),v(l,o)}return e?e(r):r}}var x=t=>"function"==typeof t,q=(t,e)=>x(t)?t(e):t,S=(i=0,()=>(++i).toString()),D=()=>{if(void 0===r&&"u">typeof window){let t=matchMedia("(prefers-reduced-motion: reduce)");r=!t||t.matches}return r},P="default",E=(t,e)=>{let{toastLimit:s}=t.settings;switch(e.type){case 0:return{...t,toasts:[e.toast,...t.toasts].slice(0,s)};case 1:return{...t,toasts:t.toasts.map(t=>t.id===e.toast.id?{...t,...e.toast}:t)};case 2:let{toast:i}=e;return E(t,{type:t.toasts.find(t=>t.id===i.id)?1:0,toast:i});case 3:let{toastId:r}=e;return{...t,toasts:t.toasts.map(t=>t.id===r||void 0===r?{...t,dismissed:!0,visible:!1}:t)};case 4:return void 0===e.toastId?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(t=>t.id!==e.toastId)};case 5:return{...t,pausedAt:e.time};case 6:let a=e.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(t=>({...t,pauseDuration:t.pauseDuration+a}))}}},A=[],_={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},F={},k=(t,e=P)=>{F[e]=E(F[e]||_,t),A.forEach(([t,s])=>{t===e&&s(F[e])})},Q=t=>Object.keys(F).forEach(e=>k(t,e)),T=t=>Object.keys(F).find(e=>F[e].toasts.some(e=>e.id===t)),I=(t=P)=>e=>{k(e,t)},M={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},R=(t={},e=P)=>{let[s,i]=(0,n.useState)(F[e]||_),r=(0,n.useRef)(F[e]);(0,n.useEffect)(()=>(r.current!==F[e]&&i(F[e]),A.push([e,i]),()=>{let t=A.findIndex(([t])=>t===e);t>-1&&A.splice(t,1)}),[e]);let a=s.toasts.map(e=>{var s,i,r;return{...t,...t[e.type],...e,removeDelay:e.removeDelay||(null==(s=t[e.type])?void 0:s.removeDelay)||(null==t?void 0:t.removeDelay),duration:e.duration||(null==(i=t[e.type])?void 0:i.duration)||(null==t?void 0:t.duration)||M[e.type],style:{...t.style,...null==(r=t[e.type])?void 0:r.style,...e.style}}});return{...s,toasts:a}},j=(t,e="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...s,id:(null==s?void 0:s.id)||S()}),N=t=>(e,s)=>{let i=j(e,t,s);return I(i.toasterId||T(i.id))({type:2,toast:i}),i.id},U=(t,e)=>N("blank")(t,e);U.error=N("error"),U.success=N("success"),U.loading=N("loading"),U.custom=N("custom"),U.dismiss=(t,e)=>{let s={type:3,toastId:t};e?I(e)(s):Q(s)},U.dismissAll=t=>U.dismiss(void 0,t),U.remove=(t,e)=>{let s={type:4,toastId:t};e?I(e)(s):Q(s)},U.removeAll=t=>U.remove(void 0,t),U.promise=(t,e,s)=>{let i=U.loading(e.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof t&&(t=t()),t.then(t=>{let r=e.success?q(e.success,t):void 0;return r?U.success(r,{id:i,...s,...null==s?void 0:s.success}):U.dismiss(i),t}).catch(t=>{let r=e.error?q(e.error,t):void 0;r?U.error(r,{id:i,...s,...null==s?void 0:s.error}):U.dismiss(i)}),t};var K=1e3,$=(t,e="default")=>{let{toasts:s,pausedAt:i}=R(t,e),r=(0,n.useRef)(new Map).current,a=(0,n.useCallback)((t,e=K)=>{if(r.has(t))return;let s=setTimeout(()=>{r.delete(t),o({type:4,toastId:t})},e);r.set(t,s)},[]);(0,n.useEffect)(()=>{if(i)return;let t=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let i=(s.duration||0)+s.pauseDuration-(t-s.createdAt);if(i<0){s.visible&&U.dismiss(s.id);return}return setTimeout(()=>U.dismiss(s.id,e),i)});return()=>{r.forEach(t=>t&&clearTimeout(t))}},[s,i,e]);let o=(0,n.useCallback)(I(e),[e]),u=(0,n.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),l=(0,n.useCallback)((t,e)=>{o({type:1,toast:{id:t,height:e}})},[o]),c=(0,n.useCallback)(()=>{i&&o({type:6,time:Date.now()})},[i,o]),h=(0,n.useCallback)((t,e)=>{let{reverseOrder:i=!1,gutter:r=8,defaultPosition:a}=e||{},n=s.filter(e=>(e.position||a)===(t.position||a)&&e.height),o=n.findIndex(e=>e.id===t.id),u=n.filter((t,e)=>e<o&&t.visible).length;return n.filter(t=>t.visible).slice(...i?[u+1]:[0,u]).reduce((t,e)=>t+(e.height||0)+r,0)},[s]);return(0,n.useEffect)(()=>{s.forEach(t=>{if(t.dismissed)a(t.id,t.removeDelay);else{let e=r.get(t.id);e&&(clearTimeout(e),r.delete(t.id))}})},[s,a]),{toasts:s,handlers:{updateHeight:l,startPause:u,endPause:c,calculateOffset:h}}},H=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,V=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Z=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,z=O("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${H} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Z} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,G=O("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,B=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Y=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,X=O("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Y} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,W=O("div")`
  position: absolute;
`,J=O("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,tt=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,te=O("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${tt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ts=({toast:t})=>{let{icon:e,type:s,iconTheme:i}=t;return void 0!==e?"string"==typeof e?n.createElement(te,null,e):e:"blank"===s?null:n.createElement(J,null,n.createElement(G,{...i}),"loading"!==s&&n.createElement(W,null,"error"===s?n.createElement(z,{...i}):n.createElement(X,{...i})))},ti=t=>`
0% {transform: translate3d(0,${-200*t}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,tr=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*t}%,-1px) scale(.6); opacity:0;}
`,ta=O("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,tn=O("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,to=(t,e)=>{let s=t.includes("top")?1:-1,[i,r]=D()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ti(s),tr(s)];return{animation:e?`${w(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},tu=n.memo(({toast:t,position:e,style:s,children:i})=>{let r=t.height?to(t.position||e||"top-center",t.visible):{opacity:0},a=n.createElement(ts,{toast:t}),o=n.createElement(tn,{...t.ariaProps},q(t.message,t));return n.createElement(ta,{className:t.className,style:{...r,...s,...t.style}},"function"==typeof i?i({icon:a,message:o}):n.createElement(n.Fragment,null,a,o))});a=n.createElement,d.p=void 0,v=a,b=void 0,C=void 0;var tl=({id:t,className:e,style:s,onHeightUpdate:i,children:r})=>{let a=n.useCallback(e=>{if(e){let s=()=>{i(t,e.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(e,{subtree:!0,childList:!0,characterData:!0})}},[t,i]);return n.createElement("div",{ref:a,className:e,style:s},r)},tc=(t,e)=>{let s=t.includes("top"),i=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:D()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${e*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...i}},th=g`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,td=({reverseOrder:t,position:e="top-center",toastOptions:s,gutter:i,children:r,toasterId:a,containerStyle:o,containerClassName:u})=>{let{toasts:l,handlers:c}=$(s,a);return n.createElement("div",{"data-rht-toaster":a||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:u,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(s=>{let a=s.position||e,o=tc(a,c.calculateOffset(s,{reverseOrder:t,gutter:i,defaultPosition:e}));return n.createElement(tl,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?th:"",style:o},"custom"===s.type?q(s.message,s):r?r(s):n.createElement(tu,{toast:s,position:a}))}))},tf=U}},function(t){t.O(0,[966,971,938,744],function(){return t(t.s=526)}),_N_E=t.O()}]);