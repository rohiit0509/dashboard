import React, { ReactNode, useState, useEffect, useContext } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Flex,
  Layout,
  Menu,
  Popover,
  theme,
  Typography,
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuItems } from './data';
import {
  Bottom,
  LogoContainer,
  LogoWrapper,
  SidebarFooter,
  Top,
} from '../styles/logo';
import LogoImage from '../assets/svgs/LogoImage';
import { AuthContext } from '../helper/auth';
import UserProfile from '../components/UserProfile';
import QuestionMark from '../assets/svgs/QuestionMark';
const { Title, Text } = Typography;
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
    const selectedItems = menuItems.filter((menuItem) =>
      menuItem.activeRoute.some((activePath) =>
        location.pathname.startsWith(activePath),
      ),
    );
    return selectedItems.length > 0 ? selectedItems[0].key : '1';
  };

  const [defaultSelectedKey, setDefaultSelectedKey] = useState(
    getDefaultSelectedKey(),
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const checkFullscreen = () => {
    const fullscreenElement = document.fullscreenElement;
    setIsFullscreen(!!fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
    };
  }, []);

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

  const initials = currentUser?.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isFullscreen && (
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
          <SidebarFooter collapsed={collapsed}>
            <Flex vertical justify="space-between" style={{ height: '100%' }}>
              <Top>
                <div className="bg-white rounded-lg w-7 flex justify-center">
                  <QuestionMark />
                </div>
              </Top>
              <Bottom>
                <div>
                  <Title style={{ color: '#fff', margin: 0 }} level={5}>
                    Need help?
                  </Title>
                  <Text style={{ color: '#fff' }}>Please check our docs</Text>
                </div>
                <button className="w-full bg-white text-black rounded-lg text-[11px] font-bold">
                  DOCUMENTATION
                </button>
              </Bottom>
            </Flex>
          </SidebarFooter>
        </Sider>
      )}
      <Layout>
        {!isFullscreen && (
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
                <Avatar
                  style={{ backgroundColor: '#704FE4', cursor: 'pointer' }}
                >
                  {initials}
                </Avatar>
              </Popover>
            </Flex>
          </Header>
        )}
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
