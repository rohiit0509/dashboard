import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Flex } from 'antd';
import { AuthContext } from '../../helper/auth';
const ListTests = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Tests'));
        const testsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTests(testsList);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex vertical gap={80}>
      <div>
        <Breadcrumb pageName="Tests" textSize="md" />
        <div className="flex flex-col gap-3">
          {tests.map((test, idx) => (
            <div
              key={test.id}
              className="py-2 px-6 border-[#EDEDED] border-[1px] rounded-[10px] bg-white flex items-center"
            >
              <div className="flex justify-between items-center w-full text-[16px] text-[#A4A4A4]">
                <h2 className="text-[#2D3748] font-bold">
                  {idx + 1}. {test.testName}
                </h2>
                <p>Content: {test.numberOfQuestions}MCQ</p>
                <p className="flex items-center gap-[3px]">
                  Time:{' '}
                  <span className="text-[#2D3748] flex gap-[4px] items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                    >
                      <path
                        d="M16.9204 10.5C16.9204 14.6421 13.5617 18 9.41845 18C5.27524 18 1.9165 14.6421 1.9165 10.5C1.9165 6.35786 5.27524 3 9.41845 3C12.1952 3 14.6196 4.50824 15.9168 6.75M14.8624 11.323L16.7379 9.44805L18.6134 11.323M12.229 12.5451L9.4165 11.6076V7.6875"
                        stroke="#191919"
                        stroke-width="1.66667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    {test.timer}mins{' '}
                  </span>
                </p>
                <Link
                  to={`/take-test/${test.id}`}
                  className="inline-block px-5 py-2 bg-[#3D3D3D] hover:bg-[#C4ED2F] hover:text-[#2D3748] text-[12px] font-bold text-white rounded-[10px]"
                >
                  Take Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {currentUser?.role == 'user' && (
          <>
            <Breadcrumb pageName="Results" textSize="md" />
            <div className="flex flex-col gap-3">
              {tests.map((test, idx) => (
                <div
                  key={test.id}
                  className="py-2 px-6 border-[#EDEDED] border-[1px] rounded-[10px] bg-white flex items-center"
                >
                  <div className="flex justify-between items-center w-full text-[16px] text-[#A4A4A4]">
                    <h2 className="text-[#2D3748] font-bold">
                      {idx + 1}. {test.testName}
                    </h2>
                    <p>Content: {test.numberOfQuestions}MCQ</p>
                    <p className="flex items-center gap-[3px]">
                      Time:{' '}
                      <span className="text-[#2D3748] flex gap-[4px] items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="21"
                          viewBox="0 0 21 21"
                          fill="none"
                        >
                          <path
                            d="M16.9204 10.5C16.9204 14.6421 13.5617 18 9.41845 18C5.27524 18 1.9165 14.6421 1.9165 10.5C1.9165 6.35786 5.27524 3 9.41845 3C12.1952 3 14.6196 4.50824 15.9168 6.75M14.8624 11.323L16.7379 9.44805L18.6134 11.323M12.229 12.5451L9.4165 11.6076V7.6875"
                            stroke="#191919"
                            stroke-width="1.66667"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        {test.timer}mins{' '}
                      </span>
                    </p>
                    <Link
                      //  to={`/take-test/${test.id}`}
                      className="inline-block px-5 py-2 bg-[#3D3D3D] hover:bg-[#C4ED2F] hover:text-[#2D3748] text-[12px] font-bold text-white rounded-[10px]"
                    >
                      View Results
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Flex>
  );
};

export default ListTests;
