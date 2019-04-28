<template>
  <div class="container">
    <h1>FROLFIT</h1>
    <div class="button-container" v-if="user === null">
      <text-button>
        Sign up
      </text-button>
      <text-button secondary>
        Sign in
      </text-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import { S_USER, M_SET_USER } from '../store';
import { loginRequest } from '../utils/api';
import TextButton from '@/components/basic/TextButton.vue';

export default Vue.extend({
  name: 'Login',
  components: {
    TextButton
  },
  computed: mapState({
    user: S_USER
  }),
  methods: {
    ...mapMutations({
      setUser: M_SET_USER
    })
  },
  mounted: async function() {
    this.setUser({ user: await loginRequest() });
  }
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100vh;
  width: 100vw;
  background-image: url('../assets/bg.png');
  background-size: contain;
}

h1 {
  font-weight: 200;
  text-align: center;
  font-size: 8rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 19rem;
  height: 13rem;
  margin: 0 auto;
}
</style>
