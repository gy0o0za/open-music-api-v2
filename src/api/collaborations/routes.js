const routes = (h)=> ([
  { method:'POST', path:'/collaborations', handler:(r,rs)=>h.postCollabHandler(r,rs), options:{ auth:'openmusic_jwt' } },
  { method:'DELETE', path:'/collaborations', handler:(r,rs)=>h.deleteCollabHandler(r,rs), options:{ auth:'openmusic_jwt' } },
]);
module.exports = routes;
