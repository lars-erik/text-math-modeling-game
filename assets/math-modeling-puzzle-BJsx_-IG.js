import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c}from"./generate-total-from-parts-4jr5fe1X.js";var l=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],u={quantities:{basePower:{variableName:`basePower`,label:`base power`},droneCount:{variableName:`droneCount`,label:`number of drones`},dronePower:{variableName:`dronePower`,label:`power per drone`},totalPower:{variableName:`totalPower`,label:`total power`}},nouns:{ship:{singular:`ship`,plural:`ships`},drone:{singular:`drone`,plural:`drones`}},units:{count:`drones`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=l[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`A ${e} uses ${t} ${n} for basic systems.`},countFact:{activeDrones:({count:e,noun:t})=>`It also powers ${e} identical active ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`The ship and its drones draw ${e} ${t} in total.`},question:{perDronePower:({noun:e})=>`How much power does one ${e} draw?`}}},d=[`null`,`én`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],f={en:u,nb:{quantities:{basePower:{variableName:`grunnEffekt`,label:`grunnleggende effekt`},droneCount:{variableName:`droneAntall`,label:`antall droner`},dronePower:{variableName:`droneEffekt`,label:`effekt per drone`},totalPower:{variableName:`totalEffekt`,label:`samlet effekt`}},nouns:{ship:{singular:`skip`,plural:`skip`},drone:{singular:`drone`,plural:`droner`}},units:{count:`droner`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=d[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`Et ${e} bruker ${t} ${n} til grunnleggende systemer.`},countFact:{activeDrones:({count:e,noun:t})=>`Det driver også ${e} identiske aktive ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`Skipet og dronene trekker til sammen ${e} ${t}.`},question:{perDronePower:({noun:e})=>`Hvor mye effekt trekker én ${e}?`}}}};function ee(e,t){let n=f[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function te(e,t,n){let r=f[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=ne(i,e.factId);switch(e.fragmentKey){case`baseFact.basicSystems`:return r.fragments.baseFact.basicSystems({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.power});case`countFact.activeDrones`:return r.fragments.countFact.activeDrones({count:r.formatNumber(t.value,!1),noun:re(r.nouns[e.nounKey],t.value),isSingular:t.value===1});case`totalFact.combinedDraw`:return r.fragments.totalFact.combinedDraw({value:String(t.value),unit:r.units.power})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.perDronePower({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`gaming.drone-power`,storySeed:t.seed}}}function ne(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function re(e,t){return t===1?e.singular:e.plural}function ie(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`gaming.drone-power`,seed:t,sentences:[{fragmentKey:`baseFact.basicSystems`,factId:p(n,`base`),nounKey:`ship`},{fragmentKey:`countFact.activeDrones`,factId:p(n,`count`),nounKey:`drone`},{fragmentKey:`totalFact.combinedDraw`,factId:p(n,`total`)}],question:{fragmentKey:`question.perDronePower`,factId:p(n,`per-item`),nounKey:`drone`}}}function p(e,t){let n=e.get(t);if(n===void 0)throw Error(`Drone-power story needs a fact with role ${t}.`);return n}var ae={base:{themeQuantityId:`basePower`,unitKey:`power`},count:{themeQuantityId:`droneCount`,unitKey:`count`},"per-item":{themeQuantityId:`dronePower`,unitKey:`powerPerDrone`},total:{themeQuantityId:`totalPower`,unitKey:`power`}},oe={id:`gaming.drone-power`,present({problem:e,locale:t,storySeed:n}){let r=f[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=ae[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=te(i,ie(i,n),t);return{themeId:`gaming.drone-power`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:ee(i,t)}}},se=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],ce={quantities:{startingFollowers:{variableName:`startingFollowers`,label:`starting followers`},promotedPostCount:{variableName:`promotedPostCount`,label:`number of promoted posts`},followersPerPost:{variableName:`followersPerPost`,label:`followers per post`},finalFollowers:{variableName:`finalFollowers`,label:`final followers`}},nouns:{creator:{singular:`creator`,plural:`creators`},post:{singular:`post`,plural:`posts`}},units:{followers:`followers`,posts:`posts`,followersPerPost:`followers/post`},formatNumber(e,t){return se[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`A ${e} starts with ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`Each of ${e} promoted ${t} gains the same number of followers.`},totalFact:{finalAudience:({value:e,unit:t})=>`The creator finishes with ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`How many followers does each ${e} gain?`}}},le=[`null`,`ett`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],m={en:ce,nb:{quantities:{startingFollowers:{variableName:`startFoelgere`,label:`følgere ved start`},promotedPostCount:{variableName:`promoterteInnlegg`,label:`antall promoterte innlegg`},followersPerPost:{variableName:`foelgerePerInnlegg`,label:`følgere per innlegg`},finalFollowers:{variableName:`sluttFoelgere`,label:`følgere til slutt`}},nouns:{creator:{singular:`innholdsskaper`,plural:`innholdsskapere`},post:{singular:`innlegg`,plural:`innlegg`}},units:{followers:`følgere`,posts:`innlegg`,followersPerPost:`følgere/innlegg`},formatNumber(e,t){return le[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`En ${e} starter med ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`${e.charAt(0).toUpperCase()}${e.slice(1)} promoterte ${t} gir like mange nye følgere hver.`},totalFact:{finalAudience:({value:e,unit:t})=>`Innholdsskaperen ender med ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`Hvor mange følgere gir hvert ${e}?`}}}};function ue(e,t){let n=m[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function de(e,t,n){let r=m[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=fe(i,e.factId);switch(e.fragmentKey){case`baseFact.startingAudience`:return r.fragments.baseFact.startingAudience({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.followers});case`countFact.promotedPosts`:return r.fragments.countFact.promotedPosts({count:r.formatNumber(t.value,!1),noun:t.value===1?r.nouns[e.nounKey].singular:r.nouns[e.nounKey].plural});case`totalFact.finalAudience`:return r.fragments.totalFact.finalAudience({value:String(t.value),unit:r.units.followers})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.followersPerPost({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`creator.followers`,storySeed:t.seed}}}function fe(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function pe(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`creator.followers`,seed:t,sentences:[{fragmentKey:`baseFact.startingAudience`,factId:h(n,`base`),nounKey:`creator`},{fragmentKey:`countFact.promotedPosts`,factId:h(n,`count`),nounKey:`post`},{fragmentKey:`totalFact.finalAudience`,factId:h(n,`total`)}],question:{fragmentKey:`question.followersPerPost`,factId:h(n,`per-item`),nounKey:`post`}}}function h(e,t){let n=e.get(t);if(n===void 0)throw Error(`Creator-followers story needs a fact with role ${t}.`);return n}var me={base:{themeQuantityId:`startingFollowers`,unitKey:`followers`},count:{themeQuantityId:`promotedPostCount`,unitKey:`posts`},"per-item":{themeQuantityId:`followersPerPost`,unitKey:`followersPerPost`},total:{themeQuantityId:`finalFollowers`,unitKey:`followers`}},he={"gaming.drone-power":oe,"creator.followers":{id:`creator.followers`,present({problem:e,locale:t,storySeed:n}){let r=m[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=me[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=de(i,pe(i,n),t);return{themeId:`creator.followers`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:ue(i,t)}}}};function ge(e){return[{id:`matching`,relation:e.relation},{id:`factor-into-group`,relation:_e(e.relation)}]}function _e(e){return{kind:`equation`,left:e.left,right:ve(e.right)}}function ve(e){if(e.kind!==`add`||e.right.kind!==`multiply`||e.left.kind===`multiply`)return e;let t=e.right;return{kind:`multiply`,left:t.left,right:{kind:`add`,left:e.left,right:t.right}}}var g=globalThis,_=g.ShadowRoot&&(g.ShadyCSS===void 0||g.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,v=Symbol(),ye=new WeakMap,be=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==v)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(_&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=ye.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&ye.set(t,e))}return e}toString(){return this.cssText}},xe=e=>new be(typeof e==`string`?e:e+``,void 0,v),y=(e,...t)=>new be(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,v),Se=(e,t)=>{if(_)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=g.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},b=_?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return xe(t)})(e):e,{is:Ce,defineProperty:we,getOwnPropertyDescriptor:Te,getOwnPropertyNames:Ee,getOwnPropertySymbols:De,getPrototypeOf:Oe}=Object,x=globalThis,ke=x.trustedTypes,Ae=ke?ke.emptyScript:``,je=x.reactiveElementPolyfillSupport,S=(e,t)=>e,C={toAttribute(e,t){switch(t){case Boolean:e=e?Ae:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Me=(e,t)=>!Ce(e,t),Ne={attribute:!0,type:String,converter:C,reflect:!1,useDefault:!1,hasChanged:Me};Symbol.metadata??=Symbol(`metadata`),x.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ne){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&we(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=Te(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ne}static _$Ei(){if(this.hasOwnProperty(S(`elementProperties`)))return;let e=Oe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(S(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S(`properties`))){let e=this.properties,t=[...Ee(e),...De(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(b(e))}else e!==void 0&&t.push(b(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Se(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?C:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?C:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??Me)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:`open`},w[S(`elementProperties`)]=new Map,w[S(`finalized`)]=new Map,je?.({ReactiveElement:w}),(x.reactiveElementVersions??=[]).push(`2.1.2`);var T=globalThis,Pe=e=>e,E=T.trustedTypes,D=E?E.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,O=`$lit$`,k=`lit$${Math.random().toFixed(9).slice(2)}$`,A=`?`+k,Fe=`<${A}>`,j=document,M=()=>j.createComment(``),N=e=>e===null||typeof e!=`object`&&typeof e!=`function`,P=Array.isArray,Ie=e=>P(e)||typeof e?.[Symbol.iterator]==`function`,F=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Le=/-->/g,L=/>/g,R=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),z=/'/g,B=/"/g,V=/^(?:script|style|textarea|title)$/i,H=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),U=Symbol.for(`lit-noChange`),W=Symbol.for(`lit-nothing`),Re=new WeakMap,G=j.createTreeWalker(j,129);function ze(e,t){if(!P(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return D===void 0?t:D.createHTML(t)}var Be=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=I;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===I?c[1]===`!--`?o=Le:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=R):(V.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=R):o=L:o===R?c[0]===`>`?(o=i??I,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?R:c[3]===`"`?B:z):o===B||o===z?o=R:o===Le||o===L?o=I:(o=R,i=void 0);let d=o===R&&e[t+1].startsWith(`/>`)?` `:``;a+=o===I?n+Fe:l>=0?(r.push(s),n.slice(0,l)+O+n.slice(l)+k+d):n+k+(l===-2?t:d)}return[ze(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},K=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Be(t,n);if(this.el=e.createElement(l,r),G.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=G.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(O)){let t=u[o++],n=i.getAttribute(e).split(k),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?He:r[1]===`?`?Ue:r[1]===`@`?We:Y}),i.removeAttribute(e)}else e.startsWith(k)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(V.test(i.tagName)){let e=i.textContent.split(k),t=e.length-1;if(t>0){i.textContent=E?E.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],M()),G.nextNode(),c.push({type:2,index:++a});i.append(e[t],M())}}}else if(i.nodeType===8){if(i.data===A)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(k,e+1))!==-1;)c.push({type:7,index:a}),e+=k.length-1}}a++}}static createElement(e,t){let n=j.createElement(`template`);return n.innerHTML=e,n}};function q(e,t,n=e,r){if(t===U)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=N(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=q(e,i._$AS(e,t.values),i,r)),t}var Ve=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??j).importNode(t,!0);G.currentNode=r;let i=G.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new J(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Ge(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=G.nextNode(),a++)}return G.currentNode=j,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},J=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=q(this,e,t),N(e)?e===W||e==null||e===``?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==U&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Ie(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=K.createElement(ze(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ve(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Re.get(e.strings);return t===void 0&&Re.set(e.strings,t=new K(e)),t}k(t){P(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(M()),this.O(M()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=Pe(e).nextSibling;Pe(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Y=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=W}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=q(this,e,t,0),a=!N(e)||e!==this._$AH&&e!==U,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=q(this,r[n+o],t,o),s===U&&(s=this._$AH[o]),a||=!N(s)||s!==this._$AH[o],s===W?e=W:e!==W&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},He=class extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}},Ue=class extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}},We=class extends Y{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=q(this,e,t,0)??W)===U)return;let n=this._$AH,r=e===W&&n!==W||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==W&&(n===W||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ge=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){q(this,e)}},Ke=T.litHtmlPolyfillSupport;Ke?.(K,J),(T.litHtmlVersions??=[]).push(`3.3.3`);var qe=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new J(t.insertBefore(M(),e),e,void 0,n??{})}return i._$AI(e),i},X=globalThis,Z=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};Z._$litElement$=!0,Z.finalized=!0,X.litElementHydrateSupport?.({LitElement:Z});var Je=X.litElementPolyfillSupport;Je?.({LitElement:Z}),(X.litElementVersions??=[]).push(`4.2.2`);function Ye(e){return Qe(e,Ze(e))}function Xe(t){let n=rt(t),{state:r,feedback:i,submission:a}=e[t.modeId].submit({problem:t.problem,locale:t.locale,answer:t.answer,names:n.learnerNames});return Qe(t,{state:r,feedback:i,submission:a})}function Ze(t){return e[t.modeId].start({problem:t.problem,locale:t.locale})}function Qe(e,t){let n=rt(e),r=et(n);return{screen:$e(e,t.state,r),context:{locale:e.locale,themeId:n.themeId,story:n.story.text,quantities:r,replay:tt(e,n)},submission:t.submission,feedback:t.feedback}}function $e(e,t,n){let i=r[e.locale];switch(t.modeId){case`story-to-quantities`:return{modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:i.storyToQuantities.prompt,quantities:n},input:t.input};case`quantities-to-named-equation`:return{modeId:`quantities-to-named-equation`,source:{kind:`quantities`,quantities:n},target:t.target,input:t.input}}}function et(e){return e.facts.map(e=>({id:e.canonicalId,themeQuantityId:e.themeQuantityId,label:e.label,variableName:e.variableName,displayValue:e.visibility===`known`?`${e.value} ${e.unit}`:`?`,role:e.role,given:e.visibility===`known`&&e.value!==void 0?{kind:`known`,value:e.value}:{kind:`hidden`}}))}function tt(e,t){return e.problem.replay?{...e.problem.replay,locale:e.locale,themeId:t.themeId,storySeed:t.story.storySeed}:void 0}function nt(e,t,n,r){let i=he[e];if(i===void 0)throw Error(`Unknown theme ${e}.`);return i.present({problem:t,locale:n,storySeed:r})}function rt(e){return nt(e.themeId,e.problem,e.locale,e.storySeed??e.problem.replay?.seed??0)}function it(e,t){return at(ge(e),t)}function at(e,t){let n=new Map(t.facts.map(e=>[e.canonicalId,e.variableName]));return e.map(e=>({id:e.id,label:ot(e.relation,n),relation:e.relation}))}function ot(e,t){return`${Q(e.left,t)} = ${Q(e.right,t)}`}function Q(e,t){switch(e.kind){case`literal`:return String(e.value);case`quantity`:return ct(t,e.id);case`add`:return st(e.left,e.right,`+`,t);case`multiply`:return st(e.left,e.right,`*`,t)}}function st(e,t,n,r){let i=e=>n===`*`&&e.kind===`add`?`(${Q(e,r)})`:Q(e,r);return`${i(e)} ${n} ${i(t)}`}function ct(e,t){let n=e.get(t);if(n===void 0)throw Error(`No theme name for canonical quantity ${t}.`);return n}var lt=class extends Z{static properties={choices:{attribute:!1},selectedChoiceId:{attribute:!1},legend:{attribute:!1},checkLabel:{attribute:!1}};static styles=y`
    :host {
      display: block;
      min-width: 0;
    }

    * {
      box-sizing: border-box;
    }

    form,
    fieldset {
      display: grid;
      gap: 0.5rem;
      min-width: 0;
    }

    fieldset {
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-block-end: 0.5rem;
      font-weight: 700;
    }

    label {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      min-width: 0;
      padding: 0.7rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #fff;
      overflow-wrap: anywhere;
      cursor: pointer;
    }

    label:has(input:checked) {
      border-color: #285f78;
      background: #edf5f8;
    }

    input {
      flex: 0 0 auto;
      width: 1.15rem;
      height: 1.15rem;
      margin: 0.15rem 0 0;
      accent-color: #285f78;
    }

    button {
      justify-self: start;
      min-height: 2.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 30rem) {
      button {
        width: 100%;
      }
    }
  `;constructor(){super(),this.choices=[],this.selectedChoiceId=void 0,this.legend=`Choose the named equation`,this.checkLabel=`Check`}render(){return H`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.choices.map(e=>H`
              <div>
                <label>
                  <input
                    type="radio"
                    name="named-equation-choice"
                    value=${e.id}
                    .checked=${e.id===this.selectedChoiceId}
                    required
                  />
                  ${e.label}
                </label>
              </div>
            `)}
        </fieldset>
        <button type="submit">${this.checkLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation-choice`),n=this.choices.find(e=>e.id===t);n!==void 0&&(this.selectedChoiceId=n.id,this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`relation-choice`,choiceId:n.id,label:n.label,relation:n.relation}})))}};customElements.get(`named-equation-choice-input`)===void 0&&customElements.define(`named-equation-choice-input`,lt);var ut=class extends Z{static properties={value:{type:String},inputLabel:{attribute:!1},checkLabel:{attribute:!1}};static styles=y`
    :host {
      display: block;
      min-width: 0;
    }

    * {
      box-sizing: border-box;
    }

    form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.5rem;
      min-width: 0;
    }

    label {
      grid-column: 1 / -1;
      font-weight: 700;
    }

    input {
      width: 100%;
      min-width: 0;
      min-height: 2.75rem;
      padding: 0.55rem 0.7rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      font: inherit;
    }

    button {
      min-height: 2.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 30rem) {
      form {
        grid-template-columns: minmax(0, 1fr);
      }

      button {
        width: 100%;
      }
    }
  `;constructor(){super(),this.value=``,this.inputLabel=`Named equation`,this.checkLabel=`Check`}render(){return H`
      <form @submit=${this.handleSubmit}>
        <label for="named-equation">${this.inputLabel}</label>
        <input
          id="named-equation"
          name="named-equation"
          type="text"
          .value=${this.value}
          required
        />
        <button type="submit">${this.checkLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation`);typeof t==`string`&&this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`text`,input:t}}))}};customElements.get(`named-equation-text-input`)===void 0&&customElements.define(`named-equation-text-input`,ut);var $={"multiple-choice":{label:`Multiple choice`,render:({definition:e,screen:t,resources:n})=>H`
      <named-equation-choice-input
        .choices=${e.choices}
        .selectedChoiceId=${t.submission?.kind===`named-equation`?t.submission.choiceId:void 0}
        .legend=${n.quantitiesToNamedEquation.choiceLegend}
        .checkLabel=${n.controls.check}
      ></named-equation-choice-input>
    `},text:{label:`Text input`,render:({screen:e,resources:t})=>H`
      <named-equation-text-input
        .value=${e.submission?.kind===`named-equation`&&e.submission.answerKind===`text`?e.submission.input:``}
        .inputLabel=${t.quantitiesToNamedEquation.inputLabel}
        .checkLabel=${t.controls.check}
      ></named-equation-text-input>
    `}};function dt(e){return Object.hasOwn($,e)}var ft=class extends Z{static properties={screen:{attribute:!1},knownLegend:{attribute:!1},unknownLegend:{attribute:!1},checkLabel:{attribute:!1}};static styles=y`
    :host {
      display: block;
      min-width: 0;
    }

    * {
      box-sizing: border-box;
    }

    form {
      display: grid;
      gap: 1rem;
      min-width: 0;
    }

    fieldset {
      display: grid;
      gap: 0.5rem;
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-block-end: 0.5rem;
      font-weight: 700;
    }

    label {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      min-width: 0;
      padding: 0.7rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #fff;
      overflow-wrap: anywhere;
      cursor: pointer;
    }

    label:has(input:checked) {
      border-color: #285f78;
      background: #edf5f8;
    }

    input {
      flex: 0 0 auto;
      width: 1.15rem;
      height: 1.15rem;
      margin: 0.15rem 0 0;
      accent-color: #285f78;
    }

    button {
      justify-self: start;
      min-height: 2.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 30rem) {
      button {
        width: 100%;
      }
    }
  `;constructor(){super(),this.screen={modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:``,quantities:[]},input:{kind:`quantity-selection`,knownIds:[]}},this.knownLegend=``,this.unknownLegend=``,this.checkLabel=``}render(){return H`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.knownLegend}</legend>
          ${this.screen.target.quantities.map(e=>H`
              <label>
                <input
                  type="checkbox"
                  name="known-quantity"
                  value=${e.id}
                  .checked=${this.screen.input.knownIds.includes(e.id)}
                />
                ${e.label}: ${e.displayValue}
              </label>
            `)}
        </fieldset>
        <fieldset>
          <legend>${this.unknownLegend}</legend>
          ${this.screen.target.quantities.map(e=>H`
              <label>
                <input
                  type="radio"
                  name="unknown-quantity"
                  value=${e.id}
                  .checked=${this.screen.input.unknownId===e.id}
                  required
                />
                ${e.label}
              </label>
            `)}
        </fieldset>
        <button type="submit">${this.checkLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`unknown-quantity`);if(typeof n!=`string`)return;let r={knownIds:t.getAll(`known-quantity`).filter(e=>typeof e==`string`),unknownId:n};this.dispatchEvent(new CustomEvent(`puzzle-quantity-selection`,{bubbles:!0,composed:!0,detail:r}))}};customElements.get(`story-quantities-input`)===void 0&&customElements.define(`story-quantities-input`,ft);var pt=class extends Z{static properties={heading:{type:String},sourceLabel:{attribute:`source-label`,type:String},targetLabel:{attribute:`target-label`,type:String},feedbackLabel:{attribute:`feedback-label`,type:String},prompt:{type:String},feedback:{type:String},replayLabel:{attribute:`replay-label`,type:String},hasReplay:{attribute:`has-replay`,type:Boolean}};static styles=y`
    :host {
      --border: #c5cbd1;
      --surface: #ffffff;
      --surface-muted: #f3f5f6;
      --text: #202428;
      --text-muted: #596168;
      --accent: #285f78;
      display: block;
      min-width: 0;
      color: var(--text);
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      line-height: 1.5;
    }

    * {
      box-sizing: border-box;
    }

    main {
      width: min(100%, 70rem);
      min-width: 0;
      margin: 0 auto;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      background: var(--surface-muted);
      box-shadow: 0 0.25rem 1rem rgb(25 35 45 / 8%);
      overflow: hidden;
    }

    header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }

    .settings {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface-muted);
    }

    h1,
    h2,
    p {
      margin-block-start: 0;
    }

    h1 {
      margin-block-end: 0;
      font-size: clamp(1.35rem, 4vw, 2rem);
      line-height: 1.2;
    }

    h2 {
      margin-block-end: 0.75rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .language {
      flex: 0 0 auto;
    }

    .representations {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      min-width: 0;
    }

    section {
      min-width: 0;
      padding: 1.5rem;
      background: var(--surface);
    }

    .source {
      border-right: 1px solid var(--border);
    }

    .prompt {
      color: var(--text-muted);
    }

    .feedback {
      border-top: 1px solid var(--border);
      background: var(--surface-muted);
    }

    [role='status'] {
      min-height: 1.5em;
      margin-block-end: 0;
      overflow-wrap: anywhere;
    }

    details {
      padding: 0.75rem 1.5rem;
      border-top: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    summary {
      cursor: pointer;
      font-weight: 600;
    }

    @media (max-width: 47.99rem) {
      main {
        border-right: 0;
        border-left: 0;
        border-radius: 0;
      }

      header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .settings {
        padding: 1rem;
      }

      .language {
        width: 100%;
      }

      .representations {
        grid-template-columns: minmax(0, 1fr);
      }

      section {
        padding: 1rem;
      }

      .source {
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }

      details {
        padding-inline: 1rem;
      }
    }
  `;constructor(){super(),this.heading=``,this.sourceLabel=``,this.targetLabel=``,this.feedbackLabel=``,this.prompt=``,this.feedback=``,this.replayLabel=``,this.hasReplay=!1}render(){return H`
      <main aria-labelledby="puzzle-heading">
        <header>
          <h1 id="puzzle-heading">${this.heading}</h1>
          <div class="language"><slot name="language"></slot></div>
        </header>

        <div class="settings"><slot name="settings"></slot></div>

        <div class="representations">
          <section class="source" aria-labelledby="source-heading">
            <h2 id="source-heading">${this.sourceLabel}</h2>
            <slot name="source"></slot>
          </section>

          <section class="target" aria-labelledby="target-heading">
            <h2 id="target-heading">${this.targetLabel}</h2>
            <p class="prompt">${this.prompt}</p>
            <slot name="input"></slot>
          </section>
        </div>

        <section class="feedback" aria-labelledby="feedback-heading">
          <h2 id="feedback-heading">${this.feedbackLabel}</h2>
          <p role="status" aria-live="polite">${this.feedback}</p>
        </section>

        ${this.hasReplay?H`
              <details>
                <summary>${this.replayLabel}</summary>
                <slot name="replay"></slot>
              </details>
            `:null}
      </main>
    `}};customElements.get(`puzzle-shell`)===void 0&&customElements.define(`puzzle-shell`,pt);var mt=class extends Z{static properties={seed:{type:Number},themeId:{attribute:`theme-id`,type:String},modeId:{attribute:`mode-id`,type:String},locale:{type:String},menuLabel:{attribute:!1},scenarioLabel:{attribute:!1},dronePowerLabel:{attribute:!1},creatorFollowersLabel:{attribute:!1},taskLabel:{attribute:!1},storyToQuantitiesLabel:{attribute:!1},quantitiesToNamedEquationLabel:{attribute:!1},seedLabel:{attribute:!1},showLabel:{attribute:!1}};static styles=y`
    :host {
      display: block;
      min-width: 0;
    }
    * {
      box-sizing: border-box;
    }
    form {
      display: flex;
      align-items: end;
      gap: 0.75rem;
      min-width: 0;
    }
    label {
      display: grid;
      flex: 1 1 12rem;
      gap: 0.25rem;
      min-width: 0;
      color: #596168;
      font-size: 0.875rem;
      font-weight: 600;
    }
    select,
    input,
    button {
      min-height: 2.75rem;
      border-radius: 0.35rem;
      font: inherit;
    }
    select,
    input {
      width: 100%;
      min-width: 0;
      padding: 0.55rem 0.7rem;
      border: 1px solid #8d969e;
      background: #fff;
      color: #202428;
    }
    button {
      flex: 0 0 auto;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      background: #285f78;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }
    @media (max-width: 40rem) {
      form {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
      }
      button {
        width: 100%;
      }
    }
  `;constructor(){super(),this.seed=17,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.locale=`en`,this.menuLabel=`Puzzle menu`,this.scenarioLabel=`Scenario`,this.dronePowerLabel=`Spaceship and drones`,this.creatorFollowersLabel=`Creator and followers`,this.taskLabel=`Task`,this.storyToQuantitiesLabel=`Story to quantities`,this.quantitiesToNamedEquationLabel=`Quantities to named equation`,this.seedLabel=`Seed`,this.showLabel=`Show puzzle`}render(){return H`
      <form aria-label=${this.menuLabel} @submit=${this.handleSubmit}>
        <label>
          ${this.scenarioLabel}
          <select name="scenario" .value=${this.themeId}>
            <option value="gaming.drone-power">
              ${this.dronePowerLabel}
            </option>
            <option value="creator.followers">
              ${this.creatorFollowersLabel}
            </option>
          </select>
        </label>
        <label>
          ${this.taskLabel}
          <select name="task" .value=${this.modeId}>
            <option value="story-to-quantities">
              ${this.storyToQuantitiesLabel}
            </option>
            <option value="quantities-to-named-equation">
              ${this.quantitiesToNamedEquationLabel}
            </option>
          </select>
        </label>
        <label>
          ${this.seedLabel}
          <input
            name="seed"
            type="number"
            min="0"
            max=${o}
            step="1"
            .value=${String(this.seed)}
            required
          />
        </label>
        <button type="submit">${this.showLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),r=t.get(`scenario`),i=t.get(`task`),o=Number(t.get(`seed`));typeof r==`string`&&s(r)&&typeof i==`string`&&a(i)&&Number.isInteger(o)&&this.dispatchEvent(new CustomEvent(n,{bubbles:!0,composed:!0,detail:{seed:o,themeId:r,modeId:i,locale:this.locale}}))}};customElements.get(`puzzle-menu`)===void 0&&customElements.define(`puzzle-menu`,mt);var ht=class extends Z{static properties={seed:{type:String},themeId:{attribute:`theme`,type:String},modeId:{attribute:`mode`,type:String},inputMode:{attribute:`input-mode`,reflect:!0,type:String},locale:{reflect:!0,type:String},screen:{state:!0}};static styles=y`
    :host {
      display: block;
      min-width: 0;
      padding: clamp(0rem, 3vw, 2rem);
    }
    * {
      box-sizing: border-box;
    }
    label,
    nav,
    ul,
    dl {
      min-width: 0;
    }
    .language-control {
      display: grid;
      gap: 0.25rem;
      color: #596168;
      font-size: 0.875rem;
      font-weight: 600;
    }
    select {
      min-height: 2.75rem;
      max-width: 100%;
      padding: 0.55rem 2rem 0.55rem 0.75rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      background: #fff;
      color: #202428;
      font: inherit;
    }
    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-block-end: 1rem;
    }
    nav button {
      min-height: 2.75rem;
      padding: 0.55rem 0.85rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      background: #fff;
      color: #202428;
      font: inherit;
      cursor: pointer;
    }
    nav button[aria-pressed='true'] {
      border-color: #285f78;
      background: #dcebf2;
      font-weight: 700;
    }
    .quantity-list {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .quantity-list li {
      padding: 0.65rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #f7f8f9;
      overflow-wrap: anywhere;
    }
    .replay-list {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 0.25rem 0.75rem;
      margin-block-end: 0;
    }
    .replay-list dt {
      font-weight: 600;
    }
    .replay-list dd {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
    }
    @media (max-width: 47.99rem) {
      :host {
        padding: 0;
      }
    }
  `;constructor(){super(),this.seed=`17`,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.inputMode=`text`,this.locale=`en`,this.screen=void 0,this.generatedProblem=gt(17)}willUpdate(e){e.has(`seed`)&&(this.generatedProblem=gt(Number(this.seed))),(e.has(`seed`)||e.has(`themeId`)||e.has(`modeId`)||e.has(`locale`))&&(this.screen=this.composeCurrentScreen())}composeCurrentScreen(){if(s(this.themeId)&&t(this.locale))return Ye({problem:this.generatedProblem,themeId:this.themeId,modeId:a(this.modeId)?this.modeId:`story-to-quantities`,locale:this.locale,storySeed:Number(this.seed)})}render(){if(!s(this.themeId))return H`<p role="alert">
        Unknown scenario ${JSON.stringify(this.themeId)}.
      </p>`;if(!a(this.modeId))return H`<p role="alert">
        Unknown task ${JSON.stringify(this.modeId)}.
      </p>`;if(!t(this.locale))return H`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;if(this.screen===void 0)return H`<p role="alert">Puzzle screen is unavailable.</p>`;let e=this.screen,n=r[this.locale],i=e.screen.modeId===`story-to-quantities`?n.storyToQuantities.heading:n.quantitiesToNamedEquation.heading;return this.renderShell({locale:this.locale,heading:i,prompt:e.screen.target.prompt,feedback:e.feedback?.message??``,replay:e.context.replay,source:e.screen.modeId===`story-to-quantities`?H`<p>${e.context.story}</p>`:H`<p>${e.context.story}</p>
              <ul class="quantity-list">
                ${e.context.quantities.map(e=>H`<li>
                    ${e.variableName} =
                    ${e.given.kind===`known`?e.given.value:`?`}
                  </li>`)}
              </ul>`,input:e.screen.modeId===`story-to-quantities`?H`<div @puzzle-quantity-selection=${this.handleQuantitySelection}>
              <story-quantities-input
                .screen=${e.screen}
                .knownLegend=${n.storyToQuantities.knownLegend}
                .unknownLegend=${n.storyToQuantities.unknownLegend}
                .checkLabel=${n.controls.check}
              ></story-quantities-input>
            </div>`:this.renderNamedEquationInput(this.locale)})}renderNamedEquationInput(e){if(!dt(this.inputMode))return H`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;let t=this.screen;if(t===void 0||!s(this.themeId))return H``;let n=r[e],i=$[this.inputMode],a=it(this.generatedProblem,nt(this.themeId,this.generatedProblem,e,Number(this.seed)));return H`<div @puzzle-answer=${this.handleAnswer}>
      <nav aria-label=${n.controls.inputMode}>
        ${Object.keys($).map(e=>H`<button
            type="button"
            aria-pressed=${this.inputMode===e}
            @click=${()=>this.selectInputMode(e)}
          >
            ${e===`text`?n.controls.textInput:n.controls.multipleChoice}
          </button>`)}
      </nav>
      ${i.render({definition:{choices:a},screen:{...t,submission:t.submission},resources:n})}
    </div>`}handleAnswer(e){this.submitAnswer(e.detail)}submitAnswer(e){s(this.themeId)&&a(this.modeId)&&t(this.locale)&&(this.screen=Xe({problem:this.generatedProblem,themeId:this.themeId,modeId:this.modeId,locale:this.locale,storySeed:Number(this.seed),answer:e}))}selectInputMode(e){this.inputMode=e,this.screen=this.composeCurrentScreen()}handleQuantitySelection(e){this.submitAnswer(e.detail)}handleLocaleChange(e){if(e.currentTarget instanceof HTMLSelectElement&&t(e.currentTarget.value)){let t=e.currentTarget.value;this.locale=t,this.requestApplicationState({locale:t})}}requestApplicationState(e){this.dispatchEvent(new CustomEvent(n,{bubbles:!0,composed:!0,detail:{seed:Number(this.seed),themeId:s(this.themeId)?this.themeId:`gaming.drone-power`,modeId:a(this.modeId)?this.modeId:`story-to-quantities`,locale:e.locale}}))}renderShell({locale:e,heading:t,prompt:n,source:i,input:a,feedback:o,replay:s}){let c=r[e];return H`
      <puzzle-shell
        .heading=${t}
        .sourceLabel=${c.common.source}
        .targetLabel=${c.common.target}
        .feedbackLabel=${c.common.feedback}
        .prompt=${n}
        .feedback=${o}
        .replayLabel=${c.common.replay}
        .hasReplay=${s!==void 0}
      >
        <label slot="language" class="language-control">
          ${c.language.label}
          <select .value=${e} @change=${this.handleLocaleChange}>
            <option value="en">${c.language.en}</option>
            <option value="nb">${c.language.nb}</option>
          </select>
        </label>
        <puzzle-menu
          slot="settings"
          .seed=${Number(this.seed)}
          .themeId=${this.themeId}
          .modeId=${this.modeId}
          .locale=${e}
          .menuLabel=${c.puzzleMenu.label}
          .scenarioLabel=${c.puzzleMenu.scenario}
          .dronePowerLabel=${c.puzzleMenu.dronePower}
          .creatorFollowersLabel=${c.puzzleMenu.creatorFollowers}
          .taskLabel=${c.puzzleMenu.task}
          .storyToQuantitiesLabel=${c.puzzleMenu.storyToQuantities}
          .quantitiesToNamedEquationLabel=${c.puzzleMenu.quantitiesToNamedEquation}
          .seedLabel=${c.puzzleMenu.seed}
          .showLabel=${c.puzzleMenu.show}
        ></puzzle-menu>
        <div slot="source">${i}</div>
        <div slot="input">${a}</div>
        ${s===void 0?null:H`<dl slot="replay" class="replay-list">
              <dt>${c.common.seed}</dt>
              <dd>${s.seed}</dd>
              <dt>${c.common.generatorVersion}</dt>
              <dd>${s.generatorVersion}</dd>
              <dt>${c.common.scenario}</dt>
              <dd>${s.themeId}</dd>
              <dt>${c.common.storySeed}</dt>
              <dd>${s.storySeed}</dd>
            </dl>`}
      </puzzle-shell>
    `}};function gt(e){return i({seed:Number.isSafeInteger(e)?e:17,config:c}).problem}customElements.get(`math-modeling-puzzle`)===void 0&&customElements.define(`math-modeling-puzzle`,ht);export{ht as MathModelingPuzzle};