import { Button, Flex, Form, Input } from 'antd';

const AddNewFacultyMember = ({
  handleClose,
  handleSave,
}: {
  handleClose: () => void;
  handleSave: (values: any) => void;
}) => {
  const onFinish = (values: any) => handleSave(values);
  return (
    <Form
      name="login"
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
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter member Email' }]}
      >
        <Input placeholder="Enter Email" />
      </Form.Item>
      <Form.Item
        label="Contact"
        name="contact"
        rules={[{ required: true, message: 'Please enter member contact' }]}
      >
        <Input placeholder="Enter Contact No." />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please enter member Password' }]}
      >
        <Input placeholder="Enter Password for login" />
      </Form.Item>
      <Form.Item>
        <Flex justify="end" gap={10}>
          <Button type="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default AddNewFacultyMember;
