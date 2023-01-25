import { Outlet, Navigate } from "react-router-dom";
import { getMeFn } from "../api/AuthApi";
import { useQuery } from "react-query";
import { useStateContext } from "../context/StateContextProvider";
import { toast } from "react-toastify";
import { IUser } from "../types/types";
import { BounceLoader } from "react-spinners";

function ProtectedRouteMiddleware() {
  const stateCTX = useStateContext();
  function showToastError(message: string) {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  const {
    data: user,
    isLoading,
    isSuccess,
    isFetching,
  } = useQuery(["authUser"], getMeFn, {
    onSuccess: (data: IUser) => {
      stateCTX.setState({ authUser: data });
    },
  });
  const loading = isFetching || isLoading;

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <BounceLoader color="#7c3aed" size={60} speedMultiplier={2} />
      </div>
    );
  }

  if (!loading && !user){
    return <Navigate to = "/login" />
  }else{
    return <Outlet />;
  }
}

export default ProtectedRouteMiddleware;
