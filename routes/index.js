const express = require('express');
let router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index');
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  } else {
    req.flash('error_msg', 'Você não está logado')
    res.redirect('/users/login')
  }
}

module.exports = router;
