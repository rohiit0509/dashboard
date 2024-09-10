import {
  AreaChartOutlined,
  DashboardOutlined,
  FileAddOutlined,
  FileProtectOutlined,
  PullRequestOutlined,
  ScheduleOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import HomeIcon from '../assets/svgs/SidebarIcons/Home';
import Courses from '../assets/svgs/SidebarIcons/Courses';
import SettingsIcon from '../assets/svgs/SidebarIcons/Settings';
import Test from '../assets/svgs/SidebarIcons/Test';
import LiveSession from '../assets/svgs/SidebarIcons/LiveSession';

export const menuItems = [
  {
    key: '1',
    icon: <HomeIcon />,
    label: 'Dashboard',
    route: '/dashboard',
    activeRoute: ['/dashboard'],
    roles: ['user'],
  },
  {
    key: '2',
    icon: <FileAddOutlined />,
    label: 'Add Test',
    route: '/add-test',
    activeRoute: ['/add-test'],
    roles: ['admin', 'superAdmin'],
  },
  {
    key: '3',
    icon: <FileProtectOutlined />,
    label: 'All Tests',
    route: '/all-tests',
    activeRoute: ['/all-tests'],

    roles: ['admin', 'superAdmin'],
  },
  {
    key: '4',
    icon: <Test />,
    label: 'Test',
    route: '/tests',
    roles: ['user'],
    activeRoute: ['/tests',],
  },
  {
    key: '5',
    icon: <LiveSession />,
    label: 'Live Session',
    route: '/live-session',
    roles: ['user'],
    activeRoute: ['/live-session'],
  },

  {
    key: '6',
    icon: <AreaChartOutlined />,
    label: 'Results',
    route: '/all-results',
    activeRoute: ['/all-results', '/test-results'],
    roles: ['admin', 'superAdmin'],
  },
  {
    key: '7',
    icon: <ScheduleOutlined />,
    label: 'Schedule Webinar',
    route: '/schedule-webinar',
    activeRoute: ['/schedule-webinar'],
    roles: ['admin', 'superAdmin'],
  },
  {
    key: '8',
    icon: <PullRequestOutlined />,
    label: 'Session Requests',
    route: '/session-requests',
    activeRoute: ['/session-requests'],
    roles: ['admin', 'superAdmin'],
  },
  {
    key: '9',
    icon: <UsergroupAddOutlined />,
    label: 'Management',
    route: '/management',
    activeRoute: ['/management'],
    roles: ['superAdmin'],
  },
  {
    key: '10',
    icon: <Courses />,
    label: 'Courses',
    route: '/courses',
    activeRoute: ['/courses', '/view-course'],
    roles: ['admin', 'user', 'superAdmin'],
  },
  {
    key: '11',
    icon: <SettingsIcon />,
    label: 'Settings',
    route: '/user-settings',
    activeRoute: ['/user-settings'],
    roles: ['user'],
  },
  // {
  //   key: '8',
  //   icon: <BookOutlined />,
  //   label: 'View Courses',
  //   route: '/view-courses',
  //   roles: ['admin', 'user'],
  // },
];
