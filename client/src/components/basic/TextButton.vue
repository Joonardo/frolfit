<template>
  <button v-on="$listeners" :class="{ secondary, loading }" v-bind="$attrs">
    <slot />
    <div class="svg-container" v-if="loading">
      <svg viewBox="0 0 24 24">
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
    </div>
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
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss" scoped>
button {
  position: relative;
  border: none;
  color: white;
  padding: 1.4rem 2rem;
  border-radius: 1rem;
  font-size: 2rem;
  background: $color-primary;

  svg {
    fill: white;
  }

  &:disabled {
    background: $color-gray;
  }

  &.secondary {
    background: transparent;
    color: $color-black;
    border: solid 1px $color-gray;
    padding: 1rem 1.6rem;

    &:disabled {
      opacity: 0.5;
    }

    svg {
      fill: $color-black;
    }
  }

  &.loading {
    color: transparent;
  }
}
.svg-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

svg {
  height: 1.6rem;
  width: 1.6rem;
  animation: spin 0.7s linear;
  animation-iteration-count: infinite;
}
</style>
