import { MongoClient } from 'mongodb';
import express from 'express';
import json from 'body-parser';
import cors from 'cors';
const app = express();
const port = 3001;


const filter = {};

const client = await MongoClient.connect(
  'mongodb://localhost:27017/',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const coll = client.db('livros').collection('livro');


app.use(json.json()); // middleware para analisar o corpo da solicitação como JSON
app.use(cors()); // middleware para permitir solicitações de origem cruzada

const BOOKS_MAPPING = '/books';


// Rota para retornar livros paginados
app.get(BOOKS_MAPPING, async (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 10; // Quantidade de livros por página
  const page = parseInt(req.query.page) || 1;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const cursor = coll.find(filter);
  const totalItems = await cursor.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedBooks = await cursor.skip(start).limit(pageSize).toArray();
  const hasNextPage = page < totalPages;

  res.json({
    books: paginatedBooks,
    perPage: pageSize,
    currentPage: page,
    hasNextPage,
    totalPages,
    totalItems
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
