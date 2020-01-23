<script>
  import { store, logout } from './auth.js'
</script>
<style>
  pre {
    text-align: left
  }
</style>
<main>
  <h2>You are logged in <button type="button" on:click={logout}>Log Out</button></h2>
  <pre>
    {JSON.stringify($store, null, 2)}
  </pre>
</main>