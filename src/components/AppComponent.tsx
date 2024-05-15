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

    const { newBookTitle, newBookAuthor, newBookISBN, newBookPages, newBookYear, newBookPrice } = extractInputValue();

    const newBook: Book = {
      title: newBookTitle.value,
      author: newBookAuthor.value,
      isbn: newBookISBN.value,
      pages: parseInt(newBookPages.value),
      year: parseInt(newBookYear.value),
      price: parseFloat(newBookPrice.value),
    };

    console.log(newBook);

    await addBook(newBook);
    fetchBooks();

    clearInputs(newBookTitle, newBookAuthor, newBookISBN, newBookPages, newBookYear, newBookPrice);

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
                    <td>{book.title ? book.title : '-'}</td>
                    <td>{book.author ? book.author : '-'}</td>
                    <td>{book.isbn ? book.isbn : '-'}</td>
                    <td>{book.pages ? book.pages : '-'}</td>
                    <td>{book.year ? book.year : '-'}</td>
                    <td> R$ {book.price ? book.price.toFixed(2) : '0'}</td>
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
            {currentPage > 5 && <button onClick={() => handlePageClick(1)}>{"<<"}</button>}
            {currentPage > 1 && <button onClick={handlePrevPage}>{"<"}</button>}
            {currentPage > 5 && <button>{"..."}</button>}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              if (page === currentPage) {
                return <button key={page} onClick={() => handlePageClick(page)} className="selected" style={{ border: '1px solid gray', backgroundColor: 'gray' }}>{page}</button>;
              } else if (page >= currentPage - 3 && page <= currentPage + 3) {
                return <button key={page} onClick={() => handlePageClick(page)} style={{ border: '1px solid gray' }}>{page}</button>;
              }
              return null;
            })}
            {currentPage < totalPages - 3 && <button>{"..."}</button>}
            {currentPage < totalPages && <button onClick={handleNextPage}>{">"}</button>}
            {currentPage < totalPages - 3 && <button onClick={() => handlePageClick(totalPages)}>{">>"}</button>}
            <br />
          </div>
        </>
      )}
    </div>
  );
}

export default AppComponent;

function extractInputValue() {
  const newBookTitle = document.getElementById('newBookTitle') as HTMLInputElement;
  const newBookAuthor = document.getElementById('newBookAuthor') as HTMLInputElement;
  const newBookISBN = document.getElementById('newBookISBN') as HTMLInputElement;
  const newBookPages = document.getElementById('newBookPages') as HTMLInputElement;
  const newBookYear = document.getElementById('newBookYear') as HTMLInputElement;
  const newBookPrice = document.getElementById('newBookPrice') as HTMLInputElement;
  return { newBookTitle, newBookAuthor, newBookISBN, newBookPages, newBookYear, newBookPrice };
}

function clearInputs(newBookTitle: HTMLInputElement, newBookAuthor: HTMLInputElement, newBookISBN: HTMLInputElement, newBookPages: HTMLInputElement, newBookYear: HTMLInputElement, newBookPrice: HTMLInputElement) {
  newBookTitle.value = '';
  newBookAuthor.value = '';
  newBookISBN.value = '';
  newBookPages.value = '';
  newBookYear.value = '';
  newBookPrice.value = '';
}

