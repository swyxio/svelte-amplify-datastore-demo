import { writable, get } from 'svelte/store';
import Amplify, { Hub } from '@aws-amplify/core';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import { Note } from '../models';

Hub.listen('auth', (data) => {
  if (data.payload.event === 'signOut') {
    DataStore.clear();
  }
});
const subscription = DataStore.observe(Note).subscribe((subscriptionMsg) => {
  console.log({ subscriptionMsg });
  listNotes();
});
const handleConnectionChange = () => {
  const condition = navigator.onLine ? 'online' : 'offline';
  console.log({ condition });
  if (condition === 'online') listNotes();
};
window.addEventListener('online', handleConnectionChange);
window.addEventListener('offline', handleConnectionChange);

export const store = writable([], () => {
  console.log('got a subscriber');
  return () => {
    console.log('no more subscribers');
    subscription.unsubscribe();
  };
});
listNotes(); // load for the first time
export async function updateNote(id) {
  const original = await DataStore.query(Note, id);
  await DataStore.save(
    Note.copyOf(original, (updated) => {
      updated.note = value;
    })
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
export async function addNote(note /* string */) {
  console.log('add note', note);
  await DataStore.save(new Note({ note }));
  return listNotes();
}

export async function listNotes() {
  return DataStore.query(Note, Predicates.ALL).then((v) => {
    console.log('listNotes', v);
    store.set(v);
  });
}
