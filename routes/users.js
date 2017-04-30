const express = require('express');
let router = express.Router();

let User = require('../models/user');

// Cadastro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let password2 = req.body.password2;

  // Validação
  req.checkBody('name', 'Preencha o nome').notEmpty();
  req.checkBody('email', 'Preencha o email').notEmpty();
  req.checkBody('email', 'O email não é válido').isEmail();
  req.checkBody('username', 'Preencha o usuário').notEmpty();
  req.checkBody('password', 'Preencha a senha').notEmpty();
  req.checkBody('password2', 'Senha não bate com a anterior').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    })
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'Você está registrado e agora pode se conectar');

    res.redirect('/users/login');
  }
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
