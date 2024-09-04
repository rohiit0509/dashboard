import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import CourseModal from './CourseModal';
import { Button, Card, Flex, Modal, Row, Spin, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import TrashIcon from '../../assets/svgs/TrashIcon';
import { CardWrapper, OfferContainer } from '../../styles/table';
const { Title, Text } = Typography;
import { TrashIconWrapper } from '../../styles/logo';
import { AuthContext } from '../../helper/auth';
import SmallTickIcon from '../../assets/svgs/SmallTickIcon';
import PlayIcon from '../../assets/svgs/PlayIcon';
import PurchaseModal from '../../Modals/PurchaseModal';
const { confirm } = Modal;

function AllCourses() {
  const [showModal, setShowModal] = useState('');
  console.log('Asdfasdf', showModal);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const handleShow = () => setShowModal('courseCreateModal');
  const handleClose = () => setShowModal('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const currentRole = currentUser.role;
  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (currentRole === 'admin') {
        // Fetch courses created by the admin
        const coursesQuery = query(
          collection(db, 'Courses'),
          where('authorId', '==', currentUser.userId),
        );
        const querySnapshot = await getDocs(coursesQuery);
        const adminCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(adminCourses);
      } else {
        const querySnapshot = await getDocs(collection(db, 'Courses'));
        const allCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(allCourses);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'Courses'), {
        courseName: data.courseName,
        subHeading: data.subHeading,
        price: data.price,
        createdAt: new Date(),
        authorId: currentUser?.userId,
      });
      handleClose();
      navigate(`/view-courses/${docRef.id}`);
      fetchCourses();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    try {
      const courseDocRef = doc(db, 'Courses', courseId);
      await deleteDoc(courseDocRef);
      fetchCourses();
      setLoading(false);
      console.log('Course deleted successfully');
    } catch (error) {
      setLoading(false);
      console.error('Error deleting course:', error);
      throw error;
    }
  };

  const showConfirm = (courseId) => {
    confirm({
      title: 'Are you sure you want to delete this course?',
      icon: (
        <>
          <TrashIconWrapper>
            <TrashIcon />
          </TrashIconWrapper>
        </>
      ),
      closable: true,
      content: 'This action cannot be reversed',
      okText: 'Yes',
      okType: 'danger',
      okButtonProps: { type: 'primary' },
      onOk() {
        handleCourseDelete(courseId);
      },
    });
  };

  return (
    <>
      <Spin spinning={loading} centered>
        {currentRole !== 'user' && (
          <Button type="primary" onClick={handleShow}>
            Create Course
          </Button>
        )}

        <div className="mt-8">
          <h2 className="text-[20px] font-semibold pb-5">Courses</h2>
          <Flex wrap gap={20}>
            {courses.length !== 0 ? (
              courses.map((course) => {
                return (
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
                            onClick={() => {
                              currentRole == 'user'
                                ? setShowModal('purchaseModal')
                                : navigate(`/view-courses/${course.id}`);
                            }}
                            icon={
                              currentRole == 'user' ? (
                                <SmallTickIcon />
                              ) : (
                                <PlayIcon />
                              )
                            }
                          >
                            {currentRole == 'user'
                              ? 'Add to Learning'
                              : 'Start'}
                          </Button>
                          {currentRole !== 'user' && (
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={() => showConfirm(course.id)}
                            />
                          )}
                        </Flex>,
                      ]}
                    >
                      <Meta
                        title={
                          course.courseName !== '' ? course.courseName : 'Demo'
                        }
                        description={
                          course.subHeading !== '' ? (
                            <Text ellipsis>{course.subHeading}</Text>
                          ) : (
                            'Subheading'
                          )
                        }
                      />
                      <Row
                        justify={'space-between'}
                        style={{ marginTop: '20px' }}
                      >
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
                );
              })
            ) : (
              <>
                <Typography.Text>No course available right now</Typography.Text>
              </>
            )}
          </Flex>
        </div>
      </Spin>
      <Modal
        title="Enter Course Details"
        open={showModal == 'courseCreateModal'}
        footer={null}
        centered
        destroyOnClose
        onCancel={handleClose}
      >
        <CourseModal handleClose={handleClose} handleSave={handleSave} />
      </Modal>
      <Modal
        width={400}
        closable={false}
        open={showModal == 'purchaseModal'}
        destroyOnClose
        footer={null}
        maskClosable={false}
        onCancel={handleClose}
      >
        <PurchaseModal handleClose={handleClose} />
      </Modal>
    </>
  );
}

export default AllCourses;
