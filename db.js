const mysql = require('mysql2');

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

module.exports = connection;
