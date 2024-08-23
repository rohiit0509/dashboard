import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { TableWrapper } from '../../styles/table';
import { Table } from 'antd';

const TestResults = () => {
  const { testId } = useParams();
  const [results, setResults] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = 'USER_ID'; // Replace with actual user ID

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // Fetch user answers
        const userAnswersRef = doc(db, 'Tests', testId, 'userAnswers', userId);
        const userAnswersDoc = await getDoc(userAnswersRef);
        let userAnswersData = null;
        if (userAnswersDoc.exists()) {
          userAnswersData = userAnswersDoc.data();
        } else {
          console.error('No such document!');
        }

        // Fetch questions to get correct answers
        const questionsCollection = collection(db, 'Tests', testId, 'Questions');
        const questionsSnapshot = await getDocs(questionsCollection);
        const questionsData = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setResults(userAnswersData);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching user results or questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [testId, userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!results) {
    return <div>No results found.</div>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-4 text-center">Test Results</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Question Number</th>
            <th className="py-2 px-4 border-b">Your Answer</th>
            <th className="py-2 px-4 border-b">Correct Answer</th>
            <th className="py-2 px-4 border-b">Result</th>
          </tr>
        </thead>
        <tbody>
          {results.selectedOptions.map((answer, index) => {
            const correctAnswer = questions[index]?.answer || 'N/A';
            return (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b text-center">
                  {answer !== null ? answer+1 : 'Not Answered'}
                </td>
                <td className="py-2 px-4 border-b text-center">{correctAnswer+1}</td>
                <td className="py-2 px-4 border-b text-center">
                  {answer === correctAnswer ? 'Correct' : 'Incorrect'}
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* <TableWrapper>
        <Table columns={columns} dataSource={results?.selectedOptions}/>
      </TableWrapper> */}
      </table>
    </>
  );
};

export default TestResults;
