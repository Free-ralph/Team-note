import {
  IUser,
  AuthTokens,
  ILoginResponse,
  GenericResponse,
  IUserResponse,
} from "../types/types";
import { RegisterInput } from "../pages/Register";
import { LoginInput } from "../pages/Login";
import axios from "axios";
import Cookies from 'js-cookie';
// import axiosApi from "./axiosApi";

const BASE_URL = "http://127.0.0.1:8000/api";
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
const crsf_token = Cookies.get('csrftoken')

axiosPrivate.defaults.headers.common["Content-Type"] = "application/json";
axiosPrivate.defaults.headers.common["X-CSRFToken"] = crsf_token ;

export const refreshAccessTokenFn = async (originalRequest: any) => {
  const response = await axiosPrivate.post("/auth/refresh",);
  return response.data;
};


axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // I customised the error message returned by the server to make "error.response.data.isUnauthorized" True
    // I did this because i was caught in a loop averytime i use the error status instead
    if ((error.response.data.isUnauthorized) && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn(originalRequest);
      return axiosPrivate(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await axiosPrivate.post<GenericResponse>(
    "auth/register",
    user
  );
  return response.data;
};

export const loginUserFn = async (user: LoginInput) => {
  const response = await axiosPrivate.post("auth/login", user);
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await axiosPrivate.get("auth/logout");
  return response.data;
};

export const getMeFn = async () => {
  const response = await axiosPrivate.get("auth/user");
  return response.data;
};

export const updateProfileFn = async () => {
  const response = await axiosPrivate.get("auth/profile");
  return response.data;
}

export const updateProfileImageFn = async (image : File) => {
  const response = await axiosPrivate.post("auth/profile/image", {image : image});
  return response.data;
}

export const getStacksFn = async () => {
  const response = await axiosPrivate.get("auth/profile/stacks");
  return response.data;
}
