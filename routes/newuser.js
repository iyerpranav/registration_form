const express = require('express');
const router = express.Router();
const pool = require('../db')
const bcrypt = require('bcrypt');

function isAuth(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
}

router.post('/', isAuth, async (req, res) => {
    const { name, email, passwd, mobile, mobCode, dob, gender, address, country, postal } = req.body

    const hash = await bcrypt.hash(passwd, 10);

    const [fname, ...rest] = name.trim().split(' ');
    const lname = rest.join(' ');

    const dobFormatted = new Date(dob).toISOString().split('T')[0];

    const sql = 'INSERT INTO users (fname, lname, email, password_hash, mobile, dob, gender, address, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [fname, lname, email.trim(), hash, mobCode + mobile.trim(), dobFormatted, gender, address, country, postal];

    try {
        const [result] = await pool.execute(sql, values)
        console.log(result)
        res.redirect('/index.html')
    } catch (error) {
        console.error('Insert error:', error);
        res.status(500).send('Server Error', error);
    }
});


router.get('/dashboard', isAuth, async (req, res) => {
    // console.log(res.session.user)
    res.render('dashboard', { user: req.session.user})
}) 

module.exports = router;