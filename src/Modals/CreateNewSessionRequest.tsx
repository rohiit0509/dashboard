import { Button, Flex, Form, Input } from 'antd';
const CreateNewSessionRequest = ({
  handleClose,
  handleSave,
}: {
  handleClose: () => void;
  handleSave: (values: any) => void;
}) => {
  const onFinish = (values: any) => handleSave(values);
  return (
    <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}
    layout='vertical'
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter Name' }]}
      >
        <Input placeholder="Enter Name" />
      </Form.Item>
      <Form.Item
        label="College"
        name="college"
        rules={[{ required: true, message: 'Please enter College Name' }]}
      >
        <Input placeholder="Enter College Name" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter Email' }]}
      >
        <Input placeholder="Enter Email" />
      </Form.Item>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please enter Title' }]}
      >
        <Input placeholder="Enter Title" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter Description' }]}
      >
        <Input placeholder="Enter Description" />
      </Form.Item>
      <Form.Item label="Share Schedule Link" name="scheduleLink">
        <Input placeholder="Enter Meet Link" />
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

export default CreateNewSessionRequest;
