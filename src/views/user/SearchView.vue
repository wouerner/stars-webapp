<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col  xl="6" sm="12"  align="center">
        <v-form @submit.prevent="onClick">
          <v-text-field
              v-model="email.value"
              placeholder="Ex: example@teste.com"
              label="Pesquise seu email"
              :loading="loading"
              append-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
              clearable
              @click:append-inner="onClick"
              ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col xl="6"  sm="12" align="center">
          <v-card v-if="volunteerStore.currentVolunteer" align="left" class="pa-4">
              <p class="pa-1">Nome: <strong>{{volunteerStore.currentVolunteer.name}}</strong></p>
              <p class="pa-1"> <strong>{{volunteerStore.currentVolunteer.phone}}</strong></p>
              <p class="pa-1"> Linkedin: <strong>{{volunteerStore.currentVolunteer.linkedin}}</strong></p>
              <p class="pa-1"> Cargo: <strong>{{job.title}}</strong></p>
              <p class="pa-1">Status: <strong>  <v-chip v-if="volunteerStore.currentVolunteer.is_active">Ativo</v-chip></strong></p>
              
              <v-divider class="my-3"></v-divider>
              <div class="d-flex justify-end">
                  <v-btn 
                    color="primary" 
                    :loading="sendingLink"
                    :disabled="linkSent"
                    @click="requestEdit"
                  >
                      {{ linkSent ? 'Link Enviado' : 'Editar Meus Dados' }}
                  </v-btn>
              </div>
          </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top right">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useVolunteerStore } from '@/stores/volunteer.js'
import { useJobtitleStore } from '@/stores/jobtitle.js'
import volunteerService from '@/services/volunteer.js'
import { useRoute } from 'vue-router'

const volunteerStore = useVolunteerStore()
const jobtitleStore = useJobtitleStore()
jobtitleStore.fetchJobtitles()

const loading = ref(false)
const sendingLink = ref(false)
const searchedEmail = ref('')
const linkSent = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const job = computed( () => {
    if (jobtitleStore.data.length === 0) return ''
    if (!volunteerStore.currentVolunteer) return ''

    const d = jobtitleStore.data.filter(x => x.id === volunteerStore.currentVolunteer.jobtitle_id)
    return d.length > 0 ? d[0] : ''
})


const email = reactive({
  value: '',
})

const route = useRoute()

onMounted(async () => {
  if (route.query.email) {
    email.value = route.query.email
    await onClick()
  }
})

const onClick = async () => {
    loading.value = true
    linkSent.value = false // Reset linkSent on new search
    try {
        await volunteerStore.fetchByEmail(email.value)
        searchedEmail.value = email.value
    } finally {
        loading.value = false
    }
}

const requestEdit = async () => {
    if (!searchedEmail.value) {
        searchedEmail.value = email.value
    }
    
    sendingLink.value = true
    try {
        await volunteerService.requestEditLink(searchedEmail.value)
        linkSent.value = true // Disable button after successful send
        snackbar.value = {
            show: true,
            text: 'Link de edição enviado para o seu e-mail! Verifique sua caixa de entrada.',
            color: 'success'
        }
    } catch (error) {
        let msg = 'Erro ao enviar link de edição.';
        if (error.response && error.response.data && error.response.data.detail) {
            msg = error.response.data.detail;
        }
        snackbar.value = {
            show: true,
            text: msg,
            color: 'error'
        }
    } finally {
        sendingLink.value = false
    }
}
</script>
