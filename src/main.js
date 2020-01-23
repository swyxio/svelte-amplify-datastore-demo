import App from './App.svelte';

// or if you don't want to install all the categories
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import aws_exports from './aws-exports';

// in this way you are only importing Auth and configuring it.
Amplify.configure(aws_exports);

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

export default app;
