import { Button, Flex, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

function CourseModal({ handleSave, handleClose }) {
  const onSave = (values) => handleSave(values);

  return (
    <Form layout="vertical" onFinish={onSave}>
      <Form.Item
        label="Course Name"
        name="courseName"
        rules={[
          {
            required: true,
            message: 'Please enter course name',
            whitespace: true,
          },
        ]}
      >
        <Input placeholder="Enter course name" />
      </Form.Item>

      <Form.Item
        label="Price"
        name={'price'}
        rules={[
          {
            required: true,
            message: 'Please enter price',
            whitespace: true,
          },
        ]}
      >
        <Input type="number" placeholder="Enter price" />
      </Form.Item>
      <Form.Item
        label="Description"
        name={'subHeading'}
        rules={[
          {
            required: true,
            message: 'Please enter description',
            whitespace: true,
          },
        ]}
      >
        <TextArea placeholder="Enter Description" rows={4} />
      </Form.Item>
      <Form.Item>
        <Flex justify="end" gap={5}>
          <Button type="default" onClick={handleClose}>
            Close
          </Button>
          <Button type="default" htmlType="submit">
            Save Changes
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default CourseModal;
