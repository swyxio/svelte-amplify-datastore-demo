<script>
  import { store as authStore, logout } from './stores/auth.js'
  import Amplify, { Hub } from '@aws-amplify/core';
  import { DataStore, Predicates } from '@aws-amplify/datastore';
  import { Note } from './models';
  import { onMount, onDestroy } from 'svelte';

  let displayMode = 'add' // add, search, update
  let value = ""
  const resetValue = () => value = ""
  let selectedId = ""
  let notes = [] // in memory copy of all the results from DataStore queries
  const setNotes = v => void (notes = v) // helper to set the store
  onMount(listNotes);
  const subscription = DataStore.observe(Note).subscribe(listNotes);
  onDestroy(subscription.unsubscribe)
  const handleConnectionChange = () => {
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') listNotes();
  };
  window.addEventListener('online', handleConnectionChange);
  Hub.listen('auth', (data) => (data.payload.event === 'signOut') && DataStore.clear())
  function handleAddNote() {
    return DataStore.save(new Note({ note: value })).then(listNotes).then(resetValue)
  }
  async function handleUpdateNote() {
    const original = await DataStore.query(Note, selectedId);
    await DataStore.save(
      Note.copyOf(original, (updated) => void (updated.note = value))
    ).then(listNotes)
  }
  function handleSearch() {
    displayMode = 'search'
    DataStore.query(Note, (c) => c.note('contains', value)).then(setNotes)
  }
  function clearSearch() {
    displayMode = 'add'
    listNotes().then(resetValue)
  }
  async function handleSelect(note) {
    value = note.note
    selectedId = note.id
    displayMode = 'update'
  }
  async function listNotes() {
    return DataStore.query(Note, Predicates.ALL).then(setNotes);
  }
  function handleDelete(id) {
    return async () => {
      const toDelete = await DataStore.query(Note, id);
      DataStore.delete(toDelete).then(listNotes)
    }
  }
</script>

<h2>You are logged in as {$authStore.username} <button type="button" on:click={logout}>Log Out</button></h2>
<div class="container">
  {#if displayMode === 'add'}
  <form on:submit|preventDefault={handleAddNote}>
    <div class="input-group mb-3">
      <input type="text" class="form-control form-control-lg" placeholder="New Note" bind:value />
      <div class="input-group-append">
        <button class="btn btn-warning border border-light text-white font-weight-bold" type="submit">
          Add Note
        </button>
        <button class="btn btn-warning border border-light text-white font-weight-bold" type="button" on:click={handleSearch} >
          Search
        </button>
      </div>
    </div>
  </form>
  {/if}
  {#if displayMode === 'update'}
  <form on:submit|preventDefault={handleUpdateNote} >
    <div class="input-group mb-3">
      <input type="text" class="form-control form-control-lg" placeholder="Update Note" bind:value />
      <div class="input-group-append">
        <button class="btn btn-warning text-white font-weight-bold" type="submit">
          Update Note
        </button>
      </div>
    </div>
  </form>
  {/if}
</div>
<div class="container">
  {#each notes as item}
  <div class="alert alert-warning alert-dismissible text-dark show" role="alert">
    <span on:click={() => handleSelect(item)}>{item.note}</span>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close" on:click={handleDelete(item.id)} >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  {/each}
  {#if displayMode === 'search'}
  <button class="button btn-warning float-right text-white font-weight-bold" on:click={clearSearch}>
    <span aria-hidden="true">Clear Search</span>
  </button>
  {/if}
</div>