import React, { ReactNode, useState, useEffect, useContext } from 'react';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Flex, Layout, Menu, theme, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { menuItems } from './data';
import { LogoContainer, LogoWrapper } from '../styles/logo';
import LogoImage from '../assets/svgs/LogoImage';
import { AuthContext } from '../helper/auth';

const { Header, Sider, Content } = Layout;

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const role = currentUser?.role;
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    Boolean(localStorage.getItem('sidebar')),
  );
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getDefaultSelectedKey = () => {
    const selectedItem = menuItems.find((menuItem) =>
      location.pathname.startsWith(menuItem.route),
    );
    return selectedItem ? selectedItem.key : '1';
  };

  const [defaultSelectedKey, setDefaultSelectedKey] = useState(
    getDefaultSelectedKey(),
  );

  useEffect(() => {
    setDefaultSelectedKey(getDefaultSelectedKey());
  }, [location]);

  const filteredMenuItems = menuItems.filter((item) =>item.roles.includes(role as string),
  );

  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = filteredMenuItems.find((item) => item.key === key);
    if (menuItem) {
      navigate(menuItem.route);
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
        <LogoWrapper onClick={() => navigate('/add-test')}>
          {collapsed && (
            <LogoContainer>
              <img src="/logo.png" alt="logo" />
            </LogoContainer>
          )}
          {!collapsed && <LogoImage />}
        </LogoWrapper>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[defaultSelectedKey]}
          items={filteredMenuItems}
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
              onClick={() => {
                localStorage.setItem('sidebar', String(!collapsed));
                setCollapsed(!collapsed);
              }}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Tooltip title="Sign Out">
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              />
            </Tooltip>
          </Flex>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            background: '#F1F5F9',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
