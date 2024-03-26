// import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import { app, db } from '../firebase';
// import { User } from 'firebase/auth';

// export const FirebaseContext = createContext({
//  user: null,
//  setUser: (user: User | null) => {},
// });

// export const FirebaseProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
//  const [user, setUser] = useState<User | null>(null);

//  useEffect(() => {
//     const unsubscribe = app.auth().onAuthStateChanged((user) => {
//       setUser(user);
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//  }, []);

//  return (
//     <FirebaseContext.Provider value={{ user, setUser }}>
//       {children}
//     </FirebaseContext.Provider>
//  );
// };
