import { axiosPrivate } from "./AuthApi";
import { NoteData, Tag, TagData } from "../types/types";

async function addNoteFn(data: NoteData) {
  const response = await axiosPrivate.post("/note", { ...data });
  return response.data;
}

async function updateNoteFn(data: NoteData, id: string) {
  const response = await axiosPrivate.post(`/note${id}`, { ...data });
  return response.data;
}

async function getNotesFn() {
  const response = await axiosPrivate.get("/notes");
  return response.data;
}

async function getNoteFn(id: string) {
  const response = await axiosPrivate.get(`/note/${id}`);
  return response.data;
}

async function deleteNoteFn(id: string) {
  const response = await axiosPrivate.delete(`/note/${id}`);
  return response.data;
}

async function addTagFn(data: TagData ) {
  const response = await axiosPrivate.post(`/tag`, {...data});
  return response.data;
}

async function getTagsFn() {
  const response = await axiosPrivate.get(`/tag`);
  return response.data;
}

async function updateTagsFn(data: Tag, id: string) {
  const response = await axiosPrivate.patch(`/tag/${id}`, { ...data });
  return response.data;
}

export {
  addNoteFn,
  getNoteFn,
  getNotesFn,
  deleteNoteFn,
  getTagsFn,
  updateNoteFn,
  updateTagsFn,
  addTagFn
};
