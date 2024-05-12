import React, { useState, useEffect } from 'react';
import './AppComponent.css';
import BooksResponse from '../models/BooksResponse';
import Book from '../models/Book';
import { addBook, deleteBook, getBooks } from '../services/bookService';

function AppComponent() {
  const [books, setBooks] = useState<BooksResponse>({ books: [], perPage: 0, currentPage: 0, hasNextPage: false, totalPages: 0, totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookISBN, setNewBookISBN] = useState('');
  const [newBookPages, setNewBookPages] = useState('');
  const [newBookYear, setNewBookYear] = useState('');
  const [newBookPrice, setNewBookPrice] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [currentPage, itemsPerPage]);

  const fetchBooks = async () => {
    setLoading(true);
    getBooks(currentPage, itemsPerPage)
            .then(data => {
                setBooks(data);
                setTotalPages(data.totalPages);
            })
            .catch(error => console.error('Error fetching books:', error))
            .finally(() => setLoading(false));
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
    const newBook: Book = {
        title: newBookTitle,
        author: newBookAuthor,
        isbn: newBookISBN,
        pages: parseInt(newBookPages),
        year: parseInt(newBookYear),
        price: parseFloat(newBookPrice)
    };

    await addBook(newBook);
    fetchBooks();

    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookISBN('');
    setNewBookPages('');
    setNewBookYear('');
    setNewBookPrice('');

    setCurrentPage(1);
};

  const handleDeleteBook = async (id: number) => {
    deleteBook(id);
    fetchBooks();
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

export default AppComponent;
