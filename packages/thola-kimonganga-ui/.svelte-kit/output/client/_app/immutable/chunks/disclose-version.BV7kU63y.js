import{H as x,j as F,k as U,l as T,o as O,q as S,v as L,w as Y,x as $,y as q,P as A,z,p as G,a as W,c as J,A as K,B as Q,T as X,C as Z}from"./runtime.DwUChn-q.js";function ee(){console.warn("hydration_mismatch")}let c=!1;function E(n){c=n}let u=null;function ne(n){u=n}function N(n){if(n.nodeType!==8)return n;var e=n;if(e.data!==x)return n;for(var t=[],a=0;(e=e.nextSibling)!==null;){if(e.nodeType===8){var o=e.data;if(o===x)a+=1;else if(o[0]===F){if(a===0)return u=t,e;a-=1}}t.push(e)}U()}var p,b,D,R,k,I,M;function B(){p===void 0&&(p=Node.prototype,b=Element.prototype,D=Text.prototype,p.appendChild,R=p.cloneNode,b.__click=void 0,D.__nodeValue=" ",b.__className="",b.__attributes=null,k=T(p,"firstChild").get,I=T(p,"nextSibling").get,M=T(p,"textContent").set,T(b,"className").set)}function te(n,e){return R.call(n,e)}function v(){return document.createTextNode("")}function ce(n){const e=k.call(n);return c?e===null?n.appendChild(v()):N(e):e}function fe(n,e){if(!c)return k.call(n);const t=n[0];return N(t)}function le(n,e=!1){const t=I.call(n);if(!c)return t;if(e&&(t==null?void 0:t.nodeType)!==3){const a=v();if(t){const o=u.indexOf(t);u.splice(o,0,a),t.before(a)}else u.push(a);return a}return N(t)}function re(n){M.call(n,"")}function P(n,e){var _;var t=n.ownerDocument,a=e.type,o=((_=e.composedPath)==null?void 0:_.call(e))||[],r=o[0]||e.target;e.target!==r&&O(e,"target",{configurable:!0,value:r});var g=0,f=e.__root;if(f){var h=o.indexOf(f);if(h!==-1&&(n===document||n===window)){e.__root=n;return}var w=o.indexOf(n);if(w===-1)return;h<=w&&(g=h+1)}r=o[g]||e.target,O(e,"currentTarget",{configurable:!0,get(){return r||t}});function m(i){r=i;var s=i.parentNode||i.host||null;try{var l=i["__"+a];if(l!==void 0&&!i.disabled)if(S(l)){var[d,...j]=l;d.apply(i,[e,...j])}else l.call(i,e)}finally{!e.cancelBubble&&s!==n&&s!==null&&i!==n&&m(s)}}try{m(r)}finally{e.__root=n,r=n}}const ae=new Set,V=new Set;function de(n,e){const t=n.__nodeValue,a=oe(e);c&&n.nodeValue===a?n.__nodeValue=a:t!==a&&(n.nodeValue=a,n.__nodeValue=a)}function _e(n,e,t,a){e===void 0||e(n,t)}function oe(n){return typeof n=="string"?n:n==null?"":n+""}function ie(n,e){const t=e.anchor??e.target.appendChild(v());return L(()=>H(n,{...e,anchor:t}),!1)}function pe(n,e){const t=e.target,a=u;let o=!1;try{return L(()=>{E(!0);for(var r=t.firstChild;r&&(r.nodeType!==8||r.data!==x);)r=r.nextSibling;r||Y();const g=N(r),f=H(n,{...e,anchor:g});return E(!1),o=!0,f},!1)}catch(r){if(!o&&e.recover!==!1&&r.message.includes("hydration_missing_marker_close"))return ee(),B(),re(t),E(!1),ie(n,e);throw r}finally{E(!!a),ne(a)}}function H(n,{target:e,anchor:t,props:a={},events:o,context:r,intro:g=!1}){B();const f=new Set,h=P.bind(null,e),w=P.bind(null,document),m=s=>{for(let l=0;l<s.length;l++){const d=s[l];f.has(d)||(f.add(d),e.addEventListener(d,h,A.includes(d)?{passive:!0}:void 0),document.addEventListener(d,w,A.includes(d)?{passive:!0}:void 0))}};m($(ae)),V.add(m);let _;const i=q(()=>(z(()=>{if(r){G({});var s=J;s.c=r}o&&(a.$$events=o),_=n(t,a)||{},r&&W()}),()=>{for(const s of f)e.removeEventListener(s,h);V.delete(m),C.delete(_)}));return C.set(_,i),_}let C=new WeakMap;function he(n){const e=C.get(n);e==null||e()}function y(n,e=K){var t=e.dom;return t===null?e.dom=n:(S(t)||(t=e.dom=[t]),S(n)?t.push(...n):t.push(n)),n}function me(n,e){var t=(e&X)!==0,a=(e&Z)!==0,o;return()=>{if(c)return y(t?u:u[0]);o||(o=Q(n),t||(o=o.firstChild));var r=a?document.importNode(o,!0):te(o,!0);return y(t?[...r.childNodes]:r),r}}function ve(n){if(!c)return y(v());var e=u[0];return e||n.before(e=v()),y(e)}function ye(){if(c)return y(u);var n=document.createDocumentFragment(),e=v();return n.append(e),y([e]),n}function ge(n,e){c||n.before(e)}const se="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(se);export{ge as a,oe as b,le as c,ce as d,ye as e,fe as f,_e as g,c as h,E as i,u as j,pe as k,ve as l,ie as m,de as s,me as t,he as u};
