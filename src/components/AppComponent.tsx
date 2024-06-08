import React, { useState, useEffect } from 'react';
import './AppComponent.css';
import BooksResponse from '../models/BooksResponse';
import { getBooks } from '../services/bookService';

function AppComponent() {
  const [books, setBooks] = useState<BooksResponse>({ books: [], perPage: 0, currentPage: 0, hasNextPage: false, totalPages: 0, totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0)
  const [total, setTotal] = useState(0)


  useEffect(() => {
    fetchBooks();
  }, [currentPage, itemsPerPage]);

  const fetchBooks = async () => {
    setLoading(true);
    getBooks(currentPage, itemsPerPage)
      .then(data => {
        setBooks(data);
        setTotalPages(data.totalPages);
        setStart(data.currentPage * data.perPage - data.perPage + 1)
        setEnd(data.currentPage * data.perPage)
        setTotal(data.totalItems)
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



  return (
    <div className="rootApp">
      <div className="title">
        <h1>Lista de Livros</h1>
      </div>

      <div className="top-section">
        <label htmlFor="itemsPerPage">Itens por Página: </label>
        <input type="number" id="itemsPerPage" min="1" onChange={handleItemsPerPageChange} />
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
              </tr>
            </thead>
            <tbody>
              {books.books && books.books.length > 0 ? (
                books.books.map(book => (
                  <tr key={book._id}>
                    <td>{book.titulo ? book.titulo : '-'}</td>
                    <td>{book.autor ? book.autor : '-'}</td>
                    <td>{book.isbn ? book.isbn : '-'}</td>
                    <td>{book.paginas ? book.paginas : '-'}</td>
                    <td>{book.ano ? book.ano : '-'}</td>
                    <td> R$ {book.valor ? book.valor.toFixed(2) : '0'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Nenhum livro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="descricaoPag">
            <h3>Exibindo de { start } até { end } de {total} livros </h3>
          </div>

          <div className="pagination">
            <button disabled={currentPage <= 1} onClick={() => handlePageClick(1)}>{"<<"}</button>
            <button disabled={currentPage <= 1} onClick={handlePrevPage}>{"<"}</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              if (page === currentPage) {
                return <button key={page} onClick={() => handlePageClick(page)} className="selected" style={{ border: '1px solid gray', backgroundColor: 'gray' }}>{page}</button>;
              } else if (page >= currentPage - 3 && page <= currentPage + 3) {
                return <button key={page} onClick={() => handlePageClick(page)} style={{ border: '1px solid gray' }}>{page}</button>;
              }
              return null;
            })}
            <button disabled={currentPage >= totalPages} onClick={handleNextPage}>{">"}</button>
            <button disabled={currentPage >= totalPages - 3} onClick={() => handlePageClick(totalPages)}>{">>"}</button>
            <br />
          </div>
        </>
      )}
    </div>
  );
}

export default AppComponent;

