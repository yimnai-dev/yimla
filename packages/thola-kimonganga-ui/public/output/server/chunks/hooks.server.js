import { r as redirect } from "./index.js";
function sequence(...handlers) {
  const length = handlers.length;
  if (!length)
    return ({ event, resolve }) => resolve(event);
  return ({ event, resolve }) => {
    return apply_handle(0, event, {});
    function apply_handle(i, event2, parent_options) {
      const handle2 = handlers[i];
      return handle2({
        event: event2,
        resolve: (event3, options) => {
          const transformPageChunk = async ({ html, done }) => {
            if (options?.transformPageChunk) {
              html = await options.transformPageChunk({ html, done }) ?? "";
            }
            if (parent_options?.transformPageChunk) {
              html = await parent_options.transformPageChunk({ html, done }) ?? "";
            }
            return html;
          };
          const filterSerializedResponseHeaders = parent_options?.filterSerializedResponseHeaders ?? options?.filterSerializedResponseHeaders;
          const preload = parent_options?.preload ?? options?.preload;
          return i < length - 1 ? apply_handle(i + 1, event3, {
            transformPageChunk,
            filterSerializedResponseHeaders,
            preload
          }) : resolve(event3, { transformPageChunk, filterSerializedResponseHeaders, preload });
        }
      });
    }
  };
}
const SUB_DOMAIN_MAP = {
  "thola-client": "tkc",
  "thola-org": "tko",
  "thola-pharmacy": "tkp"
};
const handleAppDomain = async ({ event, resolve }) => {
  const domain = event.url.host;
  const [subdomain] = domain;
  const app = SUB_DOMAIN_MAP[subdomain];
  if (!event.url.pathname.includes(app)) {
    redirect(302, `/${app}`);
  }
  return await resolve(event);
};
const handle = sequence(handleAppDomain);
export {
  handle
};
