import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { request } from '../../axios_helper'; // Update the path as necessary

interface User {
  id: number;
  nom: string;
  prenom: String;
  email: string;
  adresse: string;
  telephone : String;
  accountStatus: String;
}

const UserCrud: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await request('GET', '/admin/getUtilisateurs'); 
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCheckboxChange = async (userId: number, isActive: boolean) => {
    const confirmChange = window.confirm(
      `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this user?`
    );

    if (confirmChange) {
    try {
      const status = isActive ? `/admin/deactivateUtilisateur/${userId}` : `/admin/activateUtilisateur/${userId}`;
      await changeUserStatus(status); 
    } catch (error) {
      console.error('Error changing user status:', error);
    }
  }
  };
  const handleDelete = async (userId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (confirmDelete) {
      try {
        await request('DELETE', `/admin/deleteUtilisateur/${userId}`);
        setTimeout(() => {
          fetchUsers();
        }, 500); 
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  const changeUserStatus = async (url : string) => {
    try {
      await request('PUT', url);
      setTimeout(() => {
        fetchUsers(); 
      }, 500);
    } catch (error) {
      console.error('Error changing user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.telephone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  return (
    <>
      <Breadcrumb pageName="Users" />
      
      <div className="font-[sans-serif] overflow-x-auto">
      
      <div className="p-4 dark:bg-black ">
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 px-4 w-3/12 border dark:bg-form-input  border-x-body rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      <table className="min-w-full bg-white dark:bg-body">
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
              Nom
            </th>
            
            <th className="p-4 text-left text-sm font-semibold text-black">
              Adresse
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-[#BDBDBD] inline cursor-pointer ml-2"
                viewBox="0 0 401.998 401.998">
                <path
                  d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                  data-original="#000000" />
              </svg>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
              Telephone
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-[#BDBDBD] inline cursor-pointer ml-2"
                viewBox="0 0 401.998 401.998">
                <path
                  d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                  data-original="#000000" />
              </svg>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">
              Active
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
        {filteredUsers.map((user) => (
          <tr key={user.id} className="odd:bg-[#E3F2FD]">
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
                <img src='https://readymadeui.com/profile_6.webp' className="w-9 h-9 rounded-full shrink-0" />
                <div className="ml-4">
                  <p className="text-sm text-black">{user.prenom+" "+user.nom}</p>
                  <p className="text-xs text-[#9E9E9E] mt-0.5">{user.email}</p>
                </div>
              </div>
            </td>
            <td className="p-4 text-sm text-black">
              {user.adresse}
            </td>
            <td className="p-4 text-sm text-black">
              {user.telephone}
            </td>
            <td className="p-4">
              <label className="relative cursor-pointer">
              <input
                id={`checkbox${user.id}`}
                type="checkbox"
                className="hidden peer"
                checked={user.accountStatus === "Active"}
                onChange={() => handleCheckboxChange(user.id, user.accountStatus === "Active")}
              />
                <div
                  className="w-11 h-6 flex items-center bg-[#E0E0E0] rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-[#E0E0E0] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]">
                </div>
              </label>
            </td>
            <td className="p-4">
              <button className="mr-4" title="View Details">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-[#2196F3] hover:fill-blue-700" viewBox="0 0 24 24">
                  <path d="M12 4.5C6.75 4.5 2.25 8.75 1.25 12 2.25 15.25 6.75 19.5 12 19.5S21.75 15.25 22.75 12C21.75 8.75 17.25 4.5 12 4.5ZM12 17.5C9.5 17.5 7.25 15.25 7.25 12S9.5 6.5 12 6.5 16.75 8.75 16.75 12 14.5 17.5 12 17.5ZM12 9.5C10.75 9.5 9.75 10.5 9.75 12S10.75 14.5 12 14.5 14.25 13.5 14.25 12 13.25 9.5 12 9.5Z"/>
                </svg>
              </button>
              <button title="Delete"
               onClick={() => handleDelete(user.id)}>
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
    </div>
    </>
  );
};

export default UserCrud;
