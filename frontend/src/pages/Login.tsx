import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { showToastError, showToastSuccess } from "../utils/showToast";
import { useQuery, useMutation, useQueryClient} from 'react-query'
import { getMeFn, loginUserFn, logoutUserFn } from "../api/AuthApi";
import { useStateContext } from "../context/StateContextProvider";
import { SlideVariant } from "../animations/variants";
import { motion } from "framer-motion"


type Errors = {
  username: string[];
  password: string[];
};

export type LoginInput = {
  username: string;
  password: string;
};

export default function Login() {
  const stateCTX = useStateContext() ;
  // const queryClient = useQueryClient()

  // const from = ((location.state as any)?.from.pathname as string) || '/';
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({
    username: [],
    password: [],
  });

  const query = useQuery(['authUser'], getMeFn, {
    enabled : false, 
    retry : 1, 
    onSuccess : (data : any) => {
      console.log(data)
      stateCTX.setState({authUser : data})
    },
  })

  const {
    mutate : LoginUser,
    isError,
    isLoading
  } = useMutation( (userData : LoginInput) => loginUserFn(userData), {
    onSuccess : (data) => {
      // query.refetch()
      showToastSuccess("logged in succesfully")
      navigate('/')
    }, 
    onError : (error)=> {
      if (Array.isArray((error as any).response.data)) {
        (error as any).response.data.forEach((el: any) =>
          showToastError(el.message)
        );
      } else {
        showToastError((error as any).response.data.Invalid)
      }
      setData(prevData  => ({...prevData, password : ""}))
    }
  })


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    LoginUser({username : data.username, password: data.password})
    
  }
  return (
    <motion.div 
      variants={SlideVariant}
      initial = "hide"
      animate = "animate"
      exit = "exit"
      className="w-[95%] md:w-[60%] m-auto mt-4">
      <div className="mt-[6rem] md:mt[10rem]">
        <p className="font-bold text-3xl text-center mb-3">Welcome Back <span className="text-violet-600">Soldier</span></p>
        <form className="text-lg w-full" onSubmit={handleSubmit}>
          <div className=" w-full">
            <input
              placeholder="username"
              required
              name="username"
              value={data.username}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  username: e.target.value,
                }))
              }
              className={`rounded-md border-1 ${isError ? "border-red-500" : "border-gray-500"} p-2 w-full`}
            />
            {errors?.username && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {errors.username.map((error, i) => (
                  <p key={i} className="mt-1">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="">
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  password: e.target.value,
                }))
              }
              className={`rounded-md border-1 ${isError ? "border-red-500" : "border-gray-500"} p-2 w-full`}
              placeholder="password"
              required
            />
            {errors?.password && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {errors.password.map((error, i) => (
                  <p key={i} className="mt-1">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end flex-col items-center">
            <p className="">
              Not one of us{" "}
              <Link to="/register" className="text-violet-400 cursor-pointer">
                  Sign Up
              </Link>
            </p>
            <button
              disabled={isLoading}
              type="submit"
              className="py-2 px-4 w-[6rem] h-[3rem] flex justify-center bg-violet-600 text-white rounded-lg mr-3 hover:bg-violet-700 transition-all delay-75"
            >
              {isLoading ? (
                <BounceLoader color="#fff" size={30} speedMultiplier={2} />
              ) : (
                <span>Log in</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
