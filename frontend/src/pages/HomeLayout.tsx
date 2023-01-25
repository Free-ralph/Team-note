import Navbar from "../components/Navbar";
import { useReducer, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import AddIcon from "@mui/icons-material/Add";
import { useStateContext } from "../context/StateContextProvider";
import { Tag } from "../types/types";
import DeleteIcon from "@mui/icons-material/Delete";
import { logoutUserFn } from "../api/AuthApi";
import { useQuery } from "react-query";
import { showToastSuccess, showToastError } from "../utils/showToast";

type TeamModelProps = {
  handleCloseModal: () => void;
  openModal: boolean;
};
type ConfirmModalProps = {
  handleCloseModal: () => void;
  Logout: () => void;
  openModal: boolean;
};

type LayoutStateType = {
  openTagsModal: boolean;
  openTeamModal: boolean;
  openSidebar: boolean;
  openConfirmModal: boolean;
};

type TagModelProps = {
  handleCloseModal: () => void;
  openModal: boolean;
  availableTags: Tag[];
  onDeleteTag: (id: string | null) => void;
  onUpdateTag: (id: string | null, label: string) => void;
};

export default function HomeLayout() {
  const { state, profileQuery } = useStateContext();
  
  const navigate = useNavigate();
  const initialState: LayoutStateType = {
    openTagsModal: false,
    openTeamModal: false,
    openSidebar: false,
    openConfirmModal: false,
  };
  const [layoutState, updateLayoutState] = useReducer(
    (prevState: LayoutStateType, newState: Partial<LayoutStateType>) => {
      return {
        ...prevState,
        ...newState,
      };
    },
    initialState
  );


  const query = useQuery(["authUser"], logoutUserFn, {
    enabled: false,
    retry: 1,
  });
  
  useEffect(() => {
    profileQuery.refetch()
  }, []);


  function Logout() {
    query.refetch();
    if(query.isSuccess){
      showToastSuccess("we await your return, Soldier");
      navigate("/login");
    }else{
      showToastError("something is wrong, it's not you, it's us");
    }
  }

  function toggleSideBar() {
    updateLayoutState({ openSidebar: !layoutState.openSidebar });
  }
  function handleTagsCloseModal() {
    updateLayoutState({ openTagsModal: false });
  }

  function handleOpenTagsModal(): void {
    updateLayoutState({ openTagsModal: true });
  }
  function handleCloseConfirmModal() {
    updateLayoutState({ openConfirmModal: false });
  }

  function handleOpenConfirmModal(): void {
    updateLayoutState({ openConfirmModal: true });
  }

  function handleOpenTeamModal() {
    updateLayoutState({ openTeamModal: true });
  }

  function handleCloseTeamModal() {
    updateLayoutState({ openTeamModal: false });
  }

  function handleUpdateTag() {}
  function handleDeleteTag() {}

  return (
    <div className="h-full">
      {/* <div className="hidden md:block col-span-2 h-full">
        <SideBar
          handleOpenTagModal={handleOpenTagsModal}
          handleOpenTeamModal={handleOpenTeamModal}
        />
      </div> */}
      <div className="h-full">
        <div className="grid grid-cols-12 bg-violet-500 ">
          <div className="hidden lg:block col-span-2 relative">
            <div className="absolute w-full h-screen ">
              <SideBar
                handleOpenTagModal={handleOpenTagsModal}
                handleOpenTeamModal={handleOpenTeamModal}
                toggleSideBar={toggleSideBar}
                openSidebar={layoutState.openSidebar}
              />
            </div>
          </div>
          <div className="lg:col-span-10 col-span-12">
            <Navbar
              toggleSideBar={toggleSideBar}
              handleOpenTeamModal={handleOpenTeamModal}
              handleOpenConfirmModal={handleOpenConfirmModal}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 h-full mt-1 ml-2 grid-rows-1">
          <div className="sidebar-space hidden lg:block col-span-2 "></div>
          <div className="lg:col-span-10 col-span-12 h-full  ">
            <Outlet />
          </div>
        </div>
      </div>
      <TeamModal
        openModal={layoutState.openTeamModal}
        handleCloseModal={handleCloseTeamModal}
      />
      <ConfirmLogoutModal
        openModal={layoutState.openConfirmModal}
        handleCloseModal={handleCloseConfirmModal}
        Logout={Logout}
      />
      <TagModel
        openModal={layoutState.openTagsModal}
        handleCloseModal={handleTagsCloseModal}
        availableTags={state.availableTags}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
}

function TeamModal({ openModal, handleCloseModal }: TeamModelProps) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          <div className="w-screen h-screen flex items-center justify-center ">
            <div
              className={`p-2 lg:p-4 w-[97%] md:w-[70%] lg:w-[50%] h-[70%] overflow-auto rounded-md bg-secondary border-primary border-1 relative`}
            >
              <div className="mb-3 flex justify-between sticky top-0 bg-secondary py-2">
                <p className="font-semibold text-2xl">Teams</p>
                <div
                  onClick={handleCloseModal}
                  className="text-purple-600 mr-2 cursor-pointer"
                >
                  <DisabledByDefaultIcon />
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500 text-2xl font-bold text-center mt-5">
                  You aren't part of any Team, <br />
                  <Link
                    to="/new-team"
                    className="text-violet-500 cursor-pointer hover:text-violet-600 delay-75 transition-all"
                  >
                    Build one
                  </Link>
                </p>
              </div>
              <Link
                to="/new-team"
                className="absolute bottom-4 right-4 bg-violet-500 text-white p-3 rounded-lg hover:bg-violet-600 cursor-pointer transition-all delay-75"
              >
                <AddIcon className="scale-[1.3]" />
              </Link>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

function TagModel({
  openModal,
  handleCloseModal,
  availableTags,
  onDeleteTag,
  onUpdateTag,
}: TagModelProps) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={() => handleCloseModal()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          <div className="w-screen h-screen flex items-center justify-center">
            <div
              className={`p-2 lg:p-4 w-[97%] md:w-[40%] h-[70%] overflow-auto bg-secondary border-primary border-1`}
            >
              <div>
                <div className="mb-3 flex justify-between sticky top-0 bg-secondary py-2">
                  <p className="font-semibold text-2xl">Edit Tags</p>
                  <div
                    onClick={handleCloseModal}
                    className="text-purple-600 mr-2 cursor-pointer"
                  >
                    <DisabledByDefaultIcon />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  {availableTags.map((tag, i) => {
                    return (
                      <div
                        key={i}
                        className="flex justify-between w-full border-1 border-gray-200"
                      >
                        <input
                          type="text"
                          onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                          value={tag.label}
                          className=" rounded-l-md border-1 w-full border-gray-300 p-2 border-r-0"
                        />
                        <div
                          onClick={() => onDeleteTag(tag.id)}
                          className="border-1 bg-primary p-2 cursor-pointer rounded-r-md border-l-0 text-red-500"
                        >
                          {" "}
                          <DeleteIcon />{" "}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white ml-auto cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-sm"
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

function ConfirmLogoutModal({
  openModal,
  handleCloseModal,
  Logout,
}: ConfirmModalProps) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={() => handleCloseModal()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          <div className="w-screen h-screen flex items-center justify-center">
            <div
              className={`w-[97%] md:w-[40%] p-5 overflow-auto bg-secondary border-primary border-1 rounded-lg`}
            >
              <div>
                <p className="font-semibold text-3xl text-center w-[90%] m-auto">
                  sure you want to leave us
                  <br />
                  <span className="text-violet-500 font-bold">soldier?</span>
                </p>
                <div className="w-full flex justify-center gap-2 mt-4">
                  <button
                    onClick={Logout}
                    className="bg-gray-500 px-4 py-2 hover:bg-gray-700 text-white rounded-lg font-bold"
                  >
                    YES
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-violet-500 px-4 py-2 hover:bg-violet-700 text-white rounded-lg font-bold "
                  >
                    Never! my team needs me
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
