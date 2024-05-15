import { d as store_get, u as unsubscribe_stores, b as pop, p as push } from "../../chunks/index.js";
import { e as escape_html, p as page } from "../../chunks/stores.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let subdomain = (() => {
    const host = store_get($$store_subs ??= {}, "$page", page).url.host;
    const [subdomain2] = host.split(".");
    return subdomain2;
  })();
  $$payload.out += `<h1>Welcome to SvelteKit</h1> <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the ${escape_html(subdomain)}</p>`;
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
