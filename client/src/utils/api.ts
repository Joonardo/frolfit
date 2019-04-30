import axios from 'axios';

import { Player } from './@types';
import * as query from './queries';

const API_URL = `/api/graphql`;

const sendPost = async (query: string, variables?: object) => {
  const data = await axios.post(API_URL, {
    query,
    variables
  });
  return data.data.data;
}

export const loginRequest = async () => {
  try {
    const data = await sendPost(query.loginQuery);
    return <Player | null>data.me;
  } catch (e) {
    return null;
  }
}

export const signupRequest = async (username: string, email: string) => {
  const data = await sendPost(query.signupMutation, { username, email });
  return <Player | null>data.user;
}

export const sendLoginLinkRequest = async (email: string) => {
  const data = await sendPost(query.sendTokenLinkMutation, { email });
  return <boolean>data.result;
}
