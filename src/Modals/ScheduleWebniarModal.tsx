import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../helper/auth';
import { useContext, useState } from 'react';
dayjs.extend(utc);

const ScheduleWebniarModal = ({ handleClose,fetchWebinars }: { handleClose: () => void, fetchWebinars:()=>void }) => {
  const { currentUser } = useContext(AuthContext);
  const [btnLoading, setBtnLoading] = useState(false);

  interface IFormProps {
    title: string;
    meetLink: string;
    time: string;
    date: string;
    description: string;
    authorId: string;
  }
  const onFinish = async (values: IFormProps) => {
    setBtnLoading(true);
    const { title, meetLink, time, date, description } = values;
    const [startTime, endTime] = time;

    const formattedDate = dayjs(date).format('DD MMM');

    const start = dayjs.utc(startTime).local().format('h:mmA');
    const end = dayjs.utc(endTime).local().format('h:mmA');

    const webinarData = {
      title: title,
      meetLink: meetLink,
      startTime: start,
      endTime: end,
      date: formattedDate,
      description: description,
      authorId: currentUser?.userId,
    };
    try {
      await addDoc(collection(db, 'scheduleWebinars'), webinarData);
      fetchWebinars()
    } catch (error) {
      console.error('Error scheduling webinar:', error);
    } finally {
      setBtnLoading(false);
      handleClose();
    }
  };
  return (
    <Form
      name="schedule-webinar"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please enter Title' }]}
      >
        <Input placeholder="What is your title?" />
      </Form.Item>
      <Form.Item
        label="Meet Link"
        name="meetLink"
        rules={[{ required: true, message: 'Please enter Meet Link' }]}
      >
        <Input placeholder="www.example.com" />
      </Form.Item>
      <Row gutter={10}>
        <Col>
          <Form.Item
            label="Time Onwards"
            name="time"
            rules={[{ required: true, message: 'Please select time duration' }]}
          >
            <TimePicker.RangePicker format={'hh:mm A'} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select Date' }]}
          >
            <DatePicker format={'DD-MM-YYYY'} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter Description' }]}
      >
        <Input.TextArea
          rows={4}
          placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
        />
      </Form.Item>
      <Form.Item>
        <Flex gap={10}>
          <Button type="default" onClick={handleClose} block>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" block loading={btnLoading}>
            Confirm
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default ScheduleWebniarModal;
