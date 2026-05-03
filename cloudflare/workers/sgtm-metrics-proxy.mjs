/**
 * Proxies https://YOUR_SITE/metrics/* to Google Tag Manager server-side tagging on Cloud Run.
 *
 * Deploy (dashboard): Workers & Pages → Create → paste → Deploy → Routes:
 *   brandmeetscode.com/metrics*
 *   www.brandmeetscode.com/metrics*   (only if public URL uses www)
 *
 * Replace CLOUD_RUN_HOST with the hostname from GTM → Server Created modal (*.run.app).
 * Then verify: https://YOUR_SITE/metrics/healthy → ok
 *
 * @see https://developers.google.com/tag-platform/tag-manager/server-side/custom-domain?option=same-origin
 */

const CLOUD_RUN_HOST = 'server-side-tagging-2jqnhz5pvq-uc.a.run.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith('/metrics')) {
      return fetch(request);
    }

    const upstream = new URL(url.pathname + url.search, `https://${CLOUD_RUN_HOST}`);

    const headers = new Headers(request.headers);
    headers.set('Host', CLOUD_RUN_HOST);

    /** @type {RequestInit} */
    const init = {
      method: request.method,
      headers,
      redirect: 'manual',
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = request.body;
      init.duplex = 'half';
    }

    return fetch(upstream.toString(), init);
  },
};
