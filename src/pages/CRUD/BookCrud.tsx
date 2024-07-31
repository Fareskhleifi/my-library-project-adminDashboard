import  { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { request } from '../../axios_helper'; 

interface book {
  id: number;
  titre: string;
  auteur: string;
  isbn : string;
  genre: string;
  description: string;
  categorie: string;
  categorieId : Number
  disponibilite : boolean;
  prixParJour: number;
}

interface bookUp {
  id: number;
  titre: string;
  auteur: string;
  isbn : string;
  genre: string;
  description: string;
  categorieId : Number
  disponibilite : boolean;
  prixParJour: number;
}
const BookCrud = () => {

  const [books, setBooks] = useState<book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState<Omit<bookUp, 'id'>>({
    titre: '',
    auteur: '',
    isbn: '',
    genre: '',
    description: '',
    categorieId: 0,
    disponibilite: true,
    prixParJour: 0
  });
  

  const saveBook = async () => {
    try {
      await request('POST','/admin/saveLivres' ,formData);
        
        alert('Book saved successfully');
        setFormData({
            titre: '',
            auteur: '',
            isbn: '',
            genre: '',
            description: '',
            categorieId: 0,
            disponibilite: true,
            prixParJour: 0
        });
        fetchBooks();
        fetchCategories();
        setShowForm(false);
    } catch (error) {
       console.log(error);
    }
};

useEffect(() => {
  fetchBooks();
  fetchCategories();
}, []);

  const handleShowForm =() =>{
    setShowForm(true);
  }
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await request('GET', '/public/getlivres'); 
      setBooks(response.data);
    } catch (error) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

   const fetchCategories = async () => {
    try {
      const response = await request('GET', '/public/getAllCategories'); 
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch users.');
    } 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = async (userId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');

    if (confirmDelete) {
      try {
        await request('DELETE', `/admin/deleteLivres/${userId}`);
        setTimeout(() => {
          fetchBooks();
        }, 500); 
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdate = async (userId: number) => {

    const categoryId: number | undefined = categories.find(category => category.name === selectedCategory ||category.id === parseFloat(selectedCategory)  )?.id;
    if(categoryId)
    {
      formData.categorieId = categoryId;
    }
    const confirmDelete = window.confirm('Are you sure you want to update this book?');

    if (confirmDelete) {
      try {
        await request('PUT', `/admin/updateLivres/${userId}`,formData);
        setShowForm(false);
        setTimeout(() => {
          fetchBooks();
          fetchCategories();
        }, 500); 
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredbooks = books.filter(book => {
    const titre = book.titre.toLowerCase();
    return (
      titre.includes(searchQuery.toLowerCase()) ||
      book.categorie.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.prixParJour.toString().includes(searchQuery.toLowerCase()) 
    );
  });
  const getProductImage = (id: number) => {
    try {
      return new URL(`../../images/books/book${id}.jpg`, import.meta.url).href;
    } catch (err) {
      console.error(`Image for product ID ${id} not found, using default image`);
      return new URL("../../images/books/default.jpg", import.meta.url).href;
    }
  };

  const handleShowBeforeUpdate = (id : Number) => {
    const bookToEdit : any = books.find((book) => book.id === id);
    setFormData(bookToEdit);
    setSelectedCategory(bookToEdit.categorie); 
    setShowForm(true);
    setUpdate(true);
};

 const handelCancel = ()=>{
  setShowForm(false);
  setUpdate(false);
  setFormData({
  titre: '',
  auteur: '',
  isbn: '',
  genre: '',
  description: '',
  categorieId: 0,
  disponibilite: true,
  prixParJour: 0
  
});}

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault(); 
  if (!update) {
    saveBook(); 
  } else {
    if (formData && formData.id) {
      handleUpdate(formData.id); 
    } else {
      console.error('FormData or ID is missing');
    }
  }
};

  return (
    <>
     <Breadcrumb pageName="Books" />
      
      <div className="font-[sans-serif] overflow-x-auto">
        <div className={`flex items-center justify-between ${showForm ? 'filter blur-sm' : ''} p-4 dark:bg-black `}>
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 px-4 w-3/12 border dark:bg-form-input border-x-body rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleShowForm} className="ml-4 py-2 px-3 bg-[#3580E0]  text-white rounded-lg">
            Add Book
          </button>
        </div>

      <table className={`min-w-full bg-white ${showForm ? 'filter blur-sm' : ''} dark:bg-body`}>
        <thead className="whitespace-nowrap">
          
          <tr>
            <th className="pl-4 w-8">
              <input id="checkbox" type="checkbox" className="hidden peer" />
              <label htmlFor="checkbox"
                className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-[#2196F3] border border-[#BDBDBD] rounded overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                  <path
                    d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                    data-name="7-Check" data-original="#000000" />
                </svg>
              </label>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
              Titre
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
              ID
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
              ISBN
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-[#BDBDBD] inline cursor-pointer ml-2"
                viewBox="0 0 401.998 401.998">
                <path
                  d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                  data-original="#000000" />
              </svg>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
              Categorie
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-[#BDBDBD] inline cursor-pointer ml-2"
                viewBox="0 0 401.998 401.998">
                <path
                  d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                  data-original="#000000" />
              </svg>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
            prix par jour
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-[#BDBDBD] inline cursor-pointer ml-2"
                viewBox="0 0 401.998 401.998">
                <path
                  d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                  data-original="#000000" />
              </svg>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="whitespace-nowrap">
        {filteredbooks.map((book) => (
          <tr key={book.id} className="odd:bg-[#E3F2FD]">
            <td className="pl-4 w-8">
              <input id="checkbox1" type="checkbox" className="hidden peer" />
              <label htmlFor="checkbox1"
                className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-[#2196F3]  border border-[#BDBDBD]  rounded overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                  <path
                    d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                    data-name="7-Check" data-original="#000000" />
                </svg>
              </label>
            </td>
            <td className="p-4 text-sm">
              <div className="flex items-center cursor-pointer w-max">
                <img src={getProductImage(book.id)} className="w-9 h-9 rounded-full shrink-0" />
                <div className="ml-4">
                  <p className="text-sm text-black">{book.titre}</p>
                  <p className="text-xs text-[#9E9E9E] mt-0.5">{book.auteur}</p>
                </div>
              </div>
            </td>
            <td className="p-4 w-[100px] text-sm text-black">
              {book.id}
            </td>
            <td className="p-4 text-sm text-black">
              {book.isbn}
            </td>
            <td className="p-4 text-sm text-black">
              {book.categorie}
            </td>
            <td className="p-4 text-sm text-black">
              {book.prixParJour} DT
            </td>
            <td className="p-4">
              <button className="mr-4" title="Edit"
              onClick={() => handleShowBeforeUpdate(book.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-[#2196F3]  hover:fill-blue-700"
                  viewBox="0 0 348.882 348.882">
                  <path
                    d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                    data-original="#000000" />
                  <path
                    d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                    data-original="#000000" />
                </svg>
              </button>
              <button title="Delete"
               onClick={() => handleDelete(book.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-[#F44336] hover:fill-red-700" viewBox="0 0 24 24">
                  <path
                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                    data-original="#000000" />
                  <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                    data-original="#000000" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      {showForm && (
      <div className="min-h-full absolute left-80 top-20 bg-gray-100 p-0 sm:p-12">
        <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
          <h1 className="text-2xl font-bold text-center mb-8">Book Details</h1>
          <form id="htmlForm" noValidate>
            <div className="relative z-0 w-full mb-5">
              <input
                type="text"
                name="title"
                placeholder="Enter a title"
                required
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
              />
            
              <span className="text-sm text-red-600 hidden" id="error">
                Title is required
              </span>
            </div>

            <div className="relative z-0 w-full mb-5">
              <input
                type="text"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                name="author"
                placeholder="Enter an author"
                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
              />
            
              <span className="text-sm text-red-600 hidden" id="error">
                Author is required
              </span>
            </div>

            <div className="relative z-0 w-full mb-5">
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="Enter an ISBN"
                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
              />

              <span className="text-sm text-red-600 hidden" id="error">
                ISBN is required
              </span>
            </div>
            <select
                className="p-2 border dark:bg-form-input border-x-body rounded-lg w-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

            <div className="flex flex-row space-x-4">
              <div className="relative z-0 w-full mb-5">
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  name="genre"
                  placeholder="Genre"
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />

                <span className="text-sm text-red-600 hidden" id="error">
                  Genre is required
                </span>
              </div>
              <div className="relative z-0 w-full">
                <input
                  type="text"
                  value={formData.prixParJour}
                  onChange={(e) => setFormData({ ...formData, prixParJour: parseFloat(e.target.value) })}
                  name="price"
                  placeholder="Day price"
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />
                <span className="text-sm text-red-600 hidden" id="error">
                  Price is required
                </span>
              </div>
            </div>

            <div className="relative z-0 w-full mb-5">
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
              />
              <span className="text-sm text-red-600 hidden" id="error">
                Description is required
              </span>
            </div>
              <div className='flex gap-4'>
                  <button
                  id="button"
                  onClick={handleClick}
                  type="button"
                  className="w-7/12 px-0 py-2.5 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-primary hover:bg-bodydark2 hover:shadow-lg focus:outline-none"
                >
                  {!update ? 'Save' : 'Update'}
                </button>
                <button
                  onClick={handelCancel}
                  id="button"
                  type="button"
                  className="w-7/12 px-0 py-2.5 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-[#000000] hover:bg-bodydark2 hover:shadow-lg focus:outline-none"
                >
                  Cancel
                </button>
              </div>    
          </form>
        </div>
      </div>)}
    </div>

    </>
  );
};

export default BookCrud;
