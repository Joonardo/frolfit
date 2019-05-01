<template>
  <div>
    <login v-if="!user" />
    <router-view v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { S_USER } from './store';
import Login from '@/views/Login.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Login
  },
  computed: mapState({
    user: S_USER
  })
});
</script>

<style lang="scss">
@import './sass/_base.scss';
@import './sass/_animations.scss';
@import './sass/_components.scss';
</style>
