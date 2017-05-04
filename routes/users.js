const express = require('express');
let router = express.Router();
const passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

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

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Usuário Desconhecido'})
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Senha Inválida'})
        }
      })
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }
),
  (req, res) => {
    let username = req.body.username;
    res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();

  req.flash('success_msg', 'Você está deslogado(a)');

  res.redirect('/users/login');
});

module.exports = router;
