import { b as pop, p as push } from "../../../chunks/index2.js";
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  $$payload.out += `<h1>Thola Kimonganga Customer UI Layout</h1> <!--[-->`;
  children($$payload);
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _layout as default
};
