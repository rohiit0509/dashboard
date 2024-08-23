import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';


import DefaultLayout from './layout/DefaultLayout';
import { AuthProvider } from './helper/auth';
import routespath from './routes';
import ProtectedRoutes from './routes/private';
import PublicRoutes from './routes/public';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <AuthProvider>

        <Routes>

          {
            routespath.map((data, index) => {
              const { path, component, restricted } = data;
              return (
                <Route key={index} path={path} element={restricted ? (<DefaultLayout><ProtectedRoutes component={component} /></DefaultLayout>) : (<PublicRoutes component={component} />)} />
              )
            })
          }

        </Routes>


    </AuthProvider>
  );
}

export default App;
