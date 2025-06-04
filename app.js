const express = require('express')
const methodOverride = require('method-override');
const path = require('path')
const app = express()
const db = require('./db'); 
const port = 3000


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')); 

app.set('view engine', 'ejs');

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

const newuserRoutes = require('./routes/newuser');
app.use('/newuser', newuserRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})