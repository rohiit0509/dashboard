import { Flex, Modal, Spin, Typography } from 'antd';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import InfoCard from '../../components/InfoCard';
import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';
import useNotification from '../../hooks/useNotifier';
import PurchaseModal from '../../Modals/PurchaseModal';
const { Title } = Typography;
const LiveSession = () => {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [laoding, setLoading] = useState(false);
  const { openNotification } = useNotification();
  const [admins, setAdmins] = useState<any[]>([]);
  const [showModal, setShowModal] = useState('');

  const handleClose = () => setShowModal('');
  const fetchUserEmail = async (authorId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'userDetails', authorId));
      return userDoc.exists() ? userDoc.data().email : '';
    } catch (error) {
      openNotification('error', 'Failed to fetch user email', '');
      return '';
    }
  };
  const fetchAdmins = async () => {
    try {
      const adminsQuery = query(
        collection(db, 'userDetails'),
        where('role', '==', 'admin'),
      );
      const querySnapshot = await getDocs(adminsQuery);
      const adminData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminData);
    } catch (error) {
      openNotification('error', 'Failed to fetch admin users', '');
    }
  };
  const fetchWebinars = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'scheduleWebinars'));
      const webinarData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const webinar = { id: doc.id, ...doc.data() };
          const userEmail = await fetchUserEmail(doc.data().authorId as string);
          return { ...webinar, email: userEmail };
        }),
      );
      setWebinars(webinarData);
    } catch (error) {
      openNotification('error', 'Failed to fetch webinars', '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
    fetchAdmins();
  }, []);

  const handleBookCourse = () => setShowModal('purchaseModal');
  return (
    <Spin spinning={laoding}>
      <Breadcrumb pageName="Live Session" textSize="md" />
      <Flex gap={20} wrap>
        {webinars?.map((webinar) => (
          <InfoCard
            key={webinar.id}
            name={webinar.title}
            email={webinar.email}
            buttonAction={webinar.meetLink}
            description={webinar.description}
            buttonLabel={`Scheduled On: ${webinar.date} | ${webinar.startTime}`}
            tagName="Faculty"
          />
        ))}
      </Flex>
      <div className="mt-8">
        <h2 className="text-[18px] font-semibold pb-5">
          Request for 1:1 Live Counselling ( Paid )
        </h2>
        <Flex gap={20} wrap>
          {admins?.map((item) => (
            <InfoCard
              key={item.userId}
              name={item.name}
              email={item.designation}
              buttonLabel={'Book Now'}
              tagName=""
              extra={
                <Flex vertical gap={5}>
                  <div>5+ Years of Experience in Teaching</div>
                  <Title level={5}>₹299/-</Title>
                </Flex>
              }
              hover={true}
              avatarSize={90}
              onClick={handleBookCourse}
            />
          ))}
        </Flex>
      </div>
      <Modal
        width={400}
        closable={false}
        open={showModal == 'purchaseModal'}
        destroyOnClose
        footer={null}
        maskClosable={false}
        onCancel={handleClose}
      >
        <PurchaseModal handleClose={handleClose}/>
      </Modal>
    </Spin>
  );
};

export default LiveSession;
