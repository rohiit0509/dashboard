import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import CourseModal from './CourseModal'; // Adjust the import path accordingly

function ViewAllCourses() {
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
                Create Course
            </button>

            <CourseModal show={showModal} handleClose={handleClose} handleSave={handleSave} />

            <div className="mt-8">
                <h2 className="text-[20px] font-semibold ">On Going Courses</h2>
                <div className="mt-4 space-y-4 flex justify-start items-end">
                    {courses.map((course) => (
                            <Link to={`/view-courses/${course.id}`} key={course.id} className='w-full max-w-[272px] px-[13px] py-[12px] rounded-[10px] border border-[#EDEDED]'>
                                <div className=' w-full h-45 bg-slate-400 rounded-[10px]'></div>
                                <h3 className="text-md font-bold">{course.courseName}</h3>
                                <p className="text-sm text-[#2D3748]">{course.subHeading}</p>
                                <p className="text-sm font-bold text-[#2D3748]">₹{course.price}</p>
                            </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewAllCourses;
