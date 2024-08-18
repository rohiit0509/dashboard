import React, { useState } from 'react';

function CourseModal({ show, handleClose, handleSave }) {
    const [courseName, setcourseName] = useState('');
    const [subHeading, setSubHeading] = useState('');
    const [price, setPrice] = useState('');

    if (!show) {
        return null;
    }

    const onSave = () => {
        handleSave({ courseName, subHeading, price });
        handleClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold">Enter Course Details</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        &times;
                    </button>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Course Name:</label>
                    <input
                        type="text"
                        placeholder="Enter test name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={courseName}
                        onChange={(e) => setcourseName(e.target.value)}
                    />

                    <label className="block text-sm font-medium text-gray-700 mt-4">Sub Heading:</label>
                    <input
                        type="text"
                        placeholder="Enter sub heading"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={subHeading}
                        onChange={(e) => setSubHeading(e.target.value)}
                    />

                    <label className="block text-sm font-medium text-gray-700 mt-4">Price:</label>
                    <input
                        type="number"
                        placeholder="Enter price"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={handleClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Close
                    </button>
                    <button
                        onClick={onSave}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CourseModal;
