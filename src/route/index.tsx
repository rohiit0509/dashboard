import AddProperty from "../pages/AddProperty/AddProperty";
import SignIn from "../pages/Authentication/SignIn";
import Calendar from "../pages/Calendar";
import FormElements from "../pages/Form/FormElements";
import FormLayout from "../pages/Form/FormLayout";
import QuerryTable from "../pages/Form/QuerryTable";
import MyTable from "../pages/Form/tableDetails";
import Settings from "../pages/Settings";
import Tables from "../pages/Tables";
import Buttons from "../pages/UiElements/Buttons";

const routespath=[
    {
        path:"/",
        component:<SignIn/>,
        restricted:false

    },
    {
        path:"/dashboard",
        component:<AddProperty/>,
        restricted:true

    },

    {
        path:"/propertys",
        component:<MyTable/>,
        restricted:true

    },
    {
        path:"/querys",
        component:<QuerryTable/>,
        restricted:true

    },
    // {
    //     path:"*",
    //     component:<Error/>,
    //     restricted:false

    // },
    {
        path:"/settings",
        component:<Buttons/>,
        restricted:true

    },
    // {
    //     path:"blog/:id",
    //     component:<Blogs/>,
    //     restricted:true

    // },

]
export default routespath;