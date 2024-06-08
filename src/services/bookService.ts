import axios from 'axios';
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

export { getBooks };
