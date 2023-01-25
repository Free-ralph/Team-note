import { Note } from "../types/types"
import { useParams, Outlet, Navigate, useOutletContext } from "react-router-dom"

type NoteDetialProps = {
    notes : Note[]
}

function NoteDetailLayout ({ notes } : NoteDetialProps ){
    const { id } = useParams()
    const note = notes.find(note => note.id === id)

    if (!note){
        return <Navigate to='/' replace/>
    }

    return <Outlet context={note} />
}

export default NoteDetailLayout

export function useNote(){
    return useOutletContext<Note>();
}