import {Navigate} from 'react-router-dom'
import { Check } from '../../helper';
const  PublicRoutes=(props:any)=>{

  const {component} = props;

console.log(Check());

    if (Check()) return <Navigate to='/dashboard'/>;
 
  return component;

}

export default PublicRoutes;