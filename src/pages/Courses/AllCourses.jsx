import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import CourseModal from './CourseModal'; // Adjust the import path accordingly

function AllCourses() {
    const [showModal, setShowModal] = useState(false);
    const [courses, setCourses] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const fetchCourses = async () => {
        const querySnapshot = await getDocs(collection(db, "Courses"));
        const coursesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setCourses(coursesList);
    };

    const handleSave = async (data) => {
        try {
            const docRef = await addDoc(collection(db, "Courses"), {
                courseName: data.courseName,
                subHeading: data.subHeading,
                price: data.price,
                createdAt: new Date(), // Add a timestamp if needed
            });
            console.log("Document written with ID: ", docRef.id);
            fetchCourses(); // Refresh the list of courses after saving
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    useEffect(() => {
        fetchCourses(); // Fetch the courses when the component mounts
    }, []);

    return (
        <div className="App p-4">
            <button
                onClick={handleShow}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Open Course Modal
            </button>

            <CourseModal show={showModal} handleClose={handleClose} handleSave={handleSave} />

            <div className="mt-8">
                <h2 className="text-lg font-semibold">List of Courses</h2>
                <ul className="mt-4 space-y-4">
                    {courses.map((course) => (
                        <li key={course.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
                            <Link to={`/courses/${course.id}`}>
                                <h3 className="text-md font-bold">{course.courseName}</h3>
                                <p className="text-sm text-gray-700">{course.subHeading}</p>
                                <p className="text-sm text-gray-500">Price: ${course.price}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AllCourses;
