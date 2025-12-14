<template>
  <v-app :class="ef">
    <v-app-bar class="header" color="transparent" app elevation="4">
      <div class="w-100 d-flex align-center justify-space-between main-container">
        <a class="d-flex align-center logo">
          <h1 class=" d-none d-sm-block text-h5 font-weight-bold font-semibold primary-color ml-3 logo-text">
            Stars 
          </h1>
        </a>
        <div class="d-flex align-center ga-2">
          <!--v-icon
						v-if="currentTheme.dark"
						variant="text"
						icon="mdi-weather-night"
						size="large"
						color="purple-darken-1"
						class="mr-8 cursor-pointer"
						@click="toggleTheme"
					/-->
          <!--v-icon
						v-if="!currentTheme.dark"
						variant="text"
						icon="mdi-white-balance-sunny"
						size="large"
						color="orange"
						class="mr-8 cursor-pointer"
						@click="toggleTheme"
					/-->
          <!-- v-btn variant="text" class="font-weight-semibold" :to="{ name: 'home' }"> Home </v-btn-->
          <v-btn
            v-if="logged === true"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'onboarding' }"
          >
            Onboarding
          </v-btn>
          <v-btn
            v-if="logged === true"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'dashboard' }"
          >
            Dashboard
          </v-btn>
          <v-btn
            v-if="logged === true"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'volunteers' }"
          >
            Voluntários
          </v-btn>
          <v-btn
            v-if="logged === true"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'squads-list' }"
          >
            Squads
          </v-btn>
          <v-btn
            v-if="logged === true"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'projects-list' }"
          >
            Projetos
          </v-btn>
          <!--v-btn
            v-if="logged === false"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'registry' }"
          >
            Registro
          </v-btn-->
          <!--v-btn
            v-if="logged === false"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'login' }"
          >
            Login
          </v-btn-->
          <!--v-btn
            v-if="logged === false"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'user-register' }"
          >
            Criar Conta
          </v-btn-->
          <v-btn
            v-if="logged === false"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'registry' }"
          >
            Registro
          </v-btn>
          <v-btn
            v-if="logged === false"
            variant="text"
            class="font-weight-semibold"
            :to="{ name: 'search' }"
          >
           Pesquise 
          </v-btn>
          <v-menu v-if="logged === true" open-on-hover>
            <template #activator="{ props }">
              <v-btn variant="text" class="font-weight-semibold" v-bind="props" style="max-width: 200px;">
                <span class="text-truncate">
                  {{ formattedName }}
                </span>
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item link :to="{ name: 'profile' }">
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="auth.logout()">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-app-bar>


    <transition name="fade" mode="out-in">
      <v-main class="d-flex flex-grow-1 " style="margin-top: 64px">
        <RouterView />

    <v-snackbar v-model="snackbarStore.snack.show" v-bind="snackbarStore.snack" location="top right">
      {{ text }}
      <template #actions>
        <v-btn  variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

      </v-main>
    </transition>


  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSnackbarStore } from '@/stores/snackbar'

const snackbarStore = useSnackbarStore()

const auth = useAuthStore()

const route = useRoute()

const logged = computed(() => auth.getName() != '')

console.log('logged', route.path)
const ef = computed(() => (route.path === '/' ? 'homeBackgroundEffect' : ''))

const formattedName = computed(() => {
  const name = auth.getName()
  if (!name) return ''
  
  // Se for email, pega a parte antes do @
  if (name.includes('@')) {
    return name.split('@')[0]
  }
  
  // Se for nome completo, pega o primeiro e segundo nome se couber, senão só o primeiro
  const parts = name.split(' ')
  if (parts.length > 1) {
    // Tenta primeiro + segundo nome
    const shortName = `${parts[0]} ${parts[1]}`
    if (shortName.length <= 15) return shortName
  }
  
  return parts[0]
})

</script>

<style lang="scss">

.header {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.main-container {
  margin-left: 240px;
  margin-right: 240px;
  padding: 0;

  @media (max-width: 1600px) {
    margin-left: 120px;
    margin-right: 120px;
  }
}


.logo {
  cursor: pointer;
  transition: ease-in-out 0.2s;

  &:hover {
    filter: brightness(1.25);
    transition: ease-in-out 0.2s;
  }
}

.drag-none {
  user-select: none;
  -moz-drag-over: none;
  -webkit-user-drag: none;
}

.logo-text {
  font-family: 'Radio Canada', serif !important;
}
</style>
