import { useNote } from "./NoteDetailLayout";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";

type detialProps = {
  onDeleteNote: (id: string) => void;
};

export default function Detial ({ onDeleteNote }: detialProps) {
  const navigate = useNavigate();
  const note = useNote();

  function handleDelete() {
    onDeleteNote(note.id);
    navigate("/");
  }
  return (
    <article className="w-[95%] md:w-[70%] m-auto bg-primary p-4 h-full">
      <section className="flex justify-between">
        <p className="font-bold text-4xl">{note.title}</p>
        <div className="flex gap-2">
          <Link
            to={`/${note.id}/edit`}
            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 cursor-pointer transition-all delay-75 "
          >
            {" "}
            Edit{" "}
          </Link>
          <div
            onClick={handleDelete}
            className="border-red-400 text-red-400 border-2 py-2 px-4 rounded-lg hover:bg-gray-200 cursor-pointer transition-all delay-75"
          >
            {" "}
            Delete{" "}
          </div>
          <Link
            to={`..`}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 cursor-pointer transition-all delay-75"
          >
            Back
          </Link>
        </div>
      </section>
      <section className="mt-5">
        <ReactMarkdown className="">{note.markdown}</ReactMarkdown>
      </section>
    </article>
  );
}


