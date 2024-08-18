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

// Handle video upload
const handleVideoUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `courses/videos/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            // Insert video URL into Quill editor
            const quill = document.querySelector('.ql-editor').__quill;
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'video', url);
        }
    });
    input.click();
};

// Recursive component to render subtopics
const SubtopicList = ({ subtopics, handleSubtopicChange, handleFileChange, parentIndex }) => (
    <ul className="ml-4 mt-2 list-disc">
        {subtopics.map((subtopic, subtopicIndex) => (
            <li key={subtopicIndex} className="mb-4">
                <div>
                    <button onClick={() => handleSubtopicChange(parentIndex, subtopicIndex, 'expand')}>
                        {subtopic.name}
                    </button>
                </div>
                <div className="ml-4">
                    <ReactQuill
                        value={subtopic.content}
                        onChange={(value) => handleSubtopicChange(parentIndex, subtopicIndex, 'content', value)}
                        className="border rounded-md"
                        modules={modules}
                    />
                    <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, parentIndex, subtopicIndex)}
                        className="border p-2 rounded-md w-full mt-2"
                    />
                    {subtopic.media?.map((url, mediaIndex) => (
                        <div key={mediaIndex}>
                            {url.endsWith('.mp4') ? (
                                <video src={url} controls className="w-full mt-2" />
                            ) : (
                                <img src={url} alt={`Media ${mediaIndex}`} className="w-full mt-2" />
                            )}
                        </div>
                    ))}
                    {subtopic.subtopics && subtopic.subtopics.length > 0 && (
                        <SubtopicList
                            subtopics={subtopic.subtopics}
                            handleSubtopicChange={handleSubtopicChange}
                            handleFileChange={handleFileChange}
                            parentIndex={subtopicIndex}
                        />
                    )}
                </div>
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
    const [expandedTopic, setExpandedTopic] = useState(null);

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
                    console.log("Course data:", courseData);
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
            subtopics: newSubtopics
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

        if (field === 'expand') {
            subtopic.isExpanded = !subtopic.isExpanded;
        } else if (field === 'content') {
            subtopic.content = value;
        } else if (field === 'name') {
            subtopic.name = value;
        } else if (field === 'description') {
            subtopic.description = value;
        }

        setTopics(updatedTopics);
    };

    const handleAddSubtopicField = (index) => {
        const updatedTopics = [...topics];
        updatedTopics[index].subtopics = [...updatedTopics[index].subtopics, { name: '', content: '', description: '', media: [], subtopics: [] }];
        setTopics(updatedTopics);
    };

    const handleFileChange = async (event, parentIndex, subtopicIndex) => {
        const files = Array.from(event.target.files);
        const mediaUrls = [];

        for (const file of files) {
            const storageRef = ref(storage, `courses/${courseId}/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            mediaUrls.push(url);
        }

        const updatedTopics = [...topics];
        updatedTopics[parentIndex].subtopics[subtopicIndex].media = [...updatedTopics[parentIndex].subtopics[subtopicIndex].media, ...mediaUrls];
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return <div>No course found.</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">{course.courseName} - Dashboard</h2>

            <button onClick={handleAddTopic} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Add Topic
            </button>

            {showAddTopic && (
                <div className="mt-4">
                    <div>
                        <label className="block mb-2">Topic Name:</label>
                        <input
                            type="text"
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block mb-2">Number of Subtopics:</label>
                        <input
                            type="number"
                            value={subtopicsCount}
                            onChange={(e) => setSubtopicsCount(parseInt(e.target.value, 10))}
                            min="1"
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div className="mt-4">
                        {Array.from({ length: subtopicsCount }, (_, index) => (
                            <div key={index} className="mb-4">
                                <div>
                                    <label className="block mb-2">Subtopic {index + 1} Name:</label>
                                    <input
                                        type="text"
                                        value={newSubtopics[index]?.name || ''}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setNewSubtopics(prev => {
                                                const updated = [...prev];
                                                if (!updated[index]) updated[index] = {};
                                                updated[index].name = name;
                                                return updated;
                                            });
                                        }}
                                                                                className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block mb-2">Number of Sub-Subtopics:</label>
                                    <input
                                        type="number"
                                        value={newSubtopics[index]?.subtopicsCount || 1}
                                        onChange={(e) => {
                                            const count = parseInt(e.target.value, 10);
                                            setNewSubtopics(prev => {
                                                const updated = [...prev];
                                                if (!updated[index]) updated[index] = {};
                                                updated[index].subtopicsCount = count;
                                                if (!updated[index].subtopics) updated[index].subtopics = [];
                                                const currentSubtopicsCount = updated[index].subtopics.length;
                                                if (count > currentSubtopicsCount) {
                                                    updated[index].subtopics = [
                                                        ...updated[index].subtopics,
                                                        ...Array.from({ length: count - currentSubtopicsCount }, (_, i) => ({ name: '', description: '' }))
                                                    ];
                                                } else {
                                                    updated[index].subtopics = updated[index].subtopics.slice(0, count);
                                                }
                                                return updated;
                                            });
                                        }}
                                        min="1"
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    {Array.from({ length: newSubtopics[index]?.subtopicsCount || 1 }, (_, subIndex) => (
                                        <div key={subIndex} className="mb-4">
                                            <div>
                                                <label className="block mb-2">Sub-Subtopic {subIndex + 1} Name:</label>
                                                <input
                                                    type="text"
                                                    value={newSubtopics[index]?.subtopics[subIndex]?.name || ''}
                                                    onChange={(e) => {
                                                        const name = e.target.value;
                                                        setNewSubtopics(prev => {
                                                            const updated = [...prev];
                                                            if (!updated[index].subtopics) updated[index].subtopics = [];
                                                            if (!updated[index].subtopics[subIndex]) updated[index].subtopics[subIndex] = {};
                                                            updated[index].subtopics[subIndex].name = name;
                                                            return updated;
                                                        });
                                                    }}
                                                    className="border p-2 rounded-md w-full"
                                                />
                                            </div>
                                            <div className="mt-2">
                                                <label className="block mb-2">Sub-Subtopic {subIndex + 1} Description:</label>
                                                <ReactQuill
                                                    value={newSubtopics[index]?.subtopics[subIndex]?.description || ''}
                                                    onChange={(value) => {
                                                        setNewSubtopics(prev => {
                                                            const updated = [...prev];
                                                            if (!updated[index].subtopics) updated[index].subtopics = [];
                                                            if (!updated[index].subtopics[subIndex]) updated[index].subtopics[subIndex] = {};
                                                            updated[index].subtopics[subIndex].description = value;
                                                            return updated;
                                                        });
                                                    }}
                                                    className="border rounded-md"
                                                    modules={modules}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSaveNewTopic} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        Save Topic
                    </button>
                </div>
            )}

            {topics.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold">Topics</h3>
                    <SubtopicList
                        subtopics={topics}
                        handleSubtopicChange={handleSubtopicChange}
                        handleFileChange={handleFileChange}
                        parentIndex={null}
                    />
                </div>
            )}

            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4">
                Save All Changes
            </button>
        </div>
    );
}

export default CourseDetails;

