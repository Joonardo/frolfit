<template>
  <div class="wrapper">
    <p class="error-text" v-if="error">
      Sign in failed. Please reload the page.
    </p>
    <p class="error-text" v-if="invalidToken">
      The sign in token was incorrect. Please resend the sign in email.
    </p>
    <text-button
      class="button"
      v-if="!processing"
      secondary
      @click="() => $emit('back')"
    >
      Close
    </text-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations } from 'vuex';
import { loginRequest, tokenLoginRequest } from '../../utils/api';
import { M_SET_USER } from '../../store';
import TextButton from '@/components/basic/TextButton.vue';

export default Vue.extend({
  name: 'ConsumeToken',
  components: {
    TextButton
  },
  data: function() {
    return {
      processing: true,
      invalidToken: false,
      error: false
    };
  },
  methods: {
    ...mapMutations({
      setUser: M_SET_USER
    })
  },
  mounted: async function() {
    const parsedUrl = new URL(window.location.href);
    const token = String(parsedUrl.searchParams.get('token'));
    const result = await tokenLoginRequest(token);
    if (result) {
      const user = await loginRequest();
      if (user) this.setUser({ user });
      else this.error = true;
      this.processing = false;
    } else {
      this.invalidToken = true;
      this.processing = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  top: -2rem;
  right: 2rem;
}

.button {
  justify-self: end;
}
</style>
