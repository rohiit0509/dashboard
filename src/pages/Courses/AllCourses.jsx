import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import CourseModal from './CourseModal';
import { Button, Card, Flex, Modal, Row, Spin, Typography } from 'antd';
import { DeleteOutlined, StepForwardOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import TrashIcon from '../../assets/svgs/TrashIcon';
import { CardWrapper, OfferContainer } from '../../styles/table';
const { Title, Text } = Typography;
import { TrashIconWrapper } from '../../styles/logo';
const { confirm } = Modal;

function AllCourses() {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Courses'));
      const coursesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
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
      });
      handleClose();
      console.log('Document written with ID: ', docRef.id);
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
        <Button type="primary" onClick={handleShow}>
          Create Course
        </Button>

        <div className="mt-8">
          <h2 className="text-[20px] font-semibold pb-5">On Going Courses</h2>
          <Flex wrap gap={20}>
            {courses.map((course) => (
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
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => showConfirm(course.id)}
                      />
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
            ))}
          </Flex>
        </div>
      </Spin>
      <Modal
        title="Enter Course Details"
        open={showModal}
        footer={null}
        centered
        destroyOnClose
        onCancel={handleClose}
      >
        <CourseModal handleClose={handleClose} handleSave={handleSave} />
      </Modal>
    </>
  );
}

export default AllCourses;
