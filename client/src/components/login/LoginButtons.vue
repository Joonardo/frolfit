<template>
  <div class="start-view">
    <text-button @click="$emit('signup')">
      Sign up
    </text-button>
    <text-button secondary @click="$emit('signin')">
      Sign in
    </text-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TextButton from '@/components/basic/TextButton.vue';

export default Vue.extend({
  name: 'LoginButtons',
  components: {
    TextButton
  }
});
</script>

<style lang="scss" scoped>
.start-view {
  display: grid;
  width: 23rem;
  grid-gap: 4rem;
}
</style>
