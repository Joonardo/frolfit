<template>
  <div class="menu">
    <menu-icon id="nav-drawer-icon" @click="open = !open" />
    <div class="shadow" v-if="open">
      <div class="drawer">
        <ul class="nav-items">
          <li><home-icon /> Home</li>
          <li><courses-icon /> Courses</li>
          <li><join-game-icon /> Join game</li>
        </ul>
        <p class="logout-btn" @click="handleLogoutClick">Logout</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations } from 'vuex';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import JoinGameIcon from 'vue-material-design-icons/AccountPlus.vue';
import HomeIcon from 'vue-material-design-icons/Home.vue';
import CoursesIcon from 'vue-material-design-icons/Map.vue';
import { logoutRequest } from '../../utils/api';
import { M_SET_USER } from '../../store';

export default Vue.extend({
  name: 'NavigationDrawer',
  components: {
    MenuIcon,
    HomeIcon,
    CoursesIcon,
    JoinGameIcon
  },
  data: function() {
    return {
      open: false
    };
  },
  methods: {
    ...mapMutations({
      setUser: M_SET_USER
    }),
    async handleLogoutClick(): Promise<void> {
      const result = await logoutRequest();
      if (result) {
        this.setUser({ user: null });
        window.location.reload();
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.shadow {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
}

.drawer {
  display: grid;
  align-content: space-between;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: white;
  padding: 2rem;
  padding-top: 6rem;
  font-size: 2rem;
  width: 20rem;
}

.nav-items {
  list-style: none;

  li {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-gap: 1rem;
    margin-bottom: 1rem;
  }
}

.logout-btn {
  text-align: center;
}
</style>

<style lang="scss">
#nav-drawer-icon > svg {
  position: fixed;
  fill: $color-black;
  height: 5rem;
  width: 5rem;
  padding: 1rem;
  display: block;
  top: 0;
  right: 0;
  z-index: 1000;
}
</style>
