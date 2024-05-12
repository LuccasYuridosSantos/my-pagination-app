import Book from "./Book";

interface BooksResponse {
  books: Book[];
  perPage: number;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalItems: number;
}

export default BooksResponse;
