// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configurar o body-parser para analisar o conteúdo das requisições
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar o pool de conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'geolocalizacao_db',
  password: 'root',
  port: 5432,
});

// Endpoint para receber dados do formulário
app.post('/submit-form', async (req, res) => {
  const { nome, descricao, categoria, localizacao, raio, horario, publico } = req.body;
  console.log(req.body)
  
  try {
    const query = `
      INSERT INTO promocoes (nome, descricao, categoria, localizacao, raio, horario, publico)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [nome, descricao, categoria, localizacao, raio, horario, publico];
    
    const result = await pool.query(query, values);
    res.status(201).send(`Promoção adicionada: ${result.rows[0].nome}`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao inserir dados');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
