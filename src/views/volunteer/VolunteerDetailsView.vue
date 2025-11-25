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

                <v-list-item v-if="currentVolunteer.linkedin" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-linkedin" color="blue-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>
                    <a :href="currentVolunteer.linkedin" target="_blank" class="text-decoration-none text-primary">
                      {{ currentVolunteer.linkedin }}
                    </a>
                  </v-list-item-title>
                  <v-list-item-subtitle>LinkedIn</v-list-item-subtitle>
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
                    <span v-else class="text-body-2 text-medium-emphasis">Não tem dados de histórico de status</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>Status Atual</v-list-item-subtitle>
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
                @update:model-value="updateVolunteerStatus"
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
              <v-timeline v-if="sortedStatusHistory && sortedStatusHistory.length > 0" density="compact" align="start">
                <v-timeline-item
                  v-for="historyItem in sortedStatusHistory"
                  :key="historyItem.id"
                  :dot-color="getStatusColor(historyItem.status.name)"
                  size="small"
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex align-center">
                      <strong class="mr-2">{{ historyItem.status.name }}</strong>
                      <span class="text-caption text-medium-emphasis">{{ formatDateTime(historyItem.created_at) }}</span>
                    </div>
                    <div class="text-body-2 text-medium-emphasis mt-1">{{ historyItem.status.description }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
              <v-alert v-else type="info" variant="tonal" class="mt-2">
                Nenhum histórico de status encontrado para este voluntário.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    
    <div v-else class="d-flex justify-center align-center w-100" style="min-height: 400px;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useVolunteerStore } from '@/stores/volunteer.js';

const route = useRoute();
const volunteerStore = useVolunteerStore();

const selectedStatusId = ref(null);

const currentVolunteer = computed(() => volunteerStore.currentVolunteer);
const statuses = computed(() => volunteerStore.statuses);

const sortedStatusHistory = computed(() => {
  if (currentVolunteer.value && currentVolunteer.value.status_history) {
    return [...currentVolunteer.value.status_history].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  return [];
});

onMounted(async () => {
  const volunteerId = route.params.id;
  await volunteerStore.fetchStatuses();
  await volunteerStore.fetchVolunteer(volunteerId);
  
  if (currentVolunteer.value) {
    selectedStatusId.value = currentVolunteer.value.status_id;
  }
});

const updateVolunteerStatus = async () => {
  if (selectedStatusId.value && currentVolunteer.value && selectedStatusId.value !== currentVolunteer.value.status_id) {
    await volunteerStore.updateVolunteerStatus(currentVolunteer.value.id, selectedStatusId.value);
  }
};

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString();
};

const getStatusColor = (statusName) => {
  switch (statusName) {
    case 'INTERESTED': return 'warning';
    case 'CONTACTED': return 'info';
    case 'SCREENING': return 'deep-purple';
    case 'ACTIVE': return 'success';
    case 'INACTIVE': return 'error';
    default: return 'grey';
  }
};
</script>
