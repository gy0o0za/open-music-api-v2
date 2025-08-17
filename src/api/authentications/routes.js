const routes = (h) => ([
  { method: 'POST', path: '/authentications', handler: (r,rs)=>h.postAuthenticationHandler(r,rs) },
  { method: 'PUT', path: '/authentications', handler: (r,rs)=>h.putAuthenticationHandler(r,rs) },
  { method: 'DELETE', path: '/authentications', handler: (r,rs)=>h.deleteAuthenticationHandler(r,rs) },
]);
module.exports = routes;
