import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  deleteField
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';
import Question from './Question';
import QuestionNavigation from './QuestionNavigation';
import Timer from './Timer';

const TakeTest = () => {
  const { testId } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = 'USER_ID'; // Replace with actual user ID

  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      setIsLoading(true);
      try {
        const testDoc = await getDoc(doc(db, 'Tests', testId));
        if (testDoc.exists()) {
          setTest(testDoc.data());
        } else {
          console.error('No such test document!');
        }

        const questionsCollection = collection(
          db,
          'Tests',
          testId,
          'Questions',
        );
        const querySnapshot = await getDocs(questionsCollection);
        const questions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizData(questions);
        setSelectedOptions(Array(questions.length).fill(null));
        setAttempted(Array(questions.length).fill(false));

        const userAnswersRef = doc(db, 'Tests', testId, 'userAnswers', userId);
        const userAnswersDoc = await getDoc(userAnswersRef);
        if (userAnswersDoc.exists()) {
          const userAnswersData = userAnswersDoc.data();
          setSelectedOptions(
            userAnswersData.selectedOptions ||
              Array(questions.length).fill(null),
          );
          setAttempted(
            userAnswersData.attempted || Array(questions.length).fill(false),
          );
        }
      } catch (error) {
        console.error('Error fetching test or questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestAndQuestions();
  }, [testId, userId]);

  useEffect(() => {
    // Function to enter fullscreen
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }
    };

    // Function to exit fullscreen
    const exitFullscreen = () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    };

    // Enter fullscreen on component mount
    enterFullscreen();

    // Exit fullscreen on component unmount
    return () => exitFullscreen();
  }, []);

  const handleNext = async () => {
    if (selectedOptions[currentQuestion] !== null) {
      await saveUserAnswer(currentQuestion, selectedOptions[currentQuestion]);
    }

    setAttempted((prevAttempted) => {
      const newAttempted = [...prevAttempted];
      newAttempted[currentQuestion] = true;
      return newAttempted;
    });

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleClear = async () => {
    // Clear the user's selected option for the current question
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = [...prevSelectedOptions];
      newSelectedOptions[currentQuestion] = null;
      return newSelectedOptions;
    });
  
    // Clear the user's answer from Firestore
    try {
      const testRef = doc(db, 'Tests', testId);
      const userAnswersRef = doc(testRef, 'userAnswers', userId);
      const userAnswersDoc = await getDoc(userAnswersRef);
  
      if (!userAnswersDoc.exists()) return;
  
      const userAnswersData = userAnswersDoc.data();
  
      const updatedSelectedOptions =
        userAnswersData.selectedOptions || Array(quizData.length).fill(null);
      const updatedAttempted =
        userAnswersData.attempted || Array(quizData.length).fill(false);
      const updatedMarks =
        userAnswersData.marks || Array(quizData.length).fill(0);
  
      updatedSelectedOptions[currentQuestion] = null;
      updatedAttempted[currentQuestion] = false;
      updatedMarks[currentQuestion] = 0;
  
      const totalMarks = updatedMarks.reduce((total, mark) => total + mark, 0);
  
      await setDoc(
        userAnswersRef,
        {
          selectedOptions: updatedSelectedOptions,
          attempted: updatedAttempted,
          marks: updatedMarks,
          totalMarks: totalMarks,
        },
        { merge: true }
      );
  
      const questionRef = doc(testRef, 'Questions', quizData[currentQuestion].id);
      await updateDoc(questionRef, {
        userAnswer: deleteField(),
      });
    } catch (error) {
      console.error('Error clearing user answer:', error);
    }
  };
  

  const handleSelectQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleOptionChange = async (index) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = [...prevSelectedOptions];
      newSelectedOptions[currentQuestion] = index;
      return newSelectedOptions;
    });

    await saveUserAnswer(currentQuestion, index);
  };

  const handleTimeUp = () => {
    saveQuizResults();
    setQuizEnded(true);
  };

  const handleFinish = () => {
    setQuizEnded(true);
    saveQuizResults();
  };

  const saveQuizResults = async () => {
    try {
      await setDoc(
        doc(db, 'Tests', testId, 'userAnswers', userId),
        {
          results: {
            selectedOptions,
            attempted,
            marks: Array(quizData.length).fill(0),
            totalMarks: 0,
            timestamp: new Date(),
          },
        },
        { merge: true },
      );
    } catch (error) {
      console.error('Error saving quiz results: ', error);
    }
  };

  const saveUserAnswer = async (questionIndex, userAnswer) => {
    try {
      const testRef = doc(db, 'Tests', testId);
      const userAnswersRef = doc(testRef, 'userAnswers', userId);
      const userAnswersDoc = await getDoc(userAnswersRef);

      let userAnswersData = {};
      if (userAnswersDoc.exists()) {
        userAnswersData = userAnswersDoc.data();
      }

      const questionRef = doc(testRef, 'Questions', quizData[questionIndex].id);
      await updateDoc(questionRef, {
        userAnswer: userAnswer,
      });

      const updatedSelectedOptions =
        userAnswersData.selectedOptions || Array(quizData.length).fill(null);
      const updatedAttempted =
        userAnswersData.attempted || Array(quizData.length).fill(false);
      const updatedMarks =
        userAnswersData.marks || Array(quizData.length).fill(0);

      updatedSelectedOptions[questionIndex] = userAnswer;
      updatedAttempted[questionIndex] = true;

      // Ensure correctAnswer is an array
      const correctAnswer = Array.isArray(quizData[questionIndex].answer)
        ? quizData[questionIndex].answer
        : [quizData[questionIndex].answer];

      const isCorrect = correctAnswer.includes(userAnswer);
      updatedMarks[questionIndex] = isCorrect ? 1 : 0;

      const totalMarks = updatedMarks.reduce((total, mark) => total + mark, 0);

      await setDoc(
        userAnswersRef,
        {
          selectedOptions: updatedSelectedOptions,
          attempted: updatedAttempted,
          marks: updatedMarks,
          totalMarks: totalMarks,
        },
        { merge: true },
      );
    } catch (error) {
      console.error('Error updating user answer:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (quizEnded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-3xl font-bold">The quiz has ended. Thank you!</h2>
      </div>
    );
  }

  if (quizData.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="flex gap-[18px] px-[5.3%] py-[4.79%]">
      <div className="w-[60.5%] text-[20px] px-[40px] py-[34px] border-[1.5px] border-[#EDEDED] shadow-md rounded-[10px]">
        <div className="flex w-full justify-between mb-[30px] items-center">
          <div className="flex gap-[6px] items-center">
            <span className="cursor-pointer" onClick={handlePrevious}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >
                <path
                  d="M6 18L4.93934 16.9393L3.87868 18L4.93934 19.0607L6 18ZM28.5 19.5C29.3284 19.5 30 18.8284 30 18C30 17.1716 29.3284 16.5 28.5 16.5V19.5ZM13.9393 7.93934L4.93934 16.9393L7.06066 19.0607L16.0607 10.0607L13.9393 7.93934ZM4.93934 19.0607L13.9393 28.0607L16.0607 25.9393L7.06066 16.9393L4.93934 19.0607ZM6 19.5H28.5V16.5H6V19.5Z"
                  fill="#A4A4A4"
                />
              </svg>
            </span>
            <span className="cursor-pointer" onClick={handleNext}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >
                <path
                  d="M30 18L31.0607 19.0607L32.1213 18L31.0607 16.9393L30 18ZM7.5 16.5C6.67157 16.5 6 17.1716 6 18C6 18.8284 6.67157 19.5 7.5 19.5V16.5ZM22.0607 28.0607L31.0607 19.0607L28.9393 16.9393L19.9393 25.9393L22.0607 28.0607ZM31.0607 16.9393L22.0607 7.93934L19.9393 10.0607L28.9393 19.0607L31.0607 16.9393ZM30 16.5L7.5 16.5V19.5L30 19.5V16.5Z"
                  fill="#A4A4A4"
                />
              </svg>
            </span>
          </div>
          {test && (
            <Timer initialTime={test.timer * 60} onTimeUp={handleTimeUp} />
          )}
        </div>
        <h2 className="font-semibold mb-[20px]">
          Question {currentQuestion + 1} of {quizData.length}
        </h2>
        <Question
          question={quizData[currentQuestion].questionText} // Adjusted field name
          options={quizData[currentQuestion].options}
          selectedOption={selectedOptions[currentQuestion]}
          onOptionChange={handleOptionChange}
        />

        <div className={`flex justify-between mt-[36px]`}>
          <button
            onClick={handleFinish}
            className={`px-[18px] py-[11px] bg-[#E95744] text-white text-[14px] rounded-lg ${
              currentQuestion === quizData.length - 1
                ? 'opacity-100'
                : 'opacity-45'
            }`}
          >
            Finish Test
          </button>
          <div className="flex gap-[13px]">
          <button
              onClick={handleClear}
              className="px-[18px] py-[11px] border-[1px] border-[#704FE4] text-[#704FE4] text-[14px] rounded-lg disabled:opacity-50 flex gap-[4px] items-center"
            >
              clear
            </button>
            <button
              onClick={handleSkip}
              disabled={currentQuestion === quizData.length - 1}
              className="px-[18px] py-[11px] border-[1px] border-[#704FE4] text-[#704FE4] text-[14px] rounded-lg disabled:opacity-50 flex gap-[4px] items-center"
            >
              Skip
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12.6668 2.56783V13.4322M4.29087 2.16712L9.66673 7.59929C9.88574 7.8206 9.88574 8.1794 9.66673 8.40071L4.29087 13.8329C3.93757 14.1899 3.3335 13.937 3.3335 13.4322L3.3335 2.56783C3.3335 2.06296 3.93757 1.81012 4.29087 2.16712Z"
                    stroke="#704FE4"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion === quizData.length - 1}
              className="px-[18px] py-[11px] bg-[#704FE4] text-white text-[14px] rounded-lg disabled:opacity-50 flex gap-[4px] items-center"
            >
              Next
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.14368 0.900864C6.54361 0.519978 7.17659 0.535416 7.55747 0.935347L11.7241 5.31035C12.092 5.69655 12.092 6.30345 11.7241 6.68966L7.55747 11.0647C7.17659 11.4646 6.54361 11.48 6.14368 11.0991C5.74375 10.7183 5.72831 10.0853 6.1092 9.68535L8.66667 7L1 7C0.447715 7 0 6.55229 0 6C0 5.44772 0.447715 5 1 5H8.66667L6.1092 2.31466C5.72831 1.91473 5.74375 1.28175 6.14368 0.900864Z"
                    fill="white"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
      <QuestionNavigation
        totalQuestions={quizData.length}
        currentQuestion={currentQuestion}
        onSelectQuestion={handleSelectQuestion}
        attempted={attempted}
      />
    </div>
  );
};

export default TakeTest;
