import { c as store_get, u as unsubscribe_stores, b as pop, p as push } from "../../chunks/index.js";
import { e as escape_html, p as page } from "../../chunks/stores.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<h1>Thola Kimonganga Landing Page</h1> <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation for
	tholaKimonganga: ${escape_html(store_get($$store_subs ??= {}, "$page", page).data.tholaApp)}</p>`;
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
