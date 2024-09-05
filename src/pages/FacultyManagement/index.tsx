import { FormOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Modal, Switch, Table, Typography } from 'antd';
import TrashIcon from '../../assets/svgs/TrashIcon';
import { TrashIconWrapper } from '../../styles/logo';
import TickIcon from '../../assets/svgs/TickIcon';
import { FormRef } from 'rc-field-form/lib/interface';
import AddNewFacultyMember from '../../Modals/AddNewFacultyMember';
import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import useNotification from '../../hooks/useNotifier';
import { deleteUser } from 'firebase/auth';
const { Title } = Typography;
const { confirm } = Modal;

const FacultyManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);
  const { openNotification } = useNotification();
  const [admins, setAdmins] = useState<any>([]);
const [tableDataLoader,setTableDataLoader] = useState(false)

  const fetchAdmins = async () => {
    try {
      setTableDataLoader(true)
      const q = query(
        collection(db, 'userDetails'),
        where('role', '==', 'admin'),
      );
      const querySnapshot = await getDocs(q);
      const adminData = querySnapshot.docs.map((doc) => doc.data());
      setAdmins(adminData);
      setTableDataLoader(false)
    } catch (error) {
      setTableDataLoader(false)
      console.error('Error fetching admin users:', error);
      openNotification('error', 'Failed to fetch admin users.', '');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [modalOpen]);

  const handleDeleteAccount = async (userId: string) => {
    try {
      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteUser(user);
      }

      const userDocRef = doc(db, 'userDetails', userId);
      await deleteDoc(userDocRef);
      openNotification('success', 'User deleted successfully.', '');
      await fetchAdmins();
    } catch (error) {
      console.error('Error deleting user:', error);
      openNotification('error', 'Failed to delete user.', '');
    }
  };

  const showDeleteConfirm = (userId: string) => {
    confirm({
      title: 'You want to delete this account',
      icon: (
        <>
          <TrashIconWrapper>
            <TrashIcon />
          </TrashIconWrapper>
        </>
      ),
      closable: true,
      width: 480,
      content:
        'Are you sure you want to delete this Delete? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      okButtonProps: { type: 'primary' },
      cancelText: 'Cancel',
      onOk() {
        handleDeleteAccount(userId);
      },
    });
  };
  const showEditAccess = () => {
    let formInstance: FormRef<any> | null = null;
    Modal.confirm({
      title: 'Manage User Access',
      icon: (
        <TrashIconWrapper>
          <TickIcon />
        </TrashIconWrapper>
      ),
      closable: true,
      width: 480,
      content: (
        <Flex vertical gap={20}>
          <div>
            Control Your Faculties Access. Only Admin will be able to edit this
            changes.
          </div>
          <Form
            layout="horizontal"
            ref={(form) => {
              formInstance = form;
            }}
          >
            <Form.Item
              label={
                <Flex vertical align="flex-start">
                  <div>Disable Account</div>
                  <div>temporary suspend the account</div>
                </Flex>
              }
              name="dashboardAccess"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={
                <Flex vertical align="flex-start">
                  <div>Student Result Publish</div>
                  <div>yourcompany.medium.com</div>
                </Flex>
              }
              name="reportsAccess"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={
                <Flex vertical align="flex-start">
                  <div>Creation Access</div>
                  <div>@yourcompany</div>
                </Flex>
              }
              name="settingsAccess"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Flex>
      ),
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        formInstance &&
          formInstance
            .validateFields()
            .then((values) => {
              console.log('Form Values:', values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Access',
      dataIndex: 'access',
      key: 'access',
      align: 'center' as const,
      render: (value: string) => (
        <Button type="link" icon={<FormOutlined />} onClick={showEditAccess}>
          Edit Access
        </Button>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'userId',
      key: 'action',
      align: 'center' as const,
      render: (value: string) => (
        <Button type="link" danger onClick={() => showDeleteConfirm(value)}>
          Delete Account
        </Button>
      ),
    },
  ];

  return (
    <>
      <Flex
        vertical
        gap={5}
        style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}
      >
        <Flex justify="space-between">
          <Title level={4}>Faculty Management</Title>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Add New User
          </Button>
        </Flex>
        <Table columns={columns} dataSource={admins} loading={tableDataLoader}/>
      </Flex>
      <Modal
        title="Enter Member Details"
        open={modalOpen}
        footer={null}
        centered
        destroyOnClose
        onCancel={handleClose}
      >
        <AddNewFacultyMember handleClose={handleClose} />
      </Modal>
    </>
  );
};

export default FacultyManagement;
