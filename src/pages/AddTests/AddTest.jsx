import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Controller, useForm } from 'react-hook-form';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from '../../firebase';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const AddTest = () => {
  const { handleSubmit, register } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(0);

  const uploadFile = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `files/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Optional: Track upload progress here if needed
        }, 
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // Add main test details to Firestore
      const testRef = await addDoc(collection(db, 'Tests'), {
        testName: formData.testName,
        timer: Number(formData.timer), // Ensure the timer is saved as a number
        numberOfQuestions: Number(formData.numberOfQuestions),
        createdAt: new Date(),
      });

      console.log('Test Document written with ID: ', testRef.id);

      // Create a "Questions" collection inside the test document
      const questionsCollectionRef = collection(testRef, 'Questions');

      // Add questions to the "Questions" collection
      await Promise.all(
        questions.map(async (question, index) => {
          // Prepare option objects with images
          const optionsWithImages = await Promise.all(question.options.map(async (option, optionIndex) => {
            let imageUrl = question.optionImages[optionIndex];
            if (imageUrl instanceof File) {
              imageUrl = await uploadFile(imageUrl);
            }
            return {
              text: option,
              image: imageUrl || null,
            };
          }));

          let questionImageUrl = question.questionImage;
          if (questionImageUrl instanceof File) {
            questionImageUrl = await uploadFile(questionImageUrl);
          }

          await addDoc(questionsCollectionRef, {
            questionText: question.questionText,
            questionImage: questionImageUrl || null,
            options: optionsWithImages,
            answer: parseInt(question.answer),
            userAnswer: parseInt(question.userAnswer),
            // Add more fields as needed
          });
          console.log(`Question ${index + 1} added`);
        })
      );

      // Reload the page after successful submission
      window.location.reload();

    } catch (error) {
      console.error('Error adding document: ', error);
      // Handle error: Display an error message or alert
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumQuestionsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      setNumQuestions(num);
      const initialQuestions = Array.from({ length: num }, () => ({
        questionText: '',
        questionImage: '',
        options: ['', '', '', ''],
        optionImages: ['', '', '', ''], // New array for option images
        answer: '',
        userAnswer: '',
      }));
      setQuestions(initialQuestions);
    } else {
      setNumQuestions(0);
      setQuestions([]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Test Details
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Test Name
                  </label>
                  <input
                    {...register('testName', { required: true })}
                    type="text"
                    placeholder="Test Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Timer (in minutes)
                  </label>
                  <input
                    {...register('timer', { required: true, valueAsNumber: true })}
                    type="number"
                    placeholder="Timer"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Number of Questions
                  </label>
                  <input
                    {...register('numberOfQuestions', { required: true, valueAsNumber: true })}
                    type="number"
                    value={numQuestions}
                    onChange={handleNumQuestionsChange}
                    min="1"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {questions.map((question, index) => (
                  <div key={index} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        Question {index + 1}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={question.questionText}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].questionText = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          Question Image
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const updatedQuestions = [...questions];
                              updatedQuestions[index].questionImage = file;
                              setQuestions(updatedQuestions);
                            }
                          }}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          Options
                        </label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2 mb-3">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].options[optionIndex] = e.target.value;
                                setQuestions(updatedQuestions);
                              }}
                              className="flex-1 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            <input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[index].optionImages[optionIndex] = file;
                                  setQuestions(updatedQuestions);
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          Answer
                        </label>
                        <input
                          type="number"
                          value={question.answer}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].answer = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          User Answer
                        </label>
                        <input
                          type="number"
                          value={question.userAnswer}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].userAnswer = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || numQuestions === 0} // Disable if no questions specified
            className={`inline-flex items-center justify-center rounded-md py-4 px-10 text-center font-medium ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
              } lg:px-8 xl:px-10`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <p className='text-white'>Add Test</p>
            )}
          </button>
        </div> 
      </form>
    </>
  );
};

export default AddTest;
