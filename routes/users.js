const express = require('express');
const router = express.Router();
const { poolPromise } = require('../database');


router.get('/', async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM users');
  res.json(result.recordset);
});


router.get('/:id', async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', req.params.id)
    .query('SELECT * FROM users WHERE id = @id');
  res.json(result.recordset[0] || {});
});


router.post('/', async (req, res) => {
  const { name, email, age } = req.body;
  const pool = await poolPromise;
  await pool.request()
    .input('name', name)
    .input('email', email)
    .input('age', age)
    .query('INSERT INTO users (name, email, age) VALUES (@name, @email, @age)');
  res.status(201).json({ message: 'Usuário criado' });
});


router.put('/:id', async (req, res) => {
  const { name, email, age } = req.body;
  const pool = await poolPromise;
  await pool.request()
    .input('id', req.params.id)
    .input('name', name)
    .input('email', email)
    .input('age', age)
    .query('UPDATE users SET name=@name, email=@email, age=@age WHERE id=@id');
  res.json({ message: 'Usuário atualizado' });
});

router.delete('/:id', async (req, res) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', req.params.id)
    .query('DELETE FROM users WHERE id=@id');
  res.json({ message: 'Usuário deletado' });
});

module.exports = router; 