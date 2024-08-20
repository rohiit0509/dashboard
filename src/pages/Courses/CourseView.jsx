import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import SideNav from './SideNav';
import DetailsView from './DetailsView';

function CourseView() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [selectedSubSubtopic, setSelectedSubSubtopic] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                if (!courseId) {
                    console.error("No course ID found in URL params.");
                    return;
                }

                const docRef = doc(db, "Courses", courseId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCourse(docSnap.data());
                } else {
                    console.error("No such document exists!");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleTopicSelect = (index) => {
        // Handle topic selection logic if needed
    };

    const handleSubtopicSelect = (topicIndex, subtopicIndex) => {
        // Handle subtopic selection logic if needed
    };

    const handleSubSubtopicSelect = (topicIndex, subtopicIndex, subSubtopicIndex) => {
        const topic = course.topics[topicIndex];
        const subtopic = topic.subtopics[subtopicIndex];
        const subSubtopic = subtopic.subSubtopics[subSubtopicIndex];
        setSelectedSubSubtopic(subSubtopic);
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="flex absolute left-0 top-16">
            <SideNav
                topics={course.topics}
                onTopicSelect={handleTopicSelect}
                onSubtopicSelect={handleSubtopicSelect}
                onSubSubtopicSelect={handleSubSubtopicSelect}
            />

            <div className="flex-1 p-4">
                <h1 className="text-2xl font-bold mb-4">Course Details</h1>
                <DetailsView
                    subSubtopic={selectedSubSubtopic}
                />
            </div>
        </div>
    );
}

export default CourseView;
