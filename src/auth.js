import { writable, get } from 'svelte/store';
import Auth from '@aws-amplify/auth';

let _user = localStorage.getItem('amplifyUser');
export const store = writable(_user ? JSON.parse(_user) : null);
store.subscribe((value) => {
  if (value) localStorage.setItem('amplifyUser', JSON.stringify(value));
  else localStorage.removeItem('amplifyUser'); // for logout
});
export const logout = () => store.set(null);
export const loginFormState = writable({
  username: '',
  password: '',
  email: '',
  confirmCode: null,
  confirmingUser: null
});
export async function signIn() {
  return Auth.signIn(
    get(loginFormState).username,
    get(loginFormState).password
  ).then((data) => void store.set(data));
}
export async function signUp() {
  return Auth.signUp({
    username: get(loginFormState).username,
    password: get(loginFormState).password,
    attributes: {
      email: get(loginFormState).email
    }
  }).then((user) => {
    get(loginFormState).confirmingUser = user;
  });
}
export async function confirmSignUp() {
  if (!get(loginFormState).confirmingUser) {
    console.error({ loginFormState: get(loginFormState) });
    throw new Error('you should be confirming signup right after a signup');
  }
  return Auth.confirmSignUp(
    get(loginFormState).username,
    get(loginFormState).confirmCode
  ).then((data) => {
    store.set(get(loginFormState).confirmingUser);
    get(loginFormState).confirmingUser = null;
  });
}
