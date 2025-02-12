import React, { useContext, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../helper/auth';
import {
  FormContainer,
  FormWrapper,
  ImageContainer,
  MainContainer,
} from '../../styles/signup';
import { Button, Divider, Flex, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import GoogleIcon from '../../assets/svgs/GoogleIcon';
import TwitterIcon from '../../assets/svgs/TwitterIcon';
import useNotification from '../../hooks/useNotifier';
const { Title, Text } = Typography;
const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminLogin = location.pathname === '/admin-login';
  const auth = getAuth(app);
  const { currentUser } = useContext(AuthContext);
  const { openNotification } = useNotification();

  const onFinish = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;
      if (user) {
        openNotification('success', 'You are logged in successfully', '');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as Error;
      openNotification('error', `${err.message}`, '');
      console.error('Error signing in:', error);
    }
  };

  if (currentUser) {
    if (currentUser.role == 'admin') {
      return <Navigate to="/add-test" />;
    }
    return <Navigate to="/dashboard" />;
  }
  return (
    <MainContainer justifyContent="center">
      <FormWrapper>
        <FormContainer style={{ paddingLeft: '50px' }}>
          <Flex vertical style={{ marginBottom: '18px' }}>
            <Title level={3}>{!adminLogin ? 'Log in' : 'Faculty Log in'}</Title>
          </Flex>
          {!adminLogin && (
            <>
              <Flex vertical gap={12}>
                <Button type="default" icon={<GoogleIcon />}>
                  Continue with Google
                </Button>
                <Button type="default" icon={<TwitterIcon />}>
                  Continue with Twitter
                </Button>
              </Flex>
              <Divider>
                <Text type="secondary">OR</Text>
              </Divider>
            </>
          )}
          <Form
            name="login"
            layout="vertical"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="User name or email address"
              name="email"
              rules={[{ required: true, message: 'Please enter your Email' }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                type="email"
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: '2px' }}
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your Password' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="end">
                <Button type="link">Forgot password?</Button>
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit" loading={loading}>
                Log in
              </Button>
            </Form.Item>
            {!adminLogin && (
              <Form.Item>
                <Flex vertical gap={5} align="center">
                  <div>
                    Sign in as a{' '}
                    <Button
                      type="link"
                      onClick={() => navigate('/admin-login')}
                    >
                      Admin
                    </Button>
                  </div>
                  <div>
                    Don't have an account?
                    <Button type="link" onClick={() => navigate('/register')}>
                      Sign up
                    </Button>
                  </div>
                </Flex>
              </Form.Item>
            )}
          </Form>
        </FormContainer>
        <ImageContainer>
          <img
            src={adminLogin ? 'teacher-image.png' : 'student-image.png'}
            alt="student-login-image"
          />
        </ImageContainer>
      </FormWrapper>
    </MainContainer>
  );
};

export default SignIn;
