import{n as t,i as b,e as c,g as l,U as o,s as a,m as f}from"./runtime.DwUChn-q.js";import{s as g}from"./entry.BK8erq4Z.js";function _(s,n,u){if(s==null)return n(void 0),t;const e=s.subscribe(n,u);return e.unsubscribe?()=>e.unsubscribe():e}function y(s,n,u){let e=u[n];const r=e===void 0;r&&(e={store:null,last_value:null,value:f(o),unsubscribe:t},u[n]=e),(r||e.store!==s)&&(e.unsubscribe(),e.store=s??null,e.unsubscribe=d(s,e.value));const i=l(e.value);return i===o?e.last_value:i}function d(s,n){return s==null?(a(n,void 0),t):_(s,u=>a(n,u))}function N(s){p(()=>{let n;for(n in s)s[n].unsubscribe()})}function p(s){b(()=>()=>c(s))}const v=()=>{const s=g;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},U={subscribe(s){return v().page.subscribe(s)}};export{U as p,y as s,N as u};
