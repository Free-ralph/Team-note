import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { showToastSuccess } from "../utils/showToast";
import { signUpUserFn } from "../api/AuthApi";
import { useStateContext } from "../context/StateContextProvider";
import { motion } from "framer-motion";
import { SlideVariant } from "../animations/variants";

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};
type ErrorType = {
  username: string[];
  email: string[];
  password: string[];
};

export default function Register() {
  const stateCTX = useStateContext();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState<ErrorType>({
    username: [],
    email: [],
    password: [],
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const { mutate: SignUp, isLoading } = useMutation(
    (userData: RegisterInput) => signUpUserFn(userData),
    {
      onSuccess(data) {
        showToastSuccess("welcome to the team, Soldier!");
        navigate("/build-profile");
      },
      onError(error: any) {
        setErrors(error.response.data);
      },
    }
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (data.username && data.email && data.password) {
      SignUp({ ...data });
    }
  }

  function validatePassword(e: ChangeEvent<HTMLInputElement>) {
    if (data.password !== e.target.value) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  }

  return (
    <div className="w-[95%] md:w-[60%] m-auto mt-4">
      <motion.div
        variants={SlideVariant}
        initial="hide"
        animate="animate"
        exit="exit"
        className="mt-[6rem] md:mt[10rem]"
      >
        <p className="font-bold text-3xl text-center mb-3">Join Us</p>
        <form className="text-lg w-full" onSubmit={handleSubmit}>
          <div className=" w-full">
            <input
              placeholder="username"
              name="username"
              required
              value={data.username}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  [e.target.name]: e.target.value,
                }))
              }
              className="rounded-md border-1 border-gray-500 p-2 w-full"
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
              type="email"
              value={data.email}
              name="email"
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  [e.target.name]: e.target.value,
                }))
              }
              className="w-full rounded-md border-1 border-gray-500 p-2"
              placeholder="email"
              required
            />
            {errors?.email && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {errors.email.map((error, i) => (
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
              value={data.password}
              name="password"
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  [e.target.name]: e.target.value,
                }))
              }
              className="w-full rounded-md border-1 border-gray-500 p-2"
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
          <div className="">
            <input
              type="password"
              value={data.password2}
              name="password2"
              className={`w-full rounded-md border-1 p-2 ${
                isDisabled ? "border-red-500" : "border-gray-500"
              }`}
              placeholder="retype password"
              onChange={validatePassword}
              required
            />
            {isDisabled && (
              <p className="text-sm text-red-500 p-1 ml-2">
                passwords don't match
              </p>
            )}
          </div>
          <div className="flex justify-end flex-col items-center">
            <p className="">
              already one of us{" "}
              <Link to="/login" className="text-violet-400 cursor-pointer">
                log in
              </Link>
            </p>
            <button
              disabled={isLoading || isDisabled}
              type="submit"
              className="py-2 px-4 w-[6rem] h-[3rem] flex justify-center bg-violet-600 text-white rounded-lg mr-3 hover:bg-violet-700 transition-all delay-75"
            >
              {isLoading ? (
                <BounceLoader color="#fff" size={30} speedMultiplier={2} />
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
