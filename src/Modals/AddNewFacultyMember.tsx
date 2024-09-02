import { Button, Flex, Form, Input } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useState } from 'react';
import useNotification from '../hooks/useNotifier';

const AddNewFacultyMember = ({ handleClose }: { handleClose: () => void }) => {
  const { openNotification } = useNotification();
  const [btnLoading, setBtnLoading] = useState(false);
  const onFinish = async (values: any) => {
    try {
      setBtnLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      const user = userCredential.user;
      const userId = user.uid;

      await setDoc(doc(db, 'userDetails', userId), {
        name: values.name,
        designation: values.designation,
        contact: values.contact,
        email: values.email,
        password:values.password,
        userId:userId,
        role: 'admin',
      });
      setBtnLoading(false);
      openNotification('success', 'Faculty member created successfully!', '');
      handleClose();
    } catch (error) {
      setBtnLoading(false);
      openNotification('error', 'Failed to create faculty member.', '');
      console.error('Error creating faculty member:', error);
    }
  };

  return (
    <Form
      name="add-faculty"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter member Name' }]}
      >
        <Input placeholder="Enter Name" />
      </Form.Item>
      <Form.Item
        label="Designation"
        name="designation"
        rules={[{ required: true, message: 'Please enter member Designation' }]}
      >
        <Input placeholder="Enter Designation" />
      </Form.Item>
      <Form.Item
        label="Contact"
        name="contact"
        rules={[{ required: true, message: 'Please enter member contact' }]}
      >
        <Input placeholder="Enter Contact No." />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter member Email' }]}
      >
        <Input placeholder="Enter Email" type="email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please enter member Password' },
          {
            min: 6,
            message: 'Password must be at least 6 characters long',
          },
        ]}
      >
        <Input.Password placeholder="Enter Password for login" />
      </Form.Item>
      <Form.Item>
        <Flex justify="end" gap={10}>
          <Button type="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={btnLoading}>
            Create
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default AddNewFacultyMember;
