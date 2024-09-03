import { Flex, Spin } from 'antd';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import InfoCard from '../../components/InfoCard';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import useNotification from '../../hooks/useNotifier';

const LiveSession = () => {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [laoding, setLoading] = useState(false);
  const { openNotification } = useNotification();

  const fetchUserEmail = async (authorId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'userDetails', authorId));
      return userDoc.exists() ? userDoc.data().email : '';
    } catch (error) {
      openNotification('error', 'Failed to fetch user email', '');
      return '';
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
        })
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
  }, []);
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
    </Spin>
  );
};

export default LiveSession;
