<template>
  <div class="wrapper">
    <p class="close-btn" @click="() => $emit('back')">X</p>
    <p class="error-text" v-if="error">
      Couldn't send the sign in mail. Please try again.
    </p>
    <p class="info-text">
      Sign in link has been send to <span class="email">{{ email }}</span
      >. Follow the link to sign in to the service or resend the sign in email.
    </p>
    <text-button
      class="button"
      secondary
      :disabled="sending || !email"
      :loading="sending"
      @click="handleResendClick"
    >
      Resend
    </text-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TextButton from '@/components/basic/TextButton.vue';
import { sendLoginLinkRequest } from '../../utils/api';

export default Vue.extend({
  name: 'LinkSend',
  components: {
    TextButton
  },
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      sending: false,
      error: false
    };
  },
  methods: {
    async handleResendClick(): Promise<void> {
      if (!this.email) return;
      this.sending = true;
      this.error = false;
      const result = await sendLoginLinkRequest(this.email);
      if (!result) this.error = true;
      this.sending = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-gap: 2rem;
  position: relative;
  width: 67%;
  margin: auto;
}

.email {
  color: $color-primary;
  text-decoration: underline;
}

.button {
  justify-self: end;
  margin-top: 2rem;
}

.close-btn {
  position: absolute;
  top: -4rem;
  right: 2rem;
}
</style>
