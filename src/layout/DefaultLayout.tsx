import React, { ReactNode, useState } from 'react';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Flex, Layout, Menu, theme, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { app } from '../firebase';
import { menuItems } from './data';


const { Header, Sider, Content } = Layout;

const DefaultLayout:React.FC<{ children: ReactNode }>= ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();



  const handleMenuClick = (item: { key: string }) => {
    const selectedItem = menuItems.find((menuItem) => menuItem.key === item.key);
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
        <div className="pt-20" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
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
