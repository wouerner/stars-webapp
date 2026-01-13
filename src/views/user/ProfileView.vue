<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-primary mb-4">Seus Dados de Voluntário</h1>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.name" label="Nome completo" variant="outlined" readonly prepend-inner-icon="mdi-account"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.email" label="E-mail" variant="outlined" readonly prepend-inner-icon="mdi-email"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.phone" label="Telefone / WhatsApp" variant="outlined" readonly prepend-inner-icon="mdi-phone"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.discord" label="Discord" variant="outlined" readonly prepend-inner-icon="mdi-discord"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                 <v-text-field v-model="profile.linkedin" label="Perfil do LinkedIn" variant="outlined" readonly prepend-inner-icon="mdi-linkedin"></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            <h3 class="text-secondary mb-3">Informações da Organização</h3>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.squad" label="Squad" variant="outlined" readonly prepend-inner-icon="mdi-account-group"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.jobtitle" label="Cargo / Função" variant="outlined" readonly prepend-inner-icon="mdi-briefcase"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                 <v-text-field v-model="profile.status" label="Status" variant="outlined" readonly prepend-inner-icon="mdi-list-status"></v-text-field>
              </v-col>
            </v-row>
            
            <v-alert v-if="!volunteerFound" type="info" class="mt-3" variant="tonal" icon="mdi-information">
              Perfil de voluntário não encontrado para este usuário. Se você é um voluntário, verifique se o email cadastrado é o mesmo.
            </v-alert>
          </v-form>
        </v-card>
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
  phone: '',
  linkedin: '',
  discord: '',
  squad: '',
  jobtitle: '',
  status: ''
})

onMounted(async () => {
  if (auth.auth.email) {
    try {
      await volunteerStore.fetchByEmail(auth.auth.email)
      const vol = volunteerStore.currentVolunteer
      if (vol) {
         profile.name = vol.name || ''
         profile.phone = vol.phone || ''
         profile.linkedin = vol.linkedin || ''
         profile.discord = vol.discord || ''
         
         profile.squad = vol.squad?.name || 'Sem Squad'
         profile.jobtitle = vol.jobtitle?.title || 'Sem Cargo'
         profile.status = vol.status?.name || 'Sem Status'
         
         volunteerFound.value = true
      } else {
         volunteerFound.value = false;
      }
    } catch (e) {
      console.error("Error fetching volunteer profile", e)
      volunteerFound.value = false
    }
  }
})
</script>
