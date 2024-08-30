import { Navigate } from 'react-router-dom';
import { Check } from '../../helper';
const PublicRoutes = (props: any) => {
  const { component } = props;
  if (Check()) return <Navigate to="/add-test" />;

  return component;
};

export default PublicRoutes;
