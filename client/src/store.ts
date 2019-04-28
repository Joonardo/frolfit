import Vue from 'vue';
import Vuex from 'vuex';
import { Player } from './utils/@types';

Vue.use(Vuex);

// STATE
export const S_USER = 'user';

// MUTATIONS
export const M_SET_USER = 'setUser';

export default new Vuex.Store({
  state: {
    [S_USER]: undefined as Player | null | undefined
  },
  getters: {},
  mutations: {
    [M_SET_USER] (state, { user }) {
      state[S_USER] = user;
    }
  },
  actions: {}
});
