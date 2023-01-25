import React from "react";
import { Tag, Note } from "../types/types";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query"


type NoteListProps = {
  notes: Note[];
  availableTags: Tag[];
  handleActiveNote : ( note : Note) => void
};

type NoteCardProps = {
  handleActiveNote : (note : Note) => void
} & Note

const NoteList = ({ notes, availableTags, handleActiveNote }: NoteListProps) => {

  // const { data, isError, error, isLoading } = useQuery('notes', useGetNotes)

  return (
    <section className="border-2">
      <div className=" flex flex-col gap-4 mt-4 ">
        {notes.map((note, i) => {
          return (
            <div key={i}>
              <NoteCard {...note} handleActiveNote = {handleActiveNote} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NoteList;

function NoteCard({ title, tags, id, markdown, handleActiveNote}: NoteCardProps) {
  return (
    <div
      onClick={() => handleActiveNote({title, tags, id, markdown})}
      className="border-1 rounded flex flex-col justify-between h-[12rem] p-3 border-gray-300 bg-primary relative cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all delay-[10ms]"
    >
      <div className="flex gap-2">
        <div className="h-[3rem] w-[3rem] bg-violet-500 rounded-xl"></div>
        <div>
          <div className="">
            <p className="font-bold">{title}</p>
            <p className="text-gray-500 text-sm"> created - 10am 4/4/2022</p>
          </div>
        </div>
      </div>
      <div>
        <ReactMarkdown className="leading-tight text-gray-600 w-[90%]">
          {markdown.length < 105
            ? markdown.slice(0, 105)
            : markdown.slice(0, 105) + "..."}
        </ReactMarkdown>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <div
            className="rounded-lg bg-violet-400 text-white px-3 py-1 font-semibold text-sm"
            key={i}
          >
            {tag.label}
          </div>
        ))}
      </div>
    </div>
  );
}
