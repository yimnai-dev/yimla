import { j as escape_html, n as store_get, u as unsubscribe_stores, c as pop, p as push } from "../../chunks/index3.js";
import { p as page } from "../../chunks/stores2.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<p>tholaKimonganga: ${escape_html(store_get($$store_subs ??= {}, "$page", page).data.tholaApp)}</p>`;
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
