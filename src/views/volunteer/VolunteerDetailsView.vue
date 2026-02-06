<template>
  <v-container>
    <div v-if="currentVolunteer">
      <div class="d-flex align-center mb-6">
        <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="$router.back()"></v-btn>
        <h1 class="text-h4">Detalhes do Voluntário</h1>
      </div>

      <v-row>
        <!-- Informações Pessoais -->
        <v-col cols="12" md="6">
          <v-card class="h-100" elevation="2">
            <v-card-item>
              <v-card-title class="text-h5 mb-1">{{ currentVolunteer.name }}</v-card-title>
              <v-card-subtitle class="mb-4">Informações de Contato e Cargo</v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <v-list density="compact" bg-color="transparent">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-email" color="primary"></v-icon>
                  </template>
                  <v-list-item-title>{{ currentVolunteer.email }}</v-list-item-title>
                  <v-list-item-subtitle>Email</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="currentVolunteer.phone" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-phone" color="green-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>
                    <a
                      :href="`https://wa.me/${currentVolunteer.phone.replace(/\D/g, '')}`"
                      target="_blank"
                      class="text-decoration-none text-primary"
                    >
                      {{ currentVolunteer.phone }}
                    </a>
                  </v-list-item-title>
                  <v-list-item-subtitle>Telefone / WhatsApp</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="currentVolunteer.linkedin" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-linkedin" color="blue-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>
                    <a
                      :href="currentVolunteer.linkedin"
                      target="_blank"
                      class="text-decoration-none text-primary"
                    >
                      {{ currentVolunteer.linkedin }}
                    </a>
                  </v-list-item-title>
                  <v-list-item-subtitle>LinkedIn</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="currentVolunteer.github" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-github" color="grey-darken-3"></v-icon>
                  </template>
                  <v-list-item-title>
                    <a
                      :href="currentVolunteer.github"
                      target="_blank"
                      class="text-decoration-none text-primary"
                    >
                      {{ currentVolunteer.github }}
                    </a>
                  </v-list-item-title>
                  <v-list-item-subtitle>GitHub</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="currentVolunteer.discord" class="px-0">
                  <template #prepend>
                    <v-icon icon="fa:fab fa-discord" color="indigo-lighten-1"></v-icon>
                  </template>
                  <v-list-item-title>{{ currentVolunteer.discord }}</v-list-item-title>
                  <v-list-item-subtitle>Discord</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="currentVolunteer.job_title" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-briefcase" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>{{ currentVolunteer.job_title.name }}</v-list-item-title>
                  <v-list-item-subtitle>Cargo</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-list-status" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title class="d-flex align-center">
                    <v-chip
                      v-if="currentVolunteer.status"
                      :color="getStatusColor(currentVolunteer.status.name)"
                      size="small"
                      class="font-weight-bold"
                      variant="flat"
                    >
                      {{ currentVolunteer.status.name }}
                    </v-chip>
                    <span v-else class="text-body-2 text-medium-emphasis"
                      >Não tem dados de histórico de status</span
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle>Status Atual</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="currentVolunteer.squad" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-account-group" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>{{ currentVolunteer.squad.name }}</v-list-item-title>
                  <v-list-item-subtitle>Squad</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon
                      icon="mdi-heart"
                      :color="currentVolunteer.is_apoiase_supporter ? 'pink' : 'grey'"
                    ></v-icon>
                  </template>
                  <v-list-item-title class="d-flex align-center">
                    <span
                      v-if="currentVolunteer.is_apoiase_supporter"
                      class="text-pink font-weight-bold"
                      >Apoiador APOIA.se</span
                    >
                    <span v-else>Não é apoiador</span>
                    <v-btn
                      icon="mdi-refresh"
                      size="x-small"
                      variant="text"
                      color="primary"
                      class="ml-2"
                      :loading="isCheckingApoiase"
                      title="Verificar status APOIA.se"
                      @click="checkApoiaseStatus"
                    ></v-btn>
                  </v-list-item-title>
                  <v-list-item-subtitle>Status de Apoio</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gerenciar Status -->
        <v-col cols="12" md="6">
          <v-card class="h-100" elevation="2">
            <v-card-item>
              <v-card-title class="text-h6">Gerenciar Status</v-card-title>
            </v-card-item>
            <v-card-text>
              <p class="text-body-2 mb-4">Atualize o status do voluntário no processo seletivo.</p>
              <v-select
                v-model="selectedStatusId"
                :items="statuses"
                item-title="name"
                item-value="id"
                label="Selecione o novo status"
                variant="outlined"
                color="primary"
                hide-details
                :loading="isLoadingStatus"
                :disabled="isLoadingStatus"
                @update:model-value="updateVolunteerStatus"
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gerenciar Squad -->
        <v-col cols="12" md="6">
          <v-card class="h-100" elevation="2">
            <v-card-item>
              <v-card-title class="text-h6">Gerenciar Squad</v-card-title>
            </v-card-item>
            <v-card-text>
              <p class="text-body-2 mb-4">Atualize a Squad do voluntário.</p>
              <v-select
                v-model="selectedSquadId"
                :items="squads"
                item-title="name"
                item-value="id"
                label="Selecione a nova Squad"
                variant="outlined"
                color="primary"
                hide-details
                :loading="isLoadingSquad"
                :disabled="isLoadingSquad"
                @update:model-value="updateVolunteerSquad"
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gerenciar Tipo de Voluntário -->
        <v-col cols="12" md="6">
          <v-card class="h-100" elevation="2">
            <v-card-item>
              <v-card-title class="text-h6">Gerenciar Tipo</v-card-title>
            </v-card-item>
            <v-card-text>
              <p class="text-body-2 mb-4">Atualize o nível/tipo do voluntário.</p>
              <v-select
                v-model="selectedTypeId"
                :items="volunteerTypes"
                item-title="name"
                item-value="id"
                label="Selecione o novo tipo"
                variant="outlined"
                color="primary"
                hide-details
                :loading="isLoadingType"
                :disabled="isLoadingType"
                @update:model-value="updateVolunteerType"
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Histórico -->
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-item>
              <v-card-title class="text-h6">Histórico de Alterações</v-card-title>
            </v-card-item>
            <v-card-text>
              <v-timeline
                v-if="sortedStatusHistory && sortedStatusHistory.length > 0"
                density="compact"
                align="start"
              >
                <v-timeline-item
                  v-for="historyItem in sortedStatusHistory"
                  :key="historyItem.id"
                  :dot-color="getStatusColor(historyItem.status.name)"
                  size="small"
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex align-center">
                      <strong class="mr-2">{{ historyItem.status.name }}</strong>
                      <span class="text-caption text-medium-emphasis">{{
                        formatDateTime(historyItem.created_at)
                      }}</span>
                    </div>
                    <div class="text-body-2 text-medium-emphasis mt-1">
                      {{ historyItem.status.description }}
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
              <v-alert v-else type="info" variant="tonal" class="mt-2">
                Nenhum histórico de status encontrado para este voluntário.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Feedbacks -->
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-item class="d-flex justify-space-between align-center">
              <div class="d-flex justify-space-between w-100 align-center">
                <v-card-title class="text-h6">Feedbacks</v-card-title>
                <v-btn
                  v-if="authStore.auth.email"
                  color="primary"
                  size="small"
                  variant="flat"
                  prepend-icon="mdi-plus"
                  @click="openFeedbackDialog()"
                >
                  Adicionar
                </v-btn>
              </div>
            </v-card-item>
            <v-card-text>
              <div
                v-if="!currentVolunteer.feedbacks || currentVolunteer.feedbacks.length === 0"
                class="text-center text-caption text-medium-emphasis py-4"
              >
                <v-icon
                  icon="mdi-message-text-outline"
                  size="large"
                  class="mb-2 text-disabled"
                ></v-icon>
                <div>Nenhum feedback ainda.</div>
              </div>
              <v-list v-else lines="three" class="pa-0">
                <template
                  v-for="(feedback, index) in currentVolunteer.feedbacks"
                  :key="feedback.id"
                >
                  <v-list-item class="px-0">
                    <template #prepend>
                      <v-avatar color="grey-lighten-3" size="40" class="mr-3">
                        <span class="text-h6 font-weight-bold text-grey-darken-2">
                          {{ feedback.author?.email?.[0]?.toUpperCase() || '?' }}
                        </span>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-body-2 font-weight-bold">
                      {{ feedback.author?.email }}
                      <span class="text-caption text-medium-emphasis ml-2">
                        {{ formatDateTime(feedback.created_at) }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="mt-2 text-body-2 text-high-emphasis"
                      style="white-space: pre-wrap"
                    >
                      {{ feedback.content }}
                    </v-list-item-subtitle>

                    <template v-if="canEdit(feedback)" #append>
                      <div class="d-flex gap-1">
                        <v-btn
                          icon="mdi-pencil"
                          size="small"
                          variant="text"
                          color="primary"
                          @click="editFeedback(feedback)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          variant="text"
                          color="error"
                          @click="confirmDelete(feedback)"
                        ></v-btn>
                      </div>
                    </template>
                  </v-list-item>
                  <v-divider
                    v-if="index < currentVolunteer.feedbacks.length - 1"
                    class="my-2"
                  ></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Feedback Dialog -->
      <v-dialog v-model="feedbackDialog" max-width="500px">
        <v-card class="rounded-lg">
          <v-card-title class="text-h6 px-6 py-4 border-b">
            {{ feedbackForm.id ? 'Editar Feedback' : 'Novo Feedback' }}
          </v-card-title>
          <v-card-text class="pt-4 px-6">
            <v-textarea
              v-model="feedbackForm.content"
              label="Seu feedback"
              placeholder="Escreva aqui seu feedback sobre o voluntário..."
              variant="outlined"
              rows="4"
              auto-grow
              :rules="[(v) => !!v || 'Campo obrigatório']"
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="px-6 pb-4 pt-0 justify-end">
            <v-btn color="grey-darken-1" variant="text" @click="feedbackDialog = false"
              >Cancelar</v-btn
            >
            <v-btn
              color="primary"
              variant="flat"
              :loading="feedbackLoading"
              :disabled="!feedbackForm.content"
              @click="saveFeedback"
              >Salvar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card class="rounded-lg">
          <v-card-title class="text-h6 px-6 py-4">Excluir Feedback?</v-card-title>
          <v-card-text class="px-6 pb-2">
            Tem certeza que deseja excluir este feedback? Esta ação não pode ser desfeita.
          </v-card-text>
          <v-card-actions class="px-6 pb-4 justify-end">
            <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false"
              >Cancelar</v-btn
            >
            <v-btn color="error" variant="flat" :loading="feedbackLoading" @click="deleteFeedback"
              >Excluir</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div v-else class="d-flex justify-center align-center w-100" style="min-height: 400px">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useVolunteerStore } from '@/stores/volunteer.js'
import { useSquadStore } from '@/stores/squad.js'
import { useVolunteerTypeStore } from '@/stores/volunteerType.js'
import feedbackService from '@/services/feedback.js'
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute()
const volunteerStore = useVolunteerStore()
const squadStore = useSquadStore()
const volunteerTypeStore = useVolunteerTypeStore()
const authStore = useAuthStore()

const selectedStatusId = ref(null)
const selectedSquadId = ref(null)
const selectedTypeId = ref(null)
const isLoadingStatus = ref(false)
const isLoadingSquad = ref(false)
const isLoadingType = ref(false)
const isCheckingApoiase = ref(false)

// Feedback State
const feedbackDialog = ref(false)
const deleteDialog = ref(false)
const feedbackForm = ref({
  id: null,
  content: ''
})
const feedbackToDelete = ref(null)
const feedbackLoading = ref(false)

const canEdit = (feedback) => {
  return authStore.auth.email && feedback.author && authStore.auth.email === feedback.author.email
}

const openFeedbackDialog = () => {
  feedbackForm.value = { id: null, content: '' }
  feedbackDialog.value = true
}

const editFeedback = (feedback) => {
  feedbackForm.value = {
    id: feedback.id,
    content: feedback.content
  }
  feedbackDialog.value = true
}

const saveFeedback = async () => {
  if (!feedbackForm.value.content) return

  feedbackLoading.value = true
  try {
    if (feedbackForm.value.id) {
      // Update
      const updatedFeedback = await feedbackService.update(feedbackForm.value.id, {
        content: feedbackForm.value.content
      })
      const index = currentVolunteer.value.feedbacks.findIndex((f) => f.id === updatedFeedback.id)
      if (index !== -1) {
        // Update local state, keeping author info
        currentVolunteer.value.feedbacks[index] = {
          ...currentVolunteer.value.feedbacks[index],
          ...updatedFeedback
        }
      }
    } else {
      // Create
      const newFeedback = await feedbackService.create(currentVolunteer.value.id, {
        content: feedbackForm.value.content
      })
      if (!currentVolunteer.value.feedbacks) currentVolunteer.value.feedbacks = []
      currentVolunteer.value.feedbacks.unshift(newFeedback)
    }
    feedbackDialog.value = false
  } catch (e) {
    console.error('Error saving feedback', e)
    alert('Erro ao salvar feedback')
  } finally {
    feedbackLoading.value = false
  }
}

const confirmDelete = (feedback) => {
  feedbackToDelete.value = feedback
  deleteDialog.value = true
}

const deleteFeedback = async () => {
  if (!feedbackToDelete.value) return

  feedbackLoading.value = true
  try {
    await feedbackService.delete(feedbackToDelete.value.id)
    currentVolunteer.value.feedbacks = currentVolunteer.value.feedbacks.filter(
      (f) => f.id !== feedbackToDelete.value.id
    )
    deleteDialog.value = false
  } catch (e) {
    console.error('Error deleting feedback', e)
    alert('Erro ao excluir feedback')
  } finally {
    feedbackLoading.value = false
    feedbackToDelete.value = null
  }
}

const currentVolunteer = computed(() => volunteerStore.currentVolunteer)
const statuses = computed(() => volunteerStore.statuses)
const squads = computed(() => squadStore.squads)
const volunteerTypes = computed(() => volunteerTypeStore.data)

const sortedStatusHistory = computed(() => {
  if (currentVolunteer.value && currentVolunteer.value.status_history) {
    return [...currentVolunteer.value.status_history].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  }
  return []
})

onMounted(async () => {
  const volunteerId = route.params.id
  await Promise.all([
    volunteerStore.fetchStatuses(),
    squadStore.fetchAllSquads(),
    volunteerTypeStore.fetchVolunteerTypes(),
    volunteerStore.fetchVolunteer(volunteerId)
  ])

  if (currentVolunteer.value) {
    selectedStatusId.value = currentVolunteer.value.status_id
    selectedSquadId.value = currentVolunteer.value.squad_id
    selectedTypeId.value = currentVolunteer.value.volunteer_type_id
  }
})

const checkApoiaseStatus = async () => {
  if (!currentVolunteer.value) return

  isCheckingApoiase.value = true
  try {
    await volunteerStore.checkApoiaseStatus(currentVolunteer.value.id)
  } finally {
    isCheckingApoiase.value = false
  }
}

const updateVolunteerStatus = async () => {
  if (
    selectedStatusId.value &&
    currentVolunteer.value &&
    selectedStatusId.value !== currentVolunteer.value.status_id
  ) {
    isLoadingStatus.value = true
    try {
      await volunteerStore.updateVolunteerStatus(currentVolunteer.value.id, selectedStatusId.value)
    } finally {
      isLoadingStatus.value = false
    }
  }
}

const updateVolunteerSquad = async () => {
  if (
    selectedSquadId.value &&
    currentVolunteer.value &&
    selectedSquadId.value !== currentVolunteer.value.squad_id
  ) {
    isLoadingSquad.value = true
    try {
      await volunteerStore.updateVolunteerSquad(currentVolunteer.value.id, selectedSquadId.value)
    } finally {
      isLoadingSquad.value = false
    }
  }
}

const updateVolunteerType = async () => {
  if (
    selectedTypeId.value &&
    currentVolunteer.value &&
    selectedTypeId.value !== currentVolunteer.value.volunteer_type_id
  ) {
    isLoadingType.value = true
    try {
      await volunteerStore.updateVolunteerType(currentVolunteer.value.id, selectedTypeId.value)
    } finally {
      isLoadingType.value = false
    }
  }
}

const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString()
}

const getStatusColor = (statusName) => {
  switch (statusName) {
    case 'INTERESTED':
      return 'warning'
    case 'CONTACTED':
      return 'info'
    case 'SCREENING':
      return 'deep-purple'
    case 'ACTIVE':
      return 'success'
    case 'INACTIVE':
      return 'error'
    default:
      return 'grey'
  }
}
</script>
