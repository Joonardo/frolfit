<template>
  <div class="container">
    <h1>FROLFIT</h1>
    <Tabs>
      <Tab name="Hello">
        Hello tab!
      </Tab>
      <Tab name="Test">
        We are here
      </Tab>
    </Tabs>
    <div class="content" v-if="user === null">
      <login-buttons
        v-if="view === View.Start"
        @signup="view = View.SignUp"
        @signin="view = View.SignIn"
      />
      <sign-up-form
        v-else-if="view === View.SignUp"
        @back="view = View.Start"
        @submitSuccess="handleSubmitSuccess"
      />
      <sign-in-form
        v-else-if="view === View.SignIn"
        @back="view = View.Start"
        @submitSuccess="handleSubmitSuccess"
      />
      <link-send
        v-else-if="view === View.LinkSend"
        :email="email"
        @back="view = View.Start"
      />
      <consume-token
        v-else-if="view === View.Token"
        @back="view = View.Start"
      />
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
import SignInForm from '@/components/login/SignInForm.vue';
import LinkSend from '@/components/login/LinkSend.vue';
import ConsumeToken from '@/components/login/ConsumeToken.vue';
import { Tabs, Tab } from '../components/tabs';

/* eslint-disable no-unused-vars */
enum View {
  Start,
  SignUp,
  SignIn,
  LinkSend,
  Token
}
/* eslint-enable no-unused-vars */

export default Vue.extend({
  name: 'Login',
  components: {
    LoginButtons,
    SignUpForm,
    SignInForm,
    LinkSend,
    ConsumeToken
    Tabs,
    Tab,
  },
  data: function() {
    return {
      View,
      view: View.Start,
      email: undefined as string | undefined
    };
  },
  computed: mapState({
    user: S_USER
  }),
  methods: {
    ...mapMutations({
      setUser: M_SET_USER
    }),
    handleSubmitSuccess(email: string): void {
      this.email = email;
      this.view = View.LinkSend;
    }
  },
  mounted: async function() {
    const parsedUrl = new URL(window.location.href);
    if (parsedUrl.searchParams.has('token')) {
      this.view = View.Token;
      this.setUser({ user: null });
    } else {
      this.setUser({ user: await loginRequest() });
    }
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

.wrapper {
  position: relative;
  display: grid;
  grid-gap: 2rem;
  width: 27rem;
  margin: auto;
}

.content {
  margin: 0 auto;
}
</style>
