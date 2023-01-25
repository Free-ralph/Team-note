import { useReducer, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { createTeamFn } from "../api/teamApi";
import { useNavigate } from "react-router-dom";

type TeamMembers = { profile_id : ""; roles : "" };


export type TeamData = {
  name: string;
  about?: string;
  rules?: string;
  members: TeamMembers[];
};

type TeamState = {
  name: string;
  about: string;
  rules: string;
  members: TeamMembers[];
  errors: {
    name?: string[];
    about?: string[];
    members?: { [i: number]: string };
    rules?: string[];
  };
};

type NewMemberProps = {
  profile_id: string;
  roles: string;
  errors: { [i: number]: string } | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  removeMembers: (index: number) => void;
  index: number;
};

function NewTeam() {
  const initialState: TeamState = {
    name: "",
    about: "",
    rules: "",
    members: [{ profile_id: "", roles: "" }],
    errors: {
      name: [],
      about: [],
      members: [],
      rules: [],
    },
  };

  const navigate = useNavigate()

  const [teamState, updateTeamState] = useReducer(
    (prevState: TeamState, newState: Partial<TeamState>) => {
      if (newState.members?.length === 0) {
        return { ...prevState };
      }

      return { ...prevState, ...newState };
    },
    initialState
  );

  const { mutate: createNote } = useMutation(
    (data: TeamData) => createTeamFn(data),
    {
      onSuccess: (data) => {
        // TODO Redirect ot team page
        navigate("/team")
      },
      onError: (error: any) => {
        updateTeamState({ errors: error.response.data });
        showToastError("invalid input");
      },
    }
  );

  function addMembers() {
    updateTeamState({
      members: [...teamState.members, { profile_id: "", roles: "" }],
    });
  }

  function removeMembers(index: number) {
    const members = [...teamState.members];
    members.splice(index, 1);
    if (members.length === 0) {
      toast.error("You must have at least one member of your team", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      updateTeamState({ members: members });
    }
  }

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

  function handleChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const members = [...teamState.members];
    members[index] = { ...members[index], [e.target.name]: e.target.value };
    updateTeamState({ members: members });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createNote({
      name: teamState.name,
      about: teamState.about,
      rules: teamState.rules,
      members: teamState.members,
    });
  }
  return (
    <div className="w-full h-full overflow-auto">
      <div className="mt-4 w-[98%] md:w-[80%] lg:w-[60%] m-auto text-gray-700">
        <form className="text-lg w-full" onSubmit={handleSubmit}>
          <p className="font-bold text-gray-700 text-2xl uppercase mb-3">
            Team <span className="text-violet-500">Details</span>
          </p>
          <div className="w-full">
            <input
              placeholder="Name your Team"
              value={teamState.name}
              onChange={(e) => updateTeamState({ name: e.target.value })}
              required
              className="rounded-md border-1 border-gray-600 p-2 w-full"
            />
            {teamState?.errors?.name && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {teamState?.errors?.name.map((error, i) => (
                  <p key={i} className="mt-1">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 w-full">
            <textarea
              placeholder="What's the purpose of this team?"
              value={teamState.about}
              onChange={(e) => updateTeamState({ about: e.target.value })}
              required
              rows={3}
              className="rounded-md border-1 border-gray-500 p-2 w-full"
            />
            {teamState?.errors?.about && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {teamState?.errors?.about.map((error, i) => (
                  <p key={i} className="mt-1">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 w-full">
            <textarea
              placeholder="What are your rules if any?"
              value={teamState.rules}
              onChange={(e) => updateTeamState({ rules: e.target.value })}
              required
              rows={5}
              className="rounded-md border-1 border-gray-500 p-2 w-full"
            />
            {teamState?.errors?.rules && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {teamState?.errors?.rules.map((error, i) => (
                  <p key={i} className="mt-1">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center sticky top-2 bg-secondary border-1 border-violet-300 p-2  z-50">
            <p className="font-bold text-gray-700 text-2xl uppercase my-3">
              Team <span className="text-violet-500">Members</span>
            </p>
            <div
              onClick={addMembers}
              className="bg-violet-500 h-fit text-white p-2 rounded-lg hover:bg-violet-600 cursor-pointer transition-all delay-75"
            >
              <AddIcon className="scale-[1.3] " />
            </div>
          </div>
          {teamState.members.map((member, index) => (
            <NewMembers
              key={index}
              handleChange={handleChange}
              removeMembers={removeMembers}
              {...member}
              errors={teamState.errors.members}
              index={index}
            />
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-4 bg-violet-500 text-white rounded-md mr-3 hover:bg-violet-700 transition-all delay-75"
            >
              Save
            </button>
            <Link to="..">
              <button
                type="submit"
                className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all delay-75"
              >
                cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTeam;

function NewMembers({
  profile_id,
  roles,
  handleChange,
  index,
  removeMembers,
  errors,
}: NewMemberProps) {
  const hasError = errors && errors[index];
  return (
    <div className="p-2">
      <div className="flex justify-between">
        <p className="">
          member <span className="font-bold text-violet-500"> {index + 1}</span>
        </p>
        <div
          onClick={() => removeMembers(index)}
          className="text-red-400 mr-2 cursor-pointer hover:text-red-600"
        >
          <RemoveCircleIcon className="scale-[1.3]" />
        </div>
      </div>
      <div className="mt-3 w-full">
        <input
          placeholder="Profile ID"
          value={profile_id}
          name="profile_id"
          onChange={(e) => handleChange(e, index)}
          required
          className={`rounded-md border-1 ${hasError ? "border-red-500" : "border-gray-500"}  p-2 w-full`}
        />
        <div className="mt-3 w-full">
          <input
            placeholder="Member role"
            value={roles}
            name="roles"
            onChange={(e) => handleChange(e, index)}
            required
            className={`rounded-md border-1 ${hasError ? "border-red-500" : "border-gray-500"}  p-2 w-full`}
          />
        </div>
        {hasError && (
          <div className="text-sm text-red-500 p-1 ml-2">
            <p className="mt-1">{errors[index]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
