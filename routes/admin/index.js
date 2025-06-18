const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const pool = require('../../db')
const bcrypt = require('bcrypt');

const usersRoutes = require('./users')
console.log('usersRoutes is:', typeof usersRoutes); 
const productRoutes = require('./product')
console.log('productRoutes is:', typeof productRoutes); 

router.use('/product', productRoutes);
router.use('/users', usersRoutes);

async function isAdmin(req, res, next) {
	if (!req.session.user || req.session.user.role !== "admin") return res.redirect('/admin/logout');

	const [rows] = await pool.execute('SELECT session_token FROM users WHERE id = ?', [req.session.user.id])

	if (rows.length === 0 || rows[0].session_token !== req.session.user.token) {
		req.session.destroy(() => res.redirect('/'));
		return;
	}

	next();
}

router.post('/', async (req, res) => {
	console.log("post hit /admin")
	const { email, passwd } = req.body
	try {
		const [results] = await pool.execute('SELECT id, password_hash, role, fname, lname FROM users WHERE email = ?', [email])

		if (results.length === 0) return res.status(401).send('Invalid credentials')

		const match = await bcrypt.compare(passwd, results[0].password_hash)
		if (!match) return res.status(401).send('Invalid credentials')

		const sessionToken = crypto.randomBytes(32).toString
		('hex');
		
		req.session.user = {
			id: results[0].id,
			role: results[0].role,
			fname: results[0].fname,
			lname: results[0].lname,
			token: sessionToken
		};

		await pool.execute('UPDATE users SET session_token = ? WHERE id = ?', [sessionToken, results[0].id]);


		if (results[0].role === "admin") {
			res.redirect('/admin/users/database')
		} else {
			res.redirect('/newuser/dashboard')
		}
	} catch (error) {
		console.log(error)
		res.status(500).send('Server error')
	}
})

router.get('/logout', async (req, res) => {
	if (req.session.user) {
		await pool.execute('UPDATE users SET session_token = NULL WHERE id = ?', [req.session.user.id]);
		req.session.destroy(() => {
			res.redirect('/');
		});
	} else {
		res.redirect('/');
	}
});

module.exports = router