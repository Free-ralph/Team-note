import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getTeamByID } from "../api/teamApi";
import { useNavigate } from "react-router-dom";
import { showToastError } from "../utils/showToast";
import { useReducer } from "react";
import { TeamMembers } from "../types/types";
import { BounceLoader } from "react-spinners";

type TeamStateType = {
  members: TeamMembers[];
};

const initialState: TeamStateType = {
  members: [],
};
export default function Teams() {
  const { teamID } = useParams();
  const navigate = useNavigate();

  const [teamState, updateTeamState] = useReducer(
    (prevState: TeamStateType, newState: Partial<TeamStateType>) => {
      return {
        ...prevState,
        ...newState,
      };
    },
    initialState
  );
  const { data: team, isLoading } = useQuery(
    ["teams", teamID],
    () => getTeamByID(teamID),
    {
      onSuccess: (data) => {
        updateTeamState({members : data.members })
      },
      onError: (error) => {
        showToastError("You broke my code, thank you");
        navigate("..");
      },
    }
  );
  if (isLoading){
    return <div className="w-full h-full flex justify-center items-center"><BounceLoader color="#7c3aed" size={60} speedMultiplier={2} /></div>
  }

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-12 gap-3 mt-3 w-full h-full overflow-auto">
        { teamState.members.map((member, i) => (<TeamCards key = {i} {...member}/>)) }
      </div>
    </div>
  );
}

function TeamCards({name, profile_id, image} : TeamMembers) {
  const developerStack = [
    "Javascript",
    "Typescript",
    "React",
    "Django",
    "Tailwind",
    "Javascript",
    "Typescript",
    "React",
    "Django",
    "Tailwind",
  ];

  
  return (
    <div className=" col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 h-[18rem] bg-primary p-3 rounded-md flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all delay-[10ms] cursor-pointer">
      <div className="h-[33%] ">
        <div className="h-[4rem] w-[4rem] bg-violet-500 rounded-xl mb-1 overflow-hidden border-2 border-gray-200">
          <img src = {image} className = "w-full h-full object-cover object-center" />
        </div>
        <p className="font-bold text-gray-800">
          {name} -{" "}
          <span className="text-gray-600 font-semibold">developer</span>
        </p>
      </div>
      <div className="h-[33%] flex flex-wrap gap-3 overflow-auto">
        {developerStack.map((stack, i) => (
          <div
            key={i}
            className="bg-gray-200 text-gray-500 px-3 py-1 rounded-lg"
          >
            {stack}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="w-[50%] bg-violet-500 text-white px-4 py-2 hover:bg-violet-700 cursor-pointer transition-all delay-75 rounded-lg">
          Remove
        </button>
        <button className="w-[50%] bg-gray-400 text-white px-4 py-2 hover:bg-gray-600 cursor-pointer transition-all delay-75 rounded-lg">
          view
        </button>
      </div>
    </div>
  );
}
