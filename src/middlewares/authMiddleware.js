/**
 * This middleware must block all requests coming from unauthorized clients
 * If clients don't pass this header:
 * Authorization: Bearer U3VwZXIgc2VjcmV0IHRva2VuIGRvIG5vdCBkaXN0cmlidXRlIHBseg==
 * They must receive a 401 and the request should not propagate any further
 */
export const authMiddleware = (req, res, next) => {
  const {authorization = ''} = req.headers;
  const token = authorization.replace('Bearer ', '');
  if (token !== 'U3VwZXIgc2VjcmV0IHRva2VuIGRvIG5vdCBkaXN0cmlidXRlIHBseg==') {
    res.status(401);
    return res.send('Unauthorized access');
  }
  next();
};
