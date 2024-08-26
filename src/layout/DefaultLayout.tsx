import React, { ReactNode, useState, useEffect } from 'react';
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

const { Header, Sider, Content } = Layout;

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
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

  const handleMenuClick = (item: { key: string }) => {
    const selectedItem = menuItems.find(
      (menuItem) => menuItem.key === item.key,
    );
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
        <LogoWrapper>
          {collapsed && (
            <LogoContainer>
              <img src="/src/assets/imgs/logo.png" alt="logo" />
            </LogoContainer>
          )}
          {!collapsed && <LogoImage />}
        </LogoWrapper>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[defaultSelectedKey]}
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
