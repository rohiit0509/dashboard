import { Navigate } from 'react-router-dom';
import { Check } from '../../helper';
import { AuthContext } from '../../helper/auth';
import { useContext } from 'react';
const PublicRoutes = (props: any) => {
  const { component } = props;
  const { currentUser } = useContext(AuthContext);

  if (Check()) {
    if (currentUser?.role == 'admin' || currentUser?.role == 'superAdmin') {
      return <Navigate to="/add-test" />;
    }
    return <Navigate to="/dashboard" />;
  }

  return component;
};

export default PublicRoutes;
