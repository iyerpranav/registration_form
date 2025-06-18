const express = require('express')
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path')
const app = express()
const db = require('./db');
const port = 3000

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use(session({
  secret: 'uiqpcfhuqwipp12984u148cyhqwl',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const newuserRoutes = require('./routes/newuser');
app.use('/newuser', newuserRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})