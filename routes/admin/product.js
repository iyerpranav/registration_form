const express = require('express');
const router = express.Router();
const pool = require('../../db');
const multer = require('multer');
const upload = multer();
const { isAdmin } = require('./index');

router.get('/newproduct', async (req, res) => {
	const [categories] = await pool.query('SELECT id, name FROM product_category');
	res.render('newProduct', { categories });
});

router.post('/addproduct', upload.single('image'), async (req, res) => {
	const { name, code, rate, status, description, category_id } = req.body;
	const image = req.file?.buffer || null;
	const image_type = req.file?.mimetype || null;

	try {
		await pool.execute(
			`INSERT INTO product 
			 (name, code, rate, status, description, image, image_type, category_id)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[name, code, rate, status, description, image, image_type, category_id]
		);
		res.redirect('/admin/products');
	} catch (err) {
		res.status(500).send('Database error');
	}
});

router.get('/image/:id', async (req, res) => {
	const [rows] = await pool.execute('SELECT image, image_type FROM product WHERE id = ?', [req.params.id]);
	if (rows.length === 0 || !rows[0].image) return res.status(404).send('No image');
	res.contentType(rows[0].image_type);
	res.send(rows[0].image);
});

module.exports = router
