import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c,u as l}from"./academic-relation-BTS4R4bq.js";var u=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],d={quantities:{basePower:{variableName:`basePower`,label:`base power`},droneCount:{variableName:`droneCount`,label:`number of drones`},dronePower:{variableName:`dronePower`,label:`power per drone`},totalPower:{variableName:`totalPower`,label:`total power`}},nouns:{ship:{singular:`ship`,plural:`ships`},drone:{singular:`drone`,plural:`drones`}},units:{count:`drones`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=u[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`A ${e} uses ${t} ${n} for basic systems.`},countFact:{activeDrones:({count:e,noun:t})=>`It also powers ${e} identical active ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`The ship and its drones draw ${e} ${t} in total.`},question:{perDronePower:({noun:e})=>`How much power does one ${e} draw?`}}},ee=[`null`,`én`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],f={en:d,nb:{quantities:{basePower:{variableName:`grunnEffekt`,label:`grunnleggende effekt`},droneCount:{variableName:`droneAntall`,label:`antall droner`},dronePower:{variableName:`droneEffekt`,label:`effekt per drone`},totalPower:{variableName:`totalEffekt`,label:`samlet effekt`}},nouns:{ship:{singular:`skip`,plural:`skip`},drone:{singular:`drone`,plural:`droner`}},units:{count:`droner`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=ee[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`Et ${e} bruker ${t} ${n} til grunnleggende systemer.`},countFact:{activeDrones:({count:e,noun:t})=>`Det driver også ${e} identiske aktive ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`Skipet og dronene trekker til sammen ${e} ${t}.`},question:{perDronePower:({noun:e})=>`Hvor mye effekt trekker én ${e}?`}}}};function te(e,t){let n=f[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function ne(e,t,n){let r=f[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=re(i,e.factId);switch(e.fragmentKey){case`baseFact.basicSystems`:return r.fragments.baseFact.basicSystems({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.power});case`countFact.activeDrones`:return r.fragments.countFact.activeDrones({count:r.formatNumber(t.value,!1),noun:ie(r.nouns[e.nounKey],t.value),isSingular:t.value===1});case`totalFact.combinedDraw`:return r.fragments.totalFact.combinedDraw({value:String(t.value),unit:r.units.power})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.perDronePower({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`gaming.drone-power`,storySeed:t.seed}}}function re(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function ie(e,t){return t===1?e.singular:e.plural}function ae(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`gaming.drone-power`,seed:t,sentences:[{fragmentKey:`baseFact.basicSystems`,factId:p(n,`base`),nounKey:`ship`},{fragmentKey:`countFact.activeDrones`,factId:p(n,`count`),nounKey:`drone`},{fragmentKey:`totalFact.combinedDraw`,factId:p(n,`total`)}],question:{fragmentKey:`question.perDronePower`,factId:p(n,`per-item`),nounKey:`drone`}}}function p(e,t){let n=e.get(t);if(n===void 0)throw Error(`Drone-power story needs a fact with role ${t}.`);return n}var oe={base:{themeQuantityId:`basePower`,unitKey:`power`},count:{themeQuantityId:`droneCount`,unitKey:`count`},"per-item":{themeQuantityId:`dronePower`,unitKey:`powerPerDrone`},total:{themeQuantityId:`totalPower`,unitKey:`power`}},se={id:`gaming.drone-power`,present({problem:e,locale:t,storySeed:n}){let r=f[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=oe[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=ne(i,ae(i,n),t);return{themeId:`gaming.drone-power`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:te(i,t)}}},ce=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],le={quantities:{startingFollowers:{variableName:`startingFollowers`,label:`starting followers`},promotedPostCount:{variableName:`promotedPostCount`,label:`number of promoted posts`},followersPerPost:{variableName:`followersPerPost`,label:`followers per post`},finalFollowers:{variableName:`finalFollowers`,label:`final followers`}},nouns:{creator:{singular:`creator`,plural:`creators`},post:{singular:`post`,plural:`posts`}},units:{followers:`followers`,posts:`posts`,followersPerPost:`followers/post`},formatNumber(e,t){return ce[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`A ${e} starts with ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`Each of ${e} promoted ${t} gains the same number of followers.`},totalFact:{finalAudience:({value:e,unit:t})=>`The creator finishes with ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`How many followers does each ${e} gain?`}}},ue=[`null`,`ett`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],m={en:le,nb:{quantities:{startingFollowers:{variableName:`startFoelgere`,label:`følgere ved start`},promotedPostCount:{variableName:`promoterteInnlegg`,label:`antall promoterte innlegg`},followersPerPost:{variableName:`foelgerePerInnlegg`,label:`følgere per innlegg`},finalFollowers:{variableName:`sluttFoelgere`,label:`følgere til slutt`}},nouns:{creator:{singular:`innholdsskaper`,plural:`innholdsskapere`},post:{singular:`innlegg`,plural:`innlegg`}},units:{followers:`følgere`,posts:`innlegg`,followersPerPost:`følgere/innlegg`},formatNumber(e,t){return ue[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`En ${e} starter med ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`${e.charAt(0).toUpperCase()}${e.slice(1)} promoterte ${t} gir like mange nye følgere hver.`},totalFact:{finalAudience:({value:e,unit:t})=>`Innholdsskaperen ender med ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`Hvor mange følgere gir hvert ${e}?`}}}};function de(e,t){let n=m[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function fe(e,t,n){let r=m[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=pe(i,e.factId);switch(e.fragmentKey){case`baseFact.startingAudience`:return r.fragments.baseFact.startingAudience({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.followers});case`countFact.promotedPosts`:return r.fragments.countFact.promotedPosts({count:r.formatNumber(t.value,!1),noun:t.value===1?r.nouns[e.nounKey].singular:r.nouns[e.nounKey].plural});case`totalFact.finalAudience`:return r.fragments.totalFact.finalAudience({value:String(t.value),unit:r.units.followers})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.followersPerPost({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`creator.followers`,storySeed:t.seed}}}function pe(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function me(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`creator.followers`,seed:t,sentences:[{fragmentKey:`baseFact.startingAudience`,factId:h(n,`base`),nounKey:`creator`},{fragmentKey:`countFact.promotedPosts`,factId:h(n,`count`),nounKey:`post`},{fragmentKey:`totalFact.finalAudience`,factId:h(n,`total`)}],question:{fragmentKey:`question.followersPerPost`,factId:h(n,`per-item`),nounKey:`post`}}}function h(e,t){let n=e.get(t);if(n===void 0)throw Error(`Creator-followers story needs a fact with role ${t}.`);return n}var he={base:{themeQuantityId:`startingFollowers`,unitKey:`followers`},count:{themeQuantityId:`promotedPostCount`,unitKey:`posts`},"per-item":{themeQuantityId:`followersPerPost`,unitKey:`followersPerPost`},total:{themeQuantityId:`finalFollowers`,unitKey:`followers`}},ge={"gaming.drone-power":se,"creator.followers":{id:`creator.followers`,present({problem:e,locale:t,storySeed:n}){let r=m[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=he[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=fe(i,me(i,n),t);return{themeId:`creator.followers`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:de(i,t)}}}};function _e(e){return[{id:`matching`,relation:e.relation},{id:`factor-into-group`,relation:ve(e.relation)}]}function ve(e){return{kind:`equation`,left:e.left,right:ye(e.right)}}function ye(e){if(e.kind!==`add`||e.right.kind!==`multiply`||e.left.kind===`multiply`)return e;let t=e.right;return{kind:`multiply`,left:t.left,right:{kind:`add`,left:e.left,right:t.right}}}var g=globalThis,_=g.ShadowRoot&&(g.ShadyCSS===void 0||g.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,v=Symbol(),be=new WeakMap,xe=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==v)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(_&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=be.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&be.set(t,e))}return e}toString(){return this.cssText}},Se=e=>new xe(typeof e==`string`?e:e+``,void 0,v),y=(e,...t)=>new xe(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,v),Ce=(e,t)=>{if(_)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=g.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},we=_?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return Se(t)})(e):e,{is:Te,defineProperty:Ee,getOwnPropertyDescriptor:De,getOwnPropertyNames:Oe,getOwnPropertySymbols:ke,getPrototypeOf:Ae}=Object,b=globalThis,x=b.trustedTypes,je=x?x.emptyScript:``,Me=b.reactiveElementPolyfillSupport,S=(e,t)=>e,C={toAttribute(e,t){switch(t){case Boolean:e=e?je:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},w=(e,t)=>!Te(e,t),T={attribute:!0,type:String,converter:C,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol(`metadata`),b.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=T){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&Ee(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=De(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??T}static _$Ei(){if(this.hasOwnProperty(S(`elementProperties`)))return;let e=Ae(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(S(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S(`properties`))){let e=this.properties,t=[...Oe(e),...ke(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(we(e))}else e!==void 0&&t.push(we(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ce(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?C:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?C:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??w)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};E.elementStyles=[],E.shadowRootOptions={mode:`open`},E[S(`elementProperties`)]=new Map,E[S(`finalized`)]=new Map,Me?.({ReactiveElement:E}),(b.reactiveElementVersions??=[]).push(`2.1.2`);var D=globalThis,O=e=>e,k=D.trustedTypes,A=k?k.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,Ne=`$lit$`,j=`lit$${Math.random().toFixed(9).slice(2)}$`,Pe=`?`+j,Fe=`<${Pe}>`,M=document,N=()=>M.createComment(``),P=e=>e===null||typeof e!=`object`&&typeof e!=`function`,F=Array.isArray,Ie=e=>F(e)||typeof e?.[Symbol.iterator]==`function`,I=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Le=/-->/g,Re=/>/g,R=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ze=/'/g,Be=/"/g,Ve=/^(?:script|style|textarea|title)$/i,z=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),B=Symbol.for(`lit-noChange`),V=Symbol.for(`lit-nothing`),He=new WeakMap,H=M.createTreeWalker(M,129);function Ue(e,t){if(!F(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return A===void 0?t:A.createHTML(t)}var We=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=L;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===L?c[1]===`!--`?o=Le:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=R):(Ve.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=R):o=Re:o===R?c[0]===`>`?(o=i??L,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?R:c[3]===`"`?Be:ze):o===Be||o===ze?o=R:o===Le||o===Re?o=L:(o=R,i=void 0);let d=o===R&&e[t+1].startsWith(`/>`)?` `:``;a+=o===L?n+Fe:l>=0?(r.push(s),n.slice(0,l)+Ne+n.slice(l)+j+d):n+j+(l===-2?t:d)}return[Ue(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},U=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=We(t,n);if(this.el=e.createElement(l,r),H.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=H.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(Ne)){let t=u[o++],n=i.getAttribute(e).split(j),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ke:r[1]===`?`?qe:r[1]===`@`?Je:K}),i.removeAttribute(e)}else e.startsWith(j)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Ve.test(i.tagName)){let e=i.textContent.split(j),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],N()),H.nextNode(),c.push({type:2,index:++a});i.append(e[t],N())}}}else if(i.nodeType===8){if(i.data===Pe)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(j,e+1))!==-1;)c.push({type:7,index:a}),e+=j.length-1}}a++}}static createElement(e,t){let n=M.createElement(`template`);return n.innerHTML=e,n}};function W(e,t,n=e,r){if(t===B)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=P(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=W(e,i._$AS(e,t.values),i,r)),t}var Ge=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??M).importNode(t,!0);H.currentNode=r;let i=H.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new G(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Ye(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=H.nextNode(),a++)}return H.currentNode=M,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},G=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=W(this,e,t),P(e)?e===V||e==null||e===``?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==B&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Ie(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=U.createElement(Ue(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ge(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=He.get(e.strings);return t===void 0&&He.set(e.strings,t=new U(e)),t}k(t){F(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(N()),this.O(N()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=O(e).nextSibling;O(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},K=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=V}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=W(this,e,t,0),a=!P(e)||e!==this._$AH&&e!==B,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=W(this,r[n+o],t,o),s===B&&(s=this._$AH[o]),a||=!P(s)||s!==this._$AH[o],s===V?e=V:e!==V&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ke=class extends K{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}},qe=class extends K{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}},Je=class extends K{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=W(this,e,t,0)??V)===B)return;let n=this._$AH,r=e===V&&n!==V||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==V&&(n===V||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ye=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){W(this,e)}},Xe=D.litHtmlPolyfillSupport;Xe?.(U,G),(D.litHtmlVersions??=[]).push(`3.3.3`);var Ze=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new G(t.insertBefore(N(),e),e,void 0,n??{})}return i._$AI(e),i},q=globalThis,J=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ze(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};J._$litElement$=!0,J.finalized=!0,q.litElementHydrateSupport?.({LitElement:J});var Qe=q.litElementPolyfillSupport;Qe?.({LitElement:J}),(q.litElementVersions??=[]).push(`4.2.2`);function $e(e){let t=[],n=new Set;return Y(e.left,t,n),Y(e.right,t,n),t}function Y(e,t,n){switch(e.kind){case`literal`:return;case`quantity`:n.has(e.id)||(n.add(e.id),t.push(e.id));return;case`add`:case`multiply`:Y(e.left,t,n),Y(e.right,t,n)}}function et(e,t){return`${X(e.left,t,0)} = ${X(e.right,t,0)}`}function X(e,t,n){let r=tt(e),i;switch(e.kind){case`literal`:i=String(e.value);break;case`quantity`:i=nt(t,e.id);break;case`add`:i=`${X(e.left,t,r)} + ${X(e.right,t,r)}`;break;case`multiply`:i=`${X(e.left,t,r)} * ${X(e.right,t,r)}`}return r<n?`(${i})`:i}function tt(e){return e.kind===`add`?1:e.kind===`multiply`?2:3}function nt(e,t){let n=e[t];if(n===void 0)throw Error(`No learner-facing name for canonical quantity ${t}.`);return n}function rt(e){return ot(e,at(e))}function it(e){let t=Z(e),{state:n,feedback:r,submission:i}=a[e.modeId].submit({problem:e.problem,locale:e.locale,answer:e.answer,names:t.learnerNames});return ot(e,{state:n,feedback:r,submission:i})}function at(e){return a[e.modeId].start({problem:e.problem,locale:e.locale})}function ot(e,t){let n=Z(e),r=ft(n),i=s[e.locale];return{screen:lt(e,t.state,r,n),context:{locale:e.locale,themeId:n.themeId,story:n.story.text,quantities:r,replay:pt(e,n)},submission:t.submission,feedback:t.feedback===void 0?void 0:st(t.feedback,n,i)}}function st(e,t,n){if(e.kind!==`misconception`||e.message!==void 0)return e;let r=new Map(t.facts.map(e=>[e.canonicalId,e.label])),i=r.get(e.misconception.baseQuantityId),a=r.get(e.misconception.countQuantityId);return i===void 0||a===void 0?e:{...e,message:n.misconceptions.baseAppliedPerItem(ct(i),a)}}function ct(e){return`${e.charAt(0).toUpperCase()}${e.slice(1)}`}function lt(e,t,n,r){let i=s[e.locale];switch(t.modeId){case`story-to-quantities`:return{modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:i.storyToQuantities.prompt,quantities:n},input:t.input};case`quantities-to-named-equation`:return{modeId:`quantities-to-named-equation`,source:{kind:`quantities`,quantities:n},target:t.target,input:t.input};case`named-equation-to-academic-notation`:{let e=ut(r);return{modeId:t.modeId,source:{...t.source,names:e},target:t.target,symbolKey:dt(t.target.symbols,r,t.source.relation),input:t.input}}case`academic-notation-to-named-equation`:return{modeId:t.modeId,source:t.source,target:{...t.target,names:ut(r)},symbolKey:dt(t.source.symbols,r,t.source.relation),input:t.input}}}function ut(e){return Object.fromEntries(e.facts.map(e=>[e.canonicalId,e.variableName]))}function dt(e,t,n){let r=new Set($e(n));return t.facts.flatMap(t=>r.has(t.canonicalId)?[{canonicalId:t.canonicalId,symbol:e[t.canonicalId],variableName:t.variableName}]:[])}function ft(e){return e.facts.map(e=>({id:e.canonicalId,themeQuantityId:e.themeQuantityId,label:e.label,variableName:e.variableName,displayValue:e.visibility===`known`?`${e.value} ${e.unit}`:`?`,role:e.role,given:e.visibility===`known`&&e.value!==void 0?{kind:`known`,value:e.value}:{kind:`hidden`}}))}function pt(e,t){return e.problem.replay?{...e.problem.replay,locale:e.locale,themeId:t.themeId,storySeed:t.story.storySeed}:void 0}function mt(e,t,n,r){let i=ge[e];if(i===void 0)throw Error(`Unknown theme ${e}.`);return i.present({problem:t,locale:n,storySeed:r})}function Z(e){return mt(e.themeId,e.problem,e.locale,e.storySeed??e.problem.replay?.seed??0)}function ht(e,t){return gt(_e(e),t)}function gt(e,t){let n=new Map(t.facts.map(e=>[e.canonicalId,e.variableName]));return e.map(e=>({id:e.id,label:_t(e.relation,n),relation:e.relation}))}function _t(e,t){return et(e,Object.fromEntries(t))}var vt=class extends J{static properties={choices:{attribute:!1},selectedChoiceId:{attribute:!1},legend:{attribute:!1},checkLabel:{attribute:!1}};static styles=y`
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
  `;constructor(){super(),this.choices=[],this.selectedChoiceId=void 0,this.legend=`Choose the named equation`,this.checkLabel=`Check`}render(){return z`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.choices.map(e=>z`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation-choice`),n=this.choices.find(e=>e.id===t);n!==void 0&&(this.selectedChoiceId=n.id,this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`relation-choice`,choiceId:n.id,label:n.label,relation:n.relation}})))}};customElements.get(`named-equation-choice-input`)===void 0&&customElements.define(`named-equation-choice-input`,vt);var yt=class extends J{static properties={value:{type:String},inputLabel:{attribute:!1},checkLabel:{attribute:!1}};static styles=y`
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
  `;constructor(){super(),this.value=``,this.inputLabel=`Named equation`,this.checkLabel=`Check`}render(){return z`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation`);typeof t==`string`&&this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`text`,input:t}}))}};customElements.get(`named-equation-text-input`)===void 0&&customElements.define(`named-equation-text-input`,yt);var Q={"multiple-choice":{label:`Multiple choice`,render:({definition:e,screen:t,resources:n})=>z`
      <named-equation-choice-input
        .choices=${e.choices}
        .selectedChoiceId=${t.submission?.kind===`named-equation`?t.submission.choiceId:void 0}
        .legend=${n.quantitiesToNamedEquation.choiceLegend}
        .checkLabel=${n.controls.check}
      ></named-equation-choice-input>
    `},text:{label:`Text input`,render:({screen:e,resources:t})=>z`
      <named-equation-text-input
        .value=${e.submission?.kind===`named-equation`&&e.submission.answerKind===`text`?e.submission.input:``}
        .inputLabel=${t.quantitiesToNamedEquation.inputLabel}
        .checkLabel=${t.controls.check}
      ></named-equation-text-input>
    `}};function bt(e){return Object.hasOwn(Q,e)}var xt={render(e,t,n){n.textContent=c(e,t)}},St=class extends J{static properties={screen:{attribute:!1},knownLegend:{attribute:!1},unknownLegend:{attribute:!1},checkLabel:{attribute:!1}};static styles=y`
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
  `;constructor(){super(),this.screen={modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:``,quantities:[]},input:{kind:`quantity-selection`,knownIds:[]}},this.knownLegend=``,this.unknownLegend=``,this.checkLabel=``}render(){return z`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.knownLegend}</legend>
          ${this.screen.target.quantities.map(e=>z`
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
          ${this.screen.target.quantities.map(e=>z`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`unknown-quantity`);if(typeof n!=`string`)return;let r={knownIds:t.getAll(`known-quantity`).filter(e=>typeof e==`string`),unknownId:n};this.dispatchEvent(new CustomEvent(`puzzle-quantity-selection`,{bubbles:!0,composed:!0,detail:r}))}};customElements.get(`story-quantities-input`)===void 0&&customElements.define(`story-quantities-input`,St);var Ct=class extends J{static properties={heading:{type:String},sourceLabel:{attribute:`source-label`,type:String},targetLabel:{attribute:`target-label`,type:String},feedbackLabel:{attribute:`feedback-label`,type:String},prompt:{type:String},feedback:{type:String},replayLabel:{attribute:`replay-label`,type:String},hasReplay:{attribute:`has-replay`,type:Boolean}};static styles=y`
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
  `;constructor(){super(),this.heading=``,this.sourceLabel=``,this.targetLabel=``,this.feedbackLabel=``,this.prompt=``,this.feedback=``,this.replayLabel=``,this.hasReplay=!1}render(){return z`
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

        ${this.hasReplay?z`
              <details>
                <summary>${this.replayLabel}</summary>
                <slot name="replay"></slot>
              </details>
            `:null}
      </main>
    `}};customElements.get(`puzzle-shell`)===void 0&&customElements.define(`puzzle-shell`,Ct);var wt=class extends J{static properties={seed:{type:Number},themeId:{attribute:`theme-id`,type:String},modeId:{attribute:`mode-id`,type:String},locale:{type:String},menuLabel:{attribute:!1},scenarioLabel:{attribute:!1},dronePowerLabel:{attribute:!1},creatorFollowersLabel:{attribute:!1},taskLabel:{attribute:!1},storyToQuantitiesLabel:{attribute:!1},quantitiesToNamedEquationLabel:{attribute:!1},namedEquationToAcademicNotationLabel:{attribute:!1},academicNotationToNamedEquationLabel:{attribute:!1},seedLabel:{attribute:!1},showLabel:{attribute:!1}};static styles=y`
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
  `;constructor(){super(),this.seed=17,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.locale=`en`,this.menuLabel=`Puzzle menu`,this.scenarioLabel=`Scenario`,this.dronePowerLabel=`Spaceship and drones`,this.creatorFollowersLabel=`Creator and followers`,this.taskLabel=`Task`,this.storyToQuantitiesLabel=`Story to quantities`,this.quantitiesToNamedEquationLabel=`Quantities to named equation`,this.namedEquationToAcademicNotationLabel=`Named equation to academic notation`,this.academicNotationToNamedEquationLabel=`Academic notation to named equation`,this.seedLabel=`Seed`,this.showLabel=`Show puzzle`}render(){return z`
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
            max=${n}
            step="1"
            .value=${String(this.seed)}
            required
          />
        </label>
        <button type="submit">${this.showLabel}</button>
      </form>
    `}handleSubmit(n){if(n.preventDefault(),!(n.currentTarget instanceof HTMLFormElement))return;let i=new FormData(n.currentTarget),a=i.get(`scenario`),o=i.get(`task`),s=Number(i.get(`seed`));typeof a==`string`&&r(a)&&typeof o==`string`&&t(o)&&Number.isInteger(s)&&this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:{seed:s,themeId:a,modeId:o,locale:this.locale}}))}};customElements.get(`puzzle-menu`)===void 0&&customElements.define(`puzzle-menu`,wt);var Tt=class extends J{static properties={relation:{attribute:!1},symbols:{attribute:!1},adapter:{attribute:!1}};static styles=y`
    :host {
      display: block;
      min-width: 0;
    }
    .output {
      min-width: 0;
      overflow-x: auto;
    }
  `;constructor(){super(),this.relation=void 0,this.symbols={},this.adapter=xt}render(){return z`<div class="output" aria-label=${this.relation?c(this.relation,this.symbols):``}></div>`}updated(e){let t=this.renderRoot.querySelector(`.output`);t!==null&&this.relation!==void 0&&this.adapter.render(this.relation,this.symbols,t)}};customElements.get(`academic-notation-display`)===void 0&&customElements.define(`academic-notation-display`,Tt);var Et=class extends J{static properties={seed:{type:String},themeId:{attribute:`theme`,type:String},modeId:{attribute:`mode`,type:String},inputMode:{attribute:`input-mode`,reflect:!0,type:String},locale:{reflect:!0,type:String},academicDisplayAdapter:{attribute:!1},screen:{state:!0}};static styles=y`
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
  `;constructor(){super(),this.seed=`17`,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.inputMode=`text`,this.locale=`en`,this.academicDisplayAdapter=xt,this.screen=void 0,this.generatedProblem=$(17)}willUpdate(e){e.has(`seed`)&&(this.generatedProblem=$(Number(this.seed))),(e.has(`seed`)||e.has(`themeId`)||e.has(`modeId`)||e.has(`locale`))&&(this.screen=this.composeCurrentScreen())}composeCurrentScreen(){if(r(this.themeId)&&l(this.locale))return rt({problem:this.generatedProblem,themeId:this.themeId,modeId:t(this.modeId)?this.modeId:`story-to-quantities`,locale:this.locale,storySeed:Number(this.seed)})}render(){if(!r(this.themeId))return z`<p role="alert">
        Unknown scenario ${JSON.stringify(this.themeId)}.
      </p>`;if(!t(this.modeId))return z`<p role="alert">
        Unknown task ${JSON.stringify(this.modeId)}.
      </p>`;if(!l(this.locale))return z`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;if(this.screen===void 0)return z`<p role="alert">Puzzle screen is unavailable.</p>`;let e=this.screen,n=s[this.locale],i=this.headingFor(e.screen,n);return this.renderShell({locale:this.locale,heading:i,prompt:e.screen.target.prompt,feedback:e.feedback?.message??``,replay:e.context.replay,source:this.renderSource(e,n),input:this.renderInput(e,n)})}headingFor(e,t){switch(e.modeId){case`story-to-quantities`:return t.storyToQuantities.heading;case`quantities-to-named-equation`:return t.quantitiesToNamedEquation.heading;case`named-equation-to-academic-notation`:return t.namedEquationToAcademicNotation.heading;case`academic-notation-to-named-equation`:return t.academicNotationToNamedEquation.heading}}renderSource(e,t){let n=z`<p>${e.context.story}</p>`;switch(e.screen.modeId){case`story-to-quantities`:return n;case`quantities-to-named-equation`:return z`${n}${this.renderQuantityList(e)}`;case`named-equation-to-academic-notation`:return z`${n}${this.renderQuantityList(e)}
          <p class="equation">
            ${et(e.screen.source.relation,e.screen.source.names)}
          </p>
          ${this.renderSymbolKey(e.screen,t.namedEquationToAcademicNotation.symbolKey)}`;case`academic-notation-to-named-equation`:return z`${n}${this.renderQuantityList(e)}
          <academic-notation-display
            .relation=${e.screen.source.relation}
            .symbols=${e.screen.source.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>
          ${this.renderSymbolKey(e.screen,t.academicNotationToNamedEquation.symbolKey)}`}}renderQuantityList(e){return z`<ul class="quantity-list">
      ${e.context.quantities.map(e=>z`<li>
          ${e.variableName} =
          ${e.given.kind===`known`?e.given.value:`?`}
        </li>`)}
    </ul>`}renderSymbolKey(e,t){return z`<section class="symbol-key" aria-label=${t}>
      <h3>${t}</h3>
      <dl>
        ${e.symbolKey.map(e=>z`<dt>${e.symbol}</dt><dd>${e.variableName}</dd>`)}
      </dl>
    </section>`}renderInput(e,t){switch(e.screen.modeId){case`story-to-quantities`:return z`<div @puzzle-quantity-selection=${this.handleQuantitySelection}>
          <story-quantities-input
            .screen=${e.screen}
            .knownLegend=${t.storyToQuantities.knownLegend}
            .unknownLegend=${t.storyToQuantities.unknownLegend}
            .checkLabel=${t.controls.check}
          ></story-quantities-input>
        </div>`;case`quantities-to-named-equation`:return this.renderNamedEquationInput(this.locale);case`named-equation-to-academic-notation`:return this.renderTextExpressionInput(e,t.namedEquationToAcademicNotation.inputLabel,t.controls.check);case`academic-notation-to-named-equation`:return this.renderTextExpressionInput(e,t.academicNotationToNamedEquation.inputLabel,t.controls.check)}}renderTextExpressionInput(e,t,n){let r=e.screen.input.kind===`expression`?e.screen.input.value:``,i=e.screen.modeId===`named-equation-to-academic-notation`&&e.feedback?.kind===`accepted`&&e.submission?.kind===`academic-notation`?e.submission.relation:void 0;return z`<div @puzzle-answer=${this.handleAnswer}>
      <named-equation-text-input
        .value=${r}
        .inputLabel=${t}
        .checkLabel=${n}
      ></named-equation-text-input>
      ${i===void 0||e.screen.modeId!==`named-equation-to-academic-notation`?null:z`<academic-notation-display
            .relation=${i}
            .symbols=${e.screen.target.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>`}
    </div>`}renderNamedEquationInput(e){if(!bt(this.inputMode))return z`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;let t=this.screen;if(t===void 0||!r(this.themeId))return z``;let n=s[e],i=Q[this.inputMode],a=ht(this.generatedProblem,mt(this.themeId,this.generatedProblem,e,Number(this.seed)));return z`<div @puzzle-answer=${this.handleAnswer}>
      <nav aria-label=${n.controls.inputMode}>
        ${Object.keys(Q).map(e=>z`<button
            type="button"
            aria-pressed=${this.inputMode===e}
            @click=${()=>this.selectInputMode(e)}
          >
            ${e===`text`?n.controls.textInput:n.controls.multipleChoice}
          </button>`)}
      </nav>
      ${i.render({definition:{choices:a},screen:{...t,submission:t.submission},resources:n})}
    </div>`}handleAnswer(e){this.submitAnswer(e.detail)}submitAnswer(e){r(this.themeId)&&t(this.modeId)&&l(this.locale)&&(this.screen=it({problem:this.generatedProblem,themeId:this.themeId,modeId:this.modeId,locale:this.locale,storySeed:Number(this.seed),answer:e}))}selectInputMode(e){this.inputMode=e,this.screen=this.composeCurrentScreen()}handleQuantitySelection(e){this.submitAnswer(e.detail)}handleLocaleChange(e){if(e.currentTarget instanceof HTMLSelectElement&&l(e.currentTarget.value)){let t=e.currentTarget.value;this.locale=t,this.requestApplicationState({locale:t})}}requestApplicationState(n){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:{seed:Number(this.seed),themeId:r(this.themeId)?this.themeId:`gaming.drone-power`,modeId:t(this.modeId)?this.modeId:`story-to-quantities`,locale:n.locale}}))}renderShell({locale:e,heading:t,prompt:n,source:r,input:i,feedback:a,replay:o}){let c=s[e];return z`
      <puzzle-shell
        .heading=${t}
        .sourceLabel=${c.common.source}
        .targetLabel=${c.common.target}
        .feedbackLabel=${c.common.feedback}
        .prompt=${n}
        .feedback=${a}
        .replayLabel=${c.common.replay}
        .hasReplay=${o!==void 0}
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
          .namedEquationToAcademicNotationLabel=${c.puzzleMenu.namedEquationToAcademicNotation}
          .academicNotationToNamedEquationLabel=${c.puzzleMenu.academicNotationToNamedEquation}
          .seedLabel=${c.puzzleMenu.seed}
          .showLabel=${c.puzzleMenu.show}
        ></puzzle-menu>
        <div slot="source">${r}</div>
        <div slot="input">${i}</div>
        ${o===void 0?null:z`<dl slot="replay" class="replay-list">
              <dt>${c.common.seed}</dt>
              <dd>${o.seed}</dd>
              <dt>${c.common.generatorVersion}</dt>
              <dd>${o.generatorVersion}</dd>
              <dt>${c.common.scenario}</dt>
              <dd>${o.themeId}</dd>
              <dt>${c.common.storySeed}</dt>
              <dd>${o.storySeed}</dd>
            </dl>`}
      </puzzle-shell>
    `}};function $(e){return o({seed:Number.isSafeInteger(e)?e:17,config:i}).problem}customElements.get(`math-modeling-puzzle`)===void 0&&customElements.define(`math-modeling-puzzle`,Et);export{Et as MathModelingPuzzle};