import { Button, DatePicker, Flex, Form, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const ScheduleWebniarModal = ({ handleClose }: { handleClose: () => void }) => {
  const onFinish = (values: any) => {
    const { date, time } = values;
    const formattedDate = dayjs(date).format('DD MMM');
    const start = dayjs.utc(time[0]).local().format('h:mma'); // Convert to local time and format
    const end = dayjs.utc(time[1]).local().format('h:mma'); // Convert UTC to local time and format
    const formattedTime = `${start}-${end}`;

    console.log('Asdfasdfds', formattedTime);
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
      <Form.Item
        label="Time Onwards"
        name="time"
        rules={[{ required: true, message: 'Please select time duration' }]}
      >
        <TimePicker.RangePicker format={'hh:mm a'} />
      </Form.Item>
      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: 'Please select Date' }]}
      >
        <DatePicker />
      </Form.Item>
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
          <Button type="primary" htmlType="submit" block>
            Confirm
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default ScheduleWebniarModal;
