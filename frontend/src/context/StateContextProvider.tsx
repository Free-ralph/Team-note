import { useContext, createContext, useReducer } from "react";
import { IUser } from "../types/types";
import { useQuery, UseQueryResult } from "react-query";
import { getTagsFn } from "../api/noteApi";
import { Tag } from '../types/types'
import { ProfileType } from "../types/types";
import { getMeFn } from "../api/AuthApi";

type State = {
  authUser: IUser | null;
  availableTags: Tag[];
  profile : ProfileType | null
};


type SetState = (state : Partial<State>) => void;

const initialState: State = {
  authUser: null,
  availableTags : [],
  profile : null
};

type StateContextProps = {
  children: React.ReactNode;
};

type StateContextType = {
  state: State;
  setState: SetState;
  profileQuery : UseQueryResult<any, unknown>
};



const StateContext = createContext<StateContextType | undefined>(undefined);

function StateContextProvider({ children }: StateContextProps) {
  const [state, setState] = useReducer( (state: State, newState: Partial<State>) => ({
    ...state,
    ...newState,
  }), initialState);

  useQuery('tags', getTagsFn, {
    onSuccess : (data) => {
      setState({ availableTags : data})
    }
  })
  

  const profileQuery =  useQuery('profile', getMeFn, {
    onSuccess : (data) => {
      setState({ profile : data.profile, authUser : data.user})
    }
  })
  const value = {
    state,
    setState,
    profileQuery
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

function useStateContext() {
  const context = useContext(StateContext);

  if (context) {
    return context;
  }

  throw new Error("useStateContext must be used within a StateContextProvider");
}

export { StateContextProvider, useStateContext };
