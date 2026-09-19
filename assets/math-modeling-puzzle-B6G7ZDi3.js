import{c as e,d as t,i as n,n as r,o as i,s as a,u as o}from"./seeded-puzzle-ChmvY3Yc.js";var s=Object.defineProperty,c=(e,t)=>{let n={};for(var r in e)s(n,r,{get:e[r],enumerable:!0});return t||s(n,Symbol.toStringTag,{value:`Module`}),n},l=globalThis,u=l.ShadowRoot&&(l.ShadyCSS===void 0||l.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,d=Symbol(),f=new WeakMap,p=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==d)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(u&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=f.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&f.set(t,e))}return e}toString(){return this.cssText}},ee=e=>new p(typeof e==`string`?e:e+``,void 0,d),m=(e,...t)=>new p(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,d),te=(e,t)=>{if(u)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=l.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},ne=u?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return ee(t)})(e):e,{is:re,defineProperty:ie,getOwnPropertyDescriptor:ae,getOwnPropertyNames:oe,getOwnPropertySymbols:se,getPrototypeOf:ce}=Object,le=globalThis,ue=le.trustedTypes,de=ue?ue.emptyScript:``,fe=le.reactiveElementPolyfillSupport,pe=(e,t)=>e,me={toAttribute(e,t){switch(t){case Boolean:e=e?de:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},he=(e,t)=>!re(e,t),ge={attribute:!0,type:String,converter:me,reflect:!1,useDefault:!1,hasChanged:he};Symbol.metadata??=Symbol(`metadata`),le.litPropertyMetadata??=new WeakMap;var h=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ge){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&ie(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=ae(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ge}static _$Ei(){if(this.hasOwnProperty(pe(`elementProperties`)))return;let e=ce(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(pe(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pe(`properties`))){let e=this.properties,t=[...oe(e),...se(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(ne(e))}else e!==void 0&&t.push(ne(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return te(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?me:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?me:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??he)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};h.elementStyles=[],h.shadowRootOptions={mode:`open`},h[pe(`elementProperties`)]=new Map,h[pe(`finalized`)]=new Map,fe?.({ReactiveElement:h}),(le.reactiveElementVersions??=[]).push(`2.1.2`);var _e=globalThis,ve=e=>e,ye=_e.trustedTypes,be=ye?ye.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,xe=`$lit$`,g=`lit$${Math.random().toFixed(9).slice(2)}$`,Se=`?`+g,Ce=`<${Se}>`,_=document,we=()=>_.createComment(``),Te=e=>e===null||typeof e!=`object`&&typeof e!=`function`,Ee=Array.isArray,De=e=>Ee(e)||typeof e?.[Symbol.iterator]==`function`,Oe=`[ 	
\f\r]`,ke=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ae=/-->/g,je=/>/g,v=RegExp(`>|${Oe}(?:([^\\s"'>=/]+)(${Oe}*=${Oe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),Me=/'/g,Ne=/"/g,Pe=/^(?:script|style|textarea|title)$/i,y=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),b=Symbol.for(`lit-noChange`),x=Symbol.for(`lit-nothing`),Fe=new WeakMap,S=_.createTreeWalker(_,129);function Ie(e,t){if(!Ee(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return be===void 0?t:be.createHTML(t)}var Le=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=ke;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===ke?c[1]===`!--`?o=Ae:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=v):(Pe.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=v):o=je:o===v?c[0]===`>`?(o=i??ke,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?v:c[3]===`"`?Ne:Me):o===Ne||o===Me?o=v:o===Ae||o===je?o=ke:(o=v,i=void 0);let d=o===v&&e[t+1].startsWith(`/>`)?` `:``;a+=o===ke?n+Ce:l>=0?(r.push(s),n.slice(0,l)+xe+n.slice(l)+g+d):n+g+(l===-2?t:d)}return[Ie(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Re=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Le(t,n);if(this.el=e.createElement(l,r),S.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=S.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(xe)){let t=u[o++],n=i.getAttribute(e).split(g),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?He:r[1]===`?`?Ue:r[1]===`@`?We:Ve}),i.removeAttribute(e)}else e.startsWith(g)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Pe.test(i.tagName)){let e=i.textContent.split(g),t=e.length-1;if(t>0){i.textContent=ye?ye.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],we()),S.nextNode(),c.push({type:2,index:++a});i.append(e[t],we())}}}else if(i.nodeType===8){if(i.data===Se)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(g,e+1))!==-1;)c.push({type:7,index:a}),e+=g.length-1}}a++}}static createElement(e,t){let n=_.createElement(`template`);return n.innerHTML=e,n}};function C(e,t,n=e,r){if(t===b)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=Te(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=C(e,i._$AS(e,t.values),i,r)),t}var ze=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??_).importNode(t,!0);S.currentNode=r;let i=S.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Be(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Ge(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=S.nextNode(),a++)}return S.currentNode=_,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Be=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),Te(e)?e===x||e==null||e===``?(this._$AH!==x&&this._$AR(),this._$AH=x):e!==this._$AH&&e!==b&&this._(e):e._$litType$===void 0?e.nodeType===void 0?De(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==x&&Te(this._$AH)?this._$AA.nextSibling.data=e:this.T(_.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Re.createElement(Ie(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new ze(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Fe.get(e.strings);return t===void 0&&Fe.set(e.strings,t=new Re(e)),t}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(we()),this.O(we()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=ve(e).nextSibling;ve(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Ve=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=x,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=C(this,e,t,0),a=!Te(e)||e!==this._$AH&&e!==b,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=C(this,r[n+o],t,o),s===b&&(s=this._$AH[o]),a||=!Te(s)||s!==this._$AH[o],s===x?e=x:e!==x&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},He=class extends Ve{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===x?void 0:e}},Ue=class extends Ve{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==x)}},We=class extends Ve{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??x)===b)return;let n=this._$AH,r=e===x&&n!==x||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==x&&(n===x||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ge=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}},Ke=_e.litHtmlPolyfillSupport;Ke?.(Re,Be),(_e.litHtmlVersions??=[]).push(`3.3.3`);var qe=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Be(t.insertBefore(we(),e),e,void 0,n??{})}return i._$AI(e),i},Je=globalThis,w=class extends h{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};w._$litElement$=!0,w.finalized=!0,Je.litElementHydrateSupport?.({LitElement:w});var Ye=Je.litElementPolyfillSupport;Ye?.({LitElement:w}),(Je.litElementVersions??=[]).push(`4.2.2`);function Xe(e,t=`Write an equation that relates these quantities.`){return{source:{kind:`quantities`,quantities:e.quantities.map(e=>({id:e.id,role:e.role,given:e.given.kind===`known`?{kind:`known`,value:e.given.value}:{kind:`hidden`}})),text:`TODO: Refactor such that problem kind and story are separated.`},target:{kind:`named-equation`,prompt:t},input:{kind:`expression`,value:``},replay:e.replay?{...e.replay}:void 0}}var Ze=c({StringBuffer:()=>k,abstract:()=>E,assert:()=>D,checkNotNull:()=>ut,clone:()=>$e,copyWithoutDuplicates:()=>it,defineLazyProperty:()=>Qe,getDuplicates:()=>rt,isLexical:()=>at,isSyntactic:()=>O,padLeft:()=>ot,repeat:()=>nt,repeatFn:()=>et,repeatStr:()=>tt,unescapeCodePoint:()=>ct,unexpectedObjToString:()=>lt}),T={};for(let e=0;e<128;e++)T[e]=String.fromCharCode(e);T[39]=`\\'`,T[34]=`\\"`,T[92]=`\\\\`,T[8]=`\\b`,T[12]=`\\f`,T[10]=`\\n`,T[13]=`\\r`,T[9]=`\\t`,T[11]=`\\v`;function E(e){let t=e||``;return function(){throw Error(`this method `+t+` is abstract! (it has no implementation in class `+this.constructor.name+`)`)}}function D(e,t){if(!e)throw Error(t||`Assertion failed`)}function Qe(e,t,n){let r;Object.defineProperty(e,t,{get(){return r||=n.call(this),r}})}function $e(e){return e&&Object.assign({},e)}function et(e,t){let n=[];for(;t-->0;)n.push(e());return n}function tt(e,t){return Array(t+1).join(e)}function nt(e,t){return et(()=>e,t)}function rt(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];e.lastIndexOf(r)!==n&&t.indexOf(r)<0&&t.push(r)}return t}function it(e){let t=[];return e.forEach(e=>{t.indexOf(e)<0&&t.push(e)}),t}function O(e){let t=e[0];return t===t.toUpperCase()}function at(e){return!O(e)}function ot(e,t,n){let r=n||` `;return e.length<t?tt(r,t-e.length)+e:e}function k(){this.strings=[]}k.prototype.append=function(e){this.strings.push(e)},k.prototype.contents=function(){return this.strings.join(``)};var st=e=>String.fromCodePoint(parseInt(e,16));function ct(e){if(e.charAt(0)===`\\`)switch(e.charAt(1)){case`b`:return`\b`;case`f`:return`\f`;case`n`:return`
`;case`r`:return`\r`;case`t`:return`	`;case`v`:return`\v`;case`x`:return st(e.slice(2,4));case`u`:return e.charAt(2)===`{`?st(e.slice(3,-1)):st(e.slice(2,6));default:return e.charAt(1)}else return e}function lt(e){if(e==null)return String(e);let t=Object.prototype.toString.call(e);try{let n;return n=e.constructor&&e.constructor.name?e.constructor.name:t.indexOf(`[object `)===0?t.slice(8,-1):typeof e,n+`: `+JSON.stringify(String(e))}catch{return t}}function ut(e,t=`unexpected null value`){if(e==null)throw Error(t);return e}var dt=e=>new RegExp(String.raw`\p{${e}}`,`u`),ft=Object.fromEntries(`Cc.Cf.Cn.Co.Cs.Ll.Lm.Lo.Lt.Lu.Mc.Me.Mn.Nd.Nl.No.Pc.Pd.Pe.Pf.Pi.Po.Ps.Sc.Sk.Sm.So.Zl.Zp.Zs`.split(`.`).map(e=>[e,dt(e)]));ft.Ltmo=/\p{Lt}|\p{Lm}|\p{Lo}/u;var pt=Object.fromEntries([`XID_Start`,`XID_Continue`,`White_Space`].map(e=>[e,dt(e)])),A=class e{constructor(){if(this.constructor===e)throw Error(`PExpr cannot be instantiated -- it's abstract`)}withSource(e){return e&&(this.source=e.trimmed()),this}},j=Object.create(A.prototype),M=Object.create(A.prototype),N=class extends A{constructor(e){super(),this.obj=e}},P=class extends A{constructor(e,t){super(),this.from=e,this.to=t,this.matchCodePoint=e.length>1||t.length>1}},F=class extends A{constructor(e){super(),this.index=e}},I=class extends A{constructor(e){super(),this.terms=e}},mt=class extends I{constructor(e,t,n){let r=e.rules[t].body;super([n,r]),this.superGrammar=e,this.name=t,this.body=n}},ht=class extends I{constructor(e,t,n,r){let i=e.rules[t].body;super([...n,i,...r]),this.superGrammar=e,this.ruleName=t,this.expansionPos=n.length}},L=class extends A{constructor(e){super(),this.factors=e}},R=class extends A{constructor(e){super(),this.expr=e}},z=class extends R{},B=class extends R{},V=class extends R{};z.prototype.operator=`*`,B.prototype.operator=`+`,V.prototype.operator=`?`,z.prototype.minNumMatches=0,B.prototype.minNumMatches=1,V.prototype.minNumMatches=0,z.prototype.maxNumMatches=1/0,B.prototype.maxNumMatches=1/0,V.prototype.maxNumMatches=1;var H=class extends A{constructor(e){super(),this.expr=e}},U=class extends A{constructor(e){super(),this.expr=e}},W=class extends A{constructor(e){super(),this.expr=e}},G=class extends A{constructor(e,t=[]){super(),this.ruleName=e,this.args=t}isSyntactic(){return O(this.ruleName)}toMemoKey(){return this._memoKey||Object.defineProperty(this,"_memoKey",{value:this.toString()}),this._memoKey}},K=class extends A{constructor(e){if(super(),this.categoryOrProp=e,e in ft)this.pattern=ft[e];else if(e in pt)this.pattern=pt[e];else throw Error(`Invalid Unicode category or property name: ${JSON.stringify(e)}`)}};function q(e,t){let n;return t?(n=Error(t.getLineAndColumnMessage()+e),n.shortMessage=e,n.interval=t):n=Error(e),n}function gt(){return q(`Interval sources don't match`)}function _t(e){let t=Error();return Object.defineProperty(t,"message",{enumerable:!0,get(){return e.message}}),Object.defineProperty(t,"shortMessage",{enumerable:!0,get(){return`Expected `+e.getExpectedText()}}),t.interval=e.getInterval(),t}function vt(e,t,n){return q(t?`Grammar ${e} is not declared in namespace '${t}'`:`Undeclared grammar `+e,n)}function yt(e,t){return q(`Grammar `+e.name+` is already declared in this namespace`)}function bt(e){return q(`Grammar '${e.name}' does not support incremental parsing`)}function xt(e,t,n){return q(`Rule `+e+` is not declared in grammar `+t,n)}function St(e,t,n){return q(`Cannot override rule `+e+` because it is not declared in `+t,n)}function Ct(e,t,n){return q(`Cannot extend rule `+e+` because it is not declared in `+t,n)}function wt(e,t,n,r){let i=`Duplicate declaration for rule '`+e+`' in grammar '`+t+`'`;return t!==n&&(i+=` (originally declared in '`+n+`')`),q(i,r)}function Tt(e,t,n,r){return q(`Wrong number of parameters for rule `+e+` (expected `+t+`, got `+n+`)`,r)}function Et(e,t,n,r){return q(`Wrong number of arguments for rule `+e+` (expected `+t+`, got `+n+`)`,r)}function Dt(e,t,n){return q(`Duplicate parameter names in rule `+e+`: `+t.join(`, `),n)}function Ot(e,t){return q(`Invalid parameter to rule `+e+`: `+t+` has arity `+t.getArity()+`, but parameter expressions must have arity 1`,t.source)}function kt(e,t){return q(`Cannot apply syntactic rule `+e+` from here (inside a lexical context)`,t.source)}function At(e){let{ruleName:t}=e;return q(`applySyntactic is for syntactic rules, but '${t}' is a lexical rule. NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. See https://ohmjs.org/d/svl for more details.`,e.source)}function jt(e){return q(`applySyntactic is not required here (in a syntactic context)`,e.source)}function Mt(e,t){return q(`Incorrect argument type: expected `+e,t.source)}function Nt(e){return q(`'...' can appear at most once in a rule body`,e.source)}function Pt(e){let t=e._node;D(t&&t.isNonterminal()&&t.ctorName===`escapeChar_unicodeCodePoint`);let n=e.children.slice(1,-1).map(e=>e.source),r=n[0].coverageWith(...n.slice(1));return q(`U+${r.contents} is not a valid Unicode code point`,r)}function Ft(e,t){let n=t.length>0?t[t.length-1].args:[],r=`Nullable expression `+e.expr.substituteParams(n)+` is not allowed inside '`+e.operator+`' (possible infinite loop)`;if(t.length>0){let e=t.map(e=>new G(e.ruleName,e.args)).join(`
`);r+=`
Application stack (most recent application last):
`+e}return q(r,e.expr.source)}function It(e,t,n,r){return q(`Rule `+e+` involves an alternation which has inconsistent arity (expected `+t+`, got `+n+`)`,r.source)}function Lt(e){let t=e.map(e=>e.message);return q([`Errors:`].concat(t).join(`
- `),e[0].interval)}function Rt(e,t,n,r){let i=r.slice(0,-1).map(e=>{let t=`  `+e[0].name+` > `+e[1];return e.length===3?t+` for '`+e[2]+`'`:t}).join(`
`);i+=`
  `+t+` > `+e;let a=``;e===`_iter`&&(a=[`
NOTE: as of Ohm v16, there is no default action for iteration nodes — see `,`  https://ohmjs.org/d/dsa for details.`].join(`
`));let o=q([`Missing semantic action for '${e}' in ${n} '${t}'.${a}`,`Action stack (most recent call last):`,i].join(`
`));return o.name=`missingSemanticAction`,o}function zt(e){if(e.length===1)throw e[0];if(e.length>1)throw Lt(e)}function Bt(e){let t=0;return e.map(e=>{let n=e.toString();return t=Math.max(t,n.length),n}).map(e=>ot(e,t))}function Vt(e,t,n){let r=e.length,i=e.slice(0,n),a=e.slice(n+t.length);return(i+t+a).substr(0,r)}function Ht(...e){let t=this,{offset:n}=t,{repeatStr:r}=Ze,i=new k;i.append(`Line `+t.lineNum+`, col `+t.colNum+`:
`);let a=Bt([t.prevLine==null?0:t.lineNum-1,t.lineNum,t.nextLine==null?0:t.lineNum+1]),o=(e,t,n)=>{i.append(n+a[e]+` | `+t+`
`)};t.prevLine!=null&&o(0,t.prevLine,`  `),o(1,t.line,`> `);let s=t.line.length,c=r(` `,s+1);for(let i=0;i<e.length;++i){let a=e[i][0],o=e[i][1];D(a>=0&&a<=o,`range start must be >= 0 and <= end`);let l=n-t.colNum+1;a=Math.max(0,a-l),o=Math.min(o-l,s),c=Vt(c,r(`~`,o-a),a)}let l=2+a[1].length+3;return i.append(r(` `,l)),c=Vt(c,`^`,t.colNum-1),i.append(c.replace(/ +$/,``)+`
`),t.nextLine!=null&&o(2,t.nextLine,`  `),i.contents()}var Ut=[];function Wt(e){Ut.push(e)}function Gt(e){Ut.forEach(t=>{t(e)}),Ut=null}function Kt(e,t){let n=1,r=1,i=0,a=0,o=null,s=null,c=-1;for(;i<t;){let t=e.charAt(i++);t===`
`?(n++,r=1,c=a,a=i):t!==`\r`&&r++}let l=e.indexOf(`
`,a);if(l===-1)l=e.length;else{let t=e.indexOf(`
`,l+1);o=t===-1?e.slice(l):e.slice(l,t),o=o.replace(/^\r?\n/,``).replace(/\r$/,``)}c>=0&&(s=e.slice(c,a).replace(/\r?\n$/,``));let u=e.slice(a,l).replace(/\r$/,``);return{offset:t,lineNum:n,colNum:r,line:u,prevLine:s,nextLine:o,toString:Ht}}function qt(e,t,...n){return Kt(e,t).toString(...n)}var Jt=(()=>{let e=0;return t=>``+t+e++})(),Yt=class e{constructor(e,t,n){Object.defineProperty(this,"_sourceString",{value:e,configurable:!1,enumerable:!1,writable:!1}),this.startIdx=t,this.endIdx=n}get sourceString(){return this._sourceString}get contents(){return this._contents===void 0&&(this._contents=this.sourceString.slice(this.startIdx,this.endIdx)),this._contents}get length(){return this.endIdx-this.startIdx}coverageWith(...t){return e.coverage(...t,this)}collapsedLeft(){return new e(this.sourceString,this.startIdx,this.startIdx)}collapsedRight(){return new e(this.sourceString,this.endIdx,this.endIdx)}getLineAndColumn(){return Kt(this.sourceString,this.startIdx)}getLineAndColumnMessage(){let e=[this.startIdx,this.endIdx];return qt(this.sourceString,this.startIdx,e)}minus(t){if(this.sourceString!==t.sourceString)throw gt();return this.startIdx===t.startIdx&&this.endIdx===t.endIdx?[]:this.startIdx<t.startIdx&&t.endIdx<this.endIdx?[new e(this.sourceString,this.startIdx,t.startIdx),new e(this.sourceString,t.endIdx,this.endIdx)]:this.startIdx<t.endIdx&&t.endIdx<this.endIdx?[new e(this.sourceString,t.endIdx,this.endIdx)]:this.startIdx<t.startIdx&&t.startIdx<this.endIdx?[new e(this.sourceString,this.startIdx,t.startIdx)]:[this]}relativeTo(t){if(this.sourceString!==t.sourceString)throw gt();return D(this.startIdx>=t.startIdx&&this.endIdx<=t.endIdx,`other interval does not cover this one`),new e(this.sourceString,this.startIdx-t.startIdx,this.endIdx-t.startIdx)}trimmed(){let{contents:t}=this,n=this.startIdx+t.match(/^\s*/)[0].length,r=this.endIdx-t.match(/\s*$/)[0].length;return new e(this.sourceString,n,r)}subInterval(t,n){let r=this.startIdx+t;return new e(this.sourceString,r,r+n)}};Yt.coverage=function(e,...t){let{startIdx:n,endIdx:r}=e;for(let i of t)if(i.sourceString!==e.sourceString)throw gt();else n=Math.min(n,i.startIdx),r=Math.max(r,i.endIdx);return new Yt(e.sourceString,n,r)};var Xt=65535,Zt=class{constructor(e){this.source=e,this.pos=0,this.examinedLength=0}atEnd(){let e=this.pos>=this.source.length;return this.examinedLength=Math.max(this.examinedLength,this.pos+1),e}next(){let e=this.source[this.pos++];return this.examinedLength=Math.max(this.examinedLength,this.pos),e}nextCharCode(){let e=this.next();return e&&e.charCodeAt(0)}nextCodePoint(){let e=this.source.slice(this.pos++).codePointAt(0);return e>Xt&&(this.pos+=1),this.examinedLength=Math.max(this.examinedLength,this.pos),e}matchString(e,t){let n;if(t){for(n=0;n<e.length;n++){let t=this.next(),r=e[n];if(t==null||t.toUpperCase()!==r.toUpperCase())return!1}return!0}for(n=0;n<e.length;n++)if(this.next()!==e[n])return!1;return!0}sourceSlice(e,t){return this.source.slice(e,t)}interval(e,t){return new Yt(this.source,e,t||this.pos)}},Qt=class{constructor(e,t,n,r,i,a,o){this.matcher=e,this.input=t,this.startExpr=n,this._cst=r,this._cstOffset=i,this._rightmostFailurePosition=a,this._rightmostFailures=o,this.failed()&&(Qe(this,`message`,function(){let e=`Expected `+this.getExpectedText();return qt(this.input,this.getRightmostFailurePosition())+e}),Qe(this,`shortMessage`,function(){let e=`expected `+this.getExpectedText(),t=Kt(this.input,this.getRightmostFailurePosition());return`Line `+t.lineNum+`, col `+t.colNum+`: `+e}))}succeeded(){return!!this._cst}failed(){return!this.succeeded()}getRightmostFailurePosition(){return this._rightmostFailurePosition}getRightmostFailures(){if(!this._rightmostFailures){this.matcher.setInput(this.input);let e=this.matcher._match(this.startExpr,{tracing:!1,positionToRecordFailures:this.getRightmostFailurePosition()});this._rightmostFailures=e.getRightmostFailures()}return this._rightmostFailures}toString(){return this.succeeded()?`[match succeeded]`:`[match failed at position `+this.getRightmostFailurePosition()+`]`}getExpectedText(){if(this.succeeded())throw Error(`cannot get expected text of a successful MatchResult`);let e=new k,t=this.getRightmostFailures();t=t.filter(e=>!e.isFluffy());for(let n=0;n<t.length;n++)n>0&&(n===t.length-1?e.append(t.length>2?`, or `:` or `):e.append(`, `)),e.append(t[n].toString());return e.contents()}getInterval(){let e=this.getRightmostFailurePosition();return new Yt(this.input,e,e)}},$t=class{constructor(){this.applicationMemoKeyStack=[],this.memo={},this.maxExaminedLength=0,this.maxRightmostFailureOffset=-1,this.currentLeftRecursion=void 0}isActive(e){return this.applicationMemoKeyStack.indexOf(e.toMemoKey())>=0}enter(e){this.applicationMemoKeyStack.push(e.toMemoKey())}exit(){this.applicationMemoKeyStack.pop()}startLeftRecursion(e,t){t.isLeftRecursion=!0,t.headApplication=e,t.nextLeftRecursion=this.currentLeftRecursion,this.currentLeftRecursion=t;let{applicationMemoKeyStack:n}=this,r=n.indexOf(e.toMemoKey())+1,i=n.slice(r);t.isInvolved=function(e){return i.indexOf(e)>=0},t.updateInvolvedApplicationMemoKeys=function(){for(let e=r;e<n.length;e++){let t=n[e];this.isInvolved(t)||i.push(t)}}}endLeftRecursion(){this.currentLeftRecursion=this.currentLeftRecursion.nextLeftRecursion}shouldUseMemoizedResult(e){if(!e.isLeftRecursion)return!0;let{applicationMemoKeyStack:t}=this;for(let n=0;n<t.length;n++){let r=t[n];if(e.isInvolved(r))return!1}return!0}memoize(e,t){return this.memo[e]=t,this.maxExaminedLength=Math.max(this.maxExaminedLength,t.examinedLength),this.maxRightmostFailureOffset=Math.max(this.maxRightmostFailureOffset,t.rightmostFailureOffset),t}clearObsoleteEntries(e,t){if(e+this.maxExaminedLength<=t)return;let{memo:n}=this;this.maxExaminedLength=0,this.maxRightmostFailureOffset=-1,Object.keys(n).forEach(r=>{let i=n[r];e+i.examinedLength>t?delete n[r]:(this.maxExaminedLength=Math.max(this.maxExaminedLength,i.examinedLength),this.maxRightmostFailureOffset=Math.max(this.maxRightmostFailureOffset,i.rightmostFailureOffset))})}},en=`✗`,tn=`✓`,nn=`⋅`,rn=`␉`,an=`␊`,on=`␍`,sn={succeeded:1,isRootNode:2,isImplicitSpaces:4,isMemoized:8,isHeadOfLeftRecursion:16,terminatesLR:32};function cn(e){return nt(` `,e).join(``)}function ln(e,t,n){let r=un(e.slice(t,t+n));return r.length<n?r+nt(` `,n-r.length).join(``):r}function un(e){return typeof e==`string`?e.replace(/ /g,nn).replace(/\t/g,rn).replace(/\n/g,an).replace(/\r/g,on):String(e)}var dn=class e{constructor(e,t,n,r,i,a,o){this.input=e,this.pos=this.pos1=t,this.pos2=n,this.source=new Yt(e,t,n),this.expr=r,this.bindings=a,this.children=o||[],this.terminatingLREntry=null,this._flags=i?sn.succeeded:0}get displayString(){return this.expr.toDisplayString()}clone(){return this.cloneWithExpr(this.expr)}cloneWithExpr(t){let n=new e(this.input,this.pos,this.pos2,t,this.succeeded,this.bindings,this.children);return n.isHeadOfLeftRecursion=this.isHeadOfLeftRecursion,n.isImplicitSpaces=this.isImplicitSpaces,n.isMemoized=this.isMemoized,n.isRootNode=this.isRootNode,n.terminatesLR=this.terminatesLR,n.terminatingLREntry=this.terminatingLREntry,n}recordLRTermination(t,n){this.terminatingLREntry=new e(this.input,this.pos,this.pos2,this.expr,!1,[n],[t]),this.terminatingLREntry.terminatesLR=!0}walk(t,n){let r=t;typeof r==`function`&&(r={enter:r});function i(t,a,o){let s=!0;r.enter&&r.enter.call(n,t,a,o)===e.prototype.SKIP&&(s=!1),s&&(t.children.forEach(e=>{i(e,t,o+1)}),r.exit&&r.exit.call(n,t,a,o))}this.isRootNode?this.children.forEach(e=>{i(e,null,0)}):i(this,null,0)}toString(){let e=new k;return this.walk((t,n,r)=>{if(!t)return this.SKIP;if(t.expr.constructor.name!==`Alt`){if(e.append(ln(t.input,t.pos,10)+cn(r*2+1)),e.append((t.succeeded?tn:en)+` `+t.displayString),t.isHeadOfLeftRecursion&&e.append(` (LR)`),t.succeeded){let n=un(t.source.contents);e.append(` ⇒  `),e.append(typeof n==`string`?`"`+n+`"`:n)}e.append(`
`)}}),e.contents()}};dn.prototype.SKIP={},Object.keys(sn).forEach(e=>{let t=sn[e];Object.defineProperty(dn.prototype,e,{get(){return(this._flags&t)!==0},set(e){e?this._flags|=t:this._flags&=~t}})}),A.prototype.allowsSkippingPrecedingSpace=E(`allowsSkippingPrecedingSpace`),j.allowsSkippingPrecedingSpace=M.allowsSkippingPrecedingSpace=G.prototype.allowsSkippingPrecedingSpace=N.prototype.allowsSkippingPrecedingSpace=P.prototype.allowsSkippingPrecedingSpace=K.prototype.allowsSkippingPrecedingSpace=function(){return!0},I.prototype.allowsSkippingPrecedingSpace=R.prototype.allowsSkippingPrecedingSpace=W.prototype.allowsSkippingPrecedingSpace=U.prototype.allowsSkippingPrecedingSpace=H.prototype.allowsSkippingPrecedingSpace=F.prototype.allowsSkippingPrecedingSpace=L.prototype.allowsSkippingPrecedingSpace=function(){return!1};var fn;Wt(e=>{fn=e});var pn;A.prototype.assertAllApplicationsAreValid=function(e,t){pn=0,this._assertAllApplicationsAreValid(e,t)},A.prototype._assertAllApplicationsAreValid=E(`_assertAllApplicationsAreValid`),j._assertAllApplicationsAreValid=M._assertAllApplicationsAreValid=N.prototype._assertAllApplicationsAreValid=P.prototype._assertAllApplicationsAreValid=F.prototype._assertAllApplicationsAreValid=K.prototype._assertAllApplicationsAreValid=function(e,t){},W.prototype._assertAllApplicationsAreValid=function(e,t){pn++,this.expr._assertAllApplicationsAreValid(e,t),pn--},I.prototype._assertAllApplicationsAreValid=function(e,t){for(let n=0;n<this.terms.length;n++)this.terms[n]._assertAllApplicationsAreValid(e,t)},L.prototype._assertAllApplicationsAreValid=function(e,t){for(let n=0;n<this.factors.length;n++)this.factors[n]._assertAllApplicationsAreValid(e,t)},R.prototype._assertAllApplicationsAreValid=H.prototype._assertAllApplicationsAreValid=U.prototype._assertAllApplicationsAreValid=function(e,t){this.expr._assertAllApplicationsAreValid(e,t)},G.prototype._assertAllApplicationsAreValid=function(e,t,n=!1){let r=t.rules[this.ruleName],i=O(e)&&pn===0;if(!r)throw xt(this.ruleName,t.name,this.source);if(!n&&O(this.ruleName)&&!i)throw kt(this.ruleName,this);let a=this.args.length,o=r.formals.length;if(a!==o)throw Et(this.ruleName,o,a,this.source);let s=fn&&r===fn.rules.applySyntactic;if(fn&&r===fn.rules.caseInsensitive&&!(this.args[0]instanceof N))throw Mt(`a Terminal (e.g. "abc")`,this.args[0]);if(s){let e=this.args[0];if(!(e instanceof G))throw Mt(`a syntactic rule application`,e);if(!O(e.ruleName))throw At(e);if(i)throw jt(this)}this.args.forEach(n=>{if(n._assertAllApplicationsAreValid(e,t,s),n.getArity()!==1)throw Ot(this.ruleName,n)})},A.prototype.assertChoicesHaveUniformArity=E(`assertChoicesHaveUniformArity`),j.assertChoicesHaveUniformArity=M.assertChoicesHaveUniformArity=N.prototype.assertChoicesHaveUniformArity=P.prototype.assertChoicesHaveUniformArity=F.prototype.assertChoicesHaveUniformArity=W.prototype.assertChoicesHaveUniformArity=K.prototype.assertChoicesHaveUniformArity=function(e){},I.prototype.assertChoicesHaveUniformArity=function(e){if(this.terms.length===0)return;let t=this.terms[0].getArity();for(let n=0;n<this.terms.length;n++){let r=this.terms[n];r.assertChoicesHaveUniformArity();let i=r.getArity();if(t!==i)throw It(e,t,i,r)}},mt.prototype.assertChoicesHaveUniformArity=function(e){let t=this.terms[0].getArity(),n=this.terms[1].getArity();if(t!==n)throw It(e,n,t,this.terms[0])},L.prototype.assertChoicesHaveUniformArity=function(e){for(let t=0;t<this.factors.length;t++)this.factors[t].assertChoicesHaveUniformArity(e)},R.prototype.assertChoicesHaveUniformArity=function(e){this.expr.assertChoicesHaveUniformArity(e)},H.prototype.assertChoicesHaveUniformArity=function(e){},U.prototype.assertChoicesHaveUniformArity=function(e){this.expr.assertChoicesHaveUniformArity(e)},G.prototype.assertChoicesHaveUniformArity=function(e){},A.prototype.assertIteratedExprsAreNotNullable=E(`assertIteratedExprsAreNotNullable`),j.assertIteratedExprsAreNotNullable=M.assertIteratedExprsAreNotNullable=N.prototype.assertIteratedExprsAreNotNullable=P.prototype.assertIteratedExprsAreNotNullable=F.prototype.assertIteratedExprsAreNotNullable=K.prototype.assertIteratedExprsAreNotNullable=function(e){},I.prototype.assertIteratedExprsAreNotNullable=function(e){for(let t=0;t<this.terms.length;t++)this.terms[t].assertIteratedExprsAreNotNullable(e)},L.prototype.assertIteratedExprsAreNotNullable=function(e){for(let t=0;t<this.factors.length;t++)this.factors[t].assertIteratedExprsAreNotNullable(e)},R.prototype.assertIteratedExprsAreNotNullable=function(e){if(this.expr.assertIteratedExprsAreNotNullable(e),this.expr.isNullable(e))throw Ft(this,[])},V.prototype.assertIteratedExprsAreNotNullable=H.prototype.assertIteratedExprsAreNotNullable=U.prototype.assertIteratedExprsAreNotNullable=W.prototype.assertIteratedExprsAreNotNullable=function(e){this.expr.assertIteratedExprsAreNotNullable(e)},G.prototype.assertIteratedExprsAreNotNullable=function(e){this.args.forEach(t=>{t.assertIteratedExprsAreNotNullable(e)})};var mn=class{constructor(e){this.matchLength=e}get ctorName(){throw Error(`subclass responsibility`)}numChildren(){return this.children?this.children.length:0}childAt(e){if(this.children)return this.children[e]}indexOfChild(e){return this.children.indexOf(e)}hasChildren(){return this.numChildren()>0}hasNoChildren(){return!this.hasChildren()}onlyChild(){if(this.numChildren()!==1)throw Error(`cannot get only child of a node of type `+this.ctorName+` (it has `+this.numChildren()+` children)`);return this.firstChild()}firstChild(){if(this.hasNoChildren())throw Error(`cannot get first child of a `+this.ctorName+` node, which has no children`);return this.childAt(0)}lastChild(){if(this.hasNoChildren())throw Error(`cannot get last child of a `+this.ctorName+` node, which has no children`);return this.childAt(this.numChildren()-1)}childBefore(e){let t=this.indexOfChild(e);if(t<0)throw Error(`Node.childBefore() called w/ an argument that is not a child`);if(t===0)throw Error(`cannot get child before first child`);return this.childAt(t-1)}childAfter(e){let t=this.indexOfChild(e);if(t<0)throw Error(`Node.childAfter() called w/ an argument that is not a child`);if(t===this.numChildren()-1)throw Error(`cannot get child after last child`);return this.childAt(t+1)}isTerminal(){return!1}isNonterminal(){return!1}isIteration(){return!1}isOptional(){return!1}},J=class extends mn{get ctorName(){return`_terminal`}isTerminal(){return!0}get primitiveValue(){throw Error("The `primitiveValue` property was removed in Ohm v17.")}},hn=class extends mn{constructor(e,t,n,r){super(r),this.ruleName=e,this.children=t,this.childOffsets=n}get ctorName(){return this.ruleName}isNonterminal(){return!0}isLexical(){return at(this.ctorName)}isSyntactic(){return O(this.ctorName)}},gn=class extends mn{constructor(e,t,n,r){super(n),this.children=e,this.childOffsets=t,this.optional=r}get ctorName(){return`_iter`}isIteration(){return!0}isOptional(){return this.optional}};A.prototype.eval=E(`eval`),j.eval=function(e){let{inputStream:t}=e,n=t.pos,r=t.nextCodePoint();return r===void 0?(e.processFailure(n,this),!1):(e.pushBinding(new J(String.fromCodePoint(r).length),n),!0)},M.eval=function(e){let{inputStream:t}=e,n=t.pos;return t.atEnd()?(e.pushBinding(new J(0),n),!0):(e.processFailure(n,this),!1)},N.prototype.eval=function(e){let{inputStream:t}=e,n=t.pos;return t.matchString(this.obj)?(e.pushBinding(new J(this.obj.length),n),!0):(e.processFailure(n,this),!1)},P.prototype.eval=function(e){let{inputStream:t}=e,n=t.pos,r=this.matchCodePoint?t.nextCodePoint():t.nextCharCode();return r!==void 0&&this.from.codePointAt(0)<=r&&r<=this.to.codePointAt(0)?(e.pushBinding(new J(String.fromCodePoint(r).length),n),!0):(e.processFailure(n,this),!1)},F.prototype.eval=function(e){return e.eval(e.currentApplication().args[this.index])},W.prototype.eval=function(e){e.enterLexifiedContext();let t=e.eval(this.expr);return e.exitLexifiedContext(),t},I.prototype.eval=function(e){for(let t=0;t<this.terms.length;t++)if(e.eval(this.terms[t]))return!0;return!1},L.prototype.eval=function(e){for(let t=0;t<this.factors.length;t++){let n=this.factors[t];if(!e.eval(n))return!1}return!0},R.prototype.eval=function(e){let{inputStream:t}=e,n=t.pos,r=this.getArity(),i=[],a=[];for(;i.length<r;)i.push([]),a.push([]);let o=0,s=n,c;for(;o<this.maxNumMatches&&e.eval(this.expr);){if(t.pos===s)throw Ft(this,e._applicationStack);s=t.pos,o++;let n=e._bindings.splice(e._bindings.length-r,r),l=e._bindingOffsets.splice(e._bindingOffsets.length-r,r);for(c=0;c<n.length;c++)i[c].push(n[c]),a[c].push(l[c])}if(o<this.minNumMatches)return!1;let l=e.posToOffset(n),u=0;if(o>0){let e=i[r-1],t=a[r-1],n=t[t.length-1]+e[e.length-1].matchLength;l=a[0][0],u=n-l}let d=this instanceof V;for(c=0;c<i.length;c++)e._bindings.push(new gn(i[c],a[c],u,d)),e._bindingOffsets.push(l);return!0},H.prototype.eval=function(e){let{inputStream:t}=e,n=t.pos;e.pushFailuresInfo();let r=e.eval(this.expr);return e.popFailuresInfo(),r?(e.processFailure(n,this),!1):(t.pos=n,!0)},U.prototype.eval=function(e){let{inputStream:t}=e,n=t.pos;return e.eval(this.expr)?(t.pos=n,!0):!1},G.prototype.eval=function(e){let t=e.currentApplication(),n=t?t.args:[],r=this.substituteParams(n),i=e.getCurrentPosInfo();if(i.isActive(r))return r.handleCycle(e);let a=r.toMemoKey(),o=i.memo[a];if(o&&i.shouldUseMemoizedResult(o)){if(e.hasNecessaryInfo(o))return e.useMemoizedResult(e.inputStream.pos,o);delete i.memo[a]}return r.reallyEval(e)},G.prototype.handleCycle=function(e){let t=e.getCurrentPosInfo(),{currentLeftRecursion:n}=t,r=this.toMemoKey(),i=t.memo[r];return n&&n.headApplication.toMemoKey()===r?i.updateInvolvedApplicationMemoKeys():i||(i=t.memoize(r,{matchLength:0,examinedLength:0,value:!1,rightmostFailureOffset:-1}),t.startLeftRecursion(this,i)),e.useMemoizedResult(e.inputStream.pos,i)},G.prototype.reallyEval=function(e){let{inputStream:t}=e,n=t.pos,r=e.getCurrentPosInfo(),i=e.grammar.rules[this.ruleName],{body:a}=i,{description:o}=i;e.enterApplication(r,this),o&&e.pushFailuresInfo();let s=t.examinedLength;t.examinedLength=0;let c=this.evalOnce(a,e),l=r.currentLeftRecursion,u=this.toMemoKey(),d=l&&l.headApplication.toMemoKey()===u,f;e.doNotMemoize?e.doNotMemoize=!1:d?(c=this.growSeedResult(a,e,n,l,c),r.endLeftRecursion(),f=l,f.examinedLength=t.examinedLength-n,f.rightmostFailureOffset=e._getRightmostFailureOffset(),r.memoize(u,f)):(!l||!l.isInvolved(u))&&(f=r.memoize(u,{matchLength:t.pos-n,examinedLength:t.examinedLength-n,value:c,failuresAtRightmostPosition:e.cloneRecordedFailures(),rightmostFailureOffset:e._getRightmostFailureOffset()}));let p=!!c;if(o&&(e.popFailuresInfo(),p||e.processFailure(n,this),f&&(f.failuresAtRightmostPosition=e.cloneRecordedFailures(),f.rightmostFailureOffset=e._getRightmostFailureOffset())),e.isTracing()&&f){let t=e.getTraceEntry(n,this,p,p?[c]:[]);d&&(D(t.terminatingLREntry!=null||!p),t.isHeadOfLeftRecursion=!0),f.traceEntry=t}return t.examinedLength=Math.max(t.examinedLength,s),e.exitApplication(r,c),p},G.prototype.evalOnce=function(e,t){let{inputStream:n}=t,r=n.pos;if(t.eval(e)){let i=e.getArity(),a=t._bindings.splice(t._bindings.length-i,i),o=t._bindingOffsets.splice(t._bindingOffsets.length-i,i),s=n.pos-r;return new hn(this.ruleName,a,o,s)}return!1},G.prototype.growSeedResult=function(e,t,n,r,i){if(!i)return!1;let{inputStream:a}=t;for(;;){if(r.matchLength=a.pos-n,r.value=i,r.failuresAtRightmostPosition=t.cloneRecordedFailures(),t.isTracing()){let e=t.trace[t.trace.length-1];r.traceEntry=new dn(t.input,n,a.pos,this,!0,[i],[e.clone()])}if(a.pos=n,i=this.evalOnce(e,t),a.pos-n<=r.matchLength)break;t.isTracing()&&t.trace.splice(-2,1)}return t.isTracing()&&r.traceEntry.recordLRTermination(t.trace.pop(),i),a.pos=n+r.matchLength,r.value},K.prototype.eval=function(e){let{inputStream:t}=e,n=t.pos,r=t.nextCodePoint();if(r!==void 0&&r<=1114111){let t=String.fromCodePoint(r);if(this.pattern.test(t))return e.pushBinding(new J(t.length),n),!0}return e.processFailure(n,this),!1},A.prototype.getArity=E(`getArity`),j.getArity=M.getArity=N.prototype.getArity=P.prototype.getArity=F.prototype.getArity=G.prototype.getArity=K.prototype.getArity=function(){return 1},I.prototype.getArity=function(){return this.terms.length===0?0:this.terms[0].getArity()},L.prototype.getArity=function(){let e=0;for(let t=0;t<this.factors.length;t++)e+=this.factors[t].getArity();return e},R.prototype.getArity=function(){return this.expr.getArity()},H.prototype.getArity=function(){return 0},U.prototype.getArity=W.prototype.getArity=function(){return this.expr.getArity()};function Y(e,t){let n={};if(e.source&&t){let r=e.source.relativeTo(t);n.sourceInterval=[r.startIdx,r.endIdx]}return n}A.prototype.outputRecipe=E(`outputRecipe`),j.outputRecipe=function(e,t){return[`any`,Y(this,t)]},M.outputRecipe=function(e,t){return[`end`,Y(this,t)]},N.prototype.outputRecipe=function(e,t){return[`terminal`,Y(this,t),this.obj]},P.prototype.outputRecipe=function(e,t){return[`range`,Y(this,t),this.from,this.to]},F.prototype.outputRecipe=function(e,t){return[`param`,Y(this,t),this.index]},I.prototype.outputRecipe=function(e,t){return[`alt`,Y(this,t)].concat(this.terms.map(n=>n.outputRecipe(e,t)))},mt.prototype.outputRecipe=function(e,t){return this.terms[0].outputRecipe(e,t)},ht.prototype.outputRecipe=function(e,t){let n=this.terms.slice(0,this.expansionPos),r=this.terms.slice(this.expansionPos+1);return[`splice`,Y(this,t),n.map(n=>n.outputRecipe(e,t)),r.map(n=>n.outputRecipe(e,t))]},L.prototype.outputRecipe=function(e,t){return[`seq`,Y(this,t)].concat(this.factors.map(n=>n.outputRecipe(e,t)))},z.prototype.outputRecipe=B.prototype.outputRecipe=V.prototype.outputRecipe=H.prototype.outputRecipe=U.prototype.outputRecipe=W.prototype.outputRecipe=function(e,t){return[this.constructor.name.toLowerCase(),Y(this,t),this.expr.outputRecipe(e,t)]},G.prototype.outputRecipe=function(e,t){return[`app`,Y(this,t),this.ruleName,this.args.map(n=>n.outputRecipe(e,t))]},K.prototype.outputRecipe=function(e,t){return[`unicodeChar`,Y(this,t),this.categoryOrProp]},A.prototype.introduceParams=E(`introduceParams`),j.introduceParams=M.introduceParams=N.prototype.introduceParams=P.prototype.introduceParams=F.prototype.introduceParams=K.prototype.introduceParams=function(e){return this},I.prototype.introduceParams=function(e){return this.terms.forEach((t,n,r)=>{r[n]=t.introduceParams(e)}),this},L.prototype.introduceParams=function(e){return this.factors.forEach((t,n,r)=>{r[n]=t.introduceParams(e)}),this},R.prototype.introduceParams=H.prototype.introduceParams=U.prototype.introduceParams=W.prototype.introduceParams=function(e){return this.expr=this.expr.introduceParams(e),this},G.prototype.introduceParams=function(e){let t=e.indexOf(this.ruleName);if(t>=0){if(this.args.length>0)throw Error(`Parameterized rules cannot be passed as arguments to another rule.`);return new F(t).withSource(this.source)}return this.args.forEach((t,n,r)=>{r[n]=t.introduceParams(e)}),this},A.prototype.isNullable=function(e){return this._isNullable(e,Object.create(null))},A.prototype._isNullable=E(`_isNullable`),j._isNullable=P.prototype._isNullable=F.prototype._isNullable=B.prototype._isNullable=K.prototype._isNullable=function(e,t){return!1},M._isNullable=function(e,t){return!0},N.prototype._isNullable=function(e,t){return typeof this.obj==`string`&&this.obj===``},I.prototype._isNullable=function(e,t){return this.terms.length===0||this.terms.some(n=>n._isNullable(e,t))},L.prototype._isNullable=function(e,t){return this.factors.every(n=>n._isNullable(e,t))},z.prototype._isNullable=V.prototype._isNullable=H.prototype._isNullable=U.prototype._isNullable=function(e,t){return!0},W.prototype._isNullable=function(e,t){return this.expr._isNullable(e,t)},G.prototype._isNullable=function(e,t){let n=this.toMemoKey();if(!Object.prototype.hasOwnProperty.call(t,n)){let{body:r}=e.rules[this.ruleName],i=r.substituteParams(this.args);t[n]=!1,t[n]=i._isNullable(e,t)}return t[n]},A.prototype.substituteParams=E(`substituteParams`),j.substituteParams=M.substituteParams=N.prototype.substituteParams=P.prototype.substituteParams=K.prototype.substituteParams=function(e){return this},F.prototype.substituteParams=function(e){return ut(e[this.index])},I.prototype.substituteParams=function(e){return new I(this.terms.map(t=>t.substituteParams(e)))},L.prototype.substituteParams=function(e){return new L(this.factors.map(t=>t.substituteParams(e)))},R.prototype.substituteParams=H.prototype.substituteParams=U.prototype.substituteParams=W.prototype.substituteParams=function(e){return new this.constructor(this.expr.substituteParams(e))},G.prototype.substituteParams=function(e){if(this.args.length===0)return this;{let t=this.args.map(t=>t.substituteParams(e));return new G(this.ruleName,t)}};function _n(e){return/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(e)}function vn(e){let t=Object.create(null);e.forEach(e=>{t[e]=(t[e]||0)+1}),Object.keys(t).forEach(n=>{if(t[n]<=1)return;let r=1;e.forEach((t,i)=>{t===n&&(e[i]=t+`_`+r++)})})}A.prototype.toArgumentNameList=E(`toArgumentNameList`),j.toArgumentNameList=function(e,t){return[`any`]},M.toArgumentNameList=function(e,t){return[`end`]},N.prototype.toArgumentNameList=function(e,t){return typeof this.obj==`string`&&/^[_a-zA-Z0-9]+$/.test(this.obj)?[`_`+this.obj]:[`$`+e]},P.prototype.toArgumentNameList=function(e,t){let n=this.from+`_to_`+this.to;return _n(n)||(n=`_`+n),_n(n)||(n=`$`+e),[n]},I.prototype.toArgumentNameList=function(e,t){let n=this.terms.map(t=>t.toArgumentNameList(e,!0)),r=[],i=n[0].length;for(let e=0;e<i;e++){let t=[];for(let r=0;r<this.terms.length;r++)t.push(n[r][e]);let i=it(t);r.push(i.join(`_or_`))}return t||vn(r),r},L.prototype.toArgumentNameList=function(e,t){let n=[];return this.factors.forEach(t=>{let r=t.toArgumentNameList(e,!0);n=n.concat(r),e+=r.length}),t||vn(n),n},R.prototype.toArgumentNameList=function(e,t){let n=this.expr.toArgumentNameList(e,t).map(e=>e[e.length-1]===`s`?e+`es`:e+`s`);return t||vn(n),n},V.prototype.toArgumentNameList=function(e,t){return this.expr.toArgumentNameList(e,t).map(e=>`opt`+e[0].toUpperCase()+e.slice(1))},H.prototype.toArgumentNameList=function(e,t){return[]},U.prototype.toArgumentNameList=W.prototype.toArgumentNameList=function(e,t){return this.expr.toArgumentNameList(e,t)},G.prototype.toArgumentNameList=function(e,t){return[this.ruleName]},K.prototype.toArgumentNameList=function(e,t){return[`$`+e]},F.prototype.toArgumentNameList=function(e,t){return[`param`+this.index]},A.prototype.toDisplayString=E(`toDisplayString`),I.prototype.toDisplayString=L.prototype.toDisplayString=function(){return this.source?this.source.trimmed().contents:`[`+this.constructor.name+`]`},j.toDisplayString=M.toDisplayString=R.prototype.toDisplayString=H.prototype.toDisplayString=U.prototype.toDisplayString=W.prototype.toDisplayString=N.prototype.toDisplayString=P.prototype.toDisplayString=F.prototype.toDisplayString=function(){return this.toString()},G.prototype.toDisplayString=function(){if(this.args.length>0){let e=this.args.map(e=>e.toDisplayString());return this.ruleName+`<`+e.join(`,`)+`>`}return this.ruleName},K.prototype.toDisplayString=function(){return`Unicode [`+this.categoryOrProp+`] character`};function yn(e){return e===`description`||e===`string`||e===`code`}var X=class e{constructor(e,t,n){if(!yn(n))throw Error(`invalid Failure type: `+n);this.pexpr=e,this.text=t,this.type=n,this.fluffy=!1}getPExpr(){return this.pexpr}getText(){return this.text}getType(){return this.type}isDescription(){return this.type===`description`}isStringTerminal(){return this.type===`string`}isCode(){return this.type===`code`}isFluffy(){return this.fluffy}makeFluffy(){this.fluffy=!0}clearFluffy(){this.fluffy=!1}subsumes(e){return this.getText()===e.getText()&&this.type===e.type&&(!this.isFluffy()||this.isFluffy()&&e.isFluffy())}toString(){return this.type===`string`?JSON.stringify(this.getText()):this.getText()}clone(){let t=new e(this.pexpr,this.text,this.type);return this.isFluffy()&&t.makeFluffy(),t}toKey(){return this.toString()+`#`+this.type}};A.prototype.toFailure=E(`toFailure`),j.toFailure=function(e){return new X(this,`any object`,`description`)},M.toFailure=function(e){return new X(this,`end of input`,`description`)},N.prototype.toFailure=function(e){return new X(this,this.obj,`string`)},P.prototype.toFailure=function(e){return new X(this,JSON.stringify(this.from)+`..`+JSON.stringify(this.to),`code`)},H.prototype.toFailure=function(e){let t=this.expr===j?`nothing`:`not `+this.expr.toFailure(e);return new X(this,t,`description`)},U.prototype.toFailure=function(e){return this.expr.toFailure(e)},G.prototype.toFailure=function(e){let{description:t}=e.rules[this.ruleName];return t||=(/^[aeiouAEIOU]/.test(this.ruleName)?`an`:`a`)+` `+this.ruleName,new X(this,t,`description`)},K.prototype.toFailure=function(e){return new X(this,`a Unicode [`+this.categoryOrProp+`] character`,`description`)},I.prototype.toFailure=function(e){let t=`(`+this.terms.map(t=>t.toFailure(e)).join(` or `)+`)`;return new X(this,t,`description`)},L.prototype.toFailure=function(e){let t=`(`+this.factors.map(t=>t.toFailure(e)).join(` `)+`)`;return new X(this,t,`description`)},R.prototype.toFailure=function(e){let t=`(`+this.expr.toFailure(e)+this.operator+`)`;return new X(this,t,`description`)},A.prototype.toString=E(`toString`),j.toString=function(){return`any`},M.toString=function(){return`end`},N.prototype.toString=function(){return JSON.stringify(this.obj)},P.prototype.toString=function(){return JSON.stringify(this.from)+`..`+JSON.stringify(this.to)},F.prototype.toString=function(){return`$`+this.index},W.prototype.toString=function(){return`#(`+this.expr.toString()+`)`},I.prototype.toString=function(){return this.terms.length===1?this.terms[0].toString():`(`+this.terms.map(e=>e.toString()).join(` | `)+`)`},L.prototype.toString=function(){return this.factors.length===1?this.factors[0].toString():`(`+this.factors.map(e=>e.toString()).join(` `)+`)`},R.prototype.toString=function(){return this.expr+this.operator},H.prototype.toString=function(){return`~`+this.expr},U.prototype.toString=function(){return`&`+this.expr},G.prototype.toString=function(){if(this.args.length>0){let e=this.args.map(e=>e.toString());return this.ruleName+`<`+e.join(`,`)+`>`}return this.ruleName},K.prototype.toString=function(){return`\\p{`+this.categoryOrProp+`}`};var bn=class e extends A{constructor(e){super(),this.obj=e}_getString(e){let t=e.currentApplication().args[this.obj.index];return D(t instanceof N,`expected a Terminal expression`),t.obj}allowsSkippingPrecedingSpace(){return!0}eval(e){let{inputStream:t}=e,n=t.pos,r=this._getString(e);return t.matchString(r,!0)?(e.pushBinding(new J(r.length),n),!0):(e.processFailure(n,this),!1)}getArity(){return 1}substituteParams(t){return new e(this.obj.substituteParams(t))}toDisplayString(){return this.obj.toDisplayString()+` (case-insensitive)`}toFailure(e){return new X(this,this.obj.toFailure(e)+` (case-insensitive)`,`description`)}_isNullable(e,t){return this.obj._isNullable(e,t)}},xn;Wt(e=>{xn=e.rules.applySyntactic.body});var Sn=new G(`spaces`),Cn=class{constructor(e,t,n){this.matcher=e,this.startExpr=t,this.grammar=e.grammar,this.input=e.getInput(),this.inputStream=new Zt(this.input),this.memoTable=e._memoTable,this.userData=void 0,this.doNotMemoize=!1,this._bindings=[],this._bindingOffsets=[],this._applicationStack=[],this._posStack=[0],this.inLexifiedContextStack=[!1],this.rightmostFailurePosition=-1,this._rightmostFailurePositionStack=[],this._recordedFailuresStack=[],n!==void 0&&(this.positionToRecordFailures=n,this.recordedFailures=Object.create(null))}posToOffset(e){return e-this._posStack[this._posStack.length-1]}enterApplication(e,t){this._posStack.push(this.inputStream.pos),this._applicationStack.push(t),this.inLexifiedContextStack.push(!1),e.enter(t),this._rightmostFailurePositionStack.push(this.rightmostFailurePosition),this.rightmostFailurePosition=-1}exitApplication(e,t){let n=this._posStack.pop();this._applicationStack.pop(),this.inLexifiedContextStack.pop(),e.exit(),this.rightmostFailurePosition=Math.max(this.rightmostFailurePosition,this._rightmostFailurePositionStack.pop()),t&&this.pushBinding(t,n)}enterLexifiedContext(){this.inLexifiedContextStack.push(!0)}exitLexifiedContext(){this.inLexifiedContextStack.pop()}currentApplication(){return this._applicationStack[this._applicationStack.length-1]}inSyntacticContext(){let e=this.currentApplication();return e?e.isSyntactic()&&!this.inLexifiedContext():this.startExpr.factors[0].isSyntactic()}inLexifiedContext(){return this.inLexifiedContextStack[this.inLexifiedContextStack.length-1]}skipSpaces(){return this.pushFailuresInfo(),this.eval(Sn),this.popBinding(),this.popFailuresInfo(),this.inputStream.pos}skipSpacesIfInSyntacticContext(){return this.inSyntacticContext()?this.skipSpaces():this.inputStream.pos}maybeSkipSpacesBefore(e){return e.allowsSkippingPrecedingSpace()&&e!==Sn?this.skipSpacesIfInSyntacticContext():this.inputStream.pos}pushBinding(e,t){this._bindings.push(e),this._bindingOffsets.push(this.posToOffset(t))}popBinding(){this._bindings.pop(),this._bindingOffsets.pop()}numBindings(){return this._bindings.length}truncateBindings(e){for(;this._bindings.length>e;)this.popBinding()}getCurrentPosInfo(){return this.getPosInfo(this.inputStream.pos)}getPosInfo(e){let t=this.memoTable[e];return t||=this.memoTable[e]=new $t,t}processFailure(e,t){if(this.rightmostFailurePosition=Math.max(this.rightmostFailurePosition,e),this.recordedFailures&&e===this.positionToRecordFailures){let e=this.currentApplication();e&&(t=t.substituteParams(e.args)),this.recordFailure(t.toFailure(this.grammar),!1)}}recordFailure(e,t){let n=e.toKey();this.recordedFailures[n]?this.recordedFailures[n].isFluffy()&&!e.isFluffy()&&this.recordedFailures[n].clearFluffy():this.recordedFailures[n]=t?e.clone():e}recordFailures(e,t){Object.keys(e).forEach(n=>{this.recordFailure(e[n],t)})}cloneRecordedFailures(){if(!this.recordedFailures)return;let e=Object.create(null);return Object.keys(this.recordedFailures).forEach(t=>{e[t]=this.recordedFailures[t].clone()}),e}getRightmostFailurePosition(){return this.rightmostFailurePosition}_getRightmostFailureOffset(){return this.rightmostFailurePosition>=0?this.posToOffset(this.rightmostFailurePosition):-1}getMemoizedTraceEntry(e,t){let n=this.memoTable[e];if(n&&t instanceof G){let e=n.memo[t.toMemoKey()];if(e&&e.traceEntry){let n=e.traceEntry.cloneWithExpr(t);return n.isMemoized=!0,n}}return null}getTraceEntry(e,t,n,r){if(t instanceof G){let e=this.currentApplication(),n=e?e.args:[];t=t.substituteParams(n)}return this.getMemoizedTraceEntry(e,t)||new dn(this.input,e,this.inputStream.pos,t,n,r,this.trace)}isTracing(){return!!this.trace}hasNecessaryInfo(e){return this.trace&&!e.traceEntry?!1:this.recordedFailures&&this.inputStream.pos+e.rightmostFailureOffset===this.positionToRecordFailures?!!e.failuresAtRightmostPosition:!0}useMemoizedResult(e,t){this.trace&&this.trace.push(t.traceEntry);let n=this.inputStream.pos+t.rightmostFailureOffset;return this.rightmostFailurePosition=Math.max(this.rightmostFailurePosition,n),this.recordedFailures&&this.positionToRecordFailures===n&&t.failuresAtRightmostPosition&&this.recordFailures(t.failuresAtRightmostPosition,!0),this.inputStream.examinedLength=Math.max(this.inputStream.examinedLength,t.examinedLength+e),t.value?(this.inputStream.pos+=t.matchLength,this.pushBinding(t.value,e),!0):!1}eval(e){let{inputStream:t}=this,n=this._bindings.length,r=this.userData,i;this.recordedFailures&&=(i=this.recordedFailures,Object.create(null));let a=t.pos,o=this.maybeSkipSpacesBefore(e),s;this.trace&&=(s=this.trace,[]);let c=e.eval(this);if(this.trace){let t=this._bindings.slice(n),r=this.getTraceEntry(o,e,c,t);r.isImplicitSpaces=e===Sn,r.isRootNode=e===this.startExpr,s.push(r),this.trace=s}return c?this.recordedFailures&&t.pos===this.positionToRecordFailures&&Object.keys(this.recordedFailures).forEach(e=>{this.recordedFailures[e].makeFluffy()}):(t.pos=a,this.truncateBindings(n),this.userData=r),this.recordedFailures&&this.recordFailures(i,!1),e===xn&&this.skipSpaces(),c}getMatchResult(){this.grammar._setUpMatchState(this),this.eval(this.startExpr);let e;this.recordedFailures&&(e=Object.keys(this.recordedFailures).map(e=>this.recordedFailures[e]));let t=this._bindings[0];return t&&(t.grammar=this.grammar),new Qt(this.matcher,this.input,this.startExpr,t,this._bindingOffsets[0],this.rightmostFailurePosition,e)}getTrace(){this.trace=[];let e=this.getMatchResult(),t=this.trace[this.trace.length-1];return t.result=e,t}pushFailuresInfo(){this._rightmostFailurePositionStack.push(this.rightmostFailurePosition),this._recordedFailuresStack.push(this.recordedFailures)}popFailuresInfo(){this.rightmostFailurePosition=this._rightmostFailurePositionStack.pop(),this.recordedFailures=this._recordedFailuresStack.pop()}},wn=class{constructor(e){this.grammar=e,this._memoTable=[],this._input=``,this._isMemoTableStale=!1}_resetMemoTable(){this._memoTable=[],this._isMemoTableStale=!1}getInput(){return this._input}setInput(e){return this._input!==e&&this.replaceInputRange(0,this._input.length,e),this}replaceInputRange(e,t,n){let r=this._input,i=this._memoTable;if(e<0||e>r.length||t<0||t>r.length||e>t)throw Error(`Invalid indices: `+e+` and `+t);this._input=r.slice(0,e)+n+r.slice(t),this._input!==r&&i.length>0&&(this._isMemoTableStale=!0);let a=i.slice(t);i.length=e;for(let e=0;e<n.length;e++)i.push(void 0);for(let e of a)i.push(e);for(let t=0;t<e;t++){let n=i[t];n&&n.clearObsoleteEntries(t,e)}return this}match(e,t={incremental:!0}){return this._match(this._getStartExpr(e),{incremental:t.incremental,tracing:!1})}trace(e,t={incremental:!0}){return this._match(this._getStartExpr(e),{incremental:t.incremental,tracing:!0})}_match(e,t={}){let n={tracing:!1,incremental:!0,positionToRecordFailures:void 0,...t};if(!n.incremental)this._resetMemoTable();else if(this._isMemoTableStale&&!this.grammar.supportsIncrementalParsing)throw bt(this.grammar);let r=new Cn(this,e,n.positionToRecordFailures);return n.tracing?r.getTrace():r.getMatchResult()}_getStartExpr(e){let t=e||this.grammar.defaultStartRule;if(!t)throw Error(`Missing start rule argument -- the grammar has no default start rule.`);return new L([this.grammar.parseApplication(t),M])}},Tn=[],En=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),Dn=class{constructor(e,t,n){this._node=e,this.source=t,this._baseInterval=n,e.isNonterminal()&&D(t===n),this._childWrappers=[]}_forgetMemoizedResultFor(e){delete this._node[this._semantics.attributeKeys[e]],this.children.forEach(t=>{t._forgetMemoizedResultFor(e)})}child(e){if(!(0<=e&&e<this._node.numChildren()))return;let t=this._childWrappers[e];if(!t){let n=this._node.childAt(e),r=this._node.childOffsets[e],i=this._baseInterval.subInterval(r,n.matchLength),a=n.isNonterminal()?i:this._baseInterval;t=this._childWrappers[e]=this._semantics.wrap(n,i,a)}return t}_children(){for(let e=0;e<this._node.numChildren();e++)this.child(e);return this._childWrappers}isIteration(){return this._node.isIteration()}isTerminal(){return this._node.isTerminal()}isNonterminal(){return this._node.isNonterminal()}isSyntactic(){return this.isNonterminal()&&this._node.isSyntactic()}isLexical(){return this.isNonterminal()&&this._node.isLexical()}isOptional(){return this._node.isOptional()}iteration(e){let t=e||[],n=new gn(t.map(e=>e._node),[],-1,!1),r=this._semantics.wrap(n,null,null);return r._childWrappers=t,r}get children(){return this._children()}get ctorName(){return this._node.ctorName}get numChildren(){return this._node.numChildren()}get sourceString(){return this.source.contents}},Z=class e{constructor(e,t){let n=this;if(this.grammar=e,this.checkedActionDicts=!1,this.Wrapper=class extends (t?t.Wrapper:Dn){constructor(e,t,r){super(e,t,r),n.checkActionDictsIfHaventAlready(),this._semantics=n}toString(){return`[semantics wrapper for `+n.grammar.name+`]`}},this.super=t,t){if(!(e.equals(this.super.grammar)||e._inheritsFrom(this.super.grammar)))throw Error(`Cannot extend a semantics for grammar '`+this.super.grammar.name+`' for use with grammar '`+e.name+`' (not a sub-grammar)`);this.operations=Object.create(this.super.operations),this.attributes=Object.create(this.super.attributes),this.attributeKeys=Object.create(null);for(let e in this.attributes)Object.defineProperty(this.attributeKeys,e,{value:Jt(e)})}else this.operations=Object.create(null),this.attributes=Object.create(null),this.attributeKeys=Object.create(null)}toString(){return`[semantics for `+this.grammar.name+`]`}checkActionDictsIfHaventAlready(){this.checkedActionDicts||=(this.checkActionDicts(),!0)}checkActionDicts(){let e;for(e in this.operations)this.operations[e].checkActionDict(this.grammar);for(e in this.attributes)this.attributes[e].checkActionDict(this.grammar)}toRecipe(t){function n(t){return t.super!==e.BuiltInSemantics._getSemantics()}let r=`(function(g) {
`;if(n(this)){r+=`  var semantics = `+this.super.toRecipe(!0)+`(g`;let e=this.super.grammar,t=this.grammar;for(;t!==e;)r+=`.superGrammar`,t=t.superGrammar;r+=`);
`,r+=`  return g.extendSemantics(semantics)`}else r+=`  return g.createSemantics()`;return[`Operation`,`Attribute`].forEach(e=>{let t=this[e.toLowerCase()+`s`];Object.keys(t).forEach(i=>{let{actionDict:a,formals:o,builtInDefault:s}=t[i],c=i;o.length>0&&(c+=`(`+o.join(`, `)+`)`);let l;l=n(this)&&this.super[e.toLowerCase()+`s`][i]?`extend`+e:`add`+e,r+=`
    .`+l+`(`+JSON.stringify(c)+`, {`;let u=[];Object.keys(a).forEach(e=>{if(a[e]!==s){let t=a[e].toString().trim();t=t.replace(/^.*\(/,`function(`),u.push(`
      `+JSON.stringify(e)+`: `+t)}}),r+=u.join(`,`)+`
    })`})}),r+=`;
  })`,t||(r=`(function() {
  var grammar = this.fromRecipe(`+this.grammar.toRecipe()+`);
  var semantics = `+r+`(grammar);
  return semantics;
});
`),r}addOperationOrAttribute(e,t,n){let r=e+`s`,i=On(t,e),{name:a}=i,{formals:o}=i;this.assertNewName(a,e);let s=kn(e,a,u),c={_default:s};Object.keys(n).forEach(e=>{c[e]=n[e]});let l=e===`operation`?new An(a,o,c,s):new jn(a,c,s);l.checkActionDict(this.grammar),this[r][a]=l;function u(...t){let n=this._semantics[r][a];if(arguments.length!==n.formals.length)throw Error(`Invalid number of arguments passed to `+a+` `+e+` (expected `+n.formals.length+`, got `+arguments.length+`)`);let i=Object.create(null);for(let[e,r]of Object.entries(t)){let t=n.formals[e];i[t]=r}let o=this.args;this.args=i;let s=n.execute(this._semantics,this);return this.args=o,s}e===`operation`?(this.Wrapper.prototype[a]=u,this.Wrapper.prototype[a].toString=function(){return`[`+a+` operation]`}):(Object.defineProperty(this.Wrapper.prototype,a,{get:u,configurable:!0}),Object.defineProperty(this.attributeKeys,a,{value:Jt(a)}))}extendOperationOrAttribute(e,t,n){let r=e+`s`;if(On(t,`attribute`),!(this.super&&t in this.super[r]))throw Error(`Cannot extend `+e+` '`+t+`': did not inherit an `+e+` with that name`);if(En(this[r],t))throw Error(`Cannot extend `+e+` '`+t+`' again`);let i=this[r][t].formals,a=this[r][t].actionDict,o=Object.create(a);Object.keys(n).forEach(e=>{o[e]=n[e]}),this[r][t]=e===`operation`?new An(t,i,o):new jn(t,o),this[r][t].checkActionDict(this.grammar)}assertNewName(e,t){if(En(Dn.prototype,e))throw Error(`Cannot add `+t+` '`+e+`': that's a reserved name`);if(e in this.operations)throw Error(`Cannot add `+t+` '`+e+`': an operation with that name already exists`);if(e in this.attributes)throw Error(`Cannot add `+t+` '`+e+`': an attribute with that name already exists`)}wrap(e,t,n){let r=n||t;return e instanceof this.Wrapper?e:new this.Wrapper(e,t,r)}};function On(e,t){if(!Z.prototypeGrammar)return D(e.indexOf(`(`)===-1),{name:e,formals:[]};let n=Z.prototypeGrammar.match(e,t===`operation`?`OperationSignature`:`AttributeSignature`);if(n.failed())throw Error(n.message);return Z.prototypeGrammarSemantics(n).parse()}function kn(e,t,n){return function(...r){let i=(this._semantics.operations[t]||this._semantics.attributes[t]).formals.map(e=>this.args[e]);if(!this.isIteration()&&r.length===1)return n.apply(r[0],i);throw Rt(this.ctorName,t,e,Tn)}}Z.createSemantics=function(e,t){let n=new Z(e,t===void 0?Z.BuiltInSemantics._getSemantics():t),r=function(t){if(!(t instanceof Qt))throw TypeError(`Semantics expected a MatchResult, but got `+lt(t));if(t.failed())throw TypeError(`cannot apply Semantics to `+t.toString());let r=t._cst;if(r.grammar!==e)throw Error(`Cannot use a MatchResult from grammar '`+r.grammar.name+`' with a semantics for '`+e.name+`'`);let i=new Zt(t.input);return n.wrap(r,i.interval(t._cstOffset,t.input.length))};return r.addOperation=function(e,t){return n.addOperationOrAttribute(`operation`,e,t),r},r.extendOperation=function(e,t){return n.extendOperationOrAttribute(`operation`,e,t),r},r.addAttribute=function(e,t){return n.addOperationOrAttribute(`attribute`,e,t),r},r.extendAttribute=function(e,t){return n.extendOperationOrAttribute(`attribute`,e,t),r},r._getActionDict=function(t){let r=n.operations[t]||n.attributes[t];if(!r)throw Error(`"`+t+`" is not a valid operation or attribute name in this semantics for "`+e.name+`"`);return r.actionDict},r._remove=function(e){let t;return e in n.operations?(t=n.operations[e],delete n.operations[e]):e in n.attributes&&(t=n.attributes[e],delete n.attributes[e]),delete n.Wrapper.prototype[e],t},r.getOperationNames=function(){return Object.keys(n.operations)},r.getAttributeNames=function(){return Object.keys(n.attributes)},r.getGrammar=function(){return n.grammar},r.toRecipe=function(e){return n.toRecipe(e)},r.toString=n.toString.bind(n),r._getSemantics=function(){return n},r};var An=class{constructor(e,t,n,r){this.name=e,this.formals=t,this.actionDict=n,this.builtInDefault=r}checkActionDict(e){e._checkTopDownActionDict(this.typeName,this.name,this.actionDict)}execute(e,t){try{let{ctorName:e}=t._node,n=this.actionDict[e];return n?(Tn.push([this,e]),n.apply(t,t._children())):t.isNonterminal()&&(n=this.actionDict._nonterminal,n)?(Tn.push([this,`_nonterminal`,e]),n.apply(t,t._children())):(Tn.push([this,`default action`,e]),this.actionDict._default.apply(t,t._children()))}finally{Tn.pop()}}};An.prototype.typeName=`operation`;var jn=class extends An{constructor(e,t,n){super(e,[],t,n)}execute(e,t){let n=t._node,r=e.attributeKeys[this.name];return En(n,r)||(n[r]=An.prototype.execute.call(this,e,t)),n[r]}};jn.prototype.typeName=`attribute`;var Mn=[`_iter`,`_terminal`,`_nonterminal`,`_default`];function Nn(e){return Object.keys(e.rules).sort().map(t=>e.rules[t])}var Pn=e=>e.replace(/\u2028/g,`\\u2028`).replace(/\u2029/g,`\\u2029`),Fn,In,Q=class e{constructor(e,t,n,r){if(this.name=e,this.superGrammar=t,this.rules=n,r){if(!(r in n))throw Error(`Invalid start rule: '`+r+`' is not a rule in grammar '`+e+`'`);this.defaultStartRule=r}this._matchStateInitializer=void 0,this.supportsIncrementalParsing=!0}matcher(){return new wn(this)}isBuiltIn(){return this===e.ProtoBuiltInRules||this===e.BuiltInRules}equals(e){if(this===e)return!0;if(e==null||this.name!==e.name||this.defaultStartRule!==e.defaultStartRule||!(this.superGrammar===e.superGrammar||this.superGrammar.equals(e.superGrammar)))return!1;let t=Nn(this),n=Nn(e);return t.length===n.length&&t.every((e,t)=>e.description===n[t].description&&e.formals.join(`,`)===n[t].formals.join(`,`)&&e.body.toString()===n[t].body.toString())}match(e,t){let n=this.matcher();return n.replaceInputRange(0,0,e),n.match(t)}trace(e,t){let n=this.matcher();return n.replaceInputRange(0,0,e),n.trace(t)}createSemantics(){return Z.createSemantics(this)}extendSemantics(e){return Z.createSemantics(this,e._getSemantics())}_checkTopDownActionDict(e,t,n){let r=[];for(let e in n){let t=n[e];if(!Mn.includes(e)&&!(e in this.rules)){r.push(`'${e}' is not a valid semantic action for '${this.name}'`);continue}if(typeof t!=`function`){r.push(`'${e}' must be a function in an action dictionary for '${this.name}'`);continue}let i=t.length,a=this._topDownActionArity(e);if(i!==a){let t;t=e===`_iter`||e===`_nonterminal`?`it should use a rest parameter, e.g. \`${e}(...children) {}\`. NOTE: this is new in Ohm v16 — see https://ohmjs.org/d/ati for details.`:`expected ${a}, got ${i}`,r.push(`Semantic action '${e}' has the wrong arity: ${t}`)}}if(r.length>0){let n=r.map(e=>`- `+e),i=Error([`Found errors in the action dictionary of the '${t}' ${e}:`,...n].join(`
`));throw i.problems=r,i}}_topDownActionArity(e){return Mn.includes(e)?0:this.rules[e].body.getArity()}_inheritsFrom(e){let t=this.superGrammar;for(;t;){if(t.equals(e,!0))return!0;t=t.superGrammar}return!1}toRecipe(e=void 0){let t={};this.source&&(t.source=this.source.contents);let n=null;this.defaultStartRule&&(n=this.defaultStartRule);let r={};Object.keys(this.rules).forEach(e=>{let t=this.rules[e],{body:n}=t,i=!this.superGrammar||!this.superGrammar.rules[e],a;a=i?`define`:n instanceof mt?`extend`:`override`;let o={};if(t.source&&this.source){let e=t.source.relativeTo(this.source);o.sourceInterval=[e.startIdx,e.endIdx]}let s=i?t.description:null,c=n.outputRecipe(t.formals,this.source);r[e]=[a,o,s,t.formals,c]});let i=`null`;return e?i=e:this.superGrammar&&!this.superGrammar.isBuiltIn()&&(i=this.superGrammar.toRecipe()),Pn(`[${[...[`grammar`,t,this.name].map(JSON.stringify),i,...[n,r].map(JSON.stringify)].join(`,`)}]`)}toOperationActionDictionaryTemplate(){return this._toOperationOrAttributeActionDictionaryTemplate()}toAttributeActionDictionaryTemplate(){return this._toOperationOrAttributeActionDictionaryTemplate()}_toOperationOrAttributeActionDictionaryTemplate(){let e=new k;e.append(`{`);let t=!0;for(let n in this.rules){let{body:r}=this.rules[n];t?t=!1:e.append(`,`),e.append(`
`),e.append(`  `),this.addSemanticActionTemplate(n,r,e)}return e.append(`
}`),e.contents()}addSemanticActionTemplate(e,t,n){n.append(e),n.append(`: function(`);let r=this._topDownActionArity(e);n.append(nt(`_`,r).join(`, `)),n.append(`) {
`),n.append(`  }`)}parseApplication(e){let t;if(e.indexOf(`<`)===-1)t=new G(e);else{let n=Fn.match(e,`Base_application`);t=In(n,{})}if(!(t.ruleName in this.rules))throw xt(t.ruleName,this.name);let{formals:n}=this.rules[t.ruleName];if(n.length!==t.args.length){let{source:e}=this.rules[t.ruleName];throw Tt(t.ruleName,n.length,t.args.length,e)}return t}_setUpMatchState(e){this._matchStateInitializer&&this._matchStateInitializer(e)}};Q.ProtoBuiltInRules=new Q(`ProtoBuiltInRules`,void 0,{any:{body:j,formals:[],description:`any character`,primitive:!0},end:{body:M,formals:[],description:`end of input`,primitive:!0},caseInsensitive:{body:new bn(new F(0)),formals:[`str`],primitive:!0},lower:{body:new K(`Ll`),formals:[],description:`a lowercase letter`,primitive:!0},upper:{body:new K(`Lu`),formals:[],description:`an uppercase letter`,primitive:!0},unicodeLtmo:{body:new K(`Ltmo`),formals:[],description:`a Unicode character in Lt, Lm, or Lo`,primitive:!0},spaces:{body:new z(new G(`space`)),formals:[]},space:{body:new P(`\0`,` `),formals:[],description:`a space`}}),Q.initApplicationParser=function(e,t){Fn=e,In=t};var Ln=class{constructor(e){this.name=e}sourceInterval(e,t){return this.source.subInterval(e,t-e)}ensureSuperGrammar(){return this.superGrammar||this.withSuperGrammar(this.name===`BuiltInRules`?Q.ProtoBuiltInRules:Q.BuiltInRules),this.superGrammar}ensureSuperGrammarRuleForOverriding(e,t){let n=this.ensureSuperGrammar().rules[e];if(!n)throw St(e,this.superGrammar.name,t);return n}installOverriddenOrExtendedRule(e,t,n,r){let i=rt(t);if(i.length>0)throw Dt(e,i,r);let a=this.ensureSuperGrammar().rules[e],o=a.formals,s=o?o.length:0;if(t.length!==s)throw Tt(e,s,t.length,r);return this.install(e,t,n,a.description,r)}install(e,t,n,r,i,a=!1){return this.rules[e]={body:n.introduceParams(t),formals:t,description:r,source:i,primitive:a},this}withSuperGrammar(e){if(this.superGrammar)throw Error(`the super grammar of a GrammarDecl cannot be set more than once`);return this.superGrammar=e,this.rules=Object.create(e.rules),e.isBuiltIn()||(this.defaultStartRule=e.defaultStartRule),this}withDefaultStartRule(e){return this.defaultStartRule=e,this}withSource(e){return this.source=new Zt(e).interval(0,e.length),this}build(){let e=new Q(this.name,this.ensureSuperGrammar(),this.rules,this.defaultStartRule);e._matchStateInitializer=e.superGrammar._matchStateInitializer,e.supportsIncrementalParsing=e.superGrammar.supportsIncrementalParsing;let t=[],n=!1;return Object.keys(e.rules).forEach(r=>{let{body:i}=e.rules[r];try{i.assertChoicesHaveUniformArity(r)}catch(e){t.push(e)}try{i.assertAllApplicationsAreValid(r,e)}catch(e){t.push(e),n=!0}}),n||Object.keys(e.rules).forEach(n=>{let{body:r}=e.rules[n];try{r.assertIteratedExprsAreNotNullable(e,[])}catch(e){t.push(e)}}),t.length>0&&zt(t),this.source&&(e.source=this.source),e}define(e,t,n,r,i,a){if(this.ensureSuperGrammar(),this.superGrammar.rules[e])throw wt(e,this.name,this.superGrammar.name,i);if(this.rules[e])throw wt(e,this.name,this.name,i);let o=rt(t);if(o.length>0)throw Dt(e,o,i);return this.install(e,t,n,r,i,a)}override(e,t,n,r,i){return this.ensureSuperGrammarRuleForOverriding(e,i),this.installOverriddenOrExtendedRule(e,t,n,i),this}extend(e,t,n,r,i){if(!this.ensureSuperGrammar().rules[e])throw Ct(e,this.superGrammar.name,i);let a=new mt(this.superGrammar,e,n);return a.source=n.source,this.installOverriddenOrExtendedRule(e,t,a,i),this}},Rn=class{constructor(e){this.currentDecl=null,this.currentRuleName=null,this.options=e||{}}newGrammar(e){return new Ln(e)}grammar(e,t,n,r,i){let a=new Ln(t);return n&&a.withSuperGrammar(n instanceof Q?n:this.fromRecipe(n)),r&&a.withDefaultStartRule(r),e&&e.source&&a.withSource(e.source),this.currentDecl=a,Object.keys(i).forEach(e=>{this.currentRuleName=e;let t=i[e],n=t[0],r=t[1],o=t[2],s=t[3],c=this.fromRecipe(t[4]),l;a.source&&r&&r.sourceInterval&&(l=a.source.subInterval(r.sourceInterval[0],r.sourceInterval[1]-r.sourceInterval[0])),a[n](e,s,c,o,l)}),this.currentRuleName=this.currentDecl=null,a.build()}terminal(e){return new N(e)}range(e,t){return new P(e,t)}param(e){return new F(e)}alt(...e){let t=[];for(let n of e)n instanceof A||(n=this.fromRecipe(n)),n instanceof I?t=t.concat(n.terms):t.push(n);return t.length===1?t[0]:new I(t)}seq(...e){let t=[];for(let n of e)n instanceof A||(n=this.fromRecipe(n)),n instanceof L?t=t.concat(n.factors):t.push(n);return t.length===1?t[0]:new L(t)}star(e){return e instanceof A||(e=this.fromRecipe(e)),new z(e)}plus(e){return e instanceof A||(e=this.fromRecipe(e)),new B(e)}opt(e){return e instanceof A||(e=this.fromRecipe(e)),new V(e)}not(e){return e instanceof A||(e=this.fromRecipe(e)),new H(e)}lookahead(e){return e instanceof A||(e=this.fromRecipe(e)),this.options.eliminateLookaheads?new H(new H(e)):new U(e)}lex(e){return e instanceof A||(e=this.fromRecipe(e)),new W(e)}app(e,t){return t&&t.length>0&&(t=t.map(function(e){return e instanceof A?e:this.fromRecipe(e)},this)),new G(e,t)}splice(e,t){return new ht(this.currentDecl.superGrammar,this.currentRuleName,e.map(e=>this.fromRecipe(e)),t.map(e=>this.fromRecipe(e)))}fromRecipe(e){let t=e[0]===`grammar`?e.slice(1):e.slice(2),n=this[e[0]](...t),r=e[1];return r&&r.sourceInterval&&this.currentDecl&&n.withSource(this.currentDecl.sourceInterval(...r.sourceInterval)),n}};function zn(e){return typeof e==`function`?e.call(new Rn):(typeof e==`string`&&(e=JSON.parse(e)),new Rn().fromRecipe(e))}var Bn=zn([`grammar`,{source:`BuiltInRules {

  alnum  (an alpha-numeric character)
    = letter
    | digit

  letter  (a letter)
    = lower
    | upper
    | unicodeLtmo

  digit  (a digit)
    = "0".."9"

  hexDigit  (a hexadecimal digit)
    = digit
    | "a".."f"
    | "A".."F"

  ListOf<elem, sep>
    = NonemptyListOf<elem, sep>
    | EmptyListOf<elem, sep>

  NonemptyListOf<elem, sep>
    = elem (sep elem)*

  EmptyListOf<elem, sep>
    = /* nothing */

  listOf<elem, sep>
    = nonemptyListOf<elem, sep>
    | emptyListOf<elem, sep>

  nonemptyListOf<elem, sep>
    = elem (sep elem)*

  emptyListOf<elem, sep>
    = /* nothing */

  // Allows a syntactic rule application within a lexical context.
  applySyntactic<app> = app
}`},`BuiltInRules`,null,null,{alnum:[`define`,{sourceInterval:[18,78]},`an alpha-numeric character`,[],[`alt`,{sourceInterval:[60,78]},[`app`,{sourceInterval:[60,66]},`letter`,[]],[`app`,{sourceInterval:[73,78]},`digit`,[]]]],letter:[`define`,{sourceInterval:[82,142]},`a letter`,[],[`alt`,{sourceInterval:[107,142]},[`app`,{sourceInterval:[107,112]},`lower`,[]],[`app`,{sourceInterval:[119,124]},`upper`,[]],[`app`,{sourceInterval:[131,142]},`unicodeLtmo`,[]]]],digit:[`define`,{sourceInterval:[146,177]},`a digit`,[],[`range`,{sourceInterval:[169,177]},`0`,`9`]],hexDigit:[`define`,{sourceInterval:[181,254]},`a hexadecimal digit`,[],[`alt`,{sourceInterval:[219,254]},[`app`,{sourceInterval:[219,224]},`digit`,[]],[`range`,{sourceInterval:[231,239]},`a`,`f`],[`range`,{sourceInterval:[246,254]},`A`,`F`]]],ListOf:[`define`,{sourceInterval:[258,336]},null,[`elem`,`sep`],[`alt`,{sourceInterval:[282,336]},[`app`,{sourceInterval:[282,307]},`NonemptyListOf`,[[`param`,{sourceInterval:[297,301]},0],[`param`,{sourceInterval:[303,306]},1]]],[`app`,{sourceInterval:[314,336]},`EmptyListOf`,[[`param`,{sourceInterval:[326,330]},0],[`param`,{sourceInterval:[332,335]},1]]]]],NonemptyListOf:[`define`,{sourceInterval:[340,388]},null,[`elem`,`sep`],[`seq`,{sourceInterval:[372,388]},[`param`,{sourceInterval:[372,376]},0],[`star`,{sourceInterval:[377,388]},[`seq`,{sourceInterval:[378,386]},[`param`,{sourceInterval:[378,381]},1],[`param`,{sourceInterval:[382,386]},0]]]]],EmptyListOf:[`define`,{sourceInterval:[392,434]},null,[`elem`,`sep`],[`seq`,{sourceInterval:[438,438]}]],listOf:[`define`,{sourceInterval:[438,516]},null,[`elem`,`sep`],[`alt`,{sourceInterval:[462,516]},[`app`,{sourceInterval:[462,487]},`nonemptyListOf`,[[`param`,{sourceInterval:[477,481]},0],[`param`,{sourceInterval:[483,486]},1]]],[`app`,{sourceInterval:[494,516]},`emptyListOf`,[[`param`,{sourceInterval:[506,510]},0],[`param`,{sourceInterval:[512,515]},1]]]]],nonemptyListOf:[`define`,{sourceInterval:[520,568]},null,[`elem`,`sep`],[`seq`,{sourceInterval:[552,568]},[`param`,{sourceInterval:[552,556]},0],[`star`,{sourceInterval:[557,568]},[`seq`,{sourceInterval:[558,566]},[`param`,{sourceInterval:[558,561]},1],[`param`,{sourceInterval:[562,566]},0]]]]],emptyListOf:[`define`,{sourceInterval:[572,682]},null,[`elem`,`sep`],[`seq`,{sourceInterval:[685,685]}]],applySyntactic:[`define`,{sourceInterval:[685,710]},null,[`app`],[`param`,{sourceInterval:[707,710]},0]]}]);Q.BuiltInRules=Bn,Gt(Q.BuiltInRules);var Vn=zn([`grammar`,{source:`Ohm {

  Grammars
    = Grammar*

  Grammar
    = ident SuperGrammar? "{" Rule* "}"

  SuperGrammar
    = "<:" ident

  Rule
    = ident Formals? ruleDescr? "="  RuleBody  -- define
    | ident Formals?            ":=" OverrideRuleBody  -- override
    | ident Formals?            "+=" RuleBody  -- extend

  RuleBody
    = "|"? NonemptyListOf<TopLevelTerm, "|">

  TopLevelTerm
    = Seq caseName  -- inline
    | Seq

  OverrideRuleBody
    = "|"? NonemptyListOf<OverrideTopLevelTerm, "|">

  OverrideTopLevelTerm
    = "..."  -- superSplice
    | TopLevelTerm

  Formals
    = "<" ListOf<ident, ","> ">"

  Params
    = "<" ListOf<Seq, ","> ">"

  Alt
    = NonemptyListOf<Seq, "|">

  Seq
    = Iter*

  Iter
    = Pred "*"  -- star
    | Pred "+"  -- plus
    | Pred "?"  -- opt
    | Pred

  Pred
    = "~" Lex  -- not
    | "&" Lex  -- lookahead
    | Lex

  Lex
    = "#" Base  -- lex
    | Base

  Base
    = ident Params? ~(ruleDescr? "=" | ":=" | "+=")  -- application
    | oneCharTerminal ".." oneCharTerminal           -- range
    | terminal                                       -- terminal
    | "(" Alt ")"                                    -- paren

  ruleDescr  (a rule description)
    = "(" ruleDescrText ")"

  ruleDescrText
    = (~")" any)*

  caseName
    = "--" (~"\\n" space)* name (~"\\n" space)* ("\\n" | &"}")

  name  (a name)
    = nameFirst nameRest*

  nameFirst
    = "_"
    | letter

  nameRest
    = "_"
    | alnum

  ident  (an identifier)
    = name

  terminal
    = "\\"" terminalChar* "\\""

  oneCharTerminal
    = "\\"" terminalChar "\\""

  terminalChar
    = escapeChar
      | ~"\\\\" ~"\\"" ~"\\n" "\\u{0}".."\\u{10FFFF}"

  escapeChar  (an escape sequence)
    = "\\\\\\\\"                                     -- backslash
    | "\\\\\\""                                     -- doubleQuote
    | "\\\\\\'"                                     -- singleQuote
    | "\\\\b"                                      -- backspace
    | "\\\\n"                                      -- lineFeed
    | "\\\\r"                                      -- carriageReturn
    | "\\\\t"                                      -- tab
    | "\\\\u{" hexDigit hexDigit? hexDigit?
             hexDigit? hexDigit? hexDigit? "}"   -- unicodeCodePoint
    | "\\\\u" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape
    | "\\\\x" hexDigit hexDigit                    -- hexEscape

  space
   += comment

  comment
    = "//" (~"\\n" any)* &("\\n" | end)  -- singleLine
    | "/*" (~"*/" any)* "*/"  -- multiLine

  tokens = token*

  token = caseName | comment | ident | operator | punctuation | terminal | any

  operator = "<:" | "=" | ":=" | "+=" | "*" | "+" | "?" | "~" | "&"

  punctuation = "<" | ">" | "," | "--"
}`},`Ohm`,null,`Grammars`,{Grammars:[`define`,{sourceInterval:[9,32]},null,[],[`star`,{sourceInterval:[24,32]},[`app`,{sourceInterval:[24,31]},`Grammar`,[]]]],Grammar:[`define`,{sourceInterval:[36,83]},null,[],[`seq`,{sourceInterval:[50,83]},[`app`,{sourceInterval:[50,55]},`ident`,[]],[`opt`,{sourceInterval:[56,69]},[`app`,{sourceInterval:[56,68]},`SuperGrammar`,[]]],[`terminal`,{sourceInterval:[70,73]},`{`],[`star`,{sourceInterval:[74,79]},[`app`,{sourceInterval:[74,78]},`Rule`,[]]],[`terminal`,{sourceInterval:[80,83]},`}`]]],SuperGrammar:[`define`,{sourceInterval:[87,116]},null,[],[`seq`,{sourceInterval:[106,116]},[`terminal`,{sourceInterval:[106,110]},`<:`],[`app`,{sourceInterval:[111,116]},`ident`,[]]]],Rule_define:[`define`,{sourceInterval:[131,181]},null,[],[`seq`,{sourceInterval:[131,170]},[`app`,{sourceInterval:[131,136]},`ident`,[]],[`opt`,{sourceInterval:[137,145]},[`app`,{sourceInterval:[137,144]},`Formals`,[]]],[`opt`,{sourceInterval:[146,156]},[`app`,{sourceInterval:[146,155]},`ruleDescr`,[]]],[`terminal`,{sourceInterval:[157,160]},`=`],[`app`,{sourceInterval:[162,170]},`RuleBody`,[]]]],Rule_override:[`define`,{sourceInterval:[188,248]},null,[],[`seq`,{sourceInterval:[188,235]},[`app`,{sourceInterval:[188,193]},`ident`,[]],[`opt`,{sourceInterval:[194,202]},[`app`,{sourceInterval:[194,201]},`Formals`,[]]],[`terminal`,{sourceInterval:[214,218]},`:=`],[`app`,{sourceInterval:[219,235]},`OverrideRuleBody`,[]]]],Rule_extend:[`define`,{sourceInterval:[255,305]},null,[],[`seq`,{sourceInterval:[255,294]},[`app`,{sourceInterval:[255,260]},`ident`,[]],[`opt`,{sourceInterval:[261,269]},[`app`,{sourceInterval:[261,268]},`Formals`,[]]],[`terminal`,{sourceInterval:[281,285]},`+=`],[`app`,{sourceInterval:[286,294]},`RuleBody`,[]]]],Rule:[`define`,{sourceInterval:[120,305]},null,[],[`alt`,{sourceInterval:[131,305]},[`app`,{sourceInterval:[131,170]},`Rule_define`,[]],[`app`,{sourceInterval:[188,235]},`Rule_override`,[]],[`app`,{sourceInterval:[255,294]},`Rule_extend`,[]]]],RuleBody:[`define`,{sourceInterval:[309,362]},null,[],[`seq`,{sourceInterval:[324,362]},[`opt`,{sourceInterval:[324,328]},[`terminal`,{sourceInterval:[324,327]},`|`]],[`app`,{sourceInterval:[329,362]},`NonemptyListOf`,[[`app`,{sourceInterval:[344,356]},`TopLevelTerm`,[]],[`terminal`,{sourceInterval:[358,361]},`|`]]]]],TopLevelTerm_inline:[`define`,{sourceInterval:[385,408]},null,[],[`seq`,{sourceInterval:[385,397]},[`app`,{sourceInterval:[385,388]},`Seq`,[]],[`app`,{sourceInterval:[389,397]},`caseName`,[]]]],TopLevelTerm:[`define`,{sourceInterval:[366,418]},null,[],[`alt`,{sourceInterval:[385,418]},[`app`,{sourceInterval:[385,397]},`TopLevelTerm_inline`,[]],[`app`,{sourceInterval:[415,418]},`Seq`,[]]]],OverrideRuleBody:[`define`,{sourceInterval:[422,491]},null,[],[`seq`,{sourceInterval:[445,491]},[`opt`,{sourceInterval:[445,449]},[`terminal`,{sourceInterval:[445,448]},`|`]],[`app`,{sourceInterval:[450,491]},`NonemptyListOf`,[[`app`,{sourceInterval:[465,485]},`OverrideTopLevelTerm`,[]],[`terminal`,{sourceInterval:[487,490]},`|`]]]]],OverrideTopLevelTerm_superSplice:[`define`,{sourceInterval:[522,543]},null,[],[`terminal`,{sourceInterval:[522,527]},`...`]],OverrideTopLevelTerm:[`define`,{sourceInterval:[495,562]},null,[],[`alt`,{sourceInterval:[522,562]},[`app`,{sourceInterval:[522,527]},`OverrideTopLevelTerm_superSplice`,[]],[`app`,{sourceInterval:[550,562]},`TopLevelTerm`,[]]]],Formals:[`define`,{sourceInterval:[566,606]},null,[],[`seq`,{sourceInterval:[580,606]},[`terminal`,{sourceInterval:[580,583]},`<`],[`app`,{sourceInterval:[584,602]},`ListOf`,[[`app`,{sourceInterval:[591,596]},`ident`,[]],[`terminal`,{sourceInterval:[598,601]},`,`]]],[`terminal`,{sourceInterval:[603,606]},`>`]]],Params:[`define`,{sourceInterval:[610,647]},null,[],[`seq`,{sourceInterval:[623,647]},[`terminal`,{sourceInterval:[623,626]},`<`],[`app`,{sourceInterval:[627,643]},`ListOf`,[[`app`,{sourceInterval:[634,637]},`Seq`,[]],[`terminal`,{sourceInterval:[639,642]},`,`]]],[`terminal`,{sourceInterval:[644,647]},`>`]]],Alt:[`define`,{sourceInterval:[651,685]},null,[],[`app`,{sourceInterval:[661,685]},`NonemptyListOf`,[[`app`,{sourceInterval:[676,679]},`Seq`,[]],[`terminal`,{sourceInterval:[681,684]},`|`]]]],Seq:[`define`,{sourceInterval:[689,704]},null,[],[`star`,{sourceInterval:[699,704]},[`app`,{sourceInterval:[699,703]},`Iter`,[]]]],Iter_star:[`define`,{sourceInterval:[719,736]},null,[],[`seq`,{sourceInterval:[719,727]},[`app`,{sourceInterval:[719,723]},`Pred`,[]],[`terminal`,{sourceInterval:[724,727]},`*`]]],Iter_plus:[`define`,{sourceInterval:[743,760]},null,[],[`seq`,{sourceInterval:[743,751]},[`app`,{sourceInterval:[743,747]},`Pred`,[]],[`terminal`,{sourceInterval:[748,751]},`+`]]],Iter_opt:[`define`,{sourceInterval:[767,783]},null,[],[`seq`,{sourceInterval:[767,775]},[`app`,{sourceInterval:[767,771]},`Pred`,[]],[`terminal`,{sourceInterval:[772,775]},`?`]]],Iter:[`define`,{sourceInterval:[708,794]},null,[],[`alt`,{sourceInterval:[719,794]},[`app`,{sourceInterval:[719,727]},`Iter_star`,[]],[`app`,{sourceInterval:[743,751]},`Iter_plus`,[]],[`app`,{sourceInterval:[767,775]},`Iter_opt`,[]],[`app`,{sourceInterval:[790,794]},`Pred`,[]]]],Pred_not:[`define`,{sourceInterval:[809,824]},null,[],[`seq`,{sourceInterval:[809,816]},[`terminal`,{sourceInterval:[809,812]},`~`],[`app`,{sourceInterval:[813,816]},`Lex`,[]]]],Pred_lookahead:[`define`,{sourceInterval:[831,852]},null,[],[`seq`,{sourceInterval:[831,838]},[`terminal`,{sourceInterval:[831,834]},`&`],[`app`,{sourceInterval:[835,838]},`Lex`,[]]]],Pred:[`define`,{sourceInterval:[798,862]},null,[],[`alt`,{sourceInterval:[809,862]},[`app`,{sourceInterval:[809,816]},`Pred_not`,[]],[`app`,{sourceInterval:[831,838]},`Pred_lookahead`,[]],[`app`,{sourceInterval:[859,862]},`Lex`,[]]]],Lex_lex:[`define`,{sourceInterval:[876,892]},null,[],[`seq`,{sourceInterval:[876,884]},[`terminal`,{sourceInterval:[876,879]},`#`],[`app`,{sourceInterval:[880,884]},`Base`,[]]]],Lex:[`define`,{sourceInterval:[866,903]},null,[],[`alt`,{sourceInterval:[876,903]},[`app`,{sourceInterval:[876,884]},`Lex_lex`,[]],[`app`,{sourceInterval:[899,903]},`Base`,[]]]],Base_application:[`define`,{sourceInterval:[918,979]},null,[],[`seq`,{sourceInterval:[918,963]},[`app`,{sourceInterval:[918,923]},`ident`,[]],[`opt`,{sourceInterval:[924,931]},[`app`,{sourceInterval:[924,930]},`Params`,[]]],[`not`,{sourceInterval:[932,963]},[`alt`,{sourceInterval:[934,962]},[`seq`,{sourceInterval:[934,948]},[`opt`,{sourceInterval:[934,944]},[`app`,{sourceInterval:[934,943]},`ruleDescr`,[]]],[`terminal`,{sourceInterval:[945,948]},`=`]],[`terminal`,{sourceInterval:[951,955]},`:=`],[`terminal`,{sourceInterval:[958,962]},`+=`]]]]],Base_range:[`define`,{sourceInterval:[986,1041]},null,[],[`seq`,{sourceInterval:[986,1022]},[`app`,{sourceInterval:[986,1001]},`oneCharTerminal`,[]],[`terminal`,{sourceInterval:[1002,1006]},`..`],[`app`,{sourceInterval:[1007,1022]},`oneCharTerminal`,[]]]],Base_terminal:[`define`,{sourceInterval:[1048,1106]},null,[],[`app`,{sourceInterval:[1048,1056]},`terminal`,[]]],Base_paren:[`define`,{sourceInterval:[1113,1168]},null,[],[`seq`,{sourceInterval:[1113,1124]},[`terminal`,{sourceInterval:[1113,1116]},`(`],[`app`,{sourceInterval:[1117,1120]},`Alt`,[]],[`terminal`,{sourceInterval:[1121,1124]},`)`]]],Base:[`define`,{sourceInterval:[907,1168]},null,[],[`alt`,{sourceInterval:[918,1168]},[`app`,{sourceInterval:[918,963]},`Base_application`,[]],[`app`,{sourceInterval:[986,1022]},`Base_range`,[]],[`app`,{sourceInterval:[1048,1056]},`Base_terminal`,[]],[`app`,{sourceInterval:[1113,1124]},`Base_paren`,[]]]],ruleDescr:[`define`,{sourceInterval:[1172,1231]},`a rule description`,[],[`seq`,{sourceInterval:[1210,1231]},[`terminal`,{sourceInterval:[1210,1213]},`(`],[`app`,{sourceInterval:[1214,1227]},`ruleDescrText`,[]],[`terminal`,{sourceInterval:[1228,1231]},`)`]]],ruleDescrText:[`define`,{sourceInterval:[1235,1266]},null,[],[`star`,{sourceInterval:[1255,1266]},[`seq`,{sourceInterval:[1256,1264]},[`not`,{sourceInterval:[1256,1260]},[`terminal`,{sourceInterval:[1257,1260]},`)`]],[`app`,{sourceInterval:[1261,1264]},`any`,[]]]]],caseName:[`define`,{sourceInterval:[1270,1338]},null,[],[`seq`,{sourceInterval:[1285,1338]},[`terminal`,{sourceInterval:[1285,1289]},`--`],[`star`,{sourceInterval:[1290,1304]},[`seq`,{sourceInterval:[1291,1302]},[`not`,{sourceInterval:[1291,1296]},[`terminal`,{sourceInterval:[1292,1296]},`
`]],[`app`,{sourceInterval:[1297,1302]},`space`,[]]]],[`app`,{sourceInterval:[1305,1309]},`name`,[]],[`star`,{sourceInterval:[1310,1324]},[`seq`,{sourceInterval:[1311,1322]},[`not`,{sourceInterval:[1311,1316]},[`terminal`,{sourceInterval:[1312,1316]},`
`]],[`app`,{sourceInterval:[1317,1322]},`space`,[]]]],[`alt`,{sourceInterval:[1326,1337]},[`terminal`,{sourceInterval:[1326,1330]},`
`],[`lookahead`,{sourceInterval:[1333,1337]},[`terminal`,{sourceInterval:[1334,1337]},`}`]]]]],name:[`define`,{sourceInterval:[1342,1382]},`a name`,[],[`seq`,{sourceInterval:[1363,1382]},[`app`,{sourceInterval:[1363,1372]},`nameFirst`,[]],[`star`,{sourceInterval:[1373,1382]},[`app`,{sourceInterval:[1373,1381]},`nameRest`,[]]]]],nameFirst:[`define`,{sourceInterval:[1386,1418]},null,[],[`alt`,{sourceInterval:[1402,1418]},[`terminal`,{sourceInterval:[1402,1405]},`_`],[`app`,{sourceInterval:[1412,1418]},`letter`,[]]]],nameRest:[`define`,{sourceInterval:[1422,1452]},null,[],[`alt`,{sourceInterval:[1437,1452]},[`terminal`,{sourceInterval:[1437,1440]},`_`],[`app`,{sourceInterval:[1447,1452]},`alnum`,[]]]],ident:[`define`,{sourceInterval:[1456,1489]},`an identifier`,[],[`app`,{sourceInterval:[1485,1489]},`name`,[]]],terminal:[`define`,{sourceInterval:[1493,1531]},null,[],[`seq`,{sourceInterval:[1508,1531]},[`terminal`,{sourceInterval:[1508,1512]},`"`],[`star`,{sourceInterval:[1513,1526]},[`app`,{sourceInterval:[1513,1525]},`terminalChar`,[]]],[`terminal`,{sourceInterval:[1527,1531]},`"`]]],oneCharTerminal:[`define`,{sourceInterval:[1535,1579]},null,[],[`seq`,{sourceInterval:[1557,1579]},[`terminal`,{sourceInterval:[1557,1561]},`"`],[`app`,{sourceInterval:[1562,1574]},`terminalChar`,[]],[`terminal`,{sourceInterval:[1575,1579]},`"`]]],terminalChar:[`define`,{sourceInterval:[1583,1660]},null,[],[`alt`,{sourceInterval:[1602,1660]},[`app`,{sourceInterval:[1602,1612]},`escapeChar`,[]],[`seq`,{sourceInterval:[1621,1660]},[`not`,{sourceInterval:[1621,1626]},[`terminal`,{sourceInterval:[1622,1626]},`\\`]],[`not`,{sourceInterval:[1627,1632]},[`terminal`,{sourceInterval:[1628,1632]},`"`]],[`not`,{sourceInterval:[1633,1638]},[`terminal`,{sourceInterval:[1634,1638]},`
`]],[`range`,{sourceInterval:[1639,1660]},`\0`,`􏿿`]]]],escapeChar_backslash:[`define`,{sourceInterval:[1703,1758]},null,[],[`terminal`,{sourceInterval:[1703,1709]},`\\\\`]],escapeChar_doubleQuote:[`define`,{sourceInterval:[1765,1822]},null,[],[`terminal`,{sourceInterval:[1765,1771]},`\\"`]],escapeChar_singleQuote:[`define`,{sourceInterval:[1829,1886]},null,[],[`terminal`,{sourceInterval:[1829,1835]},`\\'`]],escapeChar_backspace:[`define`,{sourceInterval:[1893,1948]},null,[],[`terminal`,{sourceInterval:[1893,1898]},`\\b`]],escapeChar_lineFeed:[`define`,{sourceInterval:[1955,2009]},null,[],[`terminal`,{sourceInterval:[1955,1960]},`\\n`]],escapeChar_carriageReturn:[`define`,{sourceInterval:[2016,2076]},null,[],[`terminal`,{sourceInterval:[2016,2021]},`\\r`]],escapeChar_tab:[`define`,{sourceInterval:[2083,2132]},null,[],[`terminal`,{sourceInterval:[2083,2088]},`\\t`]],escapeChar_unicodeCodePoint:[`define`,{sourceInterval:[2139,2243]},null,[],[`seq`,{sourceInterval:[2139,2221]},[`terminal`,{sourceInterval:[2139,2145]},`\\u{`],[`app`,{sourceInterval:[2146,2154]},`hexDigit`,[]],[`opt`,{sourceInterval:[2155,2164]},[`app`,{sourceInterval:[2155,2163]},`hexDigit`,[]]],[`opt`,{sourceInterval:[2165,2174]},[`app`,{sourceInterval:[2165,2173]},`hexDigit`,[]]],[`opt`,{sourceInterval:[2188,2197]},[`app`,{sourceInterval:[2188,2196]},`hexDigit`,[]]],[`opt`,{sourceInterval:[2198,2207]},[`app`,{sourceInterval:[2198,2206]},`hexDigit`,[]]],[`opt`,{sourceInterval:[2208,2217]},[`app`,{sourceInterval:[2208,2216]},`hexDigit`,[]]],[`terminal`,{sourceInterval:[2218,2221]},`}`]]],escapeChar_unicodeEscape:[`define`,{sourceInterval:[2250,2309]},null,[],[`seq`,{sourceInterval:[2250,2291]},[`terminal`,{sourceInterval:[2250,2255]},`\\u`],[`app`,{sourceInterval:[2256,2264]},`hexDigit`,[]],[`app`,{sourceInterval:[2265,2273]},`hexDigit`,[]],[`app`,{sourceInterval:[2274,2282]},`hexDigit`,[]],[`app`,{sourceInterval:[2283,2291]},`hexDigit`,[]]]],escapeChar_hexEscape:[`define`,{sourceInterval:[2316,2371]},null,[],[`seq`,{sourceInterval:[2316,2339]},[`terminal`,{sourceInterval:[2316,2321]},`\\x`],[`app`,{sourceInterval:[2322,2330]},`hexDigit`,[]],[`app`,{sourceInterval:[2331,2339]},`hexDigit`,[]]]],escapeChar:[`define`,{sourceInterval:[1664,2371]},`an escape sequence`,[],[`alt`,{sourceInterval:[1703,2371]},[`app`,{sourceInterval:[1703,1709]},`escapeChar_backslash`,[]],[`app`,{sourceInterval:[1765,1771]},`escapeChar_doubleQuote`,[]],[`app`,{sourceInterval:[1829,1835]},`escapeChar_singleQuote`,[]],[`app`,{sourceInterval:[1893,1898]},`escapeChar_backspace`,[]],[`app`,{sourceInterval:[1955,1960]},`escapeChar_lineFeed`,[]],[`app`,{sourceInterval:[2016,2021]},`escapeChar_carriageReturn`,[]],[`app`,{sourceInterval:[2083,2088]},`escapeChar_tab`,[]],[`app`,{sourceInterval:[2139,2221]},`escapeChar_unicodeCodePoint`,[]],[`app`,{sourceInterval:[2250,2291]},`escapeChar_unicodeEscape`,[]],[`app`,{sourceInterval:[2316,2339]},`escapeChar_hexEscape`,[]]]],space:[`extend`,{sourceInterval:[2375,2394]},null,[],[`app`,{sourceInterval:[2387,2394]},`comment`,[]]],comment_singleLine:[`define`,{sourceInterval:[2412,2458]},null,[],[`seq`,{sourceInterval:[2412,2443]},[`terminal`,{sourceInterval:[2412,2416]},`//`],[`star`,{sourceInterval:[2417,2429]},[`seq`,{sourceInterval:[2418,2427]},[`not`,{sourceInterval:[2418,2423]},[`terminal`,{sourceInterval:[2419,2423]},`
`]],[`app`,{sourceInterval:[2424,2427]},`any`,[]]]],[`lookahead`,{sourceInterval:[2430,2443]},[`alt`,{sourceInterval:[2432,2442]},[`terminal`,{sourceInterval:[2432,2436]},`
`],[`app`,{sourceInterval:[2439,2442]},`end`,[]]]]]],comment_multiLine:[`define`,{sourceInterval:[2465,2501]},null,[],[`seq`,{sourceInterval:[2465,2487]},[`terminal`,{sourceInterval:[2465,2469]},`/*`],[`star`,{sourceInterval:[2470,2482]},[`seq`,{sourceInterval:[2471,2480]},[`not`,{sourceInterval:[2471,2476]},[`terminal`,{sourceInterval:[2472,2476]},`*/`]],[`app`,{sourceInterval:[2477,2480]},`any`,[]]]],[`terminal`,{sourceInterval:[2483,2487]},`*/`]]],comment:[`define`,{sourceInterval:[2398,2501]},null,[],[`alt`,{sourceInterval:[2412,2501]},[`app`,{sourceInterval:[2412,2443]},`comment_singleLine`,[]],[`app`,{sourceInterval:[2465,2487]},`comment_multiLine`,[]]]],tokens:[`define`,{sourceInterval:[2505,2520]},null,[],[`star`,{sourceInterval:[2514,2520]},[`app`,{sourceInterval:[2514,2519]},`token`,[]]]],token:[`define`,{sourceInterval:[2524,2600]},null,[],[`alt`,{sourceInterval:[2532,2600]},[`app`,{sourceInterval:[2532,2540]},`caseName`,[]],[`app`,{sourceInterval:[2543,2550]},`comment`,[]],[`app`,{sourceInterval:[2553,2558]},`ident`,[]],[`app`,{sourceInterval:[2561,2569]},`operator`,[]],[`app`,{sourceInterval:[2572,2583]},`punctuation`,[]],[`app`,{sourceInterval:[2586,2594]},`terminal`,[]],[`app`,{sourceInterval:[2597,2600]},`any`,[]]]],operator:[`define`,{sourceInterval:[2604,2669]},null,[],[`alt`,{sourceInterval:[2615,2669]},[`terminal`,{sourceInterval:[2615,2619]},`<:`],[`terminal`,{sourceInterval:[2622,2625]},`=`],[`terminal`,{sourceInterval:[2628,2632]},`:=`],[`terminal`,{sourceInterval:[2635,2639]},`+=`],[`terminal`,{sourceInterval:[2642,2645]},`*`],[`terminal`,{sourceInterval:[2648,2651]},`+`],[`terminal`,{sourceInterval:[2654,2657]},`?`],[`terminal`,{sourceInterval:[2660,2663]},`~`],[`terminal`,{sourceInterval:[2666,2669]},`&`]]],punctuation:[`define`,{sourceInterval:[2673,2709]},null,[],[`alt`,{sourceInterval:[2687,2709]},[`terminal`,{sourceInterval:[2687,2690]},`<`],[`terminal`,{sourceInterval:[2693,2696]},`>`],[`terminal`,{sourceInterval:[2699,2702]},`,`],[`terminal`,{sourceInterval:[2705,2709]},`--`]]]}]),Hn=Object.create(A.prototype);function Un(e,t){for(let n in e)if(n===t)return!0;return!1}function Wn(e,t,n,r){let i=new Rn(r),a,o,s,c=!1;return(n||Vn).createSemantics().addOperation(`visit`,{Grammars(e){return e.children.map(e=>e.visit())},Grammar(e,n,r,o,s){let c=e.visit();a=i.newGrammar(c),n.child(0)&&n.child(0).visit(),o.children.map(e=>e.visit());let l=a.build();if(l.source=this.source.trimmed(),Un(t,c))throw yt(l,t);return t[c]=l,l},SuperGrammar(e,n){let r=n.visit();if(r===`null`)a.withSuperGrammar(null);else{if(!t||!Un(t,r))throw vt(r,t,n.source);a.withSuperGrammar(t[r])}},Rule_define(e,t,n,r,i){o=e.visit(),s=t.children.map(e=>e.visit())[0]||[],!a.defaultStartRule&&a.ensureSuperGrammar()!==Q.ProtoBuiltInRules&&a.withDefaultStartRule(o);let c=i.visit(),l=n.children.map(e=>e.visit())[0],u=this.source.trimmed();return a.define(o,s,c,l,u)},Rule_override(e,t,n,r){o=e.visit(),s=t.children.map(e=>e.visit())[0]||[];let i=this.source.trimmed();a.ensureSuperGrammarRuleForOverriding(o,i),c=!0;let l=r.visit();return c=!1,a.override(o,s,l,null,i)},Rule_extend(e,t,n,r){o=e.visit(),s=t.children.map(e=>e.visit())[0]||[];let i=r.visit(),c=this.source.trimmed();return a.extend(o,s,i,null,c)},RuleBody(e,t){return i.alt(...t.visit()).withSource(this.source)},OverrideRuleBody(e,t){let n=t.visit(),r=n.indexOf(Hn);if(r>=0){let e=n.slice(0,r),t=n.slice(r+1);return t.forEach(e=>{if(e===Hn)throw Nt(e)}),new ht(a.superGrammar,o,e,t).withSource(this.source)}return i.alt(...n).withSource(this.source)},Formals(e,t,n){return t.visit()},Params(e,t,n){return t.visit()},Alt(e){return i.alt(...e.visit()).withSource(this.source)},TopLevelTerm_inline(e,t){let n=o+`_`+t.visit(),r=e.visit(),l=this.source.trimmed(),u=!(a.superGrammar&&a.superGrammar.rules[n]);c&&!u?a.override(n,s,r,null,l):a.define(n,s,r,null,l);let d=s.map(e=>i.app(e));return i.app(n,d).withSource(r.source)},OverrideTopLevelTerm_superSplice(e){return Hn},Seq(e){return i.seq(...e.children.map(e=>e.visit())).withSource(this.source)},Iter_star(e,t){return i.star(e.visit()).withSource(this.source)},Iter_plus(e,t){return i.plus(e.visit()).withSource(this.source)},Iter_opt(e,t){return i.opt(e.visit()).withSource(this.source)},Pred_not(e,t){return i.not(t.visit()).withSource(this.source)},Pred_lookahead(e,t){return i.lookahead(t.visit()).withSource(this.source)},Lex_lex(e,t){return i.lex(t.visit()).withSource(this.source)},Base_application(e,t){let n=t.children.map(e=>e.visit())[0]||[];return i.app(e.visit(),n).withSource(this.source)},Base_range(e,t,n){return i.range(e.visit(),n.visit()).withSource(this.source)},Base_terminal(e){return i.terminal(e.visit()).withSource(this.source)},Base_paren(e,t,n){return t.visit()},ruleDescr(e,t,n){return t.visit()},ruleDescrText(e){return this.sourceString.trim()},caseName(e,t,n,r,i){return n.visit()},name(e,t){return this.sourceString},nameFirst(e){},nameRest(e){},terminal(e,t,n){return t.children.map(e=>e.visit()).join(``)},oneCharTerminal(e,t,n){return t.visit()},escapeChar(e){try{return ct(this.sourceString)}catch(t){throw t instanceof RangeError&&t.message.startsWith(`Invalid code point `)?Pt(e):t}},NonemptyListOf(e,t,n){return[e.visit()].concat(n.children.map(e=>e.visit()))},EmptyListOf(){return[]},_terminal(){return this.sourceString}})(e).visit()}var Gn=zn([`grammar`,{source:`OperationsAndAttributes {

  AttributeSignature =
    name

  OperationSignature =
    name Formals?

  Formals
    = "(" ListOf<name, ","> ")"

  name  (a name)
    = nameFirst nameRest*

  nameFirst
    = "_"
    | letter

  nameRest
    = "_"
    | alnum

}`},`OperationsAndAttributes`,null,`AttributeSignature`,{AttributeSignature:[`define`,{sourceInterval:[29,58]},null,[],[`app`,{sourceInterval:[54,58]},`name`,[]]],OperationSignature:[`define`,{sourceInterval:[62,100]},null,[],[`seq`,{sourceInterval:[87,100]},[`app`,{sourceInterval:[87,91]},`name`,[]],[`opt`,{sourceInterval:[92,100]},[`app`,{sourceInterval:[92,99]},`Formals`,[]]]]],Formals:[`define`,{sourceInterval:[104,143]},null,[],[`seq`,{sourceInterval:[118,143]},[`terminal`,{sourceInterval:[118,121]},`(`],[`app`,{sourceInterval:[122,139]},`ListOf`,[[`app`,{sourceInterval:[129,133]},`name`,[]],[`terminal`,{sourceInterval:[135,138]},`,`]]],[`terminal`,{sourceInterval:[140,143]},`)`]]],name:[`define`,{sourceInterval:[147,187]},`a name`,[],[`seq`,{sourceInterval:[168,187]},[`app`,{sourceInterval:[168,177]},`nameFirst`,[]],[`star`,{sourceInterval:[178,187]},[`app`,{sourceInterval:[178,186]},`nameRest`,[]]]]],nameFirst:[`define`,{sourceInterval:[191,223]},null,[],[`alt`,{sourceInterval:[207,223]},[`terminal`,{sourceInterval:[207,210]},`_`],[`app`,{sourceInterval:[217,223]},`letter`,[]]]],nameRest:[`define`,{sourceInterval:[227,257]},null,[],[`alt`,{sourceInterval:[242,257]},[`terminal`,{sourceInterval:[242,245]},`_`],[`app`,{sourceInterval:[252,257]},`alnum`,[]]]]}]);Kn(Q.BuiltInRules),qn(Gn);function Kn(e){let t={empty(){return this.iteration()},nonEmpty(e,t,n){return this.iteration([e].concat(n.children))},self(...e){return this}};Z.BuiltInSemantics=Z.createSemantics(e,null).addOperation(`asIteration`,{emptyListOf:t.empty,nonemptyListOf:t.nonEmpty,EmptyListOf:t.empty,NonemptyListOf:t.nonEmpty,_iter:t.self})}function qn(e){Z.prototypeGrammarSemantics=e.createSemantics().addOperation(`parse`,{AttributeSignature(e){return{name:e.parse(),formals:[]}},OperationSignature(e,t){return{name:e.parse(),formals:t.children.map(e=>e.parse())[0]||[]}},Formals(e,t,n){return t.asIteration().children.map(e=>e.parse())},name(e,t){return this.sourceString}}),Z.prototypeGrammar=e}function Jn(e){let t=0,n=[0],r=()=>n[n.length-1],i={},a=/( *).*(?:$|\r?\n|\r)/g,o;for(;(o=a.exec(e))!=null;){let[e,a]=o;if(e.length===0)break;let s=a.length,c=r(),l=t+s;if(s>c)n.push(s),i[l]=1;else if(s<c){let e=n.length;for(;r()!==s;)n.pop();i[l]=-1*(e-n.length)}t+=e.length}return n.length>1&&(i[t]=1-n.length),i}var Yn=`an indented block`,Xn=`a dedent`,Zn=1114112,Qn=class extends Zt{constructor(e){super(e.input),this.state=e}_indentationAt(e){return this.state.userData[e]||0}atEnd(){return super.atEnd()&&this._indentationAt(this.pos)===0}next(){if(this._indentationAt(this.pos)!==0){this.examinedLength=Math.max(this.examinedLength,this.pos);return}return super.next()}nextCharCode(){return this._indentationAt(this.pos)===0?super.nextCharCode():(this.examinedLength=Math.max(this.examinedLength,this.pos),Zn)}nextCodePoint(){return this._indentationAt(this.pos)===0?super.nextCodePoint():(this.examinedLength=Math.max(this.examinedLength,this.pos),Zn)}},$n=class extends A{constructor(e=!0){super(),this.isIndent=e}allowsSkippingPrecedingSpace(){return!0}eval(e){let{inputStream:t}=e,n=e.userData;e.doNotMemoize=!0;let r=t.pos,i=this.isIndent?1:-1;return(n[r]||0)*i>0?(e.userData=Object.create(n),e.userData[r]-=i,e.pushBinding(new J(0),r),!0):(e.processFailure(r,this),!1)}getArity(){return 1}_assertAllApplicationsAreValid(e,t){}_isNullable(e,t){return!1}assertChoicesHaveUniformArity(e){}assertIteratedExprsAreNotNullable(e){}introduceParams(e){return this}substituteParams(e){return this}toString(){return this.isIndent?`indent`:`dedent`}toDisplayString(){return this.toString()}toFailure(e){let t=this.isIndent?Yn:Xn;return new X(this,t,`description`)}},er=new ht(Bn,`any`,[new G(`indent`),new G(`dedent`)],[]),tr=new Rn().newGrammar(`IndentationSensitive`).withSuperGrammar(Bn).define(`indent`,[],new $n(!0),Yn,void 0,!0).define(`dedent`,[],new $n(!1),Xn,void 0,!0).extend(`any`,[],er,`any character`,void 0).build();Object.assign(tr,{_matchStateInitializer(e){e.userData=Jn(e.input),e.inputStream=new Qn(e)},supportsIncrementalParsing:!1}),Q.initApplicationParser(Vn,Wn);var nr=e=>!!e.constructor&&typeof e.constructor.isBuffer==`function`&&e.constructor.isBuffer(e);function rr(e,t,n){let r=Vn.match(e,`Grammars`);if(r.failed())throw _t(r);return Wn(r,t,void 0,n)}function ir(e,t,n){let r=ar(e,t,n),i=Object.keys(r);if(i.length===0)throw Error(`Missing grammar definition`);if(i.length>1){let e=r[i[1]].source;throw Error(qt(e.sourceString,e.startIdx)+`Found more than one grammar definition -- use ohm.grammars() instead.`)}return r[i[0]]}function ar(e,t,n){let r=Object.create(t||{});if(typeof e!=`string`){if(nr(e))e=e.toString();else throw TypeError(`Expected string as first argument, got `+lt(e))}return rr(e,r,n),r}function or(e,t){return ir(e,t)}var sr=or(String.raw`
  NamedExpression {
    Relation = AddExpression "=" AddExpression

    AddExpression
      = AddExpression "+" MultiplyExpression  -- add
      | MultiplyExpression

    MultiplyExpression
      = MultiplyExpression "*" Primary  -- multiply
      | Primary

    Primary
      = "(" AddExpression ")"  -- parenthesized
      | integer                 -- integer
      | identifier              -- identifier

    identifier (an identifier) = letter alnum*
    integer (an integer) = digit+
  }
`),cr=sr.createSemantics().addOperation(`toAst`,{Relation(e,t,n){return{kind:`equation`,left:e.toAst(),right:n.toAst()}},AddExpression_add(e,t,n){return{kind:`add`,left:e.toAst(),right:n.toAst()}},AddExpression(e){return e.toAst()},MultiplyExpression_multiply(e,t,n){return{kind:`multiply`,left:e.toAst(),right:n.toAst()}},MultiplyExpression(e){return e.toAst()},Primary_parenthesized(e,t,n){return t.toAst()},Primary_integer(e){return e.toAst()},Primary_identifier(e){return e.toAst()},identifier(e,t){return{kind:`identifier`,identifier:this.sourceString,range:hr(this.source.sourceString,this.source.startIdx,this.source.endIdx)}},integer(e){return{kind:`integer`,literal:this.sourceString,range:hr(this.source.sourceString,this.source.startIdx,this.source.endIdx)}}});function lr(e,t){let n=sr.match(e);if(n.failed()){let t=n.getRightmostFailurePosition(),r=hr(e,t,t),i=n.getExpectedText();return{kind:`syntax-error`,message:`Expected ${i} at line ${r.start.line}, column ${r.start.column}.`,expected:i,range:r}}let r=cr(n).toAst();if(r.kind!==`equation`)return{kind:`syntax-error`,message:`Expected an equation at line 1, column 1.`,expected:`an equation`,range:hr(e,0,0)};let i=dr(t),a=pr(r.left,i);if(mr(a))return a;let o=pr(r.right,i);return mr(o)?o:{kind:`success`,relation:{kind:`equation`,left:a,right:o}}}function ur(e){return{availableIdentifiers:Object.keys(e).sort(),resolve(t){if(!Object.hasOwn(e,t))return{kind:`unknown`};let n=e[t];if(typeof n==`string`)return{kind:`resolved`,quantityId:n};let r=[...new Set(n)].sort();return r.length===0?{kind:`unknown`}:r.length===1?{kind:`resolved`,quantityId:r[0]}:{kind:`ambiguous`,candidateIds:r}}}}function dr(e){return fr(e)?e:ur(e)}function fr(e){return typeof e.resolve==`function`}function pr(e,t){switch(e.kind){case`identifier`:{let n=t.resolve(e.identifier);switch(n.kind){case`resolved`:return{kind:`quantity`,id:n.quantityId};case`unknown`:return{kind:`unknown-identifier`,identifier:e.identifier,message:`Unknown identifier ${JSON.stringify(e.identifier)}.`,range:e.range,availableIdentifiers:[...t.availableIdentifiers??[]].sort()};case`ambiguous`:return{kind:`ambiguous-identifier`,identifier:e.identifier,message:`Identifier ${JSON.stringify(e.identifier)} is ambiguous.`,range:e.range,candidateIds:[...new Set(n.candidateIds)].sort()}}}case`integer`:{let t=Number(e.literal);return Number.isSafeInteger(t)?{kind:`literal`,value:t}:{kind:`invalid-integer-literal`,literal:e.literal,message:`Integer literal ${JSON.stringify(e.literal)} is outside the safe integer range.`,range:e.range}}case`add`:{let n=pr(e.left,t);if(mr(n))return n;let r=pr(e.right,t);return mr(r)?r:{kind:`add`,left:n,right:r}}case`multiply`:{let n=pr(e.left,t);if(mr(n))return n;let r=pr(e.right,t);return mr(r)?r:{kind:`multiply`,left:n,right:r}}}}function mr(e){return e.kind===`syntax-error`||e.kind===`unknown-identifier`||e.kind===`ambiguous-identifier`||e.kind===`invalid-integer-literal`}function hr(e,t,n){return{start:gr(e,t),end:gr(e,n)}}function gr(e,t){let n=e.slice(0,t).split(/\r\n|\r|\n/);return{offset:t,line:n.length,column:(n.at(-1)?.length??0)+1}}var _r={addition:`commutative`,multiplication:`commutative`,equationSides:`ordered`};function vr(e,t){switch(e.kind){case`literal`:return{kind:`literal`,value:e.value};case`quantity`:return{kind:`quantity`,id:e.id};case`add`:return br(`add`,e.left,e.right,t.addition,t);case`multiply`:return br(`multiply`,e.left,e.right,t.multiplication,t)}}function yr(e,t,n){let r=vr(e.left,n),i=vr(e.right,n),a=vr(t.left,n),o=vr(t.right,n),s=$(r,a)&&$(i,o);return s||n.equationSides===`ordered`?s:$(r,o)&&$(i,a)}function br(e,t,n,r,i){let a=vr(t,i),o=vr(n,i);return r===`commutative`&&xr(o)<xr(a)?{kind:e,left:o,right:a}:{kind:e,left:a,right:o}}function $(e,t){if(e.kind!==t.kind)return!1;switch(e.kind){case`literal`:return t.kind===`literal`&&e.value===t.value;case`quantity`:return t.kind===`quantity`&&e.id===t.id;case`add`:return t.kind===`add`&&$(e.left,t.left)&&$(e.right,t.right);case`multiply`:return t.kind===`multiply`&&$(e.left,t.left)&&$(e.right,t.right)}}function xr(e){switch(e.kind){case`literal`:return`literal:${e.value}`;case`quantity`:return`quantity:${JSON.stringify(e.id)}`;case`add`:return`add(${xr(e.left)},${xr(e.right)})`;case`multiply`:return`multiply(${xr(e.left)},${xr(e.right)})`}}function Sr(e,t,n,r={}){let i=Xe(e,r.prompt),a=t.kind===`text`?t.input:t.label,o=t.kind===`text`?lr(t.input,n):{kind:`success`,relation:t.relation};if(o.kind!==`success`&&t.kind===`text`)return{...i,input:{kind:`expression`,value:a},submission:{kind:`named-equation`,answerKind:t.kind,input:a},feedback:Cr(o,r.unknownIdentifier)};if(o.kind!==`success`)return i;let s=yr(e.relation,o.relation,_r),c=!s&&yr(e.relation,o.relation,{..._r,equationSides:`swappable`});return{...i,input:{kind:`expression`,value:a},submission:{kind:`named-equation`,answerKind:t.kind,input:a,...t.kind===`relation-choice`?{choiceId:t.choiceId}:{},relation:o.relation},feedback:s?{kind:`accepted`,message:r.accepted??`The equation matches the quantity model.`,checkPolicy:`normalized-structure`,equationSides:_r.equationSides}:{kind:`structural-mismatch`,message:c?r.reversedSides??`The equation sides are reversed; keep them in the requested order.`:r.groupingMismatch??`The equation grouping does not match the quantity model.`,checkPolicy:`normalized-structure`,equationSides:_r.equationSides}}}function Cr(e,t){if(e.kind!==`unknown-identifier`)return e;let n=e.availableIdentifiers.join(`, `);return{...e,message:t?.(e.identifier,n)??`${e.message} Available identifiers: ${n}.`}}function wr(e){return{source:{kind:`story`,text:e.sourceText},target:{kind:`quantities`,prompt:e.prompt,choices:e.choices.map(e=>({...e}))},input:{kind:`quantity-selection`,knownIds:[]},replay:e.replay}}function Tr(e,t){let n=wr(e),r=e.facts.filter(e=>e.visibility===`known`).map(e=>e.id).sort(),i=e.facts.find(e=>e.visibility===`hidden`)?.id,a=[...new Set(t.knownIds)].sort(),o=a.length===r.length&&a.every((e,t)=>e===r[t])&&t.unknownId===i;return{...n,input:{kind:`quantity-selection`,knownIds:[...t.knownIds],...t.unknownId===void 0?{}:{unknownId:t.unknownId}},feedback:o?{kind:`accepted`,message:e.messages.accepted}:{kind:`incorrect`,message:e.messages.incorrect}}}var Er=class extends w{static properties={choices:{attribute:!1},selectedChoiceId:{attribute:!1},legend:{attribute:!1},checkLabel:{attribute:!1}};static styles=m`
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
  `;constructor(){super(),this.choices=[],this.selectedChoiceId=void 0,this.legend=`Choose the named equation`,this.checkLabel=`Check`}render(){return y`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.choices.map(e=>y`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation-choice`),n=this.choices.find(e=>e.id===t);n!==void 0&&(this.selectedChoiceId=n.id,this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`relation-choice`,choiceId:n.id,label:n.label,relation:n.relation}})))}};customElements.get(`named-equation-choice-input`)===void 0&&customElements.define(`named-equation-choice-input`,Er);var Dr=class extends w{static properties={value:{type:String},inputLabel:{attribute:!1},checkLabel:{attribute:!1}};static styles=m`
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
  `;constructor(){super(),this.value=``,this.inputLabel=`Named equation`,this.checkLabel=`Check`}render(){return y`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation`);typeof t==`string`&&this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`text`,input:t}}))}};customElements.get(`named-equation-text-input`)===void 0&&customElements.define(`named-equation-text-input`,Dr);var Or={"multiple-choice":{label:`Multiple choice`,render:({definition:e,screen:t,resources:n})=>y`
      <named-equation-choice-input
        .choices=${e.choices}
        .selectedChoiceId=${t.submission?.choiceId}
        .legend=${n.quantitiesToNamedEquation.choiceLegend}
        .checkLabel=${n.controls.check}
      ></named-equation-choice-input>
    `},text:{label:`Text input`,render:({screen:e,resources:t})=>y`
      <named-equation-text-input
        .value=${e.submission?.answerKind===`text`?e.input.value:``}
        .inputLabel=${t.quantitiesToNamedEquation.inputLabel}
        .checkLabel=${t.controls.check}
      ></named-equation-text-input>
    `}};function kr(e){return Object.hasOwn(Or,e)}var Ar=class extends w{static properties={screen:{attribute:!1},knownLegend:{attribute:!1},unknownLegend:{attribute:!1},checkLabel:{attribute:!1}};static styles=m`
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
  `;constructor(){super(),this.screen={source:{kind:`story`,text:``},target:{kind:`quantities`,prompt:``,choices:[]},input:{kind:`quantity-selection`,knownIds:[]}},this.knownLegend=``,this.unknownLegend=``,this.checkLabel=``}render(){return y`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.knownLegend}</legend>
          ${this.screen.target.choices.map(e=>y`
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
          ${this.screen.target.choices.map(e=>y`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`unknown-quantity`);if(typeof n!=`string`)return;let r={knownIds:t.getAll(`known-quantity`).filter(e=>typeof e==`string`),unknownId:n};this.dispatchEvent(new CustomEvent(`puzzle-quantity-selection`,{bubbles:!0,composed:!0,detail:r}))}};customElements.get(`story-quantities-input`)===void 0&&customElements.define(`story-quantities-input`,Ar);var jr=class extends w{static properties={heading:{type:String},sourceLabel:{attribute:`source-label`,type:String},targetLabel:{attribute:`target-label`,type:String},feedbackLabel:{attribute:`feedback-label`,type:String},prompt:{type:String},feedback:{type:String},replayLabel:{attribute:`replay-label`,type:String},hasReplay:{attribute:`has-replay`,type:Boolean}};static styles=m`
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
  `;constructor(){super(),this.heading=``,this.sourceLabel=``,this.targetLabel=``,this.feedbackLabel=``,this.prompt=``,this.feedback=``,this.replayLabel=``,this.hasReplay=!1}render(){return y`
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

        ${this.hasReplay?y`
              <details>
                <summary>${this.replayLabel}</summary>
                <slot name="replay"></slot>
              </details>
            `:null}
      </main>
    `}};customElements.get(`puzzle-shell`)===void 0&&customElements.define(`puzzle-shell`,jr);var Mr=class extends w{static properties={seed:{type:Number},scenarioId:{attribute:`scenario-id`,type:String},task:{type:String},locale:{type:String},menuLabel:{attribute:!1},scenarioLabel:{attribute:!1},dronePowerLabel:{attribute:!1},creatorFollowersLabel:{attribute:!1},taskLabel:{attribute:!1},storyToQuantitiesLabel:{attribute:!1},quantitiesToNamedEquationLabel:{attribute:!1},seedLabel:{attribute:!1},showLabel:{attribute:!1}};static styles=m`
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
  `;constructor(){super(),this.seed=17,this.scenarioId=`gaming.drone-power`,this.task=`story-to-quantities`,this.locale=`en`,this.menuLabel=`Puzzle menu`,this.scenarioLabel=`Scenario`,this.dronePowerLabel=`Spaceship and drones`,this.creatorFollowersLabel=`Creator and followers`,this.taskLabel=`Task`,this.storyToQuantitiesLabel=`Story to quantities`,this.quantitiesToNamedEquationLabel=`Quantities to named equation`,this.seedLabel=`Seed`,this.showLabel=`Show puzzle`}render(){return y`
      <form aria-label=${this.menuLabel} @submit=${this.handleSubmit}>
        <label>
          ${this.scenarioLabel}
          <select name="scenario" .value=${this.scenarioId}>
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
          <select name="task" .value=${this.task}>
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
            max=${n}
            step="1"
            .value=${String(this.seed)}
            required
          />
        </label>
        <button type="submit">${this.showLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let n=new FormData(e.currentTarget),a=n.get(`scenario`),o=n.get(`task`),s=Number(n.get(`seed`));typeof a==`string`&&r(a)&&typeof o==`string`&&t(o)&&Number.isInteger(s)&&this.dispatchEvent(new CustomEvent(i,{bubbles:!0,composed:!0,detail:{seed:s,scenarioId:a,task:o,locale:this.locale}}))}};customElements.get(`puzzle-menu`)===void 0&&customElements.define(`puzzle-menu`,Mr);var Nr=class extends w{static properties={puzzleKey:{attribute:`puzzle`,type:String},inputMode:{attribute:`input-mode`,reflect:!0,type:String},locale:{reflect:!0,type:String},puzzleRevision:{attribute:`puzzle-revision`,type:Number},screen:{state:!0},storyScreen:{state:!0}};static styles=m`
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
  `;constructor(){super(),this.puzzleKey=``,this.inputMode=`text`,this.locale=`en`,this.puzzleRevision=0,this.puzzleDefinition=void 0,this.screen=void 0,this.storyDefinition=void 0,this.storyScreen=void 0,this.namedDefinition=void 0}willUpdate(t){if(t.has(`puzzleKey`)||t.has(`puzzleRevision`)||t.has(`locale`)){this.puzzleDefinition=o(this.puzzleKey);let t=this.puzzleDefinition?.modelingCase;this.puzzleDefinition?.task===`story-to-quantities`&&t?.storyQuantities!==void 0&&a(this.locale)?(this.storyDefinition=t.storyQuantities.createDefinition(this.locale),this.storyScreen=wr(this.storyDefinition),this.screen=void 0,this.namedDefinition=void 0):(this.storyDefinition=void 0,this.storyScreen=void 0,this.namedDefinition=t&&a(this.locale)?t.namedEquation?.createDefinition(this.locale)??{learnerNames:t.learnerNames,quantityNames:Object.fromEntries(t.problem.quantities.map(e=>[e.id,e.id])),choices:t.choices}:void 0,this.screen=t&&a(this.locale)?Xe(t.problem,e[this.locale].quantitiesToNamedEquation.prompt):void 0)}}render(){if(this.puzzleDefinition===void 0)return y`<p role="alert">
        Unknown puzzle ${JSON.stringify(this.puzzleKey)}.
      </p>`;if(!a(this.locale))return y`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;if(this.puzzleDefinition.task===`story-to-quantities`&&this.storyDefinition!==void 0&&this.storyScreen!==void 0)return this.renderStoryQuantities(this.locale);if(this.screen===void 0)return y`<p role="alert">Puzzle screen is unavailable.</p>`;if(!kr(this.inputMode))return y`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;let t=Or[this.inputMode],n=e[this.locale],r=this.namedDefinition;if(r===void 0)return y`<p role="alert">Named-equation definition is unavailable.</p>`;let i={choices:r.choices};return this.renderShell({locale:this.locale,heading:n.quantitiesToNamedEquation.heading,prompt:this.screen.target.prompt,feedback:this.screen.feedback?.message??``,replay:this.screen.replay,source:y`
        <p>${this.screen.source.text}</p>
        <ul class="quantity-list">
          ${this.screen.source.quantities.map(e=>y`
              <li>
                ${r.quantityNames[e.id]??e.id} =
                ${e.given.kind===`known`?e.given.value:`?`}
              </li>
            `)}
        </ul>
      `,input:y`
        <div @puzzle-answer=${this.handleAnswer}>
          <nav aria-label=${n.controls.inputMode}>
            ${Object.keys(Or).map(e=>y`
                <button
                  type="button"
                  aria-pressed=${this.inputMode===e}
                  @click=${()=>this.selectInputMode(e)}
                >
                  ${e===`text`?n.controls.textInput:n.controls.multipleChoice}
                </button>
              `)}
          </nav>
          ${t.render({definition:i,screen:this.screen,resources:n})}
        </div>
      `})}renderStoryQuantities(t){let n=e[t],r=this.storyScreen;return r===void 0?y``:this.renderShell({locale:t,heading:n.storyToQuantities.heading,prompt:r.target.prompt,feedback:r.feedback?.message??``,replay:r.replay,source:y`<p>${r.source.text}</p>`,input:y`
        <div @puzzle-quantity-selection=${this.handleQuantitySelection}>
          <story-quantities-input
            .screen=${r}
            .knownLegend=${n.storyToQuantities.knownLegend}
            .unknownLegend=${n.storyToQuantities.unknownLegend}
            .checkLabel=${n.controls.check}
          ></story-quantities-input>
        </div>
      `})}renderShell({locale:t,heading:n,prompt:r,source:i,input:a,feedback:o,replay:s}){let c=e[t];return y`
      <puzzle-shell
        .heading=${n}
        .sourceLabel=${c.common.source}
        .targetLabel=${c.common.target}
        .feedbackLabel=${c.common.feedback}
        .prompt=${r}
        .feedback=${o}
        .replayLabel=${c.common.replay}
        .hasReplay=${s!==void 0}
      >
        <label slot="language" class="language-control">
          ${c.language.label}
          <select .value=${t} @change=${this.handleLocaleChange}>
            <option value="en">${c.language.en}</option>
            <option value="nb">${c.language.nb}</option>
          </select>
        </label>
        <puzzle-menu
          slot="settings"
          .seed=${s?.seed??17}
          .scenarioId=${this.puzzleDefinition?.modelingCase.problem.scenarioId===`creator.followers`?`creator.followers`:`gaming.drone-power`}
          .task=${this.puzzleDefinition?.task??`story-to-quantities`}
          .locale=${t}
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
        ${s===void 0?null:y`
              <dl slot="replay" class="replay-list">
                <dt>${c.common.seed}</dt>
                <dd>${s.seed}</dd>
                <dt>${c.common.generatorVersion}</dt>
                <dd>${s.generatorVersion}</dd>
                ${s.scenarioId===void 0?null:y`
                      <dt>${c.common.scenario}</dt>
                      <dd>${s.scenarioId}</dd>
                    `}
                ${s.storySeed===void 0?null:y`
                      <dt>${c.common.storySeed}</dt>
                      <dd>${s.storySeed}</dd>
                    `}
              </dl>
            `}
      </puzzle-shell>
    `}handleAnswer(t){this.puzzleDefinition!==void 0&&(this.screen=Sr(this.puzzleDefinition.modelingCase.problem,t.detail,this.namedDefinition?.learnerNames??this.puzzleDefinition.modelingCase.learnerNames,a(this.locale)?{prompt:e[this.locale].quantitiesToNamedEquation.prompt,accepted:e[this.locale].quantitiesToNamedEquation.accepted,groupingMismatch:e[this.locale].quantitiesToNamedEquation.groupingMismatch,reversedSides:e[this.locale].quantitiesToNamedEquation.reversedSides,unknownIdentifier:e[this.locale].quantitiesToNamedEquation.unknownIdentifier}:{}))}selectInputMode(t){this.inputMode=t,this.puzzleDefinition!==void 0&&(this.screen=Xe(this.puzzleDefinition.modelingCase.problem,a(this.locale)?e[this.locale].quantitiesToNamedEquation.prompt:void 0))}handleQuantitySelection(e){this.storyDefinition!==void 0&&(this.storyScreen=Tr(this.storyDefinition,e.detail))}handleLocaleChange(e){if(e.currentTarget instanceof HTMLSelectElement&&a(e.currentTarget.value)){let t=e.currentTarget.value;this.locale=t,this.requestApplicationState({locale:t})}}requestApplicationState(e){let t=this.puzzleDefinition,n=t?.modelingCase.problem,r=n?.replay?.seed;t===void 0||n===void 0||r===void 0||n.scenarioId!==`gaming.drone-power`&&n.scenarioId!==`creator.followers`||this.dispatchEvent(new CustomEvent(i,{bubbles:!0,composed:!0,detail:{seed:r,scenarioId:n.scenarioId,task:t.task,locale:e.locale}}))}};customElements.get(`math-modeling-puzzle`)===void 0&&customElements.define(`math-modeling-puzzle`,Nr);export{Nr as MathModelingPuzzle};