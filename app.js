const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
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

// Configura diretório estático
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
// Este middleware armazera sessions em memória local e não é 
// adequado para produção, apenas para desenvolvimento.
// Também não é necessário o módulo cookie-parser, pois esse 
// middleware é capaz de ler e escrever cookies sozinho.
app.use(session({
  secret: 'minhachavevaiaqui',
  saveUninitialized: true,
  resave: true
}));

// Inicializa passport
app.use(passport.initialize());
app.use(passport.session());

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
  res.locals.user = req.user || null;
  next();
});

//configura rotas
app.use('/', routes);
app.use('/users', users);

// Configura portas
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log(`Servidor rodando na porta ${ app.get('port') }`);
});
