import { useState, useRef, ChangeEvent, useReducer} from "react";
import { useMutation, useQuery } from "react-query";
import CreatableSelect from "react-select/creatable";
import { BounceLoader } from "react-spinners";
import { updateProfileFn, updateProfileImageFn, getStacksFn } from "../api/AuthApi";
import { Tag } from "../types/types";

type inputType = {
  name: string;
  stacks: string[];
};

type ErrorsType = {
  name: string[];
  stacks: string[];
};

type ProfileStateType = {
  inputData : inputType, 
  errors : ErrorsType, 
  selectedStacks : Tag[]
  availableStacks : Tag[]
}
const initialState : ProfileStateType = {
  inputData : {name : "", stacks : []}, 
  errors : {name : [], stacks : []}, 
  selectedStacks : [],
  availableStacks : []
}
function EditProfile() {
  const [profileState, updateProfileState] = useReducer(
    (prevState: ProfileStateType, newState: Partial<ProfileStateType>) => {
      return {
        ...prevState,
        ...newState,
      };
    },
    initialState
  );
  
  const profileImageRef = useRef<HTMLInputElement>(null);

  useQuery(['stacks'], getStacksFn, {
    onSuccess : (data) => {
      
    }
  })
  const { mutate: updateProfile, isLoading } = useMutation(updateProfileFn, {
    onSuccess: (data) => {},
  });

  const { mutate: updateProfileImage, isLoading: imageIsLoading } = useMutation(
    (image: File) => updateProfileImageFn(image),
    {
      onSuccess: (data) => {},
    }
  );

  function handleImageClick() {
    profileImageRef.current && profileImageRef.current.click();
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      updateProfileImage(e.target.files[0]);
    }
  }
  function handleSubmit(){

  }

  return (
    <div className="w-[95%] md:w-[60%] m-auto mt-4">
      <div className="mt-[6rem] md:mt[10rem]">
        <p className="font-bold text-3xl text-center mb-3">
          Build your profile <span className="text-violet-500">Soldier</span>
        </p>
        <div className="w-[4rem] h-[rem] bg-violet-500 overflow-hidden rounded-md">
          {/* <img src  = {} /> */}
        </div>
        <form className="text-lg w-full" onSubmit={handleSubmit}>
          <div className=" w-full">
            <input
              placeholder="Your Name"
              name="name"
              required
              value={profileState.inputData.name}
              onChange={(e) =>
                updateProfileState({inputData : {...profileState.inputData, name : e.target.value}})
              }
              className="rounded-md border-1 border-gray-500 p-2 w-full"
            />
            {profileState.errors.name && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {profileState.errors.name.map((error, i) => (
                  <p key={i} className="mt-1">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="">
            <CreatableSelect
              onCreateOption={(label) => {
                const newStack = { label: label, id: null };
                updateProfileState({selectedStacks : [...profileState.selectedStacks, newStack]});
              }}
              options={profileState.availableStacks.map((stack) => ({
                label: stack.label,
                value: stack.id,
              }))}
              className="rounded-md border-1 border-gray-300 p-2"
              value={profileState.selectedStacks.map((stack) => {
                return { label: stack.label, value: stack.id };
              })}
              onChange={(stacks) => {
                const updatedStacks = stacks.map(stack => ({label : stack.label, id : stack.value}))
                updateProfileState({selectedStacks : updatedStacks})
              }}
              isMulti
            />
            {profileState.errors.stacks && (
              <div className="text-sm text-red-500 p-1 ml-2">
                {profileState.errors.stacks.map((error, i) => (
                  <p key={i} className="mt-1">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end flex-col items-center">
            <button
              disabled={isLoading}
              type="submit"
              className="py-2 px-4 w-[6rem] h-[3rem] flex justify-center bg-violet-600 text-white rounded-lg mr-3 hover:bg-violet-700 transition-all delay-75"
            >
              {isLoading ? (
                <BounceLoader color="#fff" size={30} speedMultiplier={2} />
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
