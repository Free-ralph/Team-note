import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useStateContext } from "../context/StateContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type NavbarProps = {
  handleOpenTeamModal: () => void;
  toggleSideBar: () => void;
  handleOpenConfirmModal: () => void;
};

export default function Navbar({
  handleOpenTeamModal,
  toggleSideBar,
  handleOpenConfirmModal
}: NavbarProps) {
  const [openAuthOptions, setOpenAuthOptions] = useState(false);
  const stateCTX = useStateContext();
  return (
    <div className="w-full text-white h-[4rem] flex items-center justify-between lg:justify-end px-5">
      <div className="flex items-center  ml-3 text-white lg:hidden">
        <p onClick={toggleSideBar} className="font-bold text-lg cursor-pointer">
          <MenuIcon className="scale-[1.3]" />
        </p>
      </div>
      <div className="flex gap-10 items-center">
        <div className="gap-10 hidden md:flex">
          <div
            onClick={handleOpenTeamModal}
            className="font-semibold cursor-pointer"
          >
            Teams
          </div>
          <Link to="/about" className="font-semibold cursor-pointer">
            About
          </Link>
        </div>
        <div className="">
          <div
            onClick={() => setOpenAuthOptions((prev) => !prev)}
            className="flex gap-2 cursor-pointer items-center"
          > <div className="">{ openAuthOptions ? <ArrowDropUpIcon className="scale-[1.2ArrowDropUpIcon]"/> : <ArrowDropDownIcon className="scale-[1.2ArrowDropUpIcon]"/>}</div>
            <div className="w-[3rem] h-[3rem] bg-pink-200 rounded-xl overflow-hidden">
              <img
                src={stateCTX.state.profile?.image}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <p className="text-sm translate-y-[0.2rem]">
                @{stateCTX.state.authUser?.username}
              </p>
              <p className="font-semibold">{stateCTX.state.profile?.name}</p>
            </div>
          </div>
          <div className="relative z-50">
            <AnimatePresence>
              {openAuthOptions && (
                <motion.div
                  initial={{ opacity: 0, x : -10}}
                  animate={{
                    opacity: 1,
                    x : 0
                  }}
                  transition = {{
                    type: "spring",
                    delay : 0.1
                  }}
                  exit={{ opacity: 0, x : 10 }}
                  className="absolute bg-violet-500 text-white border-2 border-white w-[10rem] top-1 p-3 text-center"
                >
                  <Link
                    className=" hover:bg-violet-600 py-1 px-4"
                    to={`profile/${stateCTX.state.profile?.profile_id}`}
                  >
                    Profile
                  </Link>
                  <div className="h-[4px] my-1 mx-3 bg-secondary rounded-full"></div>
                  <div onClick={handleOpenConfirmModal} className="hover:bg-violet-600 py-1 px-4 cursor-pointer">Logout</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
