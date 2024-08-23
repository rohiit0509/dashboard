import { Button, Flex, Form, Input } from 'antd';
import React from 'react';

function CourseModal({ handleSave, handleClose }) {
  const onSave = (values) => {
    console.log('asdfads', values);
    handleSave(values);
  };

  return (
    <Form layout="vertical" onFinish={onSave}>
      <Form.Item
        label="Course Name"
        name="courseName"
        rules={[{ required: true, message: 'Please input your course name!' }]}
      >
        <Input placeholder="Enter course name" />
      </Form.Item>

      <Form.Item
        label="Sub Heading"
        name={'subHeading'}
        rules={[{ required: true, message: 'Please input your sub heading!' }]}
      >
        <Input placeholder="Enter sub heading" />
      </Form.Item>

      <Form.Item
        label="Price"
        name={'price'}
        rules={[
          {
            required: true,
            message: 'Please input your price!',
          },
        ]}
      >
        <Input type="number" placeholder="Enter price" />
      </Form.Item>
      <Form.Item>
        <Flex justify="end" gap={5}>
          <Button type="default" onClick={handleClose}>
            close
          </Button>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default CourseModal;
