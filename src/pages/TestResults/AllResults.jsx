import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { NavLink } from 'react-router-dom';

const AllResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = 'USER_ID'; // Replace with actual user ID

  useEffect(() => {
    const fetchAllResults = async () => {
      setIsLoading(true);
      try {
        const testsCollection = collection(db, 'Tests');
        const testsSnapshot = await getDocs(testsCollection);

        const resultsPromises = testsSnapshot.docs.map(async (testDoc) => {
          const testId = testDoc.id;
          const userAnswersRef = doc(db, 'Tests', testId, 'userAnswers', userId);
          const userAnswersDoc = await getDoc(userAnswersRef);

          if (userAnswersDoc.exists()) {
            const data = userAnswersDoc.data();
            const totalQuestions = data.selectedOptions.length;
            const attemptedQuestions = data.selectedOptions.filter(opt => opt !== null).length;
            const correctAnswers = data.marks.reduce((sum, mark) => sum + (mark === 1 ? 1 : 0), 0);

            return {
              testId,
              testName: testDoc.data().testName, 
              totalQuestions,
              attemptedQuestions,
              correctAnswers,
              totalMarks: data.totalMarks,
            };
          }

          return null;
        });

        const results = (await Promise.all(resultsPromises)).filter((result) => result !== null);
        setTestResults(results);
      } catch (error) {
        console.error('Error fetching all results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllResults();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (testResults.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">All Test Results</h2>
      <table className="min-w-full bg-white mb-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Test Name</th>
            <th className="py-2 px-4 border-b">Total Questions</th>
            <th className="py-2 px-4 border-b">Attempted Questions</th>
            <th className="py-2 px-4 border-b">Correct Answers</th>
            <th className="py-2 px-4 border-b">Total Marks</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((result, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b text-center">{result.testName}</td>
              <td className="py-2 px-4 border-b text-center">{result.totalQuestions}</td>
              <td className="py-2 px-4 border-b text-center">{result.attemptedQuestions}</td>
              <td className="py-2 px-4 border-b text-center">{result.correctAnswers}</td>
              <td className="py-2 px-4 border-b text-center">{result.totalMarks}</td>
              <td className="py-2 px-4 border-b text-center">
                <NavLink to={`/test-results/${result.testId}`} className="text-blue-500">
                  View More
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllResults;
