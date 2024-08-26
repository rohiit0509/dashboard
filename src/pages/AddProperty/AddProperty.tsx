import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Controller, useForm } from 'react-hook-form';
import { app, db } from '../../firebase';
const AddProperty = () => {
  const { register, handleSubmit, control, setValue } = useForm<FormData>();

  const [selectedCountryOption, setSelectedCountryOption] = useState<string>('');
  const [selectedBedRoomsOption, setSelectedBedRoomsOption] = useState<string>('');
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<string>('');
  const [selectedBathroomOption, setSelectedBathroomOption] = useState<string>('');
  const [selectedTypeOption, setSelectedTypeOption] = useState<string>('');
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [progress, setProgress] = useState(0);

  const data1 = ["Buy", "Rent", "Sell", "Lease", "Short Let", "Share", "Other"];
  const data2 = ["Apartment", "House", "Villa", "Office", "Warehouse", "Plot","Other"];
  const data3 = ["Available", "Sold", "Rented", "Leased"];
  const changeTextColor = () => {
    setIsOptionSelected(true);
  };
  type FormData = {
    name: string;
    description: string;
    type: string;
    category: string;
    country: string;
    status: string;
    address: string;
    surface: string;
    price: string;
    bathrooms: string;
    bedrooms: string;
    year: string;
    file: FileList;
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${data.file[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, data.file[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(data.file[0].name);
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const propertyData = {
          prpertyId: uuidv4(),
          ...data,
          img: downloadURL,
          timestamp: serverTimestamp(),
        };
        delete propertyData.file;
        await addDoc(collection(db, "properties"), propertyData);
        setIsLoading(false);
      }
    );
  };
  return (
    <>
      <Breadcrumb pageName="Add Test" />

       <form>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
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
                    {...register('name', { required: true })}
                    type="text"
                    placeholder="Test Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {' '}
                    Number Of Questions
                  </label>

                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <input
                    {...register('bedrooms')}
                    type="text"
                    placeholder="Number Of Questions"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading} // Disable the button while loading
            className={`inline-flex items-center justify-center rounded-md py-4 px-10 text-center font-medium ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
              } lg:px-8 xl:px-10`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <p className='text-white'>Submit</p>

            )}
          </button>
        </div> 
      </form>

      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9"> */}
            {/* <!-- Input Fields --> */}
            {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Property Details
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Property Name
                  </label>
                  <input
                    {...register('name', { required: true })}
                    type="text"
                    placeholder="Property Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Select City
                  </label>

                  <div className="relative z-20 bg-white dark:bg-form-input">
                 
                    <input
                    {...register('country', { required: true })}
                    type="text"
                    placeholder="City Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
              

                  
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {' '}
                    Number Of Bedrooms
                  </label>

                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <input
                    {...register('bedrooms')}
                    type="text"
                    placeholder="Number Of Bedrooms"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
               

                
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {' '}
                    Number Of Bathroom
                  </label>

                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <input
                    {...register('bathrooms')}
                    type="text"
                    placeholder="Number Of Bedrooms"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
        

                 
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Property Price
                  </label>
                  <input
                    {...register('price', { required: true })}
                    type="number"
                    placeholder="Active Input"
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>


                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Attach file
                  </label>
                  <Controller
                    name="file"
                    control={control}
                    defaultValue={undefined}
                    render={({ }) => (
                      <input
                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        type="file"
                        onChange={(e) => {

                          if (e.target.files) {
                            setValue('file', e.target.files);
                          }
                          setProgress(0);
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Property Address
                  </label>
                  <textarea
                    {...register('address', { required: true })}
                    rows={3}
                    placeholder="Property Address"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

              <div className="flex flex-col gap-5.5 p-6.5">

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Property Discription
                  </label>
                  <textarea
                    {...register('description', { required: true })}
                    rows={6}
                    placeholder=" Property Discription"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
                {/* property type */}

                {/* <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {' '}
                    Property Type
                  </label>

                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <input
                    {...register('type', { required: true })}
                    type="text"
                    placeholder="Number Of Bedrooms"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
            

                
                  </div>
                </div> */}

                {/* property catagory */}
                {/* <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {' '}
                    Property Catagory
                  </label>

                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <input
                    {...register('category', { required: true })}
                    type="text"
                    placeholder="Number Of Bedrooms"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
              

                   
                  </div>
                </div> */}

                {/* property Status */}
                {/* <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {' '}
                    Property Status
                  </label>

                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <input
                    {...register('status', { required: true })}
                    type="text"
                    placeholder="Number Of Bedrooms"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                 

                  </div>
                </div> */}

                {/* property Area */}
                {/* <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Property Area
                  </label>
                  <input
                    {...register('surface', { required: true })}
                    type="text"
                    placeholder="Property Area"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div> */}

                {/* property Address */}


              {/* </div>
            </div>


          </div>
          <button
            type="submit"
            disabled={isLoading} // Disable the button while loading
            className={`inline-flex items-center justify-center rounded-md py-4 px-10 text-center font-medium ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
              } lg:px-8 xl:px-10`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <p className='text-white'>Submit</p>

            )}
          </button>
        </div>
      </form> */}
    </>
  );
};

export default AddProperty;
