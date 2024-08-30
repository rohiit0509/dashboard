import AddProperty from '../pages/AddProperty/AddProperty';
import AddTest from '../pages/AddTests/AddTest';
import ListTests from '../pages/ListTests/ListTests';
import TakeTest from '../pages/TakeTest/TakeTest';
import TestResults from '../pages/TestResults/TestResults';
import AllResults from '../pages/TestResults/AllResults';
import AllCourses from '../pages/Courses/AllCourses';
import CourseDetails from '../pages/Courses/CourseDetails';
import CourseView from '../pages/Courses/CourseView';
import ViewAllCourses from '../pages/Courses/ViewAllCourses';
import SignIn from '../pages/Authentication/SignIn';
import Calendar from '../pages/Calendar';
import FormElements from '../pages/Form/FormElements';
import FormLayout from '../pages/Form/FormLayout';
import QuerryTable from '../pages/Form/QuerryTable';
import MyTable from '../pages/Form/tableDetails';
import Settings from '../pages/Settings';
import Tables from '../pages/Tables';
import Buttons from '../pages/UiElements/Buttons';
import NotFoundPage from '../components/NotFoundPage';
import SignUp from '../pages/Authentication/SignUp';
import SessionRequest from '../pages/SessionRequest';
import FacultyManagement from '../pages/FacultyManagement';

const routespath = [
  {
    path: '/',
    component: <SignIn />,
    restricted: false,
  },
  {
    path: '/admin-login',
    component: <SignIn />,
    restricted: false,
  },
  {
    path: '/register',
    component: <SignUp />,
    restricted: false,
  },
  {
    path: '/add-test',
    component: <AddTest />,
    restricted: true,
  },
  {
    path: '/test-results/:testId',
    component: <TestResults />,
    restricted: true,
  },
  {
    path: '/session-requests',
    component: <SessionRequest />,
    restricted: true,
  },
  ,
  {
    path: '/management',
    component: <FacultyManagement />,
    restricted: true,
  },
  {
    path: '/courses',
    component: <AllCourses />,
    restricted: true,
  },

  {
    path: '/courses/:courseId',
    component: <CourseDetails />,
    restricted: true,
  },

  // {
  //     path:"/view-courses",
  //     component:<ViewAllCourses/>,
  //     restricted:true
  // },
  {
    path: '/view-courses/:courseId',
    component: <CourseView />,
    restricted: true,
  },

  {
    path: '/all-results',
    component: <AllResults />,
    restricted: true,
  },

  {
    path: '/all-tests',
    component: <ListTests />,
    restricted: true,
  },

  {
    path: '/take-test/:testId',
    component: <TakeTest />,
    restricted: true,
  },

  {
    path: '/propertys',
    component: <MyTable />,
    restricted: true,
  },
  {
    path: '/querys',
    component: <QuerryTable />,
    restricted: true,
  },
  {
    path: '/settings',
    component: <Buttons />,
    restricted: true,
  },
  {
    path: '*',
    component: <NotFoundPage />,
    restricted: true,
  },
  // {
  //     path:"blog/:id",
  //     component:<Blogs/>,
  //     restricted:true

  // },
];
export default routespath;
