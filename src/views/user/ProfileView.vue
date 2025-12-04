<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <h1 class="text-primary">Dados pessoais:</h1>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-form>
          <v-text-field v-model="profile.name" label="Nome completo" variant="outlined" readonly>
          </v-text-field>
          <v-text-field v-model="profile.email" label="E-mail" variant="outlined" readonly> </v-text-field>
          <v-text-field v-model="profile.linkedin" label="Perfil do LinkedIn" variant="outlined" readonly>
          </v-text-field>
          
          <v-alert v-if="!volunteerFound" type="warning" class="mt-3">
            Perfil de voluntário não encontrado para este usuário.
          </v-alert>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useVolunteerStore } from '@/stores/volunteer.js'

const auth = useAuthStore()
const volunteerStore = useVolunteerStore()

const volunteerFound = ref(true)

const profile = reactive({
  name: '',
  email: auth.auth.email,
  linkedin: ''
})

onMounted(async () => {
  if (auth.auth.email) {
    try {
      await volunteerStore.fetchByEmail(auth.auth.email)
      if (volunteerStore.currentVolunteer && volunteerStore.currentVolunteer.name) {
         profile.name = volunteerStore.currentVolunteer.name
         profile.linkedin = volunteerStore.currentVolunteer.linkedin
         volunteerFound.value = true
      } else {
         // If fetchByEmail doesn't throw but returns null/empty, or if store logic differs
         // check volunteerStore state
         volunteerFound.value = false;
      }
    } catch (e) {
      console.error("Error fetching volunteer profile", e)
      volunteerFound.value = false
    }
  }
})

</script>
