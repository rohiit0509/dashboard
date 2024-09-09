import React, { ReactNode, useState, useEffect, useContext } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Flex, Layout, Menu, Popover, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuItems } from './data';
import { LogoContainer, LogoWrapper } from '../styles/logo';
import LogoImage from '../assets/svgs/LogoImage';
import { AuthContext } from '../helper/auth';
import UserProfile from '../components/UserProfile';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';

const { Header, Sider, Content } = Layout;

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const role = currentUser?.role;
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebar') == 'true',
  );
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getDefaultSelectedKey = () => {
    const selectedItem = menuItems.find((menuItem) =>
      menuItem.activeRoute.some((activePath) =>
        location.pathname.startsWith(activePath),
      ),
    );
    return selectedItem ? selectedItem.key : '1';
  };

  const [defaultSelectedKey, setDefaultSelectedKey] = useState(
    getDefaultSelectedKey(),
  );

  useEffect(() => {
    setDefaultSelectedKey(getDefaultSelectedKey());
  }, [location]);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(role as string),
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
  const initials = currentUser?.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <LogoWrapper
          onClick={() => {
            role == 'user' ? navigate('/dashboard') : navigate('/add-test');
          }}
        >
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
        {/* <SidebarFooter collapsed={collapsed}>
          <Flex>
            <Button icon={<QuestionOutlined />} type='default' ghost/>
          </Flex>
        </SidebarFooter> */}
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
            <Popover
              content={<UserProfile initials={initials} />}
              trigger="click"
              placement="bottomRight"
            >
              <Avatar style={{ backgroundColor: '#704FE4' }}>{initials}</Avatar>
            </Popover>
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
