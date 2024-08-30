import { FormOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Modal, Switch, Table, Typography } from 'antd';
import TrashIcon from '../../assets/svgs/TrashIcon';
import { TrashIconWrapper } from '../../styles/logo';
import TickIcon from '../../assets/svgs/TickIcon';
import { FormRef } from 'rc-field-form/lib/interface';
import AddNewFacultyMember from '../../Modals/AddNewFacultyMember';
import { useState } from 'react';
const { Title } = Typography;
const { confirm } = Modal;

const FacultyManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);
  const handleSave = (values: any) => {};
  const showDeleteConfirm = () => {
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
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
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
      dataIndex: 'action',
      key: 'action',
      align: 'center' as const,
      render: (value: string) => (
        <Button type="link" danger onClick={showDeleteConfirm}>
          Delete Account
        </Button>
      ),
    },
  ];
  const dataSource = [
    {
      key: '1',
      name: 'John Doe',
      designation: 'Manager',
      email: 'john.doe@example.com',
      contact: '123-456-7890',
      password: '******',
      access: 'Edit Access',
      action: 'Delete Account',
    },
    {
      key: '2',
      name: 'Jane Smith',
      designation: 'Team Lead',
      email: 'jane.smith@example.com',
      contact: '987-654-3210',
      password: '******',
      access: 'Edit Access',
      action: 'Delete Account',
    },
    {
      key: '3',
      name: 'Alice Johnson',
      designation: 'Developer',
      email: 'alice.johnson@example.com',
      contact: '456-789-0123',
      password: '******',
      access: 'Edit Access',
      action: 'Delete Account',
    },
    {
      key: '4',
      name: 'Bob Brown',
      designation: 'Intern',
      email: 'bob.brown@example.com',
      contact: '789-012-3456',
      password: '******',
      access: 'Edit Access',
      action: 'Delete Account',
    },
  ];

  return (
    <>
      <Flex vertical gap={5}>
        <Flex justify="space-between">
          <Title level={4}>Faculty Management</Title>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Add New User
          </Button>
        </Flex>
        <Table columns={columns} dataSource={dataSource} />
      </Flex>
      <Modal
        title="Enter Member Details"
        open={modalOpen}
        footer={null}
        centered
        destroyOnClose
        onCancel={handleClose}
      >
        <AddNewFacultyMember
          handleClose={handleClose}
          handleSave={handleSave}
        />
      </Modal>
    </>
  );
};

export default FacultyManagement;
