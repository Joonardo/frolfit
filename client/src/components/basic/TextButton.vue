<template>
  <button v-on="$listeners" :class="{ secondary }">
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TextButton',
  props: {
    secondary: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss" scoped>
button {
  background: none;
  border: none;
  color: white;
  padding: 1.4rem 2rem;
  border-radius: 1rem;
  font-size: 2rem;
  background-image: $bg-linear;

  &.secondary {
    background: transparent;
    color: $color-black;
    border: solid 2px $color-black;
    padding: 1rem 1.6rem;
  }
}
</style>
