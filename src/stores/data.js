import { writable, get } from 'svelte/store';
import Amplify, { Hub } from '@aws-amplify/core';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import { Note } from '../models';

const subscription = DataStore.observe(Note).subscribe(listNotes);
const handleConnectionChange = () => {
  const condition = navigator.onLine ? 'online' : 'offline';
  if (condition === 'online') listNotes();
};
window.addEventListener('online', handleConnectionChange);
Hub.listen('auth', (data) => {
  if (data.payload.event === 'signOut') DataStore.clear();
});

export const store = writable([], () => subscription.unsubscribe);
export async function updateNote(id) {
  const original = await DataStore.query(Note, id);
  await DataStore.save(
    Note.copyOf(original, (updated) => void (updated.note = value))
  );
  return listNotes();
}
export async function deleteNote(id) {
  const toDelete = await DataStore.query(Note, id);
  return DataStore.delete(toDelete);
}
export async function searchNotes(searchStr) {
  return DataStore.query(Note, (c) => c.note('contains', searchStr)).then(
    store.set
  );
}
export async function addNote(note) {
  await DataStore.save(new Note({ note }));
  return listNotes();
}

export async function listNotes() {
  return DataStore.query(Note, Predicates.ALL).then(store.set);
}
