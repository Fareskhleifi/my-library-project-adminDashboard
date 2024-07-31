import axios from 'axios';
import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    username: '',
    email: '',
    password: '',
    adresse: '',
    telephone: '',
    
  });

  const [message, setMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setConfirmPassword(e.target.value);
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/admin/signup', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);
      console.log(response.data)
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  const handleReturn = () => {
    window.location.href = "/";
  };

  return (
    <>
      <section className="bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-center min-h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/5"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')",
            }}
          />
          
          <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div className="w-full">
              <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                Get your free account now.
              </h1>
              
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Let’s get you all set up so you can verify your personal account and begin setting up your profile.
              </p>
              
              <div className="mt-6">
                <h1 className="text-gray-500 dark:text-gray-300">Type of account</h1>
                
                <div className="mt-3 md:flex md:items-center md:-mx-2">
                  
                  <button className="flex justify-center w-full px-6 py-3 mt-4 text-blue-500 border border-blue-500 rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-blue-400 dark:text-blue-400 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="mx-2">worker</span>
                  </button>
                </div>
              </div>
              
              <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">First Name</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="John" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Last name</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Snow" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="John_snow" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Adresse</label>
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Tunisie" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Phone number</label>
                  <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="XXX-XX-XXXX-XXX" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="johnsnow@example.com" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Confirm password</label>
                  <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPassword} placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <button type="button" onClick={handleReturn} className="text-white bg-black-2 hover:bg-black focus:ring-4 focus:ring-offset-black-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-bodydark2 dark:hover:bg-bodydark1 focus:outline-none dark:focus:ring-black-2">Cancel</button>
                <button type="submit" className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:ring-offset-secondary font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary focus:outline-none dark:focus:ring-primary">Sign up</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
