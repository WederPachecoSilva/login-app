const express = require('express');
let router = express.Router();

// Cadastro
router.get('/register', (req, res) => {
  res.render('register');
});

// Login
router.get('/login', (req, res) => {
  res.render('login')
});

// Logout
router.get('/logout', (req, res) => {
  res.render('logout');
});

module.exports = router;
