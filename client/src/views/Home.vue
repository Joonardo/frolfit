<template>
  <div class="home">
    <h1>FROLFIT</h1>
    <div class="accordion">
      <accordion-container
        class="tab"
        :selfControlled="false"
        :open="accordion === Accordion.Course"
        @toggle="handleAccordionToggle(Accordion.Course)"
      >
        <template v-slot:header>
          Course
        </template>
        <template v-slot:contents>
          Choose course
        </template>
      </accordion-container>
      <accordion-container
        class="tab"
        :selfControlled="false"
        :open="accordion === Accordion.Player"
        @toggle="handleAccordionToggle(Accordion.Player)"
      >
        <template v-slot:header>
          Players
        </template>
        <template v-slot:contents>
          Choose players
        </template>
      </accordion-container>
    </div>
    <text-button>
      Start
    </text-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AccordionContainer from '@/components/basic/AccordionContainer.vue';
import TextButton from '@/components/basic/TextButton.vue';

/* eslint-disable no-unused-vars */
enum Accordion {
  None,
  Course,
  Players
}
/* eslint-enable no-unused-vars */

export default Vue.extend({
  name: 'Home',
  components: {
    AccordionContainer,
    TextButton
  },
  data: function() {
    return {
      Accordion,
      accordion: Accordion.Course
    };
  },
  methods: {
    handleAccordionToggle(state: Accordion): void {
      if (this.accordion === state) this.accordion = Accordion.None;
      else this.accordion = state;
    }
  }
});
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-gap: 2rem;
  padding: 2rem;
  justify-items: center;
  align-items: start;
  height: 100vh;
  width: 100vw;
  background-image: url('../assets/bg.png');
  background-size: contain;
}

.accordion {
  display: grid;
  grid-gap: 2rem;
  overflow: auto;
  align-content: start;
  height: calc(100vh - 24rem);
}

.tab {
  width: 35rem;
}
</style>
