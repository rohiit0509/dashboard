import {
  AreaChartOutlined,
  BookOutlined,
  DashboardOutlined,
  FileProtectOutlined,
  PullRequestOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

export const menuItems = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: 'Add Test',
    route: '/dashboard',
    roles: ['admin', 'user'],
  },
  {
    key: '2',
    icon: <FileProtectOutlined />,
    label: 'All Tests',
    route: '/all-tests',
    roles: ['admin', 'user'], 

  },
  {
    key: '3',
    icon: <AreaChartOutlined />,
    label: 'Results',
    route: '/all-results',
    roles: ['admin', 'user'], 

  },
  {
    key: '4',
    icon: <ScheduleOutlined />,
    label: 'Schedule Webinar',
    route: '/schedule-webinar',
    roles: ['admin'], 

  },
  {
    key: '5',
    icon: <PullRequestOutlined />,
    label: 'Session Requests',
    route: '/session-requests',
    roles: ['admin'], 

  },
  {
    key: '6',
    icon: <UsergroupAddOutlined />,
    label: 'Management',
    route: '/management',
    roles: ['admin'], 
  },
  {
    key: '7',
    icon: <ShoppingCartOutlined />,
    label: 'Courses',
    route: '/courses',
    roles: ['admin', 'user'], 
  },
  // {
  //   key: '8',
  //   icon: <BookOutlined />,
  //   label: 'View Courses',
  //   route: '/view-courses',
  //   roles: ['admin', 'user'], 
  // },
];
