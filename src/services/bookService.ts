import axios from 'axios';
import Book from '../models/Book';
import BooksResponse from '../models/BooksResponse';

async function getBooks(currentPage: number, itemsPerPage?: number): Promise<BooksResponse> {
  try {
    const perPageParam = itemsPerPage ? `&pageSize=${itemsPerPage}` : '';
    const response = await axios.get(`http://localhost:3001/books?page=${currentPage}${perPageParam}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

async function addBook(newBook: Book): Promise<void> {
  try {
    await axios.post('http://localhost:3001/books', newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
}

async function deleteBook(id: string): Promise<void> {
  try {
    await axios.delete(`http://localhost:3001/books/${id}`);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}

export { getBooks, addBook, deleteBook };
