import { c as slot, b as pop, p as push } from "../../chunks/index.js";
function default_slot($$props) {
  var children = $$props.$$slots?.default;
  if (children === true) {
    return $$props.children;
  } else {
    return children;
  }
}
function Layout($$payload, $$props) {
  push();
  $$payload.out += `<!--[-->`;
  slot($$payload, default_slot($$props), {});
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  Layout as default
};
