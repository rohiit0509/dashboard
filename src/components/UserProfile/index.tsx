import { Avatar, Button, Divider, Flex, Row, Typography } from 'antd';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { useContext } from 'react';
import { AuthContext } from '../../helper/auth';
import { UserProfileWrapper } from '../../styles/signup';
import useNotification from '../../hooks/useNotifier';
const Text = Typography;

const UserProfile = ({ initials }: { initials: string | undefined }) => {
  const { currentUser } = useContext(AuthContext);
  const { openNotification } = useNotification();

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      openNotification('success', 'You are logged out.', '');
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <UserProfileWrapper>
        <Flex vertical justify="center" align="center" gap={3}>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            style={{ backgroundColor: '#704FE4' }}
          >
            {initials}
          </Avatar>
          <Text>{currentUser?.name}</Text>
          <Text>{currentUser?.email}</Text>
        </Flex>
        <Divider />
        <Row justify={'end'}>
          <Button type="primary" ghost onClick={handleLogout}>
            Sign Out
          </Button>
        </Row>
      </UserProfileWrapper>
    </>
  );
};

export default UserProfile;
