<template>
  <v-container>
    <div v-if="volunteer">
      <div class="d-flex align-center mb-6">
        <h1 class="text-h4">Perfil Público</h1>
      </div>

      <v-row>
        <!-- Informações Pessoais -->
        <v-col cols="12" md="6">
          <v-card class="h-100" elevation="2">
            <v-card-item>
              <v-card-title class="text-h5 mb-1">{{ volunteer.name }}</v-card-title>
              <v-card-subtitle class="mb-4">Informações de Contato e Cargo</v-card-subtitle>
            </v-card-item>
            
            <v-card-text>
              <v-list density="compact" bg-color="transparent">
                
                <v-list-item v-if="volunteer.linkedin" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-linkedin" color="blue-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>
                    <a :href="volunteer.linkedin" target="_blank" class="text-decoration-none text-primary">
                      {{ volunteer.linkedin }}
                    </a>
                  </v-list-item-title>
                  <v-list-item-subtitle>LinkedIn</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="volunteer.discord" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-message-text" color="deep-purple-accent-2"></v-icon>
                  </template>
                  <v-list-item-title>{{ volunteer.discord }}</v-list-item-title>
                  <v-list-item-subtitle>Discord</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="volunteer.jobtitle" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-briefcase" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>{{ volunteer.jobtitle.title }}</v-list-item-title>
                  <v-list-item-subtitle>Cargo</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-list-status" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title class="d-flex align-center">
                    <v-chip 
                      v-if="volunteer.status"
                      :color="getStatusColor(volunteer.status.name)"
                      size="small"
                      class="font-weight-bold"
                      variant="flat"
                    >
                      {{ volunteer.status.name }}
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>Status Atual</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="volunteer.squad" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-account-group" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>{{ volunteer.squad.name }}</v-list-item-title>
                  <v-list-item-subtitle>Squad</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Histórico -->
        <v-col cols="12" md="6">
          <v-card elevation="2" class="h-100">
            <v-card-item>
              <v-card-title class="text-h6">Histórico na SouJunior</v-card-title>
            </v-card-item>
            <v-card-text>
              <v-timeline v-if="sortedStatusHistory && sortedStatusHistory.length > 0" density="compact" align="start" side="end">
                <v-timeline-item
                  v-for="historyItem in sortedStatusHistory"
                  :key="historyItem.id"
                  :dot-color="getStatusColor(historyItem.status.name)"
                  size="small"
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex align-center">
                      <strong class="mr-2">{{ historyItem.status.name }}</strong>
                    </div>
                    <span class="text-caption text-medium-emphasis">{{ formatDateTime(historyItem.created_at) }}</span>
                    <!-- <div class="text-body-2 text-medium-emphasis mt-1">{{ historyItem.status.description }}</div> -->
                  </div>
                </v-timeline-item>
              </v-timeline>
              <v-alert v-else type="info" variant="tonal" class="mt-2">
                Nenhum histórico disponível.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    
    <div v-else-if="error" class="d-flex justify-center align-center w-100 flex-column" style="min-height: 400px;">
      <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4"></v-icon>
      <h2 class="text-h5 text-grey-darken-1">Voluntário não encontrado</h2>
    </div>

    <div v-else class="d-flex justify-center align-center w-100" style="min-height: 400px;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import volunteerService from '@/services/volunteer.js';

const route = useRoute();
const volunteer = ref(null);
const error = ref(false);

const sortedStatusHistory = computed(() => {
  if (volunteer.value && volunteer.value.status_history) {
    return [...volunteer.value.status_history].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  return [];
});

onMounted(async () => {
  const volunteerId = route.params.id;
  try {
    volunteer.value = await volunteerService.getPublicProfile(volunteerId);
  } catch (e) {
    console.error(e);
    error.value = true;
  }
});

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
