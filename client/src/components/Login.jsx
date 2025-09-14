import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {setShowLogin, axios, setToken, navigate, fetchUser} = useAppContext();

  const onSubmitHandler = async(e) => {
    try {
      e.preventDefault();
    
    const {data} = await axios.post(`/api/user/${state}`, {name, email, password});

    if(data.success) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      // await fetchUser();
      setShowLogin(false);
      navigate('/');
    }else {
      toast.error(data.message);
    }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      
      className='fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center text-sm text-gray-600 bg-black/50'
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className='flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white'
      >
        <p className='text-2xl font-medium m-auto'>
          <span className='text-primary'>User</span> {state === 'login' ? 'Login' : 'Sign Up'}
        </p>

        {state === 'register' && (
          <div className='w-full'>
            <label className='block mb-1'>Name</label>
            <input
              type='text'
              required
              placeholder='Type your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary transition-all focus:ring-2 focus:ring-primary'
              autoComplete='name'
            />
          </div>
        )}

        <div className='w-full'>
          <label className='block mb-1'>Email</label>
          <input
            type='email'
            required
            placeholder='Type your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary transition-all focus:ring-2 focus:ring-primary'
            autoComplete='email'
          />
        </div>

        <div className='w-full'>
          <label className='block mb-1'>Password</label>
          <input
            type='password'
            required
            placeholder='Type your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary transition-all focus:ring-2 focus:ring-primary'
            autoComplete={state === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        <p className='text-sm'>
          {state === 'register' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState('login')}
                className='text-primary cursor-pointer underline'
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Create an account?{' '}
              <span
                onClick={() => setState('register')}
                className='text-primary cursor-pointer underline'
              >
                Click here
              </span>
            </>
          )}
        </p>

        <button
          type='submit'
          className='bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer'
        >
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
