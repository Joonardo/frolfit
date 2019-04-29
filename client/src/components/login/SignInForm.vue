<template>
  <div class="wrapper">
    <p class="close-btn" @click="() => $emit('back')">X</p>
    <p class="error-text" v-if="error">
      Couldn't send the link. Make sure that the email is correct.
    </p>
    <p class="info-text">
      Use the sign in link from the confirmation email or send a new link to
      your registered email.
    </p>
    <text-input v-model="email" id="email" text="Email" autofocus />
    <text-button
      class="button"
      :disabled="sending || !isValid"
      :loading="sending"
      @click="handleSendClick"
    >
      Send
    </text-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as validator from 'validator';
import TextInput from '@/components/basic/TextInput.vue';
import TextButton from '@/components/basic/TextButton.vue';
import { sendLoginLinkRequest } from '../../utils/api';

export default Vue.extend({
  name: 'SignInForm',
  components: {
    TextInput,
    TextButton
  },
  data: function() {
    return {
      email: '',
      sending: false,
      error: false
    };
  },
  computed: {
    isValid(): boolean {
      return validator.isEmail(this.email);
    }
  },
  methods: {
    async handleSendClick(): Promise<void> {
      if (!this.isValid) return;
      this.sending = true;
      this.error = false;
      const result = await sendLoginLinkRequest(this.email);
      if (result) this.$emit('submitSuccess', this.email);
      else this.error = true;
      this.sending = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  display: grid;
  grid-gap: 2rem;
  width: 67%;
  margin: auto;
}

.info-text {
  padding: 0px 1rem;
}

.button {
  justify-self: end;
  margin-top: 2rem;
}

.close-btn {
  position: absolute;
  top: -4rem;
  right: 1rem;
}
</style>
