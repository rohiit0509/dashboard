import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Space, Table } from 'antd';
import { TableWrapper } from '../../styles/table';

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
          const userAnswersRef = doc(
            db,
            'Tests',
            testId,
            'userAnswers',
            userId,
          );
          const userAnswersDoc = await getDoc(userAnswersRef);

          if (userAnswersDoc.exists()) {
            const data = userAnswersDoc.data();
            const totalQuestions = data.selectedOptions.length;
            const attemptedQuestions = data.selectedOptions.filter(
              (opt) => opt !== null,
            ).length;
            const correctAnswers = data.marks.reduce(
              (sum, mark) => sum + (mark === 1 ? 1 : 0),
              0,
            );

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

        const results = (await Promise.all(resultsPromises)).filter(
          (result) => result !== null,
        );
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
  const columns = [
    {
      title: 'Test Name	',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Total Questions',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
    },
    {
      title: 'Attempted Questions',
      dataIndex: 'attemptedQuestions',
      key: 'attemptedQuestions',
    },
    {
      title: 'Correct Answers',
      dataIndex: 'correctAnswers',
      key: 'correctAnswers',
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalMarks',
      key: 'totalMarks',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/test-results/${record.testId}`}>View More</Link>
        </Space>
      ),
    },
  ];
  return (
    <>
      <h2 className="text-3xl font-bold mb-4 text-center">All Test Results</h2>
      <TableWrapper>
        <Table columns={columns} dataSource={testResults}/>
      </TableWrapper>
    </>
  );
};

export default AllResults;
