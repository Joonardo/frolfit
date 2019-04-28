<template>
  <div class="container">
    <h1>FROLFIT</h1>
    <div class="content" v-if="user === null">
      <login-buttons
        v-if="view === View.Start"
        @signup="view = View.SignUp"
        @signin="view = View.SignIn"
      />
      <sign-up-form v-else-if="view === View.SignUp" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import { S_USER, M_SET_USER } from '../store';
import { loginRequest } from '../utils/api';
import LoginButtons from '@/components/login/LoginButtons.vue';
import SignUpForm from '@/components/login/SignUpForm.vue';

enum View {
  Start,
  SignUp,
  SignIn
}

export default Vue.extend({
  name: 'Login',
  components: {
    LoginButtons,
    SignUpForm
  },
  data: function() {
    return {
      View,
      view: View.Start
    };
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
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  padding: 10rem 0;
  background-image: url('../assets/bg.png');
  background-size: contain;
}

h1 {
  font-weight: 200;
  text-align: center;
  font-size: 8rem;
}

.content {
  margin: 0 auto;
}
</style>
