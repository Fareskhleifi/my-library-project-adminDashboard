import  { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  titre: string;
  auteur: string;
  isbn: string;
  genre: string;
  description: string;
  categorie: Category;
  disponibilite: boolean;
  prixParJour: number;
  borrowCount: number; 
}


const TableTwo = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMostBorrowedBooks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get("/admin/livres/plusEmpruntes", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }

        );
        const fetchedBooks: Book[] = response.data.map(
          (item: [Book, number]) => ({
            ...item[0], 
            borrowCount: item[1],
          })
        );

        setBooks(fetchedBooks);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch most borrowed books");
      }
    };

    fetchMostBorrowedBooks();
  }, []);

  const getProductImage = (id: number) => {
    try {
      return new URL(`../../images/books/book${id}.jpg`, import.meta.url).href;
    } catch (err) {
      console.error(`Image for product ID ${id} not found, using default image`);
      return new URL("../../images/books/default.jpg", import.meta.url).href;
    }
  };
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Top Books
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Book ID</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">N° borrowings</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Profit</p>
        </div>
      </div>

      {error ? (
        <div className="py-4.5 px-4 text-red-500">{error}</div>
      ) : (
        books.map((book) => (
          <div
            key={book.id}
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          >
            <div className="col-span-2 flex items-center">
              <img src={getProductImage(book.id)} className="rounded-full w-12 h-12 mr-10"></img>
              <p className="text-sm text-black dark:text-white">( {book.id} )</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {book.categorie.name}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {book.prixParJour.toFixed(2)} DT
              </p>
            </div>
            <div className="col-span-2 ml-5 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {book.borrowCount}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">
                {(book.borrowCount * book.prixParJour).toFixed(2)} DT
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TableTwo;
