import React, { useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Link } from "react-router-dom";
import { NoteData, Tag, TagData } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom'

type noteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (data: TagData) => void;
  availableTags: Tag[];
  errors? : any
} & Partial<NoteData>

const NoteForm = ({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [], errors = {} }: noteFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const markDownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // This could be an extra check to make sure the user doesn't override the html and submit empty data
    if (titleRef.current && markDownRef.current) {
      onSubmit({
        title: titleRef.current.value,
        markdown: markDownRef.current.value,
        tags: selectedTags,
      });
    }
  }

  return (
    <div className="mt-3">
      <form className="text-lg w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
          <input
            placeholder="Title"
            required
            defaultValue={title}
            ref={titleRef}
            className="rounded-md border-1 border-gray-300 p-2"
          />
          <CreatableSelect
            onCreateOption={(label) => {
              const newTag = { label: label, id : null};
              setSelectedTags((prevTags) => [...prevTags, newTag]);
            }}

            options = {
              availableTags.map(tag => ({label : tag.label, value : tag.id}))
            }
            className="rounded-md border-1 border-gray-300 p-2"
            value={selectedTags.map((tag) => {
              return { label: tag.label, value: tag.id };
            })}
            onChange={(tags) => {
              setSelectedTags(
                tags.map((tag) => {
                  return { label: tag.label, id: tag.value };
                })
              );
            }}
            isMulti
          />
        </div>
        <div className="mt-4">
          <textarea
            rows={10}
            defaultValue = {markdown}
            ref={markDownRef}
            className="w-full rounded-md border-1 border-gray-300 p-2"
            placeholder="Body"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md mr-3 hover:bg-blue-700 transition-all delay-75"
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
  );
};

export default NoteForm;
