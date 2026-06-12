const setIdAsParam = (src, srcKey = 'id', dest = 'id') => {
  return (req, res, next) => {
    req.params[dest] = req[src][srcKey];
    next();
  };
};

module.exports = setIdAsParam;
