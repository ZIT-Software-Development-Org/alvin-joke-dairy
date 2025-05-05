// middleware/auth.js
export function isAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  export function isOwnerOrAdmin(modelGetter) {
    // modelGetter: async (id) => { returns record with user_id }
    return async (req, res, next) => {
      console.log("j")
      const record = await modelGetter(req.params.id);
      if (!record) return res.status(404).json({ error: 'Not found' });
      if (record.user_id === req.session.userId || req.session.role === 'admin') {
        return next();
      }
      return res.status(403).json({ error: 'Forbidden' });
    };
  }
  