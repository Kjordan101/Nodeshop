exports.get404 = (req, res, next) => {
  res.status(404).render('../views/404', { pageTitle: 'Page Not Found', path: ''});
};
