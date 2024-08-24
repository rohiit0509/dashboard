import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Layout, Menu, Button, Input } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Sider, Content } = Layout;

interface Subtopic {
  name: string;
  content: string;
}

interface Topic {
  name: string;
  content: string;
  subtopics: Subtopic[];
}

interface Course {
  courseName: string;
  topics: Topic[];
}

interface SelectedIndexes {
  topicIndex: number | null;
  subtopicIndex: number | null;
}

function CourseView({ isAdmin }: { isAdmin: boolean }) {
  isAdmin = true;
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedIndexes, setSelectedIndexes] = useState<SelectedIndexes>({
    topicIndex: null,
    subtopicIndex: null,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | null>(null); // State to manage active menu item

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
    setActiveKey(`topic-${index}`); // Set active key for highlighting
  };

  const handleSubtopicSelect = (topicIndex: number, subtopicIndex: number) => {
    setSelectedIndexes({ topicIndex, subtopicIndex });
    setSelectedContent(
      topics[topicIndex].subtopics[subtopicIndex].content || '',
    );
    setActiveKey(`subtopic-${topicIndex}-${subtopicIndex}`); // Set active key for highlighting
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
  const handleVideoUpload = () => {};
  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }],
        ['bold', 'italic', 'underline'],
        ['link', 'image', 'video'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
      ],
      handlers: {
        video: () => handleVideoUpload(),
      },
    },
  };
  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider width={250} className="site-layout-background">
        <Menu
          mode="inline"
          selectedKeys={[activeKey || '']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="courseName">{course.courseName}</Menu.Item>
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
                <Button type="dashed" onClick={() => addSubtopic(topicIndex)}>
                  Add Subtopic
                </Button>
              )}
            </Menu.SubMenu>
          ))}
        </Menu>
        {isEditing && (
          <Button type="dashed" onClick={addTopic}>
            Add Topic
          </Button>
        )}
        {isAdmin && !isEditing && (
          <Button type="default" onClick={() => setIsEditing(true)} block>
            Edit
          </Button>
        )}
        {isEditing && (
          <Button type="default" onClick={handleSave} block>
            Save
          </Button>
        )}
      </Sider>
      <Layout>
        <Content style={{ padding: 15 }}>
          {isEditing ? (
            <ReactQuill
              // className="border rounded-md height-500"
              // modules={modules}
              value={selectedContent}
              onChange={handleContentChange}
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: selectedContent }} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default CourseView;
