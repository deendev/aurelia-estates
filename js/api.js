/* =========================================================================
   AURELIA ESTATES · API layer
   -------------------------------------------------------------------------
   The front end talks only to these functions. Each one currently resolves
   from local sample data (js/data.js) or simulates a network round trip.

   BACKEND INTEGRATION
   Replace each body with a real request, for example:

     getProperties: (params) =>
       fetch('/api/properties?' + new URLSearchParams(params)).then(r => r.json())

   Suggested endpoints:
     GET  /api/properties            list + filters (status, location, type, price, beds, q)
     GET  /api/properties/:id        single listing
     POST /api/enquiries             property enquiry form
     POST /api/viewings              viewing requests (date, time slot)
     POST /api/valuations            "List Your Property" / Sell form
     POST /api/contact               general contact form
     POST /api/newsletter            newsletter subscription (double opt-in)
     GET  /api/favourites            per-user favourites (once accounts exist)
   ========================================================================= */

window.AureliaAPI = (function () {
  const D = window.AURELIA_DATA;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Simulated submission. Nothing leaves the browser.
  async function submit(endpoint, payload) {
    await wait(750);
    // eslint-disable-next-line no-console
    console.info('[Aurelia demo] would POST to', endpoint, payload);
    return { ok: true, reference: 'AE-' + Math.random().toString(36).slice(2, 8).toUpperCase() };
  }

  return {
    getProperties: async () => D.properties.slice(),
    getProperty: async (id) => D.properties.find((p) => p.id === id) || null,
    submitEnquiry: (data) => submit('/api/enquiries', data),
    requestViewing: (data) => submit('/api/viewings', data),
    requestValuation: (data) => submit('/api/valuations', data),
    sendContact: (data) => submit('/api/contact', data),
    subscribe: (data) => submit('/api/newsletter', data),
    registerInterest: (data) => submit('/api/developments/interest', data)
  };
})();
