const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-hanblebars')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require(express-session);
const passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
const mongo - require('mongodb');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
let db = mongoose.connection;

let routes = require('./routes/index');
let users = require('./routes/users');

let app = express();

//Configura View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// Parseadores
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Configura diretório estático
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'minhachavesecreta',
  saveUnitializes: true,
  resave: true
}));

// Configura Middleware de validação
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connecta flash
app.use(flash());

// Variáveis globais
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', routes);
app.use('/users', users);

// Configura portas
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log('Servidor rodando na porta ' + app.get('port'));
})
