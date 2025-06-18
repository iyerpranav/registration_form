const express = require('express');
const router = express.Router();
const pool = require('../../db');

async function isAdmin(req, res, next) {
	if (!req.session.user || req.session.user.role !== "admin") return res.redirect('/admin/logout');

	const [rows] = await pool.execute('SELECT session_token FROM users WHERE id = ?', [req.session.user.id])

	if (rows.length === 0 || rows[0].session_token !== req.session.user.token) {
		req.session.destroy(() => res.redirect('/'));
		return;
	}
	next();
}

router.get('/database', isAdmin, async (req, res) => {
	console.log("get hit /admin/database")
	try {
		const [rows, fields] = await pool.execute(
			'SELECT id, fname, lname, email, password_hash, mobile, DATE_FORMAT(dob, "%Y-%m-%d") AS dob, gender, address, country, postal_code, DATE_FORMAT(created_at, "%a, %b %d %Y, %H:%i:%s") AS created_at, role FROM users'
		)
		
		res.render('database', { 
			users: rows, 
			cols: fields.map(col => col.name),
			table: fields[0].table
		});
	} catch (error) {
		res.status(500).send('Server error');
	}
});

router.get('/update/:id', isAdmin, async (req, res) => {
	const lastUpdatedId = req.session.lastUpdatedId;
	if (lastUpdatedId === req.params.id) {
		delete req.session.lastUpdatedId;
		return res.redirect('/admin/database');
	}

	try {
		const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id])
		res.render('editUser', { user: rows[0] })
	} catch (error) {
		res.status(500).send('Server error');
	}
});

router.patch('/edituser/:id', isAdmin, async (req, res) => {
	console.log(req.body)
	const { fname, lname, email, passwd, mobile, mobCode, dob, gender, address, country, postal } = req.body

	try {
		const [result] = await pool.execute(
			'UPDATE users SET fname=?, lname=?, email=?, password_hash=?, mobile=?, dob=?, gender=?, address=?, country=?, postal_code=? WHERE id=?',
			[fname, lname, email, passwd, mobCode + " " + mobile, dob, gender, address, country, postal, req.params.id]
		)

		if (result.affectedRows === 0) return res.status(404).send('User not found');
		req.session.lastUpdatedId = req.params.id;
		res.redirect('/admin/database');

	} catch (error) {
		console.log(error)
		res.status(500).send('Database error');
	}
});

router.delete('/delete/:id', isAdmin, async (req, res) => {
	try {
		await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id])
		res.redirect("/admin/users/	database")
	} catch (error) {
		res.status(500).send('Database error');
	}
});


module.exports = router;