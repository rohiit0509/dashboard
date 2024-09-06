import React, { useEffect, useState, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Loader from '../common/Loader';

export const AuthContext = React.createContext<{
  currentUser: UserDetails | null;
}>({
  currentUser: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;

        try {
          const userDoc = await getDoc(doc(db, 'userDetails', userId));

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserDetails;

            // Only update currentUser if the logged-in user is the same as the existing currentUser
            if (!currentUser || currentUser.userId === userId) {
              setCurrentUser({
                ...userData,
              });
            }
          } else {
            console.error('No such user document!');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        setCurrentUser(null);
      }

      setPending(false);
    });

    return () => unsubscribe();
  }, [currentUser]);
  if (pending) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
