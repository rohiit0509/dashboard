import {
    AreaChartOutlined,
    BookOutlined,
    DashboardOutlined,
    FileProtectOutlined,
    ShoppingCartOutlined,
  } from '@ant-design/icons';
  
export const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Add Test',
      route: '/dashboard',
    },
    {
      key: '2',
      icon: <FileProtectOutlined />,
      label: 'All Tests',
      route: '/all-tests',
    },
    {
      key: '3',
      icon: <AreaChartOutlined />,
      label: 'Results',
      route: '/all-results',
    },
    {
      key: '4',
      icon: <ShoppingCartOutlined />,
      label: 'Courses',
      route: '/courses',
    },
    {
      key: '5',
      icon:<BookOutlined />,
      label: 'View Courses',
      route: '/view-courses',
    },
  ];