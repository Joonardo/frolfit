<template>
  <div>
    <div id="header">
      <button v-for="(tab, idx) in tabs" :key="idx" @click="select(idx)">
        {{ tab.name }}
      </button>
    </div>
    <div id="content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

interface ITab extends Vue {
  show: () => void;
  unshow: () => void;
  name: string;
}

export default Vue.extend({
  data() {
    return {
      tabs: [] as ITab[],
      current: 0
    };
  },
  methods: {
    select(idx: number) {
      this.tabs[this.current].unshow();
      this.tabs[idx].show();
      this.current = idx;
    }
  },
  mounted() {
    this.tabs = this.$children as any;
    this.tabs[this.current].show();
  },
});
</script>
