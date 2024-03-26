import React, { useEffect, useState, ReactNode } from "react";
import { app } from '../firebase';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Loader from "../common/Loader";

export const AuthContext = React.createContext({
 currentUser: null as User | null,
});

interface AuthProviderProps {
 children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
 const [currentUser, setCurrentUser] = useState<User | null>(null);
 const [pending, setPending] = useState(true);
 const auth = getAuth(app);

 useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    });
 }, []);

 if (pending) {
    return <Loader />;
 }

 return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
 );
};
