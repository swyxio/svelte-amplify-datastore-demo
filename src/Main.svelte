<script>
  import { store as authStore, logout } from './stores/auth.js'
  import { store, addNote, searchNotes, listNotes, updateNote, deleteNote } from './stores/data.js'
  import "bootstrap/dist/css/bootstrap.min.css";

  let displayAdd = true
  let displaySearch = false
  let displayUpdate = false
  let value = ""
  let id = ""
  const resetValue = () => value = ""
  let promise
  function handleAddNote() {
    promise = addNote(value).then(resetValue)
  }
  function handleSearch() {
    displaySearch = true
    promise = searchNotes(value)
  }
  function clearSearch() {
    displaySearch = false;
    listNotes().then(resetValue)
  }
  function handleUpdateNote() {
    if (id !== "") {
      promise = updateNote()
    }
  }
  async function handleSelect(note) {
    value = note.note
    id = note.id
    displayUpdate = true
    displayAdd = false
  }
  let notes = []
  store.subscribe(_notes => {
    notes = _notes
  })
  authStore.subscribe(user => {
    console.log({user})
  })
</script>
<style>
  /* pre {
    text-align: left
  } */
</style>

<h2>You are logged in <button type="button" on:click={logout}>Log Out</button></h2>

<div class="container">
  {#if displayAdd}
  <form on:submit|preventDefault={handleAddNote}>
    <div class="input-group mb-3">
      <input type="text" class="form-control form-control-lg" placeholder="New Note" aria-label="Note"
        aria-describedby="basic-addon2" bind:value />
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
  {#if displayUpdate}
  <form on:submit|preventDefault={handleUpdateNote} >
    <div class="input-group mb-3">
      <input type="text" class="form-control form-control-lg" placeholder="Update Note" aria-label="Note"
        aria-describedby="basic-addon2" bind:value />
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
    <span on:click={() => handleSelect(item)}>
      {item.note}
    </span>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close" 
    on:click={()=> {deleteNote(item.id).then(listNotes)}} >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  {/each}
  {#if displaySearch}
  <button class="button btn-warning float-right text-white font-weight-bold" 
    on:click={clearSearch}>
    <span aria-hidden="true">Clear Search</span>
  </button>
  {/if}
</div>
{#await promise}
  <p>Work work...</p>
{:catch error}
  <p class="errorMessage">Something went wrong: {error.message}</p>
{/await}