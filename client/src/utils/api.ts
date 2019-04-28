import axios from 'axios';

import { Player } from './@types';
import * as query from './queries';

const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/graphql`;

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