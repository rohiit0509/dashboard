import {Navigate} from 'react-router-dom'
import { Check } from '../../helper';

const  ProtectedRoutes=(props:any) =>{

  const { component } = props;
  if (!Check()) return <Navigate to="/" />;
  return component;

}

export default ProtectedRoutes;