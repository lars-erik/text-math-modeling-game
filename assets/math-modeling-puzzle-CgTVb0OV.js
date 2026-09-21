import{_ as e,a as t,b as n,c as r,d as i,f as a,g as o,h as s,i as c,m as l,n as u,o as d,p as f,r as p,s as m,t as h,v as g,x as _,y as v}from"./academic-relation-CHYACgqA.js";var ee=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],y={quantities:{basePower:{variableName:`basePower`,label:`base power`},droneCount:{variableName:`droneCount`,label:`number of drones`},dronePower:{variableName:`dronePower`,label:`power per drone`},totalPower:{variableName:`totalPower`,label:`total power`}},nouns:{ship:{singular:`ship`,plural:`ships`},drone:{singular:`drone`,plural:`drones`}},units:{count:`drones`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=ee[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`A ${e} uses ${t} ${n} for basic systems.`},countFact:{activeDrones:({count:e,noun:t})=>`It also powers ${e} identical active ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`The ship and its drones draw ${e} ${t} in total.`},question:{perDronePower:({noun:e})=>`How much power does one ${e} draw?`}}},te=[`null`,`én`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],b={en:y,nb:{quantities:{basePower:{variableName:`grunnEffekt`,label:`grunnleggende effekt`},droneCount:{variableName:`droneAntall`,label:`antall droner`},dronePower:{variableName:`droneEffekt`,label:`effekt per drone`},totalPower:{variableName:`totalEffekt`,label:`samlet effekt`}},nouns:{ship:{singular:`skip`,plural:`skip`},drone:{singular:`drone`,plural:`droner`}},units:{count:`droner`,power:`MW`,powerPerDrone:`MW/drone`},formatNumber(e,t){let n=te[e]??String(e);return t?`${n.charAt(0).toUpperCase()}${n.slice(1)}`:n},fragments:{baseFact:{basicSystems:({noun:e,value:t,unit:n})=>`Et ${e} bruker ${t} ${n} til grunnleggende systemer.`},countFact:{activeDrones:({count:e,noun:t})=>`Det driver også ${e} identiske aktive ${t}.`},totalFact:{combinedDraw:({value:e,unit:t})=>`Skipet og dronene trekker til sammen ${e} ${t}.`},question:{perDronePower:({noun:e})=>`Hvor mye effekt trekker én ${e}?`}}}};function x(e,t){let n=b[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function S(e,t,n){let r=b[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=ne(i,e.factId);switch(e.fragmentKey){case`baseFact.basicSystems`:return r.fragments.baseFact.basicSystems({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.power});case`countFact.activeDrones`:return r.fragments.countFact.activeDrones({count:r.formatNumber(t.value,!1),noun:re(r.nouns[e.nounKey],t.value),isSingular:t.value===1});case`totalFact.combinedDraw`:return r.fragments.totalFact.combinedDraw({value:String(t.value),unit:r.units.power})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.perDronePower({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`gaming.drone-power`,storySeed:t.seed}}}function ne(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function re(e,t){return t===1?e.singular:e.plural}function ie(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`gaming.drone-power`,seed:t,sentences:[{fragmentKey:`baseFact.basicSystems`,factId:C(n,`base`),nounKey:`ship`},{fragmentKey:`countFact.activeDrones`,factId:C(n,`count`),nounKey:`drone`},{fragmentKey:`totalFact.combinedDraw`,factId:C(n,`total`)}],question:{fragmentKey:`question.perDronePower`,factId:C(n,`per-item`),nounKey:`drone`}}}function C(e,t){let n=e.get(t);if(n===void 0)throw Error(`Drone-power story needs a fact with role ${t}.`);return n}var ae={base:{themeQuantityId:`basePower`,unitKey:`power`},count:{themeQuantityId:`droneCount`,unitKey:`count`},"per-item":{themeQuantityId:`dronePower`,unitKey:`powerPerDrone`},total:{themeQuantityId:`totalPower`,unitKey:`power`}},oe={id:`gaming.drone-power`,present({problem:e,locale:t,storySeed:n}){let r=b[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=ae[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=S(i,ie(i,n),t);return{themeId:`gaming.drone-power`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:x(i,t)}}},se=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],ce={quantities:{startingFollowers:{variableName:`startingFollowers`,label:`starting followers`},promotedPostCount:{variableName:`promotedPostCount`,label:`number of promoted posts`},followersPerPost:{variableName:`followersPerPost`,label:`followers per post`},finalFollowers:{variableName:`finalFollowers`,label:`final followers`}},nouns:{creator:{singular:`creator`,plural:`creators`},post:{singular:`post`,plural:`posts`}},units:{followers:`followers`,posts:`posts`,followersPerPost:`followers/post`},formatNumber(e,t){return se[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`A ${e} starts with ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`Each of ${e} promoted ${t} gains the same number of followers.`},totalFact:{finalAudience:({value:e,unit:t})=>`The creator finishes with ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`How many followers does each ${e} gain?`}}},le=[`null`,`ett`,`to`,`tre`,`fire`,`fem`,`seks`,`sju`,`åtte`,`ni`,`ti`],w={en:ce,nb:{quantities:{startingFollowers:{variableName:`startFoelgere`,label:`følgere ved start`},promotedPostCount:{variableName:`promoterteInnlegg`,label:`antall promoterte innlegg`},followersPerPost:{variableName:`foelgerePerInnlegg`,label:`følgere per innlegg`},finalFollowers:{variableName:`sluttFoelgere`,label:`følgere til slutt`}},nouns:{creator:{singular:`innholdsskaper`,plural:`innholdsskapere`},post:{singular:`innlegg`,plural:`innlegg`}},units:{followers:`følgere`,posts:`innlegg`,followersPerPost:`følgere/innlegg`},formatNumber(e,t){return le[e]??String(e)},fragments:{baseFact:{startingAudience:({noun:e,value:t,unit:n})=>`En ${e} starter med ${t} ${n}.`},countFact:{promotedPosts:({count:e,noun:t})=>`${e.charAt(0).toUpperCase()}${e.slice(1)} promoterte ${t} gir like mange nye følgere hver.`},totalFact:{finalAudience:({value:e,unit:t})=>`Innholdsskaperen ender med ${e} ${t}.`},question:{followersPerPost:({noun:e})=>`Hvor mange følgere gir hvert ${e}?`}}}};function T(e,t){let n=w[t];return Object.fromEntries(e.map(e=>[n.quantities[e.themeQuantityId].variableName,e.canonicalId]))}function E(e,t,n){let r=w[n],i=new Map(e.map(e=>[e.themeQuantityId,e])),a=t.sentences.map(e=>{let t=D(i,e.factId);switch(e.fragmentKey){case`baseFact.startingAudience`:return r.fragments.baseFact.startingAudience({noun:r.nouns[e.nounKey].singular,value:String(t.value),unit:r.units.followers});case`countFact.promotedPosts`:return r.fragments.countFact.promotedPosts({count:r.formatNumber(t.value,!1),noun:t.value===1?r.nouns[e.nounKey].singular:r.nouns[e.nounKey].plural});case`totalFact.finalAudience`:return r.fragments.totalFact.finalAudience({value:String(t.value),unit:r.units.followers})}});if(i.get(t.question.factId)?.visibility!==`hidden`)throw Error(`Story question fact ${t.question.factId} must be hidden.`);let o=r.fragments.question.followersPerPost({noun:r.nouns[t.question.nounKey].singular});return{text:[...a,o].join(` `),replay:{locale:n,scenarioId:`creator.followers`,storySeed:t.seed}}}function D(e,t){let n=e.get(t);if(n?.visibility!==`known`||n.value===void 0)throw Error(`Story sentence fact ${t} must have a known value.`);return{...n,visibility:`known`,value:n.value}}function ue(e,t){let n=new Map(e.map(e=>[e.role,e.themeQuantityId]));return{scenarioId:`creator.followers`,seed:t,sentences:[{fragmentKey:`baseFact.startingAudience`,factId:O(n,`base`),nounKey:`creator`},{fragmentKey:`countFact.promotedPosts`,factId:O(n,`count`),nounKey:`post`},{fragmentKey:`totalFact.finalAudience`,factId:O(n,`total`)}],question:{fragmentKey:`question.followersPerPost`,factId:O(n,`per-item`),nounKey:`post`}}}function O(e,t){let n=e.get(t);if(n===void 0)throw Error(`Creator-followers story needs a fact with role ${t}.`);return n}var de={base:{themeQuantityId:`startingFollowers`,unitKey:`followers`},count:{themeQuantityId:`promotedPostCount`,unitKey:`posts`},"per-item":{themeQuantityId:`followersPerPost`,unitKey:`followersPerPost`},total:{themeQuantityId:`finalFollowers`,unitKey:`followers`}},fe={"gaming.drone-power":oe,"creator.followers":{id:`creator.followers`,present({problem:e,locale:t,storySeed:n}){let r=w[t],i=e.quantities.map(e=>{if(e.role===void 0)throw Error(`Quantity ${e.id} has no total-from-parts role.`);let t=de[e.role],n=r.quantities[t.themeQuantityId];return{themeQuantityId:t.themeQuantityId,canonicalId:e.id,role:e.role,visibility:e.given.kind,...e.given.kind===`known`?{value:e.given.value}:{},label:n.label,variableName:n.variableName,unit:r.units[t.unitKey]}}),a=E(i,ue(i,n),t);return{themeId:`creator.followers`,locale:t,facts:i,story:{text:a.text,storySeed:a.replay.storySeed},learnerNames:T(i,t)}}}};function pe(e){return[{id:`matching`,relation:e.relation},{id:`factor-into-group`,relation:me(e.relation)}]}function me(e){return{kind:`equation`,left:e.left,right:he(e.right)}}function he(e){if(e.kind!==`add`||e.right.kind!==`multiply`||e.left.kind===`multiply`)return e;let t=e.right;return{kind:`multiply`,left:t.left,right:{kind:`add`,left:e.left,right:t.right}}}function k(e){let t=[],n=new Set;return A(e.left,t,n),A(e.right,t,n),t}function A(e,t,n){switch(e.kind){case`literal`:return;case`quantity`:n.has(e.id)||(n.add(e.id),t.push(e.id));return;case`add`:case`multiply`:A(e.left,t,n),A(e.right,t,n)}}function j(e,t){return`${M(e.left,t,0)} = ${M(e.right,t,0)}`}function M(e,t,n){let r=N(e),i;switch(e.kind){case`literal`:i=String(e.value);break;case`quantity`:i=P(t,e.id);break;case`add`:i=`${M(e.left,t,r)} + ${M(e.right,t,r)}`;break;case`multiply`:i=`${M(e.left,t,r)} * ${M(e.right,t,r)}`}return r<n?`(${i})`:i}function N(e){return e.kind===`add`?1:e.kind===`multiply`?2:3}function P(e,t){let n=e[t];if(n===void 0)throw Error(`No learner-facing name for canonical quantity ${t}.`);return n}function F(e){return R(e,L(e))}function I(e){let t=H(e),{state:n,feedback:r,submission:i}=s[e.modeId].submit({problem:e.problem,locale:e.locale,answer:e.answer,names:t.learnerNames});return R(e,{state:n,feedback:r,submission:i})}function L(e){return s[e.modeId].start({problem:e.problem,locale:e.locale})}function R(t,n){let r=H(t),i=ye(r),a=e[t.locale];return{screen:ve(t,n.state,i,r),context:{locale:t.locale,themeId:r.themeId,story:r.story.text,quantities:i,replay:be(t,r)},submission:n.submission,feedback:n.feedback===void 0?void 0:ge(n.feedback,r,a)}}function ge(e,t,n){if(e.kind!==`misconception`||e.message!==void 0)return e;let r=new Map(t.facts.map(e=>[e.canonicalId,e.label])),i=r.get(e.misconception.baseQuantityId),a=r.get(e.misconception.countQuantityId);return i===void 0||a===void 0?e:{...e,message:n.misconceptions.baseAppliedPerItem(_e(i),a)}}function _e(e){return`${e.charAt(0).toUpperCase()}${e.slice(1)}`}function ve(t,n,r,i){let a=e[t.locale];switch(n.modeId){case`story-to-quantities`:return{modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:a.storyToQuantities.prompt,quantities:r},input:n.input};case`quantities-to-named-equation`:return{modeId:`quantities-to-named-equation`,source:{kind:`quantities`,quantities:r},target:n.target,input:n.input};case`named-equation-to-academic-notation`:{let e=z(i);return{modeId:n.modeId,source:{...n.source,names:e},target:n.target,symbolKey:B(n.target.symbols,i,n.source.relation),input:n.input}}case`academic-notation-to-named-equation`:return{modeId:n.modeId,source:n.source,target:{...n.target,names:z(i)},symbolKey:B(n.source.symbols,i,n.source.relation),input:n.input}}}function z(e){return Object.fromEntries(e.facts.map(e=>[e.canonicalId,e.variableName]))}function B(e,t,n){let r=new Set(k(n));return t.facts.flatMap(t=>r.has(t.canonicalId)?[{canonicalId:t.canonicalId,symbol:e[t.canonicalId],variableName:t.variableName}]:[])}function ye(e){return e.facts.map(e=>({id:e.canonicalId,themeQuantityId:e.themeQuantityId,label:e.label,variableName:e.variableName,displayValue:e.visibility===`known`?`${e.value} ${e.unit}`:`?`,role:e.role,given:e.visibility===`known`&&e.value!==void 0?{kind:`known`,value:e.value}:{kind:`hidden`}}))}function be(e,t){return e.problem.replay?{...e.problem.replay,locale:e.locale,themeId:t.themeId,storySeed:t.story.storySeed}:void 0}function V(e,t,n,r){let i=fe[e];if(i===void 0)throw Error(`Unknown theme ${e}.`);return i.present({problem:t,locale:n,storySeed:r})}function H(e){return V(e.themeId,e.problem,e.locale,e.storySeed??e.problem.replay?.seed??0)}function xe(e,t){return Se(pe(e),t)}function Se(e,t){let n=new Map(t.facts.map(e=>[e.canonicalId,e.variableName]));return e.map(e=>({id:e.id,label:Ce(e.relation,n),relation:e.relation}))}function Ce(e,t){return j(e,Object.fromEntries(t))}var U=`session-plan-v1`,W=5;function we(e){if(!Number.isSafeInteger(e.seed)||e.seed<0||e.seed>4294967295)throw Error(`Session seed must be a non-negative 32-bit unsigned integer.`);let t=e.randomSource??i(e.seed),n=Te(t),r=Ee(e.seed,n,t);return{seed:e.seed,plannerVersion:U,length:n,items:r}}function Te(e){return W+Math.floor(e.nextFloat()*6)}function Ee(e,t,n){let r=Oe([...v],n),i=[];for(let n=0;n<t;n+=1)i.push({index:n+1,problemSeed:De(e,n),modeId:r[n%r.length]});return i}function De(e,t){return G(G(e>>>0)^t+1>>>0)>>>0}function Oe(e,t){for(let n=e.length-1;n>0;--n){let r=Math.floor(t.nextFloat()*(n+1)),i=e[n];e[n]=e[r],e[r]=i}return e}function G(e){let t=e>>>0;return t=Math.imul(t^t>>>16,2146121005),t^=t>>>15,t=Math.imul(t^t>>>15,782666323),t^=t>>>15,t}function ke(e){return K(e,we({seed:e.seed}),0,[],void 0,void 0)}function K(e,t,n,r,i,a,s=!1){let c={options:e,plan:t,currentIndex:n,answerLog:r,currentScreen:i??Ie(e,t,n),currentProblem:i===void 0?J(t,n):void 0,hint:a,currentCompleted:s};return c.currentScreen===void 0?q(e,t,r,void 0):{replay:{seed:e.seed,plannerVersion:U,themeId:e.themeId,locale:e.locale},plan:t,status:`active`,currentIndex:n,position:n+1,total:t.length,screen:c.currentScreen,currentProblem:Y(c),hint:a,answerLog:r,availableNext:c.currentCompleted,summary:void 0,submit(i){let o=I({problem:Y(c),themeId:e.themeId,modeId:t.items[n].modeId,locale:e.locale,storySeed:t.items[n].problemSeed,answer:i}),s=Ae.has(o.feedback?.kind??`none`);return K(e,t,n,Me(r,{itemIndex:t.items[n].index,modeId:t.items[n].modeId,submission:Ne(o),accepted:s}),o,s?void 0:a,s)},requestHint(){let i=o({modeId:t.items[n].modeId,guidance:Y(c).guidance??[]});return i===void 0||a?.guidanceId===i.id?this:K(e,t,n,r,c.currentScreen,{guidanceId:i.id},s)},next(){return c.currentCompleted?n+1>=t.length?q(e,t,r,c.currentScreen):K(e,t,n+1,r,void 0,void 0):this},withLocale(i){return i===e.locale?this:K({...e,locale:i},t,n,r,Fe(c,e,i),a,c.currentCompleted)}}}function q(e,t,n,r){let i=Pe(n.filter(e=>e.accepted).map(e=>e.modeId));return{replay:{seed:e.seed,plannerVersion:U,themeId:e.themeId,locale:e.locale},plan:t,status:`complete`,currentIndex:t.length-1,position:t.length,total:t.length,screen:r,currentProblem:void 0,hint:void 0,answerLog:n,availableNext:!1,summary:{total:n.filter(e=>e.accepted).length,counts:i},submit:()=>{throw Error(`The session is complete; there is nothing to submit.`)},requestHint:()=>{throw Error(`The session is complete; there is no hint to request.`)},next:()=>{throw Error(`The session is complete; there is no next item.`)},withLocale:i=>q({...e,locale:i},t,n,r)}}var Ae=new Set([`accepted`,`quantity-selection-accepted`]);function je(e){if(e.hint!==void 0&&e.currentProblem!==void 0)return e.currentProblem.guidance?.find(t=>t.id===e.hint?.guidanceId)}function Me(e,t){let n=e.findIndex(e=>e.itemIndex===t.itemIndex);return n===-1?[...e,t]:e.map((e,r)=>r===n?t:e)}function Ne(e){if(e.submission===void 0)throw Error(`A submitted session item requires a submission.`);return e.submission}function Pe(e){let t={};for(let e of v)t[e]=0;for(let n of e)t[n]+=1;return t}function Fe(e,t,n){let r=e.plan.items[e.currentIndex];if(r!==void 0)return F({problem:Y(e),themeId:t.themeId,modeId:r.modeId,locale:n,storySeed:r.problemSeed})}function J(e,t){return f({seed:e.items[t].problemSeed,config:a}).problem}function Ie(e,t,n){if(!(n>=t.length))return F({problem:J(t,n),themeId:e.themeId,modeId:t.items[n].modeId,locale:e.locale,storySeed:t.items[n].problemSeed})}function Y(e){return e.currentProblem===void 0?J(e.plan,e.currentIndex):e.currentProblem}var Le=class extends p{static properties={choices:{attribute:!1},selectedChoiceId:{attribute:!1},legend:{attribute:!1},checkLabel:{attribute:!1}};static styles=t`
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
  `;constructor(){super(),this.choices=[],this.selectedChoiceId=void 0,this.legend=`Choose the named equation`,this.checkLabel=`Check`}render(){return c`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.choices.map(e=>c`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation-choice`),n=this.choices.find(e=>e.id===t);n!==void 0&&(this.selectedChoiceId=n.id,this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`relation-choice`,choiceId:n.id,label:n.label,relation:n.relation}})))}};customElements.get(`named-equation-choice-input`)===void 0&&customElements.define(`named-equation-choice-input`,Le);var Re=class extends p{static properties={value:{type:String},inputLabel:{attribute:!1},checkLabel:{attribute:!1}};static styles=t`
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
  `;constructor(){super(),this.value=``,this.inputLabel=`Named equation`,this.checkLabel=`Check`}render(){return c`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation`);typeof t==`string`&&this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`text`,input:t}}))}};customElements.get(`named-equation-text-input`)===void 0&&customElements.define(`named-equation-text-input`,Re);var X={"multiple-choice":{label:`Multiple choice`,render:({definition:e,screen:t,resources:n})=>c`
      <named-equation-choice-input
        .choices=${e.choices}
        .selectedChoiceId=${t.submission?.kind===`named-equation`?t.submission.choiceId:void 0}
        .legend=${n.quantitiesToNamedEquation.choiceLegend}
        .checkLabel=${n.controls.check}
      ></named-equation-choice-input>
    `},text:{label:`Text input`,render:({screen:e,resources:t})=>c`
      <named-equation-text-input
        .value=${e.submission?.kind===`named-equation`&&e.submission.answerKind===`text`?e.submission.input:``}
        .inputLabel=${t.quantitiesToNamedEquation.inputLabel}
        .checkLabel=${t.controls.check}
      ></named-equation-text-input>
    `}};function ze(e){return Object.hasOwn(X,e)}var Z={render(e,t,n){n.textContent=h(e,t)}},Be=class extends p{static properties={screen:{attribute:!1},knownLegend:{attribute:!1},unknownLegend:{attribute:!1},checkLabel:{attribute:!1}};static styles=t`
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
  `;constructor(){super(),this.screen={modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:``,quantities:[]},input:{kind:`quantity-selection`,knownIds:[]}},this.knownLegend=``,this.unknownLegend=``,this.checkLabel=``}render(){return c`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.knownLegend}</legend>
          ${this.screen.target.quantities.map(e=>c`
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
          ${this.screen.target.quantities.map(e=>c`
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`unknown-quantity`);if(typeof n!=`string`)return;let r={knownIds:t.getAll(`known-quantity`).filter(e=>typeof e==`string`),unknownId:n};this.dispatchEvent(new CustomEvent(`puzzle-quantity-selection`,{bubbles:!0,composed:!0,detail:r}))}};customElements.get(`story-quantities-input`)===void 0&&customElements.define(`story-quantities-input`,Be);var Ve=class extends p{static properties={heading:{type:String},sourceLabel:{attribute:`source-label`,type:String},targetLabel:{attribute:`target-label`,type:String},feedbackLabel:{attribute:`feedback-label`,type:String},prompt:{type:String},feedback:{type:String},replayLabel:{attribute:`replay-label`,type:String},hasReplay:{attribute:`has-replay`,type:Boolean}};static styles=t`
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

    .menu {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      gap: 1rem;
    }

    .menu button {
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
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

      .menu {
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
  `;constructor(){super(),this.heading=``,this.sourceLabel=``,this.targetLabel=``,this.feedbackLabel=``,this.prompt=``,this.feedback=``,this.replayLabel=``,this.hasReplay=!1}render(){return c`
      <main aria-labelledby="puzzle-heading">
        <header>
          <h1 id="puzzle-heading">${this.heading}</h1>
          <div class="menu"><slot name="menu"></slot></div>
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

        ${this.hasReplay?c`
              <details>
                <summary>${this.replayLabel}</summary>
                <slot name="replay"></slot>
              </details>
            `:null}
      </main>
    `}};customElements.get(`puzzle-shell`)===void 0&&customElements.define(`puzzle-shell`,Ve);var He=class extends p{static properties={seed:{type:Number},themeId:{attribute:`theme-id`,type:String},modeId:{attribute:`mode-id`,type:String},locale:{type:String},menuLabel:{attribute:!1},scenarioLabel:{attribute:!1},dronePowerLabel:{attribute:!1},creatorFollowersLabel:{attribute:!1},taskLabel:{attribute:!1},storyToQuantitiesLabel:{attribute:!1},quantitiesToNamedEquationLabel:{attribute:!1},namedEquationToAcademicNotationLabel:{attribute:!1},academicNotationToNamedEquationLabel:{attribute:!1},seedLabel:{attribute:!1},showLabel:{attribute:!1},startSessionLabel:{attribute:!1}};static styles=t`
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
  `;constructor(){super(),this.seed=17,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.locale=`en`,this.menuLabel=`Puzzle menu`,this.scenarioLabel=`Scenario`,this.dronePowerLabel=`Spaceship and drones`,this.creatorFollowersLabel=`Creator and followers`,this.taskLabel=`Task`,this.storyToQuantitiesLabel=`Story to quantities`,this.quantitiesToNamedEquationLabel=`Quantities to named equation`,this.namedEquationToAcademicNotationLabel=`Named equation to academic notation`,this.academicNotationToNamedEquationLabel=`Academic notation to named equation`,this.seedLabel=`Seed`,this.showLabel=`Show puzzle`,this.startSessionLabel=`Start session`}render(){return c`
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
            max=${l}
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
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),r=t.get(`scenario`),i=t.get(`task`),a=Number(t.get(`seed`)),o=e.submitter instanceof HTMLButtonElement?e.submitter.value:void 0;if(typeof r==`string`&&n(r)&&typeof i==`string`&&g(i)&&Number.isInteger(a)){if(o===`session`){this.dispatchEvent(new CustomEvent(m,{bubbles:!0,composed:!0,detail:{seed:a,themeId:r,locale:this.locale}}));return}this.dispatchEvent(new CustomEvent(d,{bubbles:!0,composed:!0,detail:{seed:a,themeId:r,modeId:i,locale:this.locale}}))}}};customElements.get(`puzzle-menu`)===void 0&&customElements.define(`puzzle-menu`,He);var Ue=class extends p{static properties={relation:{attribute:!1},symbols:{attribute:!1},adapter:{attribute:!1}};static styles=t`
    :host {
      display: block;
      min-width: 0;
    }
    .output {
      min-width: 0;
      overflow-x: auto;
    }
  `;constructor(){super(),this.relation=void 0,this.symbols={},this.adapter=Z}render(){let e=this.relation?h(this.relation,this.symbols):``;return c`<div class="output" aria-label=${e}></div>`}updated(e){let t=this.renderRoot.querySelector(`.output`);t!==null&&this.relation!==void 0&&this.adapter.render(this.relation,this.symbols,t)}};customElements.get(`academic-notation-display`)===void 0&&customElements.define(`academic-notation-display`,Ue);var Q=class extends p{static properties={seed:{type:String},session:{type:String},themeId:{attribute:`theme`,type:String},modeId:{attribute:`mode`,type:String},inputMode:{attribute:`input-mode`,reflect:!0,type:String},locale:{reflect:!0,type:String},academicDisplayAdapter:{attribute:!1},screen:{state:!0},activeSession:{state:!0}};static styles=t`
    :host {
      display: block;
      min-width: 0;
      padding: clamp(0rem, 3vw, 2rem);
    }
    :host([hidden]) {
      display: none;
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
    .answer-log {
      margin-block: 0.5rem 1rem;
    }
    .answer-log h3 {
      margin-block: 0 0.4rem;
      font-size: 0.9rem;
    }
    .answer-log-list {
      display: grid;
      gap: 0.25rem;
      margin: 0;
      padding-inline-start: 1.25rem;
    }
    .answer-log-list li {
      overflow-wrap: anywhere;
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
  `;constructor(){super(),this.seed=`17`,this.session=``,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.inputMode=`text`,this.locale=`en`,this.academicDisplayAdapter=Z,this.screen=void 0,this.generatedProblem=$(17),this.activeSession=void 0}willUpdate(e){if(e.has(`session`)||e.has(`themeId`)||e.has(`locale`)){let t=e.has(`locale`)&&!e.has(`session`)&&!e.has(`themeId`)&&this.activeSession!==void 0;this.activeSession=t?this.activeSession?.withLocale(this.locale):this.composeCurrentSession()}e.has(`seed`)&&(this.generatedProblem=$(Number(this.seed))),(e.has(`seed`)||e.has(`themeId`)||e.has(`modeId`)||e.has(`locale`)||e.has(`session`))&&(this.screen=this.activeSession===void 0?this.composeCurrentScreen():this.activeSession.screen)}composeCurrentSession(){if(this.session&&n(this.themeId)&&_(this.locale))return ke({seed:Number(this.session),themeId:this.themeId,locale:this.locale})}composeCurrentScreen(){if(n(this.themeId)&&_(this.locale))return F({problem:this.generatedProblem,themeId:this.themeId,modeId:g(this.modeId)?this.modeId:`story-to-quantities`,locale:this.locale,storySeed:Number(this.seed)})}render(){if(!n(this.themeId))return c`<p role="alert">
        Unknown scenario ${JSON.stringify(this.themeId)}.
      </p>`;if(this.activeSession!==void 0)return this.renderSession(this.activeSession);if(!g(this.modeId))return c`<p role="alert">
        Unknown task ${JSON.stringify(this.modeId)}.
      </p>`;if(!_(this.locale))return c`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;if(this.screen===void 0)return c`<p role="alert">Puzzle screen is unavailable.</p>`;let t=this.screen,r=e[this.locale],i=this.headingFor(t.screen,r);return this.renderShell({locale:this.locale,heading:i,prompt:t.screen.target.prompt,feedback:t.feedback?.message??``,replay:t.context.replay,menuSeed:Number(this.seed),menuModeId:g(this.modeId)?this.modeId:`story-to-quantities`,source:this.renderSource(t,r),input:this.renderInput(t,r)})}headingFor(e,t){switch(e.modeId){case`story-to-quantities`:return t.storyToQuantities.heading;case`quantities-to-named-equation`:return t.quantitiesToNamedEquation.heading;case`named-equation-to-academic-notation`:return t.namedEquationToAcademicNotation.heading;case`academic-notation-to-named-equation`:return t.academicNotationToNamedEquation.heading}}renderSource(e,t){let n=c`<p>${e.context.story}</p>`;switch(e.screen.modeId){case`story-to-quantities`:return n;case`quantities-to-named-equation`:return c`${n}${this.renderQuantityList(e)}`;case`named-equation-to-academic-notation`:return c`${n}${this.renderQuantityList(e)}
          <p class="equation">
            ${j(e.screen.source.relation,e.screen.source.names)}
          </p>
          ${this.renderSymbolKey(e.screen,t.namedEquationToAcademicNotation.symbolKey)}`;case`academic-notation-to-named-equation`:return c`${n}${this.renderQuantityList(e)}
          <academic-notation-display
            .relation=${e.screen.source.relation}
            .symbols=${e.screen.source.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>
          ${this.renderSymbolKey(e.screen,t.academicNotationToNamedEquation.symbolKey)}`}}renderQuantityList(e){return c`<ul class="quantity-list">
      ${e.context.quantities.map(e=>c`<li>
          ${e.variableName} =
          ${e.given.kind===`known`?e.given.value:`?`}
        </li>`)}
    </ul>`}renderSymbolKey(e,t){return c`<section class="symbol-key" aria-label=${t}>
      <h3>${t}</h3>
      <dl>
        ${e.symbolKey.map(e=>c`<dt>${e.symbol}</dt><dd>${e.variableName}</dd>`)}
      </dl>
    </section>`}renderInput(e,t){switch(e.screen.modeId){case`story-to-quantities`:return c`<div @puzzle-quantity-selection=${this.handleQuantitySelection}>
          <story-quantities-input
            .screen=${e.screen}
            .knownLegend=${t.storyToQuantities.knownLegend}
            .unknownLegend=${t.storyToQuantities.unknownLegend}
            .checkLabel=${t.controls.check}
          ></story-quantities-input>
        </div>`;case`quantities-to-named-equation`:return this.renderNamedEquationInput(this.locale);case`named-equation-to-academic-notation`:return this.renderTextExpressionInput(e,t.namedEquationToAcademicNotation.inputLabel,t.controls.check);case`academic-notation-to-named-equation`:return this.renderTextExpressionInput(e,t.academicNotationToNamedEquation.inputLabel,t.controls.check)}}renderTextExpressionInput(e,t,n){let r=e.screen.input.kind===`expression`?e.screen.input.value:``,i=e.screen.modeId===`named-equation-to-academic-notation`&&e.feedback?.kind===`accepted`&&e.submission?.kind===`academic-notation`?e.submission.relation:void 0;return c`<div @puzzle-answer=${this.handleAnswer}>
      <named-equation-text-input
        .value=${r}
        .inputLabel=${t}
        .checkLabel=${n}
      ></named-equation-text-input>
      ${i===void 0||e.screen.modeId!==`named-equation-to-academic-notation`?null:c`<academic-notation-display
            .relation=${i}
            .symbols=${e.screen.target.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>`}
    </div>`}renderNamedEquationInput(t){if(!ze(this.inputMode))return c`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;let r=this.screen;if(r===void 0||!n(this.themeId))return c``;let i=this.currentProblemFor(),a=e[t],o=X[this.inputMode],s=xe(i,V(this.themeId,i,t,r.context.replay?.storySeed??Number(this.seed)));return c`<div @puzzle-answer=${this.handleAnswer}>
      <nav aria-label=${a.controls.inputMode}>
        ${Object.keys(X).map(e=>c`<button
            type="button"
            aria-pressed=${this.inputMode===e}
            @click=${()=>this.selectInputMode(e)}
          >
            ${e===`text`?a.controls.textInput:a.controls.multipleChoice}
          </button>`)}
      </nav>
      ${o.render({definition:{choices:s},screen:{...r,submission:r.submission},resources:a})}
    </div>`}handleAnswer(e){this.submitAnswer(e.detail)}submitAnswer(e){if(this.activeSession!==void 0){this.activeSession=this.activeSession.submit(e),this.screen=this.activeSession.screen;return}n(this.themeId)&&g(this.modeId)&&_(this.locale)&&(this.screen=I({problem:this.generatedProblem,themeId:this.themeId,modeId:this.modeId,locale:this.locale,storySeed:Number(this.seed),answer:e}))}selectInputMode(e){this.inputMode=e,this.activeSession===void 0&&(this.screen=this.composeCurrentScreen())}currentProblemFor(){return this.activeSession===void 0?this.generatedProblem:this.activeSession.currentProblem??this.generatedProblem}handleQuantitySelection(e){this.submitAnswer(e.detail)}handleLocaleChange(e){if(e.currentTarget instanceof HTMLSelectElement&&_(e.currentTarget.value)){let t=e.currentTarget.value;if(this.locale=t,this.activeSession!==void 0&&this.session!==``){this.requestSessionState({locale:t});return}this.requestApplicationState({locale:t})}}requestSessionState(e){this.dispatchEvent(new CustomEvent(m,{bubbles:!0,composed:!0,detail:{seed:Number(this.session),themeId:n(this.themeId)?this.themeId:`gaming.drone-power`,locale:e.locale}}))}requestApplicationState(e){this.dispatchEvent(new CustomEvent(d,{bubbles:!0,composed:!0,detail:{seed:Number(this.seed),themeId:n(this.themeId)?this.themeId:`gaming.drone-power`,modeId:g(this.modeId)?this.modeId:`story-to-quantities`,locale:e.locale}}))}renderSession(t){let n=this.locale,r=e[n],i=r.session;if(t.status===`complete`)return c`
        <puzzle-shell
          .heading=${i.completionHeading}
          .sourceLabel=${r.common.source}
          .targetLabel=${r.common.target}
          .feedbackLabel=${r.common.feedback}
          .prompt=${i.completedTotal(t.summary?.total??0)}
          .feedback=${``}
          .replayLabel=${r.common.replay}
          .hasReplay=${!1}
        >
          <div slot="source">
            <p>${i.completedTotal(t.summary?.total??0)}</p>
            <ul class="quantity-list">
              ${v.map(e=>c`<li>
                  ${this.modeLabel(e,r)}:
                  ${t.summary?.counts[e]??0}
                </li>`)}
            </ul>
          </div>
          <div slot="input">
            ${this.renderAnswerLog(t,i,r)}
            <button
              type="button"
              class="session-next"
              @click=${this.handleNavigateHome}
            >
              ${i.backToPuzzle}
            </button>
          </div>
        </puzzle-shell>
      `;let a=t.screen,o=this.headingFor(a.screen,r),s=i.positionLabel(t.position,t.total),l=t.hint,u=je(t),d=l===void 0||u===void 0?``:i.hintText(u),f=a.feedback?.message??``,p=d!==``&&f===``?d:[f,d].filter(e=>e!==``).join(` `);return this.renderShell({locale:n,heading:o,positionLabel:s,prompt:a.screen.target.prompt,feedback:p,replay:a.context.replay,menuSeed:t.replay.seed,menuModeId:a.screen.modeId,source:this.renderSource(a,r),input:c`
        ${this.renderInput(a,r)}
        ${this.renderAnswerLog(t,i,r)}
        ${t.availableNext?c`<button
              type="button"
              class="session-next"
              @click=${this.handleSessionNext}
            >
              ${i.next}
            </button>`:``}
        ${this.supportsHint(t)?c`<button
              type="button"
              class="session-hint"
              @click=${this.handleSessionHint}
            >
              ${i.hint}
            </button>`:``}
      `})}renderAnswerLog(e,t,n){return e.answerLog.length===0?``:c`
      <section class="answer-log" aria-label=${t.answerLogHeading}>
        <h3>${t.answerLogHeading}</h3>
        <ol class="answer-log-list">
          ${e.answerLog.map((e,r)=>c`<li>
              ${r+1}.
              ${this.modeLabel(e.modeId,n)}:
              ${this.describeSubmission(e.submission)}
              (${e.accepted?t.answerLogCorrect:t.answerLogIncorrect})
            </li>`)}
        </ol>
      </section>
    `}describeSubmission(e){switch(e.kind){case`quantity-selection`:return`known=[${e.knownIds.join(`, `)}] unknown=${e.unknownId??`none`}`;case`named-equation`:case`academic-notation`:return e.input}}handleNavigateHome(){this.dispatchEvent(new CustomEvent(r,{bubbles:!0,composed:!0,detail:{}}))}supportsHint(e){if(e.status!==`active`)return!1;let t=e.currentProblem,n=e.plan.items[e.currentIndex];return t===void 0||n===void 0?!1:o({modeId:n.modeId,guidance:t.guidance??[]})!==void 0}modeLabel(e,t){switch(e){case`story-to-quantities`:return t.storyToQuantities.heading;case`quantities-to-named-equation`:return t.quantitiesToNamedEquation.heading;case`named-equation-to-academic-notation`:return t.namedEquationToAcademicNotation.heading;case`academic-notation-to-named-equation`:return t.academicNotationToNamedEquation.heading}}handleSessionNext(){this.activeSession!==void 0&&(this.activeSession=this.activeSession.next(),this.screen=this.activeSession.screen)}handleSessionHint(){this.activeSession!==void 0&&(this.activeSession=this.activeSession.requestHint())}renderShell({locale:t,heading:n,positionLabel:r,prompt:i,source:a,input:o,feedback:s,replay:l,menuSeed:d,menuModeId:f}){let p=e[t],m=u[t]??u.en;return c`
      <puzzle-shell
        .heading=${r===void 0?n:`${n} — ${r}`}
        .sourceLabel=${p.common.source}
        .targetLabel=${p.common.target}
        .feedbackLabel=${p.common.feedback}
        .prompt=${i}
        .feedback=${s}
        .replayLabel=${p.common.replay}
        .hasReplay=${l!==void 0}
      >
        <div slot="menu" class="shell-menu">
          <button type="button" @click=${this.handleNavigateHome}>
            ${m.menu.homeLabel}
          </button>
        </div>
        <label slot="language" class="language-control">
          ${p.language.label}
          <select .value=${t} @change=${this.handleLocaleChange}>
            <option value="en">${p.language.en}</option>
            <option value="nb">${p.language.nb}</option>
          </select>
        </label>
        <puzzle-menu
          slot="settings"
          .seed=${d}
          .themeId=${this.themeId}
          .modeId=${f}
          .locale=${t}
          .menuLabel=${p.puzzleMenu.label}
          .scenarioLabel=${p.puzzleMenu.scenario}
          .dronePowerLabel=${p.puzzleMenu.dronePower}
          .creatorFollowersLabel=${p.puzzleMenu.creatorFollowers}
          .taskLabel=${p.puzzleMenu.task}
          .storyToQuantitiesLabel=${p.puzzleMenu.storyToQuantities}
          .quantitiesToNamedEquationLabel=${p.puzzleMenu.quantitiesToNamedEquation}
          .namedEquationToAcademicNotationLabel=${p.puzzleMenu.namedEquationToAcademicNotation}
          .academicNotationToNamedEquationLabel=${p.puzzleMenu.academicNotationToNamedEquation}
          .seedLabel=${p.puzzleMenu.seed}
          .showLabel=${p.puzzleMenu.show}
          .startSessionLabel=${p.puzzleMenu.startSession}
        ></puzzle-menu>
        <div slot="source">${a}</div>
        <div slot="input">${o}</div>
        ${l===void 0?null:c`<dl slot="replay" class="replay-list">
              <dt>${p.common.seed}</dt>
              <dd>${l.seed}</dd>
              <dt>${p.common.generatorVersion}</dt>
              <dd>${l.generatorVersion}</dd>
              <dt>${p.common.scenario}</dt>
              <dd>${l.themeId}</dd>
              <dt>${p.common.storySeed}</dt>
              <dd>${l.storySeed}</dd>
            </dl>`}
      </puzzle-shell>
    `}};function $(e){return f({seed:Number.isSafeInteger(e)?e:17,config:a}).problem}customElements.get(`math-modeling-puzzle`)===void 0&&customElements.define(`math-modeling-puzzle`,Q);export{Q as MathModelingPuzzle};