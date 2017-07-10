const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Solicita cadastro
router.get('/register', (req, res) => {
  res.render('register');
});

// Cadastro
router.post('/register', (req, res) => {
  const { name, username, email, password, password2 } = req.body;

  req.checkBody('name', 'Preencha o nome').notEmpty();
  req.checkBody('email', 'Preencha o email').notEmpty();
  req.checkBody('email', 'O email não é válido').isEmail();
  req.checkBody('username', 'Preencha o usuário').notEmpty();
  req.checkBody('password', 'Preencha a senha').notEmpty();
  req.checkBody('password2', 'Senha não bate com a anterior').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', { errors });
  } else {
    let newUser = new User({ name, email, username, password });

    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'Você está registrado e agora pode se conectar');

    req.logIn(newUser, err => {
      if (err) throw err;
      console.log(req.user)
      return res.redirect('/')
    })
    // res.redirect('/users/login');
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('login')
});

// Configura o passport com o Local Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'Usuário Desconhecido' })
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Senha Inválida' })
        }
      })
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
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
    const { username } = req.body;
    res.redirect('/');
    console.log('executei')
  }
);

//logout
router.get('/logout', (req, res) => {
  req.logout();

  req.flash('success_msg', 'Você está deslogado(a)');

  res.redirect('/users/login');
});

module.exports = router;
