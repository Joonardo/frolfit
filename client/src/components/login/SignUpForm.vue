<template>
  <div class="wrapper">
    <p class="close-btn" @click="() => $emit('back')">X</p>
    <p class="error-text" v-if="error">An error occured. Try again.</p>
    <text-input text="Username" v-model="username" id="username" autofocus />
    <text-input text="Email" v-model="email" id="email" type="email" />
    <text-button
      class="button"
      :disabled="sending || !isValid"
      :loading="sending"
      @click="handleSubmit"
    >
      Sign up
    </text-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as validator from 'validator';
import TextInput from '@/components/basic/TextInput.vue';
import TextButton from '@/components/basic/TextButton.vue';
import { signupRequest } from '../../utils/api';

export default Vue.extend({
  name: 'SignUpForm',
  components: {
    TextInput,
    TextButton
  },
  data: function() {
    return {
      username: '',
      email: '',
      sending: false,
      error: false
    };
  },
  computed: {
    isValid(): boolean {
      return this.username.length >= 4 && validator.isEmail(this.email);
    }
  },
  methods: {
    async handleSubmit(): Promise<void> {
      if (this.isValid) {
        this.sending = true;
        this.error = false;
        try {
          const user = await signupRequest(this.username, this.email);
          if (user) this.$emit('submitSuccess', this.email);
          else this.error = true;
        } catch (e) {
          this.error = true;
        }
        this.sending = false;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.button {
  justify-self: end;
  margin-top: 2rem;
}

.close-btn {
  position: absolute;
  top: -2rem;
  right: 2rem;
}
</style>
