<template>
  <v-container>
    <v-sheet class="pa-4 rounded-lg mb-4">
      <h1 class="mb-8">Detalhes da Squad</h1>
      <v-form v-if="squad">
        <div class="d-flex align-items-center ga-8">
          <div>
            <v-avatar size="140" color="grey-darken-3">
              <span class="text-h2">{{ squad.name?.charAt(0) }}</span>
            </v-avatar>
          </div>
          <div class="w-100">
            <div class="mb-4">
              <label class="text-caption text-grey">Nome</label>
              <p class="text-h5">{{ squad.name }}</p>
            </div>
            <div>
              <label class="text-caption text-grey">Descrição</label>
              <p class="text-body-1">{{ squad.description || 'Sem descrição' }}</p>
            </div>
          </div>
        </div>
        <div class="mt-8 d-flex align-center ga-4">
          <v-btn
            v-if="authStore.auth.email"
            color="primary"
            :to="{ name: 'squad-update', params: { uuid: squad.id || squad.uuid } }"
          >
            Editar
          </v-btn>
          <v-btn color="tertiary" @click="cancel"> Voltar </v-btn>
        </div>
      </v-form>
      <div v-else>
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </v-sheet>

    <v-sheet v-if="squad" class="pa-4 rounded-lg mt-4">
      <h2 class="mb-4">Projetos</h2>
      <v-list v-if="squad.projects?.length > 0">
        <v-list-item
          v-for="project in squad.projects"
          :key="project.id"
          :href="project.link"
          target="_blank"
          prepend-icon="mdi-briefcase-variant"
        >
          <v-list-item-title class="font-weight-bold">{{ project.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ project.description || 'Sem descrição' }}</v-list-item-subtitle>
          <template v-if="project.link" v-slot:append>
            <v-icon size="small">mdi-open-in-new</v-icon>
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="text-center py-4 text-grey">Nenhum projeto associado a esta squad.</div>
    </v-sheet>

    <v-sheet v-if="squad" class="pa-4 rounded-lg mt-4">
      <h2 class="mb-4">Participantes</h2>

      <div v-if="mentors.length > 0">
        <h3 class="text-subtitle-1 text-primary mb-2">Mentores</h3>
        <v-list>
          <v-list-item
            v-for="volunteer in mentors"
            :key="volunteer.id"
            :to="getVolunteerLink(volunteer.id)"
            prepend-icon="mdi-account-school"
          >
            <v-list-item-title class="font-weight-bold">{{ volunteer.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="volunteer.jobtitle">{{
              volunteer.jobtitle.title
            }}</v-list-item-subtitle>
            <v-list-item-subtitle v-else class="text-caption text-grey"
              >Sem cargo definido</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </div>

      <div v-if="juniors.length > 0">
        <h3 class="text-subtitle-1 text-primary mb-2 mt-4">Juniores</h3>
        <v-list>
          <v-list-item
            v-for="volunteer in juniors"
            :key="volunteer.id"
            :to="getVolunteerLink(volunteer.id)"
            prepend-icon="mdi-account"
          >
            <v-list-item-title class="font-weight-bold">{{ volunteer.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="volunteer.jobtitle">{{
              volunteer.jobtitle.title
            }}</v-list-item-subtitle>
            <v-list-item-subtitle v-else class="text-caption text-grey"
              >Sem cargo definido</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </div>

      <div v-if="others.length > 0">
        <h3 class="text-subtitle-1 text-primary mb-2 mt-4">Outros</h3>
        <v-list>
          <v-list-item
            v-for="volunteer in others"
            :key="volunteer.id"
            :to="getVolunteerLink(volunteer.id)"
            prepend-icon="mdi-account-outline"
          >
            <v-list-item-title class="font-weight-bold">{{ volunteer.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="volunteer.jobtitle">{{
              volunteer.jobtitle.title
            }}</v-list-item-subtitle>
            <v-list-item-subtitle v-else class="text-caption text-grey"
              >Sem cargo definido</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </div>

      <div
        v-if="mentors.length === 0 && juniors.length === 0 && others.length === 0"
        class="text-center py-4 text-grey"
      >
        Nenhum participante nesta squad.
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSquadStore } from '@/stores/squad'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const squadStore = useSquadStore()
const authStore = useAuthStore()
const squad = ref(null)

const mentors = computed(
  () => squad.value?.volunteers?.filter((v) => v.volunteer_type?.name === 'Mentor') || []
)
const juniors = computed(
  () => squad.value?.volunteers?.filter((v) => v.volunteer_type?.name === 'Junior') || []
)
const others = computed(
  () =>
    squad.value?.volunteers?.filter(
      (v) => v.volunteer_type?.name !== 'Mentor' && v.volunteer_type?.name !== 'Junior'
    ) || []
)

onMounted(async () => {
  await squadStore.fetch(route.params.uuid)
  squad.value = squadStore.squad
})

function cancel() {
  router.back()
}

function getVolunteerLink(volunteerId) {
  if (authStore.auth.email) {
    return { name: 'volunteer-details', params: { id: volunteerId } }
  } else {
    return { name: 'public-profile', params: { id: volunteerId } }
  }
}
</script>
