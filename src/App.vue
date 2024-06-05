<template>
  <div id="app">
    <div id="nav" v-if="currentRouteMeta?.showNavBar">
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink>
    </div>
    <RouterView />
  </div>
</template>

<style lang="scss">
@import 'assets/my.scss';

// Import Bootstrap and BootstrapVue source SCSS files
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import '../node_modules/bootstrap-vue-next/src/styles/styles.scss';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/bootstrap';
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #714216;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #aecf00;

    &.router-link-exact-active {
      color: #714216;
    }
  }
}
</style>

<script setup lang="ts">
import { useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import api from './api'
import { ref } from 'vue'
import { useToast } from 'bootstrap-vue-next'

const currentRoute = useRoute()
const router = useRouter()
const currentRouteMeta = ref<any>(null)
const toast = useToast()

async function onCreated() {
  // fillRouteInfo(currentRoute)
  router.onError((err) =>
    toast.show?.({
      props: { body: err.message, title: 'Navigation error', variant: 'danger', solid: true }
    })
  )
  router.afterEach((to, from) => fillRouteInfo(to))
  router.beforeEach(async (to, from, next) => {
    const loggedIn = await api.authorized()
    if (!loggedIn && to.fullPath.startsWith('/app')) {
      next('/')
    } else if (loggedIn && to.name === 'Home') {
      next('/app/conferences')
    } else {
      next()
    }
  })

  if (await api.authorized()) {
    if (currentRoute != null && currentRoute.name === 'Home') {
      router.push('/app/conferences')
    }
  } else {
    if (currentRoute.fullPath !== '/' && currentRoute.fullPath !== '/apply') {
      router.push('/')
    }
  }
}

function fillRouteInfo(route: RouteLocationNormalizedLoaded) {
  currentRouteMeta.value = route.meta
}
</script>
