import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage } from '../../firebase'; // Import Firebase storage
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import React Quill styles
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Custom toolbar with video button
const modules = {
    toolbar: {
        container: [
            [{ 'header': '1'}, { 'header': '2' }],
            ['bold', 'italic', 'underline'],
            ['link', 'image', 'video'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
        ],
        handlers: {
            video: () => handleVideoUpload()
        }
    }
};

// Recursive component to render sub-subtopics
const SubSubtopicList = ({ subSubtopics, handleSubSubtopicChange, parentIndex, subtopicIndex }) => (
    <ul className="ml-4 mt-2 list-disc">
        {subSubtopics.map((subSubtopic, index) => (
            <li key={index} className="mb-4">
                <div>
                    <label className="block mb-2">Sub-Subtopic {index + 1} Name:</label>
                    <input
                        type="text"
                        value={subSubtopic.name || ''}
                        onChange={(e) => handleSubSubtopicChange(parentIndex, subtopicIndex, index, 'name', e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                </div>
                <div className="mt-2">
                    <label className="block mb-2">Sub-Subtopic {index + 1} Description:</label>
                    <ReactQuill
                        value={subSubtopic.description || ''}
                        onChange={(value) => handleSubSubtopicChange(parentIndex, subtopicIndex, index, 'description', value)}
                        className="border rounded-md"
                        modules={modules}
                    />
                </div>
            </li>
        ))}
    </ul>
);

// Recursive component to render subtopics
const SubtopicList = ({ subtopics, handleSubtopicChange, handleFileChange, parentIndex, handleSubSubtopicChange }) => (
    <ul className="ml-4 mt-2 list-disc">
        {subtopics.map((subtopic, subtopicIndex) => (
            <li key={subtopicIndex} className="mb-4">
                <div>
                    <label className="block mb-2">Subtopic {subtopicIndex + 1} Name:</label>
                    <input
                        type="text"
                        value={subtopic.name || ''}
                        onChange={(e) => handleSubtopicChange(parentIndex, subtopicIndex, 'name', e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block mb-2">Number of Sub-Subtopics:</label>
                    <input
                        type="number"
                        value={subtopic.subSubtopicCount || ''}
                        onChange={(e) => handleSubtopicChange(parentIndex, subtopicIndex, 'subSubtopicCount', e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                </div>
                {subtopic.subSubtopics && subtopic.subSubtopics.length > 0 && (
                    <SubSubtopicList
                        subSubtopics={subtopic.subSubtopics}
                        handleSubSubtopicChange={handleSubSubtopicChange}
                        parentIndex={parentIndex}
                        subtopicIndex={subtopicIndex}
                    />
                )}
            </li>
        ))}
    </ul>
);

function CourseDetails() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState([]);
    const [showAddTopic, setShowAddTopic] = useState(false);
    const [newTopicName, setNewTopicName] = useState('');
    const [subtopicsCount, setSubtopicsCount] = useState(1);
    const [newSubtopics, setNewSubtopics] = useState([]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                if (!courseId) {
                    console.error("No course ID found in URL params.");
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, "Courses", courseId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const courseData = docSnap.data();
                    setCourse(courseData);
                    setTopics(courseData.topics || []);
                } else {
                    console.error("No such document exists!");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleAddTopic = () => {
        setShowAddTopic(true);
    };

    const handleSaveNewTopic = async () => {
        const newTopic = {
            name: newTopicName,
            subtopics: Array.from({ length: subtopicsCount }, () => ({
                name: '',
                content: '',
                subSubtopics: [],
                subSubtopicCount: 0
            }))
        };

        const updatedTopics = [...topics, newTopic];
        setTopics(updatedTopics);
        await updateCourseInDatabase(updatedTopics);
        setShowAddTopic(false);
        setNewTopicName('');
        setSubtopicsCount(1);
        setNewSubtopics([]);
    };

    const handleSubtopicChange = (parentIndex, subtopicIndex, field, value) => {
        const updatedTopics = [...topics];
        const topic = updatedTopics[parentIndex];
        const subtopic = topic.subtopics[subtopicIndex];

        if (field === 'subSubtopicCount') {
            const subSubtopics = Array.from({ length: value }, () => ({ name: '', description: '' }));
            subtopic.subSubtopics = subSubtopics;
        } else {
            subtopic[field] = value;
        }

        setTopics(updatedTopics);
    };

    const handleSave = async () => {
        if (courseId) {
            await updateCourseInDatabase(topics);
        }
    };

    const updateCourseInDatabase = async (updatedTopics) => {
        if (courseId) {
            const courseRef = doc(db, "Courses", courseId);
            await updateDoc(courseRef, { topics: updatedTopics });
        }
    };

    const handleSubSubtopicChange = (parentIndex, subtopicIndex, subSubtopicIndex, field, value) => {
        const updatedTopics = [...topics];
        const subtopic = updatedTopics[parentIndex].subtopics[subtopicIndex];
        const subSubtopic = subtopic.subSubtopics[subSubtopicIndex];

        subSubtopic[field] = value;

        setTopics(updatedTopics);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Course Details</h1>
            {course && (
                <div>
                    {topics.map((topic, index) => (
                        <div key={index} className="my-4">
                            <h2 className="text-xl font-semibold">{topic.name}</h2>
                            <SubtopicList
                                subtopics={topic.subtopics}
                                handleSubtopicChange={handleSubtopicChange}
                                handleSubSubtopicChange={handleSubSubtopicChange}
                                parentIndex={index}
                            />
                        </div>
                    ))}

                    {showAddTopic ? (
                        <div className="my-4">
                            <input
                                type="text"
                                placeholder="New Topic Name"
                                value={newTopicName}
                                onChange={(e) => setNewTopicName(e.target.value)}
                                className="border p-2 rounded-md w-full"
                            />
                            <input
                                type="number"
                                placeholder="Number of Subtopics"
                                value={subtopicsCount}
                                onChange={(e) => setSubtopicsCount(e.target.value)}
                                className="border p-2 rounded-md w-full mt-2 text-black"
                            />
                            <button onClick={handleSaveNewTopic} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
                                Save New Topic
                            </button>
                            <button onClick={() => setShowAddTopic(false)} className="mt-2 ml-2 bg-gray-500 text-white px-4 py-2 rounded-md">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleAddTopic} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Add New Topic
                        </button>
                    )}

                    <button onClick={handleSave} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
                        Save All Changes
                    </button>
                </div>
            )}
        </div>
    );
}

export default CourseDetails;
