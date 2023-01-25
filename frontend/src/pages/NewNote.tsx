import NoteForm from "../components/NoteForm";
import { NoteData, Tag, TagData } from "../types/types";
import { addNoteFn, addTagFn, getTagsFn } from "../api/noteApi";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient} from 'react-query'
import { useStateContext } from "../context/StateContextProvider";

// type newNoteProps = {
// }
const NewNote = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { state } = useStateContext()
  const tagQuery = useQuery(['tags'], getTagsFn, {
    enabled : false
  })

  const noteMutate = useMutation((data : NoteData) => addNoteFn(data), {
    onSuccess : () => {
      queryClient.invalidateQueries("notes")
      navigate('..')
    }
  })
  
  const tagMutate = useMutation((data : TagData) => addTagFn(data), {
    onSuccess : () => {
      queryClient.invalidateQueries("tags")
    }
  })

  function handleAddNote(data : NoteData){
    noteMutate.mutate(data)
  }
  function handleAddTag(data : TagData){
    tagMutate.mutate(data)
  }
  
  

  return (
    <div>
      <div className=" w-[95%] md:w-[65%] m-auto mt-10">
        <p className="text-4xl text-center md:text-start">New Note</p>
        <NoteForm onSubmit = {handleAddNote} errors = {noteMutate.isError && noteMutate.error} onAddTag = {handleAddTag}  availableTags = {state.availableTags || []}/>
      </div>
    </div>
  );
};

export default NewNote;
