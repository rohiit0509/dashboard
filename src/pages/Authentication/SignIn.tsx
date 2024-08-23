import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { app, db } from '../../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../helper/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { currentUser } = useContext(AuthContext);
  interface UserData {
    email?: string;
    role?: string;
  }
  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(email, password);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
    
      const userDoc = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDoc);
  console.log("asdfasdf",userCredential, user, userDoc, userDocSnapshot)
      if (!userDocSnapshot.exists()) {
        const userData: UserData = {
          email: user?.email as string,
          role: "user",
        };
        await setDoc(userDoc, userData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-wrap items-center justify-center h-screen">
    <div className="w-full border-2 border-gray-300 dark:border-strokedark xl:w-1/2 xl:border-l-2 rounded-lg">
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Sign In 
        </h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg py-4 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default SignIn;
