// import { useEffect } from "react";
// import refreshToken from "./refreshToken";
// // import { axiosPrivate } from '../api/axiosApi';
// import { getAuthTokens } from "../api/AuthApi";
// import axios, { AxiosError, AxiosRequestConfig } from "axios";
// import { axiosPrivate } from "../api/axiosApi";
// declare module "axios" {
//   export interface AxiosRequestConfig {
//     _retry?: boolean;
//   }
// }

// export default function useAxiosPrivate() {
//   const auth = getAuthTokens();
//   const refresh = refreshToken();

//   useEffect(() => {
//     const responseInterceptor = axiosPrivate.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError) => {
//         const status = error?.response?.status;
//         const originalRequest = error.config;
//         if (
//           originalRequest &&
//           (status === 401 || status === 403) &&
//           !originalRequest._retry
//         ) {
//           originalRequest!._retry = true;
//           const newToken = refresh();
//           return axiosPrivate(originalRequest);
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => axiosPrivate.interceptors.response.eject(responseInterceptor);
//   }, []);

//   return axiosPrivate;
// }

export function raxios (){
  
}
