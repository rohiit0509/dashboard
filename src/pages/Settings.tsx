import { Avatar, Button, Flex, Form, Input } from 'antd';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { UserOutlined } from '@ant-design/icons';

const Settings = () => {
  const onFinish = () => {};
  return (
    <>
      <Breadcrumb pageName="Settings" textSize='md'/>
      <Flex
        vertical
        gap={30}
        style={{
          background: '#fff',
          width: '700px',
          padding: '25px',       
          borderRadius: '15px',
        }}
      >
        <Flex>
          <Avatar
            size={{ xs: 32, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#87d068' }}
          />
        </Flex>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between">
              <Button type="primary">Save Changes</Button>
              <Button type="primary" danger>
                Delete Account
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
};

export default Settings;
