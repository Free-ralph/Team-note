import {useMemo, useReducer } from "react";
import NoteList from "../components/NoteList";
import Select from "react-select";
import { Tag, Note } from "../types/types";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ReactMarkdown from "react-markdown";
import EditIcon from "@mui/icons-material/Edit";
import { useStateContext } from "../context/StateContextProvider";
import { useQuery } from "react-query";
import { getNotesFn } from "../api/noteApi";


type HomeStateType = {
  title: string;
  selectedTags: Tag[];
  activeNote: Note | null;
};

type NoteDetailProps = {
  activeNote: Note | null;
};

function Home() {
  const { state } = useStateContext();
  const initialState: HomeStateType = {
    title: "",
    selectedTags: [],
    activeNote: null,
  };
  const [homeState, updateHomeState] = useReducer(
    (prevState: HomeStateType, newState: Partial<HomeStateType>) => {
      return {
        ...prevState,
        ...newState,
      };
    },
    initialState
  );

  const { data: notes, isLoading } = useQuery(["notes"], getNotesFn, {
    onSuccess: (data) => {
      updateHomeState({ activeNote: data.length > 0 ? data[0] : null });
    },
  });

  const filteredNotes = useMemo(() => {
    return notes?.filter((note: Note) => {
      return (
        (homeState.title === "" ||
          note.title
            .toLocaleLowerCase()
            .includes(homeState.title.toLocaleLowerCase())) &&
        (homeState.selectedTags.length === 0 ||
          homeState.selectedTags.every((tag) =>
            note.tags.some((noteTag) => tag.id === noteTag.id)
          ))
      );
    });
  }, [homeState]);


  function handleActiveNote(note: Note) {
    updateHomeState({ activeNote: note });
  }

  return (
    <div className="h-full grid grid-cols-7 gap-2">
      <div className="col-span-7 md:col-span-2  flex flex-col h-full border-2">
        <section className="h-fit">
          <form>
            <div className="grid grid-cols-1 gap-2">
              <input
                placeholder="Title"
                required
                value={homeState.title}
                onChange={(e) => {
                  updateHomeState({ title: e.target.value });
                }}
                className="rounded-md border-1 border-gray-400 p-2"
              />
              <Select
                options={state.availableTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                className="rounded-md border-1 border-gray-400 p-2"
                value={homeState.selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  updateHomeState({
                    selectedTags: tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    }),
                  });
                }}
                isMulti
              />
            </div>
          </form>
        </section>
        <div className=" grow shrink basis-0  border-2 overflow-auto">
          <NoteList
            availableTags={state.availableTags}
            notes={filteredNotes || []}
            handleActiveNote={handleActiveNote}
          />
        </div>
      </div>
      <div className="hidden col-span-5 md:block">
        <NoteDetail activeNote={homeState.activeNote} />
      </div>
    </div>
  );
}

function NoteDetail({ activeNote }: NoteDetailProps) {
  return (
    <div className="bg-primary h-full rounded-lg border-1 border-gray-300">
      {activeNote ? (
        <div className="p-5 h-full">
          <div className="w-full text-gray-500 mt-1 flex justify-between items-center">
            <div>
              <span>
                {" "}
                <ArchiveIcon className="scale-[0.9] hover:text-gray-700 cursor-pointer transition-all delay-75" />
              </span>
              <span>
                {" "}
                <EditIcon className="scale-[0.9] hover:text-gray-700 cursor-pointer transition-all delay-75" />
              </span>
              <span>
                {" "}
                <DeleteIcon className="scale-[0.9] hover:text-gray-700 cursor-pointer transition-all delay-75" />
              </span>
            </div>
            <div className="flex items-center">
              <span> 8 of 203 </span>
              <span>
                <NavigateBeforeIcon className="hover:scale-[1.3] cursor-pointer transition-all delay-75" />
              </span>
              <span>
                <NavigateNextIcon className="hover:scale-[1.3] cursor-pointer transition-all delay-75" />
              </span>
            </div>
          </div>
          <div className="mt-6 h-full">
            <p className="font-sm font-semibold text-gray-500">
              chidera okosa - mary johnson
            </p>
            <p className="font-semibold text-4xl text-gray-700">
              {activeNote.title}
            </p>
            <ReactMarkdown className="mt-6 overflow-auto h-[50%] border-2 bg-gray-50 p-2">
              {activeNote.markdown}
            </ReactMarkdown>
            <div className="flex flex-wrap gap-2 mt-5 w-[50%]">
              {activeNote.tags.map((tag, i) => (
                <div
                  className="rounded-lg bg-violet-400 text-white px-3 py-1 font-semibold text-sm"
                  key={i}
                >
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full text-center text-4xl text-gray-600">
          <span className="mt-5">No note selected</span>
        </div>
      )}
    </div>
  );
}



export default Home;
