import { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Flex, Form, Input, message, Modal } from 'antd';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { UserOutlined } from '@ant-design/icons';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';
import { AuthContext } from '../helper/auth';
import Loader from '../common/Loader';
import { TrashIconWrapper } from '../styles/logo';
import TrashIcon from '../assets/svgs/TrashIcon';
const { confirm } = Modal;

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'userDetails', currentUser.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            form.setFieldsValue({
              name: userData.name,
              email: userData.email,
              bio: userData.bio,
            });
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [currentUser, db, form]);

  const onFinish = async (values: any) => {
    if (currentUser) {
      setBtnLoading(true);
      try {
        const userRef = doc(db, 'userDetails', currentUser.userId);
        await updateDoc(userRef, {
          name: values.name,
          bio: values.bio,
        });
        message.success('User details updated successfully!');
        setBtnLoading(false);
      } catch (error) {
        setBtnLoading(false);
        console.error('Error updating user details:', error);
        message.error('Failed to update user details.');
      }
    }
  };
  const showConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete your account?',
      icon: (
        <>
          <TrashIconWrapper>
            <TrashIcon />
          </TrashIconWrapper>
        </>
      ),
      closable: true,
      content: 'This action cannot be reversed',
      okText: 'Yes',
      okType: 'danger',
      okButtonProps: { type: 'primary' },
      onOk() {
        handleDeleteAccount();
      },
    });
  };

  const handleDeleteAccount = async () => {
    if (currentUser) {
      setDeleteBtnLoading(true);
      try {
        const userRef = doc(db, 'userDetails', currentUser.userId);
        await deleteDoc(userRef);
        await deleteUser(auth.currentUser!);
        setDeleteBtnLoading(false);
        message.success('Account deleted successfully!');
      } catch (error) {
        setDeleteBtnLoading(false);
        console.error('Error deleting account:', error);
        message.error('Failed to delete account.');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Settings" textSize="md" />
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
          form={form}
          name="settings"
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
              <Button type="primary" htmlType="submit" loading={btnLoading}>
                Save Changes
              </Button>
              <Button
                type="primary"
                danger
                onClick={showConfirm}
                loading={deleteBtnLoading}
              >
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
