import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  pages: number;
  year: number;
  price: number;
}

interface BooksResponse {
  books: Book[];
  perPage: number;
  currentPage: number;
  hasNextPage: boolean;
  totalItems: number;
}

function App() {
  const [books, setBooks] = useState<BooksResponse>({ books: [], perPage: 0, currentPage: 0, hasNextPage: false, totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, itemsPerPage]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const perPageParam = itemsPerPage ? `&pageSize=${itemsPerPage}` : '';
      const response = await axios.get(`http://localhost:3001/books?page=${currentPage}${perPageParam}`);
      console.log(`HTTP Method: ${response.statusText}`);
      console.log(`Request URL: ${response.config.url}`);
      console.log(response.data);
      setBooks(response.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
    } else {
      setItemsPerPage(undefined);
    }
  };

  const handleAddBook = async () => {
    const newBookTitle = document.getElementById('newBookTitle') as HTMLInputElement;
    const newBookAuthor = document.getElementById('newBookAuthor') as HTMLInputElement;
    const newBookISBN = document.getElementById('newBookISBN') as HTMLInputElement;
    const newBookPages = document.getElementById('newBookPages') as HTMLInputElement;
    const newBookYear = document.getElementById('newBookYear') as HTMLInputElement;
    const newBookPrice = document.getElementById('newBookPrice') as HTMLInputElement;

    const newBook: Book = {
      title: newBookTitle.value,
      author: newBookAuthor.value,
      isbn: newBookISBN.value,
      pages: parseInt(newBookPages.value),
      year: parseInt(newBookYear.value),
      price: parseFloat(newBookPrice.value)
    };

    console.log('Adding book:', newBook);

    try {
      await axios.post('http://localhost:3001/books', newBook);
      fetchBooks(); // Call fetchBooks to update the book list
      // Clear the input fields
      newBookTitle.value = '';
      newBookAuthor.value = '';
      newBookISBN.value = '';
      newBookPages.value = '';
      newBookYear.value = '';
      newBookPrice.value = '';
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      fetchBooks(); // Call fetchBooks to update the book list
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className='rootApp'>
      <div className="title">
        <h1 >Lista de Livros</h1>
      </div>
      <div>
        <label htmlFor="itemsPerPage">Itens por Página: </label>
        <input type="number" id="itemsPerPage" min="1" onChange={handleItemsPerPageChange} />
      </div>


      <div className="add-book-container">
        <button onClick={handleAddBook}>Adicionar Livro</button>
        <input type="text" id="newBookTitle" placeholder="Título do Livro" />
        <input type="text" id="newBookAuthor" placeholder="Autor do Livro" />
        <input type="text" id="newBookISBN" placeholder="ISBN do Livro" />
        <input type="number" id="newBookPages" placeholder="Número de Páginas" />
        <input type="number" id="newBookYear" placeholder="Ano de Publicação" />
        <input type="number" id="newBookPrice" placeholder="Preço do Livro" />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="App">

          {books.books && books.books.length > 0 ? (
            <ul>
              {books.books.map(book => (
                <li key={book.id}>
                  <strong>Título:</strong> {book.title}, <strong>Autor:</strong> {book.author}, <strong>ISBN:</strong> {book.isbn}, <strong>Páginas:</strong> {book.pages}, <strong>Ano:</strong> {book.year}, <strong>Valor:</strong> {book.price}
                  <button onClick={() => handleDeleteBook(book.id ?? 0)}>Excluir</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No books found.</p>
          )}

          <div>
            {currentPage > 1 && <button onClick={handlePrevPage}>Página anterior</button>}
            {currentPage < totalPages && <button onClick={handleNextPage}>Próxima página</button>}
            <br />
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
