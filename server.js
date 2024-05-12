import express from 'express';
import json  from 'body-parser';
import cors from 'cors';
const app = express();
const port = 3001;

app.use(json.json()); // middleware para analisar o corpo da solicitação como JSON
app.use(cors()); // middleware para permitir solicitações de origem cruzada

const BOOKS_MAPPING = '/books';

// Dados dos livros (exemplo)
let books = [
  { id: 1, title: 'Livro 1', author: 'Autor 1', isbn: '123456789', pages: 200, year: 2020, price: 30.0 },
  { id: 2, title: 'Livro 2', author: 'Autor 2', isbn: '987654321', pages: 250, year: 2019, price: 25.0 },
  // Adicione mais livros conforme necessário
];


// Rota para retornar livros paginados
app.get(BOOKS_MAPPING, (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 2; // Quantidade de livros por página
  const page = parseInt(req.query.page) || 1;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedBooks = books.slice(start, end);
  const totalPages = Math.ceil(books.length / pageSize);
  const hasNextPage = page < totalPages;
  const totalItems = books.length;

  res.json({ 
    books: paginatedBooks, 
    perPage: pageSize,
    currentPage: page,
    hasNextPage,
    totalPages,
    totalItems
  });
});

// Rota para adicionar um novo livro
app.post('/books', (req, res) => {
  const { title, author, isbn, pages, year, price } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    author,
    isbn,
    pages,
    year,
    price
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Rota para deletar um livro
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  books = books.filter(book => book.id !== parseInt(id));
  res.sendStatus(204);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
