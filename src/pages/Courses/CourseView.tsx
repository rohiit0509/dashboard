import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Layout, Menu, Button, Input, Typography, Flex } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  CloseOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../../helper/auth';
import { Course, SelectedIndexes, Topic } from '../../types/courses';
import { TextEditorWrapper } from '../../styles/textEditor';

const { Sider, Content } = Layout;

function CourseView() {
  const { currentUser } = useContext(AuthContext);
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedIndexes, setSelectedIndexes] = useState<SelectedIndexes>({
    topicIndex: null,
    subtopicIndex: null,
  });
  console.log('asfsfdfs', topics);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        console.error('No course ID found in URL params.');
        return;
      }

      const docRef = doc(db, 'Courses', courseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const courseData = docSnap.data() as Course;
        setCourse(courseData);
        setTopics(courseData.topics || []);
      } else {
        console.error('No such document exists!');
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role == 'admin') setIsAdmin(true);
            else setIsAdmin(false);
          } else {
            console.log('No such user document!');
            return null;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          return null;
        }
      }
    };
    fetchUserData();
  }, []);

  const handleTopicChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTopics = [...topics];
    newTopics[index].name = event.target.value;
    setTopics(newTopics);
  };

  const handleSubtopicChange = (
    topicIndex: number,
    subtopicIndex: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics[subtopicIndex].name = event.target.value;
    setTopics(newTopics);
  };

  const handleContentChange = (value: string) => {
    const newTopics = [...topics];
    const { topicIndex, subtopicIndex } = selectedIndexes;

    if (subtopicIndex === null) {
      newTopics[topicIndex!].content = value;
    } else {
      newTopics[topicIndex!].subtopics[subtopicIndex].content = value;
    }

    setTopics(newTopics);
    setSelectedContent(value);
  };

  const handleTopicSelect = (index: number) => {
    setSelectedIndexes({ topicIndex: index, subtopicIndex: null });
    setSelectedContent(topics[index].content || '');
    setActiveKey(`topic-${index}`);
  };

  const handleSubtopicSelect = (topicIndex: number, subtopicIndex: number) => {
    setSelectedIndexes({ topicIndex, subtopicIndex });
    setSelectedContent(
      topics[topicIndex].subtopics[subtopicIndex].content || '',
    );
    setActiveKey(`subtopic-${topicIndex}-${subtopicIndex}`);
  };

  const handleSave = async () => {
    if (courseId) {
      try {
        const docRef = doc(db, 'Courses', courseId);
        await setDoc(docRef, { ...course, topics }, { merge: true });
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving course:', error);
      }
    }
  };

  const addTopic = () => {
    setTopics([...topics, { name: '', content: '', subtopics: [] }]);
  };

  const addSubtopic = (index: number) => {
    const newTopics = [...topics];
    newTopics[index].subtopics.push({ name: '', content: '' });
    setTopics(newTopics);
  };

  if (!course) return <div>Loading...</div>;

  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }],
        ['bold', 'italic', 'underline'],
        ['link', 'image', 'video'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
      ],
      // handlers: {
      //   video: () => handleVideoUpload(),
      // },
    },
  };
  return (
    <Layout style={{ minHeight: '97%' }}>
      <Sider width={230}>
        <Menu
          mode="inline"
          selectedKeys={[activeKey || '']}
          style={{ height: '100%', borderRight: 0, overflow: 'auto' }}
        >
          <Flex justify="space-between" align="center">
            <Typography.Title level={5}>{course.courseName}</Typography.Title>
            {isAdmin && !isEditing && (
              <Button
                type="text"
                onClick={() => setIsEditing(true)}
                icon={<EditOutlined />}
              />
            )}
            {isAdmin && isEditing && (
              <Button
                type="text"
                onClick={() => setIsEditing(false)}
                icon={<CloseOutlined />}
              />
            )}
          </Flex>
          {topics?.map((topic, topicIndex) => (
            <Menu.SubMenu
              key={`topic-${topicIndex}`}
              title={
                isEditing ? (
                  <Input
                    value={topic?.name}
                    onChange={(e) => handleTopicChange(topicIndex, e)}
                    onClick={() => handleTopicSelect(topicIndex)}
                  />
                ) : (
                  <span onClick={() => handleTopicSelect(topicIndex)}>
                    {topic.name}
                  </span>
                )
              }
            >
              {topic?.subtopics?.map((subtopic, subtopicIndex) => (
                <Menu.Item
                  key={`subtopic-${topicIndex}-${subtopicIndex}`}
                  onClick={() =>
                    handleSubtopicSelect(topicIndex, subtopicIndex)
                  }
                >
                  {isEditing ? (
                    <Input
                      value={subtopic?.name}
                      onChange={(e) =>
                        handleSubtopicChange(topicIndex, subtopicIndex, e)
                      }
                    />
                  ) : (
                    subtopic.name
                  )}
                </Menu.Item>
              ))}
              {isEditing && (
                <Menu.Item>
                  <Button
                    type="dashed"
                    onClick={() => addSubtopic(topicIndex)}
                    icon={<PlusCircleOutlined />}
                  >
                    Add Subtopic
                  </Button>
                </Menu.Item>
              )}
            </Menu.SubMenu>
          ))}
          {isEditing && (
            <Menu.Item>
              <Button
                type="dashed"
                onClick={addTopic}
                icon={<PlusOutlined />}
                block
              >
                Add Topic
              </Button>
            </Menu.Item>
          )}
        </Menu>
        {isEditing && (
          <Button type="default" onClick={handleSave}>
            Save
          </Button>
        )}
      </Sider>
      <Layout>
        <Content style={{ padding: 15 }}>
          {isEditing ? (
            <TextEditorWrapper>
              <ReactQuill
                theme="snow"
                modules={modules}
                value={selectedContent}
                onChange={handleContentChange}
              />
            </TextEditorWrapper>
          ) : selectedContent == '' ? (
            <Flex justify="center" align="center">
              <Typography.Title>Course Details</Typography.Title>
            </Flex>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: selectedContent,
              }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default CourseView;
