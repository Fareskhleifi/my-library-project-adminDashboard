import Breadcrumb from '../components/Breadcrumb';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  prenom: string;
  nom: string;
  username: string;
  telephone: string;
  email: string;
  adresse: string;
}

const Settings: React.FC = () => {
  const [user, setUser] = useState<User>({
    prenom: '',
    nom: '',
    username: '',
    telephone: '',
    email: '',
    adresse: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.log('No token found');
        return;
      }
      try {
        const response = await axios.get<User>('/admin/getAdminDetails', {
          headers: { 'Authorization': `Bearer ${token}` },
          params:{
            token:token
          },
        });
        setUser(response.data);
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, []);

  // Handle input changes for user information
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle input changes for password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') setCurrentPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // Save user information
  const saveUserInfo = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('/admin/updateUserDetails', user, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('User information updated successfully!');
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  // Change password
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const token = localStorage.getItem('token');
    const email = user.email;
    try {
      await axios.put('/admin/changePassword', {
        currentPassword,
        newPassword,
        email,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  // Handle save button click
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await saveUserInfo();
    if (currentPassword && newPassword) {
      await changePassword();
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Personal Information</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSave}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="prenom">First Name</label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="prenom"
                        id="prenom"
                        placeholder=""
                        value={user?.prenom || ''}
                        onChange={handleUserChange}
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="nom">Last Name</label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="nom"
                        id="nom"
                        placeholder=""
                        value={user?.nom || ''}
                        onChange={handleUserChange}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="username">Username</label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="username"
                        id="username"
                        placeholder=""
                        value={user?.username || ''}
                        onChange={handleUserChange}
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="telephone">Phone</label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="telephone"
                        id="telephone"
                        placeholder="+990 3343 7865"
                        value={user?.telephone || ''}
                        onChange={handleUserChange}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">Email Address</label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="devidjond45@gmail.com"
                      value={user?.email || ''}
                      onChange={handleUserChange}
                    />
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="adresse">Address</label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="adresse"
                      id="adresse"
                      placeholder="Enter your address"
                      value={user?.adresse || ''}
                      onChange={handleUserChange}
                    />
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => window.location.href = '/'}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Reset Password</h3>
              </div>
              <div className="p-7">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  changePassword();
                }}>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="currentPassword">Current Password</label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="newPassword">New Password</label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => window.location.href = '/'}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
