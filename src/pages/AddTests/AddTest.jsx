import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const AddTest = () => {
  const { handleSubmit, register, setError, clearErrors, formState: { errors }, reset, getValues } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(0);

  useEffect(() => {
    // Load saved data from localStorage on component mount
    const savedData = JSON.parse(localStorage.getItem('testForm'));
    if (savedData) {
      reset(savedData.formData);
      setQuestions(savedData.questions);
      setNumQuestions(savedData.numQuestions || 0); // Ensure numQuestions is set correctly
    }
  }, [reset]);

  useEffect(() => {
    // Save data to localStorage on form change
    const formData = getValues();
    localStorage.setItem('testForm', JSON.stringify({
      formData,
      questions,
      numQuestions,
    }));
  }, [questions, numQuestions, getValues]);

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

      if (question.answer < 1 || question.answer > 4) {
        setError(`questions.${index}.answer`, {
          type: 'manual',
          message: 'Answer must be between 1 and 4.',
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

      // Clear the local storage after successful submission
      localStorage.removeItem('testForm');

      // Reset the form
      reset();
      setQuestions([]);
      setNumQuestions(0);

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
                    {...register('timer', { required: true, valueAsNumber: true, min: 1 })}
                    type="number"
                    min="1"
                    placeholder="Timer"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.timer && <p className="text-red-500">Timer must be a positive number.</p>}
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
                  {errors.numberOfQuestions && <p className="text-red-500">Number of questions must be a positive number.</p>}
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
                          onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.questions && errors.questions[index] && (
                          <p className="text-red-500">{errors.questions[index].message}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          Question Image
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleQuestionChange(index, 'questionImage', e.target.files[0])}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-3">
                          <label className="block text-black dark:text-white">
                            Option {optionIndex + 1}
                          </label>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                          {errors.questions && errors.questions[index] && errors.questions[index].options && errors.questions[index].options[optionIndex] && (
                            <p className="text-red-500">{errors.questions[index].options[optionIndex].message}</p>
                          )}
                          <input
                            type="file"
                            onChange={(e) => handleOptionChange(index, optionIndex, e.target.files[0])}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mt-2"
                          />
                        </div>
                      ))}

                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          Correct Answer
                        </label>
                        <select
                          value={question.answer}
                          onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option value="">Select Answer</option>
                          <option value="1">Option 1</option>
                          <option value="2">Option 2</option>
                          <option value="3">Option 3</option>
                          <option value="4">Option 4</option>
                        </select>
                        {errors.questions && errors.questions[index] && errors.questions[index].answer && (
                          <p className="text-red-500">{errors.questions[index].answer.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-3 text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark focus:ring-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddTest;
