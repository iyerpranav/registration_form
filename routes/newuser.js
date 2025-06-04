const express = require('express');
const router = express.Router();
const connection = require('../db');


router.post('/', (req, res) => {
    const { name, email, passwd, mobile, mobCode, dob, gender, address, country, postal } = req.body

    const [fname, ...rest] = name.trim().split(' ');
    const lname = rest.join(' ');

    // const dob1 = console.log(dob.split('T')[0])
    const dobFormatted = new Date(dob).toISOString().split('T')[0]; 

    const sql = 'INSERT INTO users (fname, lname, email, password_hash, mobile, dob, gender, address, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [fname, lname, email, passwd, mobCode + mobile, dobFormatted, gender, address, country, postal];

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

module.exports = router;