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

  function handlePageClick(page: number): void {
    setCurrentPage(page);
  }

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
    <div className="rootApp">
      <div className="title">
        <h1>Lista de Livros</h1>
      </div>

      <div className="top-section">
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
        <>
          <table className="books-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>ISBN</th>
                <th>Páginas</th>
                <th>Ano</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {books.books && books.books.length > 0 ? (
                books.books.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.pages}</td>
                    <td>{book.year}</td>
                    <td>{book.price}</td>
                    <td>
                      <button onClick={() => handleDeleteBook(book.id ?? 0)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Nenhum livro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            {currentPage > 1 && <button onClick={handlePrevPage}>Página anterior</button>}
            {books.books && books.books.length > 0 && <button onClick={() => handlePageClick(1)}>Primeira página</button>}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => handlePageClick(page)}>{page}</button>
            ))}
            {books.books && books.books.length > 0 && <button onClick={() => handlePageClick(totalPages)}>Última página</button>}
            {currentPage < totalPages && <button onClick={handleNextPage}>Próxima página</button>}
            <br />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
