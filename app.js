const express = require('express')
const mysql = require('mysql2')
const path = require('path')

const app = express()
const port = 3000
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'jack',
    password: '12ka4',
    database: 'registration_form'
});

connection.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.post('/newuser', (req, res) => {
    const { fname, email, passwd, mobile, dob, gender, address, country, postal } = req.body

    const sql = 'INSERT INTO users (full_name, email, password_hash, mobile, dob, gender, address, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [fname, email, passwd, mobile, dob, gender, address, country, postal];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            res.status(500).send('Server Error');
            return;
        }
        console.log(result)
        res.redirect('/index.html')
    });
    console.log(req.body)
});

app.post('/login', (req, res) => {
  const { fname, passwd } = req.body;
  const sql = 'SELECT * FROM users WHERE full_name = ? AND password_hash = ?';
  const values = [fname, passwd];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Invalid credentials');
      return;
    }

    res.redirect('/pages/dashboard.html'); 
  });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})