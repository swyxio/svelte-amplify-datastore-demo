<script>
  import { store, signUp, signIn, confirmSignUp, loginFormState } from './stores/auth.js'
  let mode = localStorage.getItem('svelteLoginMode') || 'signup'
  let isSigningIn = mode === 'signin'
  let promise // nothing to start with
  function toggleMode() {
    if (mode === 'signup') mode = 'signin'
    else mode = 'signup'
    localStorage.setItem('svelteLoginMode', mode)
  }
  function handleSubmit() {
    if (mode === 'signup') {
      promise = signUp().then(() => {
        mode = 'confirm'
      })
    } else if (mode === 'confirm') {
      promise = confirmSignUp()
    } else {
      promise = signIn()
    }
  }
</script>
<div>
  {#await promise}
    <p>Logging in...</p>
  {:catch error}
    <p class="errorMessage">Something went wrong: {error.message}</p>
  {/await}
  <div class="SwitchContainer">
    <label class="switch">
      <input type="checkbox" on:click={toggleMode} bind:checked={isSigningIn}>
      <span class="slider round"></span>
    </label>
    {#if mode === 'signin'}
    Switch to Sign Up
    {:else}
    Switch to Sign In
    {/if}
  </div>
  {#if mode === 'signin'}
    <h1>Sign In</h1>
  {:else if mode === 'confirm'}
    <h1>Confirm Signup</h1>
  {:else}
    <h1>Sign Up</h1>
  {/if}
  <form on:submit|preventDefault={handleSubmit}>
    {#if mode !== 'confirm'}
    <label>
      Username:
      <input type="text" bind:value={$loginFormState.username} placeholder="your username"/>
    </label>
    <label>
      Password:
      <input type="password" bind:value={$loginFormState.password} />
    </label>
    {/if}
    {#if mode === 'signup'}
      <label>
        Email (for confirmation code):
        <input type="email" bind:value={$loginFormState.email} placeholder="real@email.com"/>
      </label>
    {/if}
    {#if mode === 'confirm'}
      <label>
        6 digit Confirmation:
        <input type="text" bind:value={$loginFormState.confirmCode} placeholder="e.g. 123456"/>
      </label>
    {/if}
    <button type="submit">Submit</button>
  </form>
</div>



<style>
  .errorMessage {
    background: papayawhip;
    color: red;
    padding: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 0 auto;
  }
  label {
    text-align: left;
    display: flex;
    align-items: center;
    margin: 0 0 1em 0;
    justify-content: space-between;
  }
  button[type="submit"] {
    grid-column: 1 / 3
  }
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .SwitchContainer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked+.slider {
    background-color: #2196F3;
  }

  input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>