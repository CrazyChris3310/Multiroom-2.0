<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <BCard title="Card Title" no-body>
      <BCard-header header-tag="nav" align="center">
        <BNav card-header tabs>
          <BNavItem href="/app/conferences" exact-active-class="active">Conferences</BNavItem>
          <BNavItem href="/app/profile" exact-active-class="active">Settings</BNavItem>
          <BButton
            variant="outline-primary"
            style="margin-left: auto; margin-bottom: auto"
            @click="doLogout"
            >Logout</BButton
          >
        </BNav>
      </BCard-header>

      <BCard-body class="text-center" style="height: 100%">
        <RouterView></RouterView>
      </BCard-body>
    </BCard>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()

async function doLogout() {
  await api.logout()
  router.push('/')
}
</script>
