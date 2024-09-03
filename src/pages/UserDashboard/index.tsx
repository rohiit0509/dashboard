import { Button, Card, Flex, Row, Spin, Typography } from 'antd';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import InfoCard from '../../components/InfoCard';
import { CardWrapper, OfferContainer } from '../../styles/table';
import { StepForwardOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../helper/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import useNotification from '../../hooks/useNotifier';
const { Title, Text } = Typography;
const UserDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { openNotification } = useNotification();

  const fetchPurchasedCourses = async () => {
    setLoading(true);
    try {
      const userId = currentUser?.userId;
      const coursesRef = collection(db, 'Courses');
      const q = query(
        coursesRef,
        where('consumerId', 'array-contains', userId),
      );
      const querySnapshot = await getDocs(q);

      const purchasedCourses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(purchasedCourses);
    } catch (error) {
      openNotification('error', 'Failed to fetch courses', '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);
  return (
    <Spin spinning={loading}>
      <div>
        <Breadcrumb pageName="Dashboard" textSize="md" />
        <InfoCard
          name="Rohit Mandal"
          email="Rohit@gmail.com"
          buttonLabel="Verified"
          tagName="Student"
        />
      </div>
      <div className="mt-8">
        <h2 className="text-[18px] font-semibold pb-5">On Going Courses</h2>
        <Flex wrap gap={20}>
          {courses.length !== 0 ? (
            courses.map((course) => (
              <CardWrapper>
                <Card
                  hoverable
                  style={{ width: 300, cursor: 'pointer' }}
                  cover={
                    <img
                      alt="example"
                      src="https://cdn.prod.website-files.com/5a9ee6416e90d20001b20038/64f5c1c1f5723d7453a3de42_Rectangle%20(94).svg"
                    />
                  }
                  actions={[
                    <Flex gap={5}>
                      <Button
                        block
                        type="default"
                        onClick={() => navigate(`/view-courses/${course.id}`)}
                        icon={<StepForwardOutlined />}
                      >
                        Start
                      </Button>
                    </Flex>,
                  ]}
                >
                  <Meta
                    title={
                      course.courseName !== '' ? course.courseName : 'Demo'
                    }
                    description={
                      course.subHeading !== ''
                        ? course.subHeading
                        : 'Subheading'
                    }
                  />
                  <Row justify={'space-between'} style={{ marginTop: '20px' }}>
                    <Title level={5}>
                      ₹{course.price !== '' ? course.price : '100'}
                    </Title>
                    <OfferContainer>
                      <Title level={5}>{`60%off`}</Title>
                      <Text className="text-xs">Limited Time offer</Text>
                    </OfferContainer>
                  </Row>
                </Card>
              </CardWrapper>
            ))
          ) : (
            <>
              <Typography.Text>No course available right now</Typography.Text>
            </>
          )}
        </Flex>
      </div>

      <div className="mt-8">
        <h2 className="text-[18px] font-semibold pb-5">Scheduled Sessions</h2>
      </div>
    </Spin>
  );
};

export default UserDashboard;
