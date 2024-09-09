import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Space, Table } from 'antd';
import { TableWrapper } from '../../styles/table';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { AuthContext } from '../../helper/auth';
const AllResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const { userId, role } = currentUser;

  useEffect(() => {
    const fetchAllResults = async () => {
      setIsLoading(true);
      try {
        let testsQuery;

        if (role === 'admin') {
          testsQuery = query(
            collection(db, 'Tests'),
            where('authorId', '==', userId),
          );
        } else if (role === 'superAdmin') {
          testsQuery = collection(db, 'Tests');
        }

        const testsSnapshot = await getDocs(testsQuery);

        const resultsPromises = testsSnapshot.docs.map(async (testDoc) => {
          const testId = testDoc.id;

          const userAnswersRef = collection(db, 'Tests', testId, 'userAnswers');
          const userAnswersSnapshot = await getDocs(userAnswersRef);

          const usersResults = await Promise.all(
            userAnswersSnapshot.docs.map(async (userAnswerDoc) => {
              const userId = userAnswerDoc.id;

              const userDetailsRef = doc(db, 'userDetails', userId);
              const userDetailsDoc = await getDoc(userDetailsRef);

              const name = userDetailsDoc.exists()
                ? userDetailsDoc.data().name
                : 'Unknown User';

              const data = userAnswerDoc.data();
              const totalQuestions = data.selectedOptions.length;
              const attemptedQuestions = data.selectedOptions.filter(
                (opt) => opt !== null,
              ).length;
              const correctAnswers = data.marks.reduce(
                (sum, mark) => sum + (mark === 1 ? 1 : 0),
                0,
              );

              return {
                userDetails: { userId, name },
                testId,
                testName: testDoc.data().testName,
                totalQuestions,
                attemptedQuestions,
                correctAnswers,
                totalMarks: data.totalMarks,
              };
            }),
          );

          return usersResults;
        });

        const allResults = (await Promise.all(resultsPromises)).flat();
        setTestResults(allResults);
      } catch (error) {
        console.error('Error fetching all results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (role === 'admin' || role === 'superAdmin') {
      fetchAllResults();
    }
  }, [userId, role]);

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
      title: 'Attempted By	',
      dataIndex: 'userDetails',
      key: 'userDetails',
      render: (value) => <>{value.name ?? '--'}</>,
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
          <Link to={`/test-results/${record?.testId}/${record.userDetails.userId}`}>View More</Link>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Breadcrumb pageName="All Test Results" textSize="md" />
      <TableWrapper>
        <Table columns={columns} dataSource={testResults} tableLayout="fixed" />
      </TableWrapper>
    </>
  );
};

export default AllResults;
