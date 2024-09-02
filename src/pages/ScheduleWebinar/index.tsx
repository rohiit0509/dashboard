import { Button, Flex, Modal, Table, Typography } from 'antd';
import { useState } from 'react';
import ScheduleWebniarModal from '../../Modals/ScheduleWebniarModal';
const { Title } = Typography;
const ScheduleWebinar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Time & Date',
      dataIndex: 'timeAndDate',
      key: 'timeAndDate',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: ' Share Schedule Link',
      dataIndex: 'sheduleLink',
      key: 'sheduleLink',
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
          <Title level={4}>Scheduled Webinar</Title>
          <Button type="primary" onClick={() => setModalOpen(true)}>
           Schedule
          </Button>
        </Flex>
        <Table columns={columns} dataSource={[]} />
      </Flex>
      <Modal
        title="Schedule Webinar"
        open={modalOpen}
        footer={null}
        centered
        destroyOnClose
        onCancel={handleClose}
      >
        <ScheduleWebniarModal handleClose={handleClose}/>
      </Modal>
    </>
  );
};

export default ScheduleWebinar;
