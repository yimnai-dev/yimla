import { c as slot, b as pop, p as push } from "../../chunks/index2.js";
function _layout($$payload, $$props) {
  push();
  $$payload.out += `<!--[-->`;
  slot($$payload, $$props.children, {});
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _layout as default
};
