<template>
  <div>
    <label :for="id">
      {{ text }}
    </label>
    <input
      v-bind="$attrs"
      :id="id"
      type="text"
      :value="value"
      @input="e => $emit('input', e.target.value)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TextInput',
  props: {
    value: {
      type: String,
      required: true
    },
    text: {
      type: String
    },
    id: {
      type: String
    }
  }
});
</script>

<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: column;
}
label {
  padding-bottom: 4px;
  padding-left: 1.4rem;
  font-size: 1.6rem;
}

input {
  border: solid 1px $color-gray;
  padding: 1.4rem;
  font-size: 2rem;
  border-radius: 1rem;
  outline: none;

  &:focus {
    border-color: $color-secondary;
  }
}
</style>
