const express = require('express')
const router = express.Router()
const connection = require('../db')


router.post('/', (req, res) => {
	const { email, passwd } = req.body
	connection.query('SELECT role FROM users WHERE email = ? AND password_hash = ?', [email, passwd], (err, results) => {
		if (err) return res.status(500).send('Server error')

		if (results.length === 0) return res.status(401).send('Invalid credentials')

		if (results[0].role === "admin") {
			res.redirect('/login/database')
		} else {
			res.redirect('/pages/dashboard.html')
		}
	})
})

router.get('/database', (req, res) => {
	connection.query(
		'SELECT id, fname, lname, email, password_hash, mobile, DATE_FORMAT(dob, "%Y-%m-%d") AS dob, gender, address, country, postal_code, DATE_FORMAT(created_at, "%a, %b %d %Y, %H:%i:%s") AS created_at, role FROM users', (err, result) => {
			if (err) return res.status(500).send('Server error');

			res.render('database', { users: result });
		});
});

router.get('/update/:id', (req, res) => {
	connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
		res.render('editUser', { user: rows[0] })
	})
})

router.patch('/edituser/:id', (req, res) => {
	console.log(req.body)
	const { fname, lname, email, passwd, mobile, mobCode, dob, gender, address, country, postal } = req.body
	
	connection.query(
		'UPDATE users SET fname=?, lname=?, email=?, password_hash=?, mobile=?, dob=?, gender=?, address=?, country=?, postal_code=? WHERE id=?',
		[fname, lname, email, passwd, mobCode + " " + mobile, dob, gender, address, country, postal, req.params.id],
		(err, result) => {
			console.log(err)
			if (err) return res.status(500).send('Database error');
			if (result.affectedRows === 0) return res.status(404).send('User not found');
			res.redirect('/login/database');
		}
	);
	
})

router.delete('/delete/:id', (req, res) => {
	connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows) => {
		res.redirect("/login/database")
	})
})
module.exports = router
