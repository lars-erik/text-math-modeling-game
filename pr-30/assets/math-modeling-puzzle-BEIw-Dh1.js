import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,p as c,r as l,s as u,t as d,u as f}from"./academic-relation-Da0i64cZ.js";var ee=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],te={quantities:{basePower:{variableName:`basePower`,label:`base power`},droneCount:{variableName:`droneCount`,label:`number of drones`},dronePower:{variableName:`dronePower`,label:`power per drone`},totalPower:{variableName:`totalPower`,label:`total power`}},nouns:{ship:{singular:`ship`,plural:`ships`},drone:{singular:`drone`,plural:`drones`}},units:{count:`drones`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=ee[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`A ${e} uses ${t} ${n} for basic systems.`},countFact:{activeDrones:({count:e,noun:t})=>`It also powers ${e} identical active ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`The ship and its drones draw ${e} ${t} in total.`},question:{perDronePower:({noun:e})=>`How much power does one ${e} draw?`}}},ne=[`null`,`én`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],p={en:te,nb:{quantities:{basePower:{variableName:`grunnEffekt`,label:`grunnleggende effekt`},droneCount:{variableName:`droneAntall`,label:`antall droner`},dronePower:{variableName:`droneEffekt`,label:`effekt per drone`},totalPower:{variableName:`totalEffekt`,label:`samlet effekt`}},nouns:{ship:{singular:`skip`,plural:`skip`},drone:{singular:`drone`,plural:`droner`}},units:{count:`droner`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=ne[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`Et ${e} bruker ${t} ${n} til grunnleggende systemer.`},countFact:{activeDrones:({count:e,noun:t})=>`Det driver også ${e} identiske aktive ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`Skipet og dronene trekker til sammen ${e} ${t}.`},question:{perDronePower:({noun:e})=>`Hvor mye effekt trekker én ${e}?`}}}};function re(e,t){let n=p[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function ie(e,t,n){let r=p[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=ae(i,e.factId);switch(e.fragmentKey){case`baseFact.basicSystems`:return r.fragments.baseFact.basicSystems({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.power});case`countFact.activeDrones`:return r.fragments.countFact.activeDrones({count:r.formatNumber(t.value,!1),noun:oe(r.nouns[e.nounKey],t.value),isSingular:t.value===1});case`totalFact.combinedDraw`:return r.fragments.totalFact.combinedDraw({value:String(t.value),unit:r.units.power})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.perDronePower({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`gaming.drone-power`,storySeed:t.seed}}}function ae(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function oe(e,t){return t===1?e.singular:e.plural}function se(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`gaming.drone-power`,seed:t,sentences:[{fragmentKey:`baseFact.basicSystems`,factId:m(n,`base`),nounKey:`ship`},{fragmentKey:`countFact.activeDrones`,factId:m(n,`count`),nounKey:`drone`},{fragmentKey:`totalFact.combinedDraw`,factId:m(n,`total`)}],question:{fragmentKey:`question.perDronePower`,factId:m(n,`per-item`),nounKey:`drone`}}}function m(e,t){let n=e.get(t);if(n===void 0)throw Error(`Drone-power story needs a fact with role ${t}.`);return n}var ce={base:{themeQuantityId:`basePower`,unitKey:`power`},count:{themeQuantityId:`droneCount`,unitKey:`count`},"per-item":{themeQuantityId:`dronePower`,unitKey:`powerPerDrone`},total:{themeQuantityId:`totalPower`,unitKey:`power`}},le={id:`gaming.drone-power`,present({problem:e,locale:t,storySeed:n}){let r=p[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=ce[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=ie(i,se(i,n),t);return{themeId:`gaming.drone-power`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:re(i,t)}}},ue=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],de={quantities:{startingFollowers:{variableName:`startingFollowers`,label:`starting followers`},promotedPostCount:{variableName:`promotedPostCount`,label:`number of promoted posts`},followersPerPost:{variableName:`followersPerPost`,label:`followers per post`},finalFollowers:{variableName:`finalFollowers`,label:`final followers`}},nouns:{creator:{singular:`creator`,plural:`creators`},post:{singular:`post`,plural:`posts`}},units:{followers:`followers`,posts:`posts`,followersPerPost:`followers/post`},formatNumber(e,t){return ue[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`A ${e} starts with ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`Each of ${e} promoted ${t} gains the same number of followers.`},totalFact:{finalAudience:({value:e,unit:t})=>`The creator finishes with ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`How many followers does each ${e} gain?`}}},fe=[`null`,`ett`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],h={en:de,nb:{quantities:{startingFollowers:{variableName:`startFoelgere`,label:`følgere ved start`},promotedPostCount:{variableName:`promoterteInnlegg`,label:`antall promoterte innlegg`},followersPerPost:{variableName:`foelgerePerInnlegg`,label:`følgere per innlegg`},finalFollowers:{variableName:`sluttFoelgere`,label:`følgere til slutt`}},nouns:{creator:{singular:`innholdsskaper`,plural:`innholdsskapere`},post:{singular:`innlegg`,plural:`innlegg`}},units:{followers:`følgere`,posts:`innlegg`,followersPerPost:`følgere/innlegg`},formatNumber(e,t){return fe[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`En ${e} starter med ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`${e.charAt(0).toUpperCase()}${e.slice(1)} promoterte ${t} gir like mange nye følgere hver.`},totalFact:{finalAudience:({value:e,unit:t})=>`Innholdsskaperen ender med ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`Hvor mange følgere gir hvert ${e}?`}}}};function pe(e,t){let n=h[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function me(e,t,n){let r=h[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=he(i,e.factId);switch(e.fragmentKey){case`baseFact.startingAudience`:return r.fragments.baseFact.startingAudience({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.followers});case`countFact.promotedPosts`:return r.fragments.countFact.promotedPosts({count:r.formatNumber(t.value,!1),noun:t.value===1?r.nouns[e.nounKey].singular:r.nouns[e.nounKey].plural});case`totalFact.finalAudience`:return r.fragments.totalFact.finalAudience({value:String(t.value),unit:r.units.followers})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.followersPerPost({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`creator.followers`,storySeed:t.seed}}}function he(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function ge(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`creator.followers`,seed:t,sentences:[{fragmentKey:`baseFact.startingAudience`,factId:g(n,`base`),nounKey:`creator`},{fragmentKey:`countFact.promotedPosts`,factId:g(n,`count`),nounKey:`post`},{fragmentKey:`totalFact.finalAudience`,factId:g(n,`total`)}],question:{fragmentKey:`question.followersPerPost`,factId:g(n,`per-item`),nounKey:`post`}}}function g(e,t){let n=e.get(t);if(n===void 0)throw Error(`Creator-followers story needs a fact with role ${t}.`);return n}var _e={base:{themeQuantityId:`startingFollowers`,unitKey:`followers`},count:{themeQuantityId:`promotedPostCount`,unitKey:`posts`},"per-item":{themeQuantityId:`followersPerPost`,unitKey:`followersPerPost`},total:{themeQuantityId:`finalFollowers`,unitKey:`followers`}},ve={"gaming.drone-power":le,"creator.followers":{id:`creator.followers`,present({problem:e,locale:t,storySeed:n}){let r=h[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=_e[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=me(i,ge(i,n),t);return{themeId:`creator.followers`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:pe(i,t)}}}};function ye(e){return[{id:`matching`,relation:e.relation},{id:`factor-into-group`,relation:be(e.relation)}]}function be(e){return{kind:`equation`,left:e.left,right:xe(e.right)}}function xe(e){if(e.kind!==`add`||e.right.kind!==`multiply`||e.left.kind===`multiply`)return e;let t=e.right;return{kind:`multiply`,left:t.left,right:{kind:`add`,left:e.left,right:t.right}}}var _=globalThis,v=_.ShadowRoot&&(_.ShadyCSS===void 0||_.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,y=Symbol(),b=new WeakMap,Se=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(v&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=b.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&b.set(t,e))}return e}toString(){return this.cssText}},Ce=e=>new Se(typeof e==`string`?e:e+``,void 0,y),x=(e,...t)=>new Se(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,y),we=(e,t)=>{if(v)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=_.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},Te=v?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return Ce(t)})(e):e,{is:Ee,defineProperty:De,getOwnPropertyDescriptor:Oe,getOwnPropertyNames:ke,getOwnPropertySymbols:Ae,getPrototypeOf:je}=Object,S=globalThis,C=S.trustedTypes,Me=C?C.emptyScript:``,Ne=S.reactiveElementPolyfillSupport,w=(e,t)=>e,T={toAttribute(e,t){switch(t){case Boolean:e=e?Me:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Pe=(e,t)=>!Ee(e,t),Fe={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:Pe};Symbol.metadata??=Symbol(`metadata`),S.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Fe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&De(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=Oe(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Fe}static _$Ei(){if(this.hasOwnProperty(w(`elementProperties`)))return;let e=je(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w(`properties`))){let e=this.properties,t=[...ke(e),...Ae(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(Te(e))}else e!==void 0&&t.push(Te(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return we(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?T:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?T:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??Pe)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};E.elementStyles=[],E.shadowRootOptions={mode:`open`},E[w(`elementProperties`)]=new Map,E[w(`finalized`)]=new Map,Ne?.({ReactiveElement:E}),(S.reactiveElementVersions??=[]).push(`2.1.2`);var D=globalThis,Ie=e=>e,O=D.trustedTypes,Le=O?O.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,Re=`$lit$`,k=`lit$${Math.random().toFixed(9).slice(2)}$`,ze=`?`+k,Be=`<${ze}>`,A=document,j=()=>A.createComment(``),M=e=>e===null||typeof e!=`object`&&typeof e!=`function`,N=Array.isArray,Ve=e=>N(e)||typeof e?.[Symbol.iterator]==`function`,P=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,He=/-->/g,Ue=/>/g,I=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),We=/'/g,Ge=/"/g,Ke=/^(?:script|style|textarea|title)$/i,L=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),R=Symbol.for(`lit-noChange`),z=Symbol.for(`lit-nothing`),qe=new WeakMap,B=A.createTreeWalker(A,129);function Je(e,t){if(!N(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return Le===void 0?t:Le.createHTML(t)}var Ye=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=F;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===F?c[1]===`!--`?o=He:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=I):(Ke.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=I):o=Ue:o===I?c[0]===`>`?(o=i??F,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?I:c[3]===`"`?Ge:We):o===Ge||o===We?o=I:o===He||o===Ue?o=F:(o=I,i=void 0);let d=o===I&&e[t+1].startsWith(`/>`)?` `:``;a+=o===F?n+Be:l>=0?(r.push(s),n.slice(0,l)+Re+n.slice(l)+k+d):n+k+(l===-2?t:d)}return[Je(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},V=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Ye(t,n);if(this.el=e.createElement(l,r),B.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=B.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(Re)){let t=u[o++],n=i.getAttribute(e).split(k),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ze:r[1]===`?`?Qe:r[1]===`@`?$e:W}),i.removeAttribute(e)}else e.startsWith(k)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Ke.test(i.tagName)){let e=i.textContent.split(k),t=e.length-1;if(t>0){i.textContent=O?O.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],j()),B.nextNode(),c.push({type:2,index:++a});i.append(e[t],j())}}}else if(i.nodeType===8){if(i.data===ze)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(k,e+1))!==-1;)c.push({type:7,index:a}),e+=k.length-1}}a++}}static createElement(e,t){let n=A.createElement(`template`);return n.innerHTML=e,n}};function H(e,t,n=e,r){if(t===R)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=M(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=H(e,i._$AS(e,t.values),i,r)),t}var Xe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??A).importNode(t,!0);B.currentNode=r;let i=B.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new U(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new et(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=B.nextNode(),a++)}return B.currentNode=A,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},U=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),M(e)?e===z||e==null||e===``?(this._$AH!==z&&this._$AR(),this._$AH=z):e!==this._$AH&&e!==R&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Ve(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==z&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=V.createElement(Je(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Xe(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=qe.get(e.strings);return t===void 0&&qe.set(e.strings,t=new V(e)),t}k(t){N(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(j()),this.O(j()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=Ie(e).nextSibling;Ie(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},W=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=z,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=z}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=H(this,e,t,0),a=!M(e)||e!==this._$AH&&e!==R,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=H(this,r[n+o],t,o),s===R&&(s=this._$AH[o]),a||=!M(s)||s!==this._$AH[o],s===z?e=z:e!==z&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ze=class extends W{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===z?void 0:e}},Qe=class extends W{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==z)}},$e=class extends W{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??z)===R)return;let n=this._$AH,r=e===z&&n!==z||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==z&&(n===z||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},et=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}},tt=D.litHtmlPolyfillSupport;tt?.(V,U),(D.litHtmlVersions??=[]).push(`3.3.3`);var nt=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new U(t.insertBefore(j(),e),e,void 0,n??{})}return i._$AI(e),i},G=globalThis,K=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=nt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};K._$litElement$=!0,K.finalized=!0,G.litElementHydrateSupport?.({LitElement:K});var rt=G.litElementPolyfillSupport;rt?.({LitElement:K}),(G.litElementVersions??=[]).push(`4.2.2`);function it(e){let t=[],n=new Set;return q(e.left,t,n),q(e.right,t,n),t}function q(e,t,n){switch(e.kind){case`literal`:return;case`quantity`:n.has(e.id)||(n.add(e.id),t.push(e.id));return;case`add`:case`multiply`:q(e.left,t,n),q(e.right,t,n)}}function at(e,t){return`${J(e.left,t,0)} = ${J(e.right,t,0)}`}function J(e,t,n){let r=ot(e),i;switch(e.kind){case`literal`:i=String(e.value);break;case`quantity`:i=st(t,e.id);break;case`add`:i=`${J(e.left,t,r)} + ${J(e.right,t,r)}`;break;case`multiply`:i=`${J(e.left,t,r)} * ${J(e.right,t,r)}`}return r<n?`(${i})`:i}function ot(e){return e.kind===`add`?1:e.kind===`multiply`?2:3}function st(e,t){let n=e[t];if(n===void 0)throw Error(`No learner-facing name for canonical quantity ${t}.`);return n}function ct(e){return dt(e,ut(e))}function lt(e){let n=bt(e),{state:r,feedback:i,submission:a}=t[e.modeId].submit({problem:e.problem,locale:e.locale,answer:e.answer,names:n.learnerNames});return dt(e,{state:r,feedback:i,submission:a})}function ut(e){return t[e.modeId].start({problem:e.problem,locale:e.locale})}function dt(e,t){let n=bt(e),r=_t(n),i=a[e.locale];return{screen:mt(e,t.state,r,n),context:{locale:e.locale,themeId:n.themeId,story:n.story.text,quantities:r,replay:vt(e,n)},submission:t.submission,feedback:t.feedback===void 0?void 0:ft(t.feedback,n,i)}}function ft(e,t,n){if(e.kind!==`misconception`||e.message!==void 0)return e;let r=new Map(t.facts.map(e=>[e.canonicalId,e.label])),i=r.get(e.misconception.baseQuantityId),a=r.get(e.misconception.countQuantityId);return i===void 0||a===void 0?e:{...e,message:n.misconceptions.baseAppliedPerItem(pt(i),a)}}function pt(e){return`${e.charAt(0).toUpperCase()}${e.slice(1)}`}function mt(e,t,n,r){let i=a[e.locale];switch(t.modeId){case`story-to-quantities`:return{modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:i.storyToQuantities.prompt,quantities:n},input:t.input};case`quantities-to-named-equation`:return{modeId:`quantities-to-named-equation`,source:{kind:`quantities`,quantities:n},target:t.target,input:t.input};case`named-equation-to-academic-notation`:{let e=ht(r);return{modeId:t.modeId,source:{...t.source,names:e},target:t.target,symbolKey:gt(t.target.symbols,r,t.source.relation),input:t.input}}case`academic-notation-to-named-equation`:return{modeId:t.modeId,source:t.source,target:{...t.target,names:ht(r)},symbolKey:gt(t.source.symbols,r,t.source.relation),input:t.input}}}function ht(e){return Object.fromEntries(e.facts.map(e=>[e.canonicalId,e.variableName]))}function gt(e,t,n){let r=new Set(it(n));return t.facts.flatMap(t=>r.has(t.canonicalId)?[{canonicalId:t.canonicalId,symbol:e[t.canonicalId],variableName:t.variableName}]:[])}function _t(e){return e.facts.map(e=>({id:e.canonicalId,themeQuantityId:e.themeQuantityId,label:e.label,variableName:e.variableName,displayValue:e.visibility===`known`?`${e.value} ${e.unit}`:`?`,role:e.role,given:e.visibility===`known`&&e.value!==void 0?{kind:`known`,value:e.value}:{kind:`hidden`}}))}function vt(e,t){return e.problem.replay?{...e.problem.replay,locale:e.locale,themeId:t.themeId,storySeed:t.story.storySeed}:void 0}function yt(e,t,n,r){let i=ve[e];if(i===void 0)throw Error(`Unknown theme ${e}.`);return i.present({problem:t,locale:n,storySeed:r})}function bt(e){return yt(e.themeId,e.problem,e.locale,e.storySeed??e.problem.replay?.seed??0)}function xt(e,t){return St(ye(e),t)}function St(e,t){let n=new Map(t.facts.map(e=>[e.canonicalId,e.variableName]));return e.map(e=>({id:e.id,label:Ct(e.relation,n),relation:e.relation}))}function Ct(e,t){return at(e,Object.fromEntries(t))}var Y=`session-plan-v1`,wt=n.length,Tt=8;function Et(e){if(!Number.isSafeInteger(e.seed)||e.seed<0||e.seed>4294967295)throw Error(`Session seed must be a non-negative 32-bit unsigned integer.`);let t=e.randomSource??o(e.seed),n=Dt(t),r=Ot(e.seed,n,t);return{seed:e.seed,plannerVersion:Y,length:n,items:r}}function Dt(e){return wt+Math.floor(e.nextFloat()*(Tt-wt+1))}function Ot(e,t,r){let i=At([...n],r),a=[];for(let n=0;n<t;n+=1)a.push({index:n+1,problemSeed:kt(e,n),modeId:i[n%i.length]});return a}function kt(e,t){return jt(jt(e>>>0)^t+1>>>0)>>>0}function At(e,t){for(let n=e.length-1;n>0;--n){let r=Math.floor(t.nextFloat()*(n+1)),i=e[n];e[n]=e[r],e[r]=i}return e}function jt(e){let t=e>>>0;return t=Math.imul(t^t>>>16,2146121005),t^=t>>>15,t=Math.imul(t^t>>>15,782666323),t^=t>>>15,t}function Mt(e){return X(e,Et({seed:e.seed}),0,[],void 0,void 0)}function X(e,t,n,r,i,a,o=!1){let s={options:e,plan:t,currentIndex:n,completedItems:r,currentScreen:i??It(e,t,n),currentProblem:i===void 0?Z(t,n):void 0,hint:a,currentCompleted:o};return s.currentScreen===void 0?Nt(e,t,r,void 0):{replay:{seed:e.seed,plannerVersion:Y,themeId:e.themeId,locale:e.locale},plan:t,status:`active`,currentIndex:n,position:n+1,total:t.length,screen:s.currentScreen,currentProblem:Lt(s),hint:a,completedItems:r,completedCounts:Ft(r),availableNext:s.currentCompleted,summary:void 0,submit(i){let o=lt({problem:Lt(s),themeId:e.themeId,modeId:t.items[n].modeId,locale:e.locale,storySeed:t.items[n].problemSeed,answer:i}),c=Pt.has(o.feedback?.kind??`none`);return X(e,t,n,r,o,c?void 0:a,c)},requestHint(){let i=Rt(t.items[n].modeId,e.locale);return i===void 0?this:X(e,t,n,r,s.currentScreen,{kind:`structured`,modeId:t.items[n].modeId,content:i},o)},next(){if(!s.currentCompleted)return this;let i=t.items[n],a=[...r,{index:i.index,modeId:i.modeId}];return n+1>=t.length?Nt(e,t,a,s.currentScreen):X(e,t,n+1,a,void 0,void 0)}}}function Nt(e,t,n,r){let i=Ft(n);return{replay:{seed:e.seed,plannerVersion:Y,themeId:e.themeId,locale:e.locale},plan:t,status:`complete`,currentIndex:t.length-1,position:t.length,total:t.length,screen:r,currentProblem:void 0,hint:void 0,completedItems:n,completedCounts:i,availableNext:!1,summary:{total:n.length,counts:i},submit:()=>{throw Error(`The session is complete; there is nothing to submit.`)},requestHint:()=>{throw Error(`The session is complete; there is no hint to request.`)},next:()=>{throw Error(`The session is complete; there is no next item.`)}}}var Pt=new Set([`accepted`,`quantity-selection-accepted`]);function Ft(e){let t={};for(let e of n)t[e]=0;for(let n of e)t[n.modeId]+=1;return t}function Z(e,t){return i({seed:e.items[t].problemSeed,config:l}).problem}function It(e,t,n){if(!(n>=t.length))return ct({problem:Z(t,n),themeId:e.themeId,modeId:t.items[n].modeId,locale:e.locale,storySeed:t.items[n].problemSeed})}function Lt(e){return e.currentProblem===void 0?Z(e.plan,e.currentIndex):e.currentProblem}function Rt(e,t){if(e===`quantities-to-named-equation`)return a[t].session.hintText}var zt=class extends K{static properties={choices:{attribute:!1},selectedChoiceId:{attribute:!1},legend:{attribute:!1},checkLabel:{attribute:!1}};static styles=x`
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
  `;constructor(){super(),this.choices=[],this.selectedChoiceId=void 0,this.legend=`Choose the named equation`,this.checkLabel=`Check`}render(){return L`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.choices.map(e=>L`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation-choice`),n=this.choices.find(e=>e.id===t);n!==void 0&&(this.selectedChoiceId=n.id,this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`relation-choice`,choiceId:n.id,label:n.label,relation:n.relation}})))}};customElements.get(`named-equation-choice-input`)===void 0&&customElements.define(`named-equation-choice-input`,zt);var Bt=class extends K{static properties={value:{type:String},inputLabel:{attribute:!1},checkLabel:{attribute:!1}};static styles=x`
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
  `;constructor(){super(),this.value=``,this.inputLabel=`Named equation`,this.checkLabel=`Check`}render(){return L`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation`);typeof t==`string`&&this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`text`,input:t}}))}};customElements.get(`named-equation-text-input`)===void 0&&customElements.define(`named-equation-text-input`,Bt);var Q={"multiple-choice":{label:`Multiple choice`,render:({definition:e,screen:t,resources:n})=>L`
      <named-equation-choice-input
        .choices=${e.choices}
        .selectedChoiceId=${t.submission?.kind===`named-equation`?t.submission.choiceId:void 0}
        .legend=${n.quantitiesToNamedEquation.choiceLegend}
        .checkLabel=${n.controls.check}
      ></named-equation-choice-input>
    `},text:{label:`Text input`,render:({screen:e,resources:t})=>L`
      <named-equation-text-input
        .value=${e.submission?.kind===`named-equation`&&e.submission.answerKind===`text`?e.submission.input:``}
        .inputLabel=${t.quantitiesToNamedEquation.inputLabel}
        .checkLabel=${t.controls.check}
      ></named-equation-text-input>
    `}};function Vt(e){return Object.hasOwn(Q,e)}var Ht={render(e,t,n){n.textContent=d(e,t)}},Ut=class extends K{static properties={screen:{attribute:!1},knownLegend:{attribute:!1},unknownLegend:{attribute:!1},checkLabel:{attribute:!1}};static styles=x`
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
  `;constructor(){super(),this.screen={modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:``,quantities:[]},input:{kind:`quantity-selection`,knownIds:[]}},this.knownLegend=``,this.unknownLegend=``,this.checkLabel=``}render(){return L`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.knownLegend}</legend>
          ${this.screen.target.quantities.map(e=>L`
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
          ${this.screen.target.quantities.map(e=>L`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`unknown-quantity`);if(typeof n!=`string`)return;let r={knownIds:t.getAll(`known-quantity`).filter(e=>typeof e==`string`),unknownId:n};this.dispatchEvent(new CustomEvent(`puzzle-quantity-selection`,{bubbles:!0,composed:!0,detail:r}))}};customElements.get(`story-quantities-input`)===void 0&&customElements.define(`story-quantities-input`,Ut);var Wt=class extends K{static properties={heading:{type:String},sourceLabel:{attribute:`source-label`,type:String},targetLabel:{attribute:`target-label`,type:String},feedbackLabel:{attribute:`feedback-label`,type:String},prompt:{type:String},feedback:{type:String},replayLabel:{attribute:`replay-label`,type:String},hasReplay:{attribute:`has-replay`,type:Boolean}};static styles=x`
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
  `;constructor(){super(),this.heading=``,this.sourceLabel=``,this.targetLabel=``,this.feedbackLabel=``,this.prompt=``,this.feedback=``,this.replayLabel=``,this.hasReplay=!1}render(){return L`
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

        ${this.hasReplay?L`
              <details>
                <summary>${this.replayLabel}</summary>
                <slot name="replay"></slot>
              </details>
            `:null}
      </main>
    `}};customElements.get(`puzzle-shell`)===void 0&&customElements.define(`puzzle-shell`,Wt);var Gt=class extends K{static properties={seed:{type:Number},themeId:{attribute:`theme-id`,type:String},modeId:{attribute:`mode-id`,type:String},locale:{type:String},menuLabel:{attribute:!1},scenarioLabel:{attribute:!1},dronePowerLabel:{attribute:!1},creatorFollowersLabel:{attribute:!1},taskLabel:{attribute:!1},storyToQuantitiesLabel:{attribute:!1},quantitiesToNamedEquationLabel:{attribute:!1},namedEquationToAcademicNotationLabel:{attribute:!1},academicNotationToNamedEquationLabel:{attribute:!1},seedLabel:{attribute:!1},showLabel:{attribute:!1},startSessionLabel:{attribute:!1}};static styles=x`
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
  `;constructor(){super(),this.seed=17,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.locale=`en`,this.menuLabel=`Puzzle menu`,this.scenarioLabel=`Scenario`,this.dronePowerLabel=`Spaceship and drones`,this.creatorFollowersLabel=`Creator and followers`,this.taskLabel=`Task`,this.storyToQuantitiesLabel=`Story to quantities`,this.quantitiesToNamedEquationLabel=`Quantities to named equation`,this.namedEquationToAcademicNotationLabel=`Named equation to academic notation`,this.academicNotationToNamedEquationLabel=`Academic notation to named equation`,this.seedLabel=`Seed`,this.showLabel=`Show puzzle`,this.startSessionLabel=`Start session`}render(){return L`
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
            <option value="named-equation-to-academic-notation">
              ${this.namedEquationToAcademicNotationLabel}
            </option>
            <option value="academic-notation-to-named-equation">
              ${this.academicNotationToNamedEquationLabel}
            </option>
          </select>
        </label>
        <label>
          ${this.seedLabel}
          <input
            name="seed"
            type="number"
            min="0"
            max=${e}
            step="1"
            .value=${String(this.seed)}
            required
          />
        </label>
        <button type="submit" name="action" value="puzzle">
          ${this.showLabel}
        </button>
        <button type="submit" name="action" value="session">
          ${this.startSessionLabel}
        </button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`scenario`),i=t.get(`task`),a=Number(t.get(`seed`)),o=e.submitter instanceof HTMLButtonElement?e.submitter.value:void 0;if(typeof n==`string`&&r(n)&&typeof i==`string`&&f(i)&&Number.isInteger(a)){if(o===`session`){this.dispatchEvent(new CustomEvent(u,{bubbles:!0,composed:!0,detail:{seed:a,themeId:n,locale:this.locale}}));return}this.dispatchEvent(new CustomEvent(s,{bubbles:!0,composed:!0,detail:{seed:a,themeId:n,modeId:i,locale:this.locale}}))}}};customElements.get(`puzzle-menu`)===void 0&&customElements.define(`puzzle-menu`,Gt);var Kt=class extends K{static properties={relation:{attribute:!1},symbols:{attribute:!1},adapter:{attribute:!1}};static styles=x`
    :host {
      display: block;
      min-width: 0;
    }
    .output {
      min-width: 0;
      overflow-x: auto;
    }
  `;constructor(){super(),this.relation=void 0,this.symbols={},this.adapter=Ht}render(){return L`<div class="output" aria-label=${this.relation?d(this.relation,this.symbols):``}></div>`}updated(e){let t=this.renderRoot.querySelector(`.output`);t!==null&&this.relation!==void 0&&this.adapter.render(this.relation,this.symbols,t)}};customElements.get(`academic-notation-display`)===void 0&&customElements.define(`academic-notation-display`,Kt);var qt=class extends K{static properties={seed:{type:String},session:{type:String},themeId:{attribute:`theme`,type:String},modeId:{attribute:`mode`,type:String},inputMode:{attribute:`input-mode`,reflect:!0,type:String},locale:{reflect:!0,type:String},academicDisplayAdapter:{attribute:!1},screen:{state:!0},activeSession:{state:!0}};static styles=x`
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
    .session-next,
    .session-hint {
      min-height: 2.75rem;
      margin-block-start: 0.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .session-hint {
      border-color: #8d969e;
      background: #fff;
      color: #202428;
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
    .equation {
      margin-block: 1rem;
      padding: 0.85rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #f7f8f9;
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      overflow-wrap: anywhere;
    }
    .symbol-key {
      margin-block-start: 1rem;
    }
    .symbol-key h3 {
      margin-block: 0 0.4rem;
      font-size: 0.9rem;
    }
    .symbol-key dl {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 0.25rem 0.75rem;
      margin: 0;
    }
    .symbol-key dt {
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-weight: 700;
    }
    .symbol-key dd {
      margin: 0;
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
  `;constructor(){super(),this.seed=`17`,this.session=``,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.inputMode=`text`,this.locale=`en`,this.academicDisplayAdapter=Ht,this.screen=void 0,this.generatedProblem=$(17),this.activeSession=void 0}willUpdate(e){(e.has(`session`)||e.has(`themeId`)||e.has(`locale`))&&(this.activeSession=this.composeCurrentSession()),e.has(`seed`)&&(this.generatedProblem=$(Number(this.seed))),(e.has(`seed`)||e.has(`themeId`)||e.has(`modeId`)||e.has(`locale`))&&(this.screen=this.activeSession===void 0?this.composeCurrentScreen():this.activeSession.screen)}composeCurrentSession(){if(this.session!==``&&r(this.themeId)&&c(this.locale))return Mt({seed:Number(this.session),themeId:this.themeId,locale:this.locale})}composeCurrentScreen(){if(r(this.themeId)&&c(this.locale))return ct({problem:this.generatedProblem,themeId:this.themeId,modeId:f(this.modeId)?this.modeId:`story-to-quantities`,locale:this.locale,storySeed:Number(this.seed)})}render(){if(!r(this.themeId))return L`<p role="alert">
        Unknown scenario ${JSON.stringify(this.themeId)}.
      </p>`;if(this.activeSession!==void 0)return this.renderSession(this.activeSession);if(!f(this.modeId))return L`<p role="alert">
        Unknown task ${JSON.stringify(this.modeId)}.
      </p>`;if(!c(this.locale))return L`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;if(this.screen===void 0)return L`<p role="alert">Puzzle screen is unavailable.</p>`;let e=this.screen,t=a[this.locale],n=this.headingFor(e.screen,t);return this.renderShell({locale:this.locale,heading:n,prompt:e.screen.target.prompt,feedback:e.feedback?.message??``,replay:e.context.replay,source:this.renderSource(e,t),input:this.renderInput(e,t)})}headingFor(e,t){switch(e.modeId){case`story-to-quantities`:return t.storyToQuantities.heading;case`quantities-to-named-equation`:return t.quantitiesToNamedEquation.heading;case`named-equation-to-academic-notation`:return t.namedEquationToAcademicNotation.heading;case`academic-notation-to-named-equation`:return t.academicNotationToNamedEquation.heading}}renderSource(e,t){let n=L`<p>${e.context.story}</p>`;switch(e.screen.modeId){case`story-to-quantities`:return n;case`quantities-to-named-equation`:return L`${n}${this.renderQuantityList(e)}`;case`named-equation-to-academic-notation`:return L`${n}${this.renderQuantityList(e)}
          <p class="equation">
            ${at(e.screen.source.relation,e.screen.source.names)}
          </p>
          ${this.renderSymbolKey(e.screen,t.namedEquationToAcademicNotation.symbolKey)}`;case`academic-notation-to-named-equation`:return L`${n}${this.renderQuantityList(e)}
          <academic-notation-display
            .relation=${e.screen.source.relation}
            .symbols=${e.screen.source.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>
          ${this.renderSymbolKey(e.screen,t.academicNotationToNamedEquation.symbolKey)}`}}renderQuantityList(e){return L`<ul class="quantity-list">
      ${e.context.quantities.map(e=>L`<li>
          ${e.variableName} =
          ${e.given.kind===`known`?e.given.value:`?`}
        </li>`)}
    </ul>`}renderSymbolKey(e,t){return L`<section class="symbol-key" aria-label=${t}>
      <h3>${t}</h3>
      <dl>
        ${e.symbolKey.map(e=>L`<dt>${e.symbol}</dt><dd>${e.variableName}</dd>`)}
      </dl>
    </section>`}renderInput(e,t){switch(e.screen.modeId){case`story-to-quantities`:return L`<div @puzzle-quantity-selection=${this.handleQuantitySelection}>
          <story-quantities-input
            .screen=${e.screen}
            .knownLegend=${t.storyToQuantities.knownLegend}
            .unknownLegend=${t.storyToQuantities.unknownLegend}
            .checkLabel=${t.controls.check}
          ></story-quantities-input>
        </div>`;case`quantities-to-named-equation`:return this.renderNamedEquationInput(this.locale);case`named-equation-to-academic-notation`:return this.renderTextExpressionInput(e,t.namedEquationToAcademicNotation.inputLabel,t.controls.check);case`academic-notation-to-named-equation`:return this.renderTextExpressionInput(e,t.academicNotationToNamedEquation.inputLabel,t.controls.check)}}renderTextExpressionInput(e,t,n){let r=e.screen.input.kind===`expression`?e.screen.input.value:``,i=e.screen.modeId===`named-equation-to-academic-notation`&&e.feedback?.kind===`accepted`&&e.submission?.kind===`academic-notation`?e.submission.relation:void 0;return L`<div @puzzle-answer=${this.handleAnswer}>
      <named-equation-text-input
        .value=${r}
        .inputLabel=${t}
        .checkLabel=${n}
      ></named-equation-text-input>
      ${i===void 0||e.screen.modeId!==`named-equation-to-academic-notation`?null:L`<academic-notation-display
            .relation=${i}
            .symbols=${e.screen.target.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>`}
    </div>`}renderNamedEquationInput(e){if(!Vt(this.inputMode))return L`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;let t=this.screen;if(t===void 0||!r(this.themeId))return L``;let n=this.currentProblemFor(),i=a[e],o=Q[this.inputMode],s=xt(n,yt(this.themeId,n,e,t.context.replay?.storySeed??Number(this.seed)));return L`<div @puzzle-answer=${this.handleAnswer}>
      <nav aria-label=${i.controls.inputMode}>
        ${Object.keys(Q).map(e=>L`<button
            type="button"
            aria-pressed=${this.inputMode===e}
            @click=${()=>this.selectInputMode(e)}
          >
            ${e===`text`?i.controls.textInput:i.controls.multipleChoice}
          </button>`)}
      </nav>
      ${o.render({definition:{choices:s},screen:{...t,submission:t.submission},resources:i})}
    </div>`}handleAnswer(e){this.submitAnswer(e.detail)}submitAnswer(e){if(this.activeSession!==void 0){this.activeSession=this.activeSession.submit(e),this.screen=this.activeSession.screen;return}r(this.themeId)&&f(this.modeId)&&c(this.locale)&&(this.screen=lt({problem:this.generatedProblem,themeId:this.themeId,modeId:this.modeId,locale:this.locale,storySeed:Number(this.seed),answer:e}))}selectInputMode(e){this.inputMode=e,this.activeSession===void 0&&(this.screen=this.composeCurrentScreen())}currentProblemFor(){return this.activeSession===void 0?this.generatedProblem:this.activeSession.currentProblem??this.generatedProblem}handleQuantitySelection(e){this.submitAnswer(e.detail)}handleLocaleChange(e){if(e.currentTarget instanceof HTMLSelectElement&&c(e.currentTarget.value)){let t=e.currentTarget.value;this.locale=t,this.requestApplicationState({locale:t})}}requestApplicationState(e){this.dispatchEvent(new CustomEvent(s,{bubbles:!0,composed:!0,detail:{seed:Number(this.seed),themeId:r(this.themeId)?this.themeId:`gaming.drone-power`,modeId:f(this.modeId)?this.modeId:`story-to-quantities`,locale:e.locale}}))}renderSession(e){let t=this.locale,r=a[t],i=r.session;if(e.status===`complete`)return L`
        <puzzle-shell
          .heading=${i.completionHeading}
          .sourceLabel=${r.common.source}
          .targetLabel=${r.common.target}
          .feedbackLabel=${r.common.feedback}
          .prompt=${i.completedTotal(e.summary?.total??0)}
          .feedback=${``}
          .replayLabel=${r.common.replay}
          .hasReplay=${!1}
        >
          <div slot="source">
            <p>${i.completedTotal(e.summary?.total??0)}</p>
            <ul class="quantity-list">
              ${n.map(t=>L`<li>
                  ${this.modeLabel(t,r)}:
                  ${e.completedCounts[t]}
                </li>`)}
            </ul>
          </div>
          <div slot="input"></div>
        </puzzle-shell>
      `;let o=e.screen,s=this.headingFor(o.screen,r),c=i.positionLabel(e.position,e.total),l=e.hint,u=o.feedback?.message??``,d=l!==void 0&&u===``?l.content:[u,l?.content??``].filter(e=>e!==``).join(` `);return this.renderShell({locale:t,heading:s,positionLabel:c,prompt:o.screen.target.prompt,feedback:d,replay:o.context.replay,source:this.renderSource(o,r),input:L`
        ${this.renderInput(o,r)}
        ${e.availableNext?L`<button
              type="button"
              class="session-next"
              @click=${this.handleSessionNext}
            >
              ${i.next}
            </button>`:``}
        ${this.supportsHint(e)?L`<button
              type="button"
              class="session-hint"
              @click=${this.handleSessionHint}
            >
              ${i.hint}
            </button>`:``}
      `})}supportsHint(e){let t=e.plan.items[e.currentIndex];return e.status===`active`&&t?.modeId===`quantities-to-named-equation`}modeLabel(e,t){switch(e){case`story-to-quantities`:return t.storyToQuantities.heading;case`quantities-to-named-equation`:return t.quantitiesToNamedEquation.heading;case`named-equation-to-academic-notation`:return t.namedEquationToAcademicNotation.heading;case`academic-notation-to-named-equation`:return t.academicNotationToNamedEquation.heading}}handleSessionNext(){this.activeSession!==void 0&&(this.activeSession=this.activeSession.next(),this.screen=this.activeSession.screen)}handleSessionHint(){this.activeSession!==void 0&&(this.activeSession=this.activeSession.requestHint())}renderShell({locale:e,heading:t,positionLabel:n,prompt:r,source:i,input:o,feedback:s,replay:c}){let l=a[e];return L`
      <puzzle-shell
        .heading=${n===void 0?t:`${t} — ${n}`}
        .sourceLabel=${l.common.source}
        .targetLabel=${l.common.target}
        .feedbackLabel=${l.common.feedback}
        .prompt=${r}
        .feedback=${s}
        .replayLabel=${l.common.replay}
        .hasReplay=${c!==void 0}
      >
        <label slot="language" class="language-control">
          ${l.language.label}
          <select .value=${e} @change=${this.handleLocaleChange}>
            <option value="en">${l.language.en}</option>
            <option value="nb">${l.language.nb}</option>
          </select>
        </label>
        <puzzle-menu
          slot="settings"
          .seed=${Number(this.seed)}
          .themeId=${this.themeId}
          .modeId=${this.modeId}
          .locale=${e}
          .menuLabel=${l.puzzleMenu.label}
          .scenarioLabel=${l.puzzleMenu.scenario}
          .dronePowerLabel=${l.puzzleMenu.dronePower}
          .creatorFollowersLabel=${l.puzzleMenu.creatorFollowers}
          .taskLabel=${l.puzzleMenu.task}
          .storyToQuantitiesLabel=${l.puzzleMenu.storyToQuantities}
          .quantitiesToNamedEquationLabel=${l.puzzleMenu.quantitiesToNamedEquation}
          .namedEquationToAcademicNotationLabel=${l.puzzleMenu.namedEquationToAcademicNotation}
          .academicNotationToNamedEquationLabel=${l.puzzleMenu.academicNotationToNamedEquation}
          .seedLabel=${l.puzzleMenu.seed}
          .showLabel=${l.puzzleMenu.show}
          .startSessionLabel=${l.puzzleMenu.startSession}
        ></puzzle-menu>
        <div slot="source">${i}</div>
        <div slot="input">${o}</div>
        ${c===void 0?null:L`<dl slot="replay" class="replay-list">
              <dt>${l.common.seed}</dt>
              <dd>${c.seed}</dd>
              <dt>${l.common.generatorVersion}</dt>
              <dd>${c.generatorVersion}</dd>
              <dt>${l.common.scenario}</dt>
              <dd>${c.themeId}</dd>
              <dt>${l.common.storySeed}</dt>
              <dd>${c.storySeed}</dd>
            </dl>`}
      </puzzle-shell>
    `}};function $(e){return i({seed:Number.isSafeInteger(e)?e:17,config:l}).problem}customElements.get(`math-modeling-puzzle`)===void 0&&customElements.define(`math-modeling-puzzle`,qt);export{qt as MathModelingPuzzle};