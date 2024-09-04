import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'antd';
import { AuthContext } from '../../helper/auth';

const AddTest = () => {
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    getValues,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(0);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('testForm'));
    if (savedData) {
      reset(savedData.formData);
      setQuestions(savedData.questions);
      setNumQuestions(savedData.numQuestions || 0);
    }
  }, [reset]);

  useEffect(() => {
    const formData = getValues();
    localStorage.setItem(
      'testForm',
      JSON.stringify({
        formData,
        questions,
        numQuestions,
      }),
    );
  }, [questions, numQuestions, getValues]);

  const uploadFile = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `files/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
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
        },
      );
    });
  };

  const validateQuestions = () => {
    let valid = true;
    questions.forEach((question, index) => {
      if (!question.questionText.trim()) {
        setError(`questions.${index}`, {
          type: 'manual',
          message: 'Question text is required.',
        });
        valid = false;
      }

      question.options.forEach((option, optionIndex) => {
        if (!option.trim() && !question.optionImages[optionIndex]) {
          setError(`questions.${index}.options.${optionIndex}`, {
            type: 'manual',
            message: 'Either text or image is required for each option.',
          });
          valid = false;
        }
      });

      if (question.answer < 0 || question.answer > 4) {
        setError(`questions.${index}.answer`, {
          type: 'manual',
          message: 'Something went wrong',
        });
        valid = false;
      }
    });
    return valid;
  };

  const onSubmit = async (formData) => {
    if (!validateQuestions()) {
      return;
    }

    setIsLoading(true);

    try {
      const testRef = await addDoc(collection(db, 'Tests'), {
        testName: formData.testName,
        timer: Number(formData.timer),
        numberOfQuestions: Number(formData.numberOfQuestions),
        createdAt: new Date(),
        authorId: currentUser?.userId,
      });

      console.log('Test Document written with ID: ', testRef.id);

      const questionsCollectionRef = collection(testRef, 'Questions');

      await Promise.all(
        questions.map(async (question, index) => {
          const optionsWithImages = await Promise.all(
            question.options.map(async (option, optionIndex) => {
              let imageUrl = question.optionImages[optionIndex];
              if (imageUrl instanceof File) {
                imageUrl = await uploadFile(imageUrl);
              }
              return {
                text: option,
                image: imageUrl || null,
              };
            }),
          );

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
          });
          console.log(`Question ${index + 1} added`);
        }),
      );

      localStorage.removeItem('testForm');

      reset();
      setQuestions([]);
      setNumQuestions(0);
      toast.success('Test Added');
    } catch (error) {
      console.error('Error adding document: ', error);
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
        optionImages: ['', '', '', ''],
        answer: '',
        userAnswer: '',
      }));
      setQuestions(initialQuestions);
    } else {
      setNumQuestions(0);
      setQuestions([]);
    }
  };

  const handleClearQuestions = () => {
    const clearedQuestions = questions.map(() => ({
      questionText: '',
      questionImage: '',
      options: ['', '', '', ''],
      optionImages: ['', '', '', ''],
      answer: '',
      userAnswer: '',
    }));
    setQuestions(clearedQuestions);
    localStorage.setItem(
      'testForm',
      JSON.stringify({
        formData: getValues(),
        questions: clearedQuestions,
        numQuestions,
      }),
    );
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
    clearErrors(`questions.${index}`);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
    clearErrors(`questions.${index}.options.${optionIndex}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
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
                    {...register('timer', {
                      required: true,
                      valueAsNumber: true,
                      min: 1,
                    })}
                    type="number"
                    min="1"
                    placeholder="Timer"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Number of Questions
                  </label>
                  <input
                    {...register('numberOfQuestions', {
                      required: true,
                      valueAsNumber: true,
                      min: 1,
                    })}
                    type="number"
                    min="1"
                    value={numQuestions}
                    onChange={handleNumQuestionsChange}
                    placeholder="Number of Questions"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            {questions.map((question, index) => (
              <div
                key={index}
                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
              >
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
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          'questionText',
                          e.target.value,
                        )
                      }
                      placeholder="Enter Question"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors?.questions?.[index]?.questionText && (
                      <p className="text-danger">
                        {errors.questions[index].questionText.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Question Image (Optional)
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          'questionImage',
                          e.target.files[0],
                        )
                      }
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {question.questionImage &&
                      typeof question.questionImage !== 'string' && (
                        <p>{question.questionImage.name}</p>
                      )}
                  </div>

                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-3 mb-3"
                      >
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              optionIndex,
                              e.target.value,
                            )
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <input
                          type="file"
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].optionImages[optionIndex] =
                              e.target.files[0];
                            setQuestions(updatedQuestions);
                          }}
                          className="w-1/3 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {question.optionImages[optionIndex] &&
                          typeof question.optionImages[optionIndex] !==
                            'string' && (
                            <p>{question.optionImages[optionIndex].name}</p>
                          )}
                        {errors?.questions?.[index]?.options?.[optionIndex] && (
                          <p className="text-danger">
                            {
                              errors.questions[index].options[optionIndex]
                                .message
                            }
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Correct Answer
                    </label>
                    <select
                      value={question.answer}
                      onChange={(e) =>
                        handleQuestionChange(index, 'answer', e.target.value)
                      }
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="" disabled>
                        Select correct option
                      </option>
                      {question.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={optionIndex}>
                          Option {optionIndex + 1}
                        </option>
                      ))}
                    </select>
                    {errors?.questions?.[index]?.answer && (
                      <p className="text-danger">
                        {errors.questions[index].answer.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 flex gap-5">
              <Button type="primary" htmlType="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Test'}
              </Button>
              <Button type="default" onClick={handleClearQuestions}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default AddTest;
