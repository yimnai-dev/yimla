import { b as pop, p as push } from "../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<h1>Welcome to SvelteKit</h1> <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>`;
  pop();
}
export {
  _page as default
};
