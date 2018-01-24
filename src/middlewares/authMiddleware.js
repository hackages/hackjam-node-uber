/**
 * This middleware must block all requests coming from unauthorized clients
 * If clients don't pass this header:
 * Authorization: Bearer U3VwZXIgc2VjcmV0IHRva2VuIGRvIG5vdCBkaXN0cmlidXRlIHBseg==
 * They must receive a 401 and the request should not propagate any further
 */
export const authMiddleware = (req, res, next) => {};
