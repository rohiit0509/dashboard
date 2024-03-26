import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firebase config

const QuerryTable = () => {
    const [data, setData] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filter, setFilter] = useState('');
    const tableHeaders = ["Email", "Messages", "Name", "Phone"];
    const fetchData = async () => {

        let querySnapshot;
    
            querySnapshot = await getDocs(collection(db, "messages"));
        
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(items);
        setCurrentPage(1);

    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const deleteDocument = async (id: any) => {
        console.log(id);

        try {
            // Query for the document with the matching propertyId
            const querySnapshot = await getDocs(collection(db, "messages"));
            const docToDelete = querySnapshot.docs.find(doc => doc.data().prpertyId == id);

            if (docToDelete) {
                // Delete the document if found
                await deleteDoc(docToDelete.ref);
                // Optionally, refetch the data after deletion to update the UI
                fetchData();
            } else {
                console.error("Document with propertyId not found: ", id);
            }
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };
    const handleFilterChange = (event: any) => {
        setFilter(event.target.value);
    };

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };
    return (

        <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
                <div>
                    <h2 className="text-2xl font-semibold leading-tight">Users</h2>
                </div>

                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>{
                                    tableHeaders.map((item: any) => (
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {item}
                                        </th>
                                    ))
                                }

                                </tr>
                            </thead>
                            <tbody>{
                                data.map((items: any) => (
                                    <tr>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div className="flex items-center">

                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {items.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <textarea
                                                value={items.message}
                                                rows={3}
                                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            >

                                            </textarea>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">
                                                {items.name}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">
                                                {items.phone}
                                            </p>
                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                onClick={() => deleteDocument(items.prpertyId)}
                                                className="inline-flex items-center justify-center rounded-md bg-red-500 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                            >
                                                Delete
                                            </button>
                                        </td>


                                    </tr>
                                ))}



                            </tbody>
                        </table>
                        <div
                            className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                            <span className="text-xs xs:text-sm text-gray-900">
                                Showing {currentPage} to {totalPages}
                            </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                                    Prev
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default QuerryTable;
