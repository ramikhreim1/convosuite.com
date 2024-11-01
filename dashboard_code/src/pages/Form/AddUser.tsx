import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { inject } from 'mobx-react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppStore } from '../../store/AppStore';
import Breadcrumb from '../../components/Breadcrumb';
import { Category } from '../../types/common';


const schema = yup.object().shape({
  fname: yup.string().required('First name is required'),
  lname: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().required('Role is required'),
});

type AddUserFormType = yup.InferType<typeof schema>;

interface AddUserFormPropType {
  store?: AppStore
}

const FormLayout: React.FC<AddUserFormPropType> = inject("store")(({ store }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categaories, setCategaories] = useState<Category[]>([])
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddUserFormType>({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await store?.api.get("/category");
      if (response?.data)
        setCategaories(response.data)
    } catch { }
  }

  const onSubmit = async (data: AddUserFormType) => {
    setIsSubmitting(true)
    const result = await store?.users.addUser(data);
    setIsSubmitting(false)
    if (result?.success == true) {
      reset()
      return toast.success(result?.message)
    } else if (result?.success == false)
      toast.error(result?.message)
  };

  return (
    <>
      <Breadcrumb pageName="Add User" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
        <div className=""></div>
        <div className="flex flex-col gap-9">
          {/* <!-- User add Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add a new user
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label htmlFor='fname' className="mb-2.5 block text-black dark:text-white">
                      First name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      {...register("fname")}
                      id='fname'
                      type="text"
                      placeholder="Enter first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.fname ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                      {errors.fname.message}
                    </span> : ""}
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label htmlFor='lname' className="mb-2.5 block text-black dark:text-white">
                      Last name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      id='lname'
                      {...register("lname")}
                      placeholder="Enter last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.lname ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                      {errors.lname.message}
                    </span> : ""}
                  </div>
                </div>

                <div className="mb-4.5">
                  <label htmlFor='email' className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    id='email'
                    placeholder="Enter email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors.email ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    {errors.email.message}
                  </span> : ""}
                </div>

                <div className="mb-4.5">
                  <label htmlFor='role' className="mb-2.5 block text-black dark:text-white">
                    Role <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select {...register("role")} id='role' className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'>
                      <option className='capitalize' value="">Select a Role</option>
                      {categaories.map((category) => (
                        <option className='capitalize' value={category.name}>{category.name}</option>
                      ))}

                    </select>
                    {/* <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span> */}
                  </div>
                  {errors.role ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    {errors.role.message}
                  </span> : ""}
                </div>
                <button disabled={isSubmitting} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  {isSubmitting ? "Adding" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
});

export default FormLayout;
