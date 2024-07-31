import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserData {
  email: string;  // Use lowercase 'string'
  username: string;  // Use lowercase 'string'
  revenues: number;
  totalBorrowings: number;
  mostBorrowedBook: string;
  preferredGenre: string;
}

const TableOne = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/admin/utilisateurs/plusActifs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          const transformedData = response.data.map((item: any) => ({
            email: item[0],
            username: item[1],
            revenues: item[2],
            totalBorrowings: item[3],
            mostBorrowedBook: item[4],
            preferredGenre: item[5]
          }));
          setUsers(transformedData);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Active Users
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              User
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Revenues
            </h5>
          </div>
          <div className="hidden sm:block p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Total Borrowings
            </h5>
          </div>
          <div className="hidden md:block p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Most Borrowed Book
            </h5>
          </div>
          <div className="hidden lg:block p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Preferred Genre
            </h5>
          </div>
        </div>

        {users.map((user, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-b border-stroke dark:border-strokedark">
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {`${user.username}`}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.revenues.toFixed(2)} DT</p>
            </div>

            <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{user.totalBorrowings}</p>
            </div>

            <div className="hidden md:flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.mostBorrowedBook}</p>
            </div>

            <div className="hidden lg:flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-5">{user.preferredGenre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
