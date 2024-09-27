import { Button, Flex, Modal, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ScheduleWebniarModal from '../../Modals/ScheduleWebniarModal';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import useNotification from '../../hooks/useNotifier';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
const { Title } = Typography;
const ScheduleWebinar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);
  const { openNotification } = useNotification();
  const [webinars, setWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDeleteWebinar = async(webinarId:string)=>{
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'scheduleWebinars', webinarId));
      setWebinars((prev) => prev.filter((webinar) => webinar.key !== webinarId));
      openNotification('success', 'Webinar deleted successfully', '');
    } catch (error) {
      openNotification('error', 'Failed to delete webinar', '');
    } finally {
      setLoading(false);
    }
  };
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
      title: 'Share Schedule Link',
      dataIndex: 'sheduleLink',
      key: 'sheduleLink',
      render: (value: string) => (
        <Link to={value} target="_blank">
          {value}
        </Link>
      ),
    },
    {
      title: 'Action',
      key: 'Action',
      render: (record:any) => {
        return (
          <Button type="text" onClick={()=>handleDeleteWebinar(record.key)}>
            <DeleteOutlined />
          </Button>
        );
      },
    },
  ];

  const fetchWebinars = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'scheduleWebinars'));
      const webinarData = querySnapshot.docs.map((doc) => ({
        key: doc.id,
        title: doc.data().title,
        timeAndDate: `${doc.data().startTime} - ${doc.data().endTime} | ${
          doc.data().date
        }`,
        description: doc.data().description,
        sheduleLink: doc.data().meetLink,
      }));
      setWebinars(webinarData);
    } catch (error) {
      openNotification('error', 'Failed to fetch webinars', '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);
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
        <Table columns={columns} dataSource={webinars} loading={loading} />
      </Flex>
      <Modal
        title="Schedule Webinar"
        open={modalOpen}
        footer={null}
        centered
        destroyOnClose
        onCancel={handleClose}
      >
        <ScheduleWebniarModal
          handleClose={handleClose}
          fetchWebinars={fetchWebinars}
        />
      </Modal>
    </>
  );
};

export default ScheduleWebinar;
