import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InboxIcon from "@mui/icons-material/Inbox";
import ArchiveIcon from "@mui/icons-material/Archive";
import StarsIcon from "@mui/icons-material/Stars";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "react-query";
import { logoutUserFn } from "../api/AuthApi";
import { toast } from "react-toastify";
import { Drawer } from "@mui/material";

type sideBarProps = {
  handleOpenTagModal: () => void;
  handleOpenTeamModal: () => void;
  toggleSideBar: () => void;
  openSidebar: boolean;
};

export default function SideBar({
  handleOpenTagModal,
  handleOpenTeamModal,
  toggleSideBar,
  openSidebar,
}: sideBarProps) {
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
  // determines when the regular sidebar becomes a drawer
  const [isDrawer, setIsDrawer] = useState(false);
  const { mutate: LogoutUser, isLoading } = useMutation(
    async () => await logoutUserFn(),
    {
      onSuccess: (data) => {
        window.location.href = "/login";
      },
      onError: (error: any) => {
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach((el: any) => {
            showToastError(el.message);
          });
        }
      },
    }
  );

  const options = [
    {
      label: "Inbox",
      link: "/inbox",
      icon: <InboxIcon />,
    },

    {
      label: "Archive",
      link: "/archive",
      icon: <ArchiveIcon />,
    },

    {
      label: "starred",
      link: "/favourites",
      icon: <StarsIcon />,
    },
    {
      label: "Trash",
      link: "/trash",
      icon: <DeleteIcon />,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsDrawer(false);
      } else {
        setIsDrawer(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDrawer ? (
    <Drawer anchor="left" open={openSidebar} onClose={toggleSideBar}>
      <div className="w-full bg-primary h-full text-gray-600 rounded-lg rounded-tr-[4rem]">
        <div className="h-[4rem] flex items-center  ml-3">
          <p className="font-bold text-lg">
            My{" "}
            <Link
              to={"/"}
              className="text-violet-800 text-2xl hover:text-violet-500"
            >
              Notes
            </Link>
          </p>
        </div>
        <div className="p-3">
          <div className="flex flex-col gap-5 text-gray-700 ml-1">
            {options.map((option, i) => (
              <Link to={option.link} key={i}>
                <span className="mr-1">{option.icon}</span> {option.label}
              </Link>
            ))}
          </div>
          <div className="p-3 flex justify-center">
            <div
              onClick={handleOpenTeamModal}
              className="font-bold py-2 px-4 bg-violet-700 border-2 border-gray-400 border-r-0 text-white rounded-l-md hover:bg-violet-800 transition-all delay-75 cursor-pointer"
            >
              Teams
            </div>
            <div
              onClick={handleOpenTagModal}
              className="py-2 px-4 rounded-r-md border-2 border-l-0 border-gray-400 hover:bg-gray-200 transition-all delay-75 cursor-pointer"
            >
              Tags
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  ) : (
    <div className="w-full bg-primary h-full text-gray-600 rounded-lg rounded-tr-[4rem]">
      <div className="h-[4rem] flex items-center  ml-3">
        <p className="font-bold text-lg">
          My{" "}
          <Link
            to={"/"}
            className="text-violet-800 text-2xl hover:text-violet-500"
          >
            Notes
          </Link>
        </p>
      </div>
      <div className="p-3">
        <div className="flex flex-col gap-5 text-gray-700 ml-1">
          {options.map((option, i) => (
            <Link to={option.link} key={i}>
              <span className="mr-1">{option.icon}</span> {option.label}
            </Link>
          ))}
        </div>
        <div className="p-3 flex justify-center">
          <div
            onClick={handleOpenTeamModal}
            className="font-bold py-2 px-4 bg-violet-700 border-2 border-gray-400 border-r-0 text-white rounded-l-md hover:bg-violet-800 transition-all delay-75 cursor-pointer"
          >
            Teams
          </div>
          <div
            onClick={handleOpenTagModal}
            className="py-2 px-4 rounded-r-md border-2 border-l-0 border-gray-400 hover:bg-gray-200 transition-all delay-75 cursor-pointer"
          >
            Tags
          </div>
        </div>
      </div>
    </div>
  );
}
