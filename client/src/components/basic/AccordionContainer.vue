<template>
  <div class="accordion-container">
    <div class="header" @click="handleHeadingClick">
      <div>
        <slot name="header" />
      </div>
      <chevron-down-icon class="chevron-svg" v-if="!isOpen" />
      <chevron-up-icon class="chevron-svg" v-else />
    </div>
    <div class="contents" v-if="isOpen">
      <slot name="contents" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown.vue';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp.vue';

export default Vue.extend({
  name: 'AccordionContainer',
  components: {
    ChevronDownIcon,
    ChevronUpIcon
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    selfControlled: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      internalOpen: false
    };
  },
  computed: {
    isOpen(): boolean {
      return this.open || (this.selfControlled && this.internalOpen);
    }
  },
  methods: {
    handleHeadingClick() {
      this.$emit('toggle');
      this.internalOpen = !this.internalOpen;
    }
  }
});
</script>

<style lang="scss" scoped>
.accordion-container {
  background: transparent;
  border: 1px solid $color-gray;
  border-radius: 1rem;
}

.header {
  padding: 1rem;
  font-size: 2rem;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr min-content;
}

.contents {
  padding-top: 1rem;
  margin: 1rem;
  margin-top: 0;
  border-top: 0.5px solid $color-gray;
}
</style>

<style lang="scss">
.chevron-svg > svg {
  display: block;
  height: 3rem;
  width: 3rem;
  fill: $color-gray;
}
</style>
