// import React, { useState, ReactNode } from 'react';
// import Header from '../components/Header/index';
// import Sidebar from '../components/Sidebar/index';

// const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="dark:bg-boxdark-2 dark:text-bodydark">
//       {/* <!-- ===== Page Wrapper Start ===== --> */}
//       <div className="flex h-screen overflow-hidden">
//         {/* <!-- ===== Sidebar Start ===== --> */}
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         {/* <!-- ===== Sidebar End ===== --> */}

//         {/* <!-- ===== Content Area Start ===== --> */}
//         <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//           {/* <!-- ===== Header Start ===== --> */}
//           <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           {/* <!-- ===== Header End ===== --> */}

//           {/* <!-- ===== Main Content Start ===== --> */}
//           <main>
//             <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
//               {children}
//             </div>
//           </main>
//           {/* <!-- ===== Main Content End ===== --> */}
//         </div>
//         {/* <!-- ===== Content Area End ===== --> */}
//       </div>
//       {/* <!-- ===== Page Wrapper End ===== --> */}
//     </div>
//   );
// };

// export default DefaultLayout;

import React, { ReactNode, useState } from 'react';
import {
  AreaChartOutlined,
  BookOutlined,
  DashboardOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Flex, Layout, Menu, theme, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { app } from '../firebase';


const { Header, Sider, Content } = Layout;

const DefaultLayout:React.FC<{ children: ReactNode }>= ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
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

  const handleMenuClick = (item: { key: string }) => {
    const selectedItem = items.find((menuItem) => menuItem.key === item.key);
    if (selectedItem && selectedItem.route) {
      navigate(selectedItem.route);
    }
  };
  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
       await signOut(auth);
       console.log('User signed out successfully');
    } catch (error) {
       console.error('Error signing out:', error);
    }
   };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Flex
            justify="space-between"
            align="center"
            style={{ paddingRight: '20px' }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
           <Tooltip title="log out">
           <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} />
           </Tooltip>
          </Flex>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
