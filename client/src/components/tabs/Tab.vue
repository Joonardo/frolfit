<template>
  <div v-show="visible">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    name: { required: true }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    unshow() {
      this.visible = false;
    }
  }
});
</script>
