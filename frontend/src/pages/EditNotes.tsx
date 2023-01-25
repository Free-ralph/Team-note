import NoteForm from "../components/NoteForm";
import { Note, NoteData, Tag, TagData } from "../types/types";
import { useNote } from "../components/NoteDetailLayout";

type editNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (data: TagData) => void;
  availableTags: Tag[];
};

export default function EditNote ({ onSubmit, onAddTag, availableTags }: editNoteProps) {
  const note = useNote();
  return (
    <div>
      <div className=" w-[95%] md:w-[65%] m-auto mt-10">
        <p className="text-4xl text-center md:text-start">New Note</p>
        <NoteForm
          title = {note.title}
          markdown = {note.markdown}
          tags = {note.tags}
          onSubmit={(data) => onSubmit(note.id, data)}
          onAddTag={onAddTag}
          availableTags={availableTags}
        />
      </div>
    </div>
  );
}
