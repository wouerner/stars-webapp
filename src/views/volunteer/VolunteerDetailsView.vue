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
                    <a :href="`https://wa.me/${currentVolunteer.phone.replace(/\D/g, '')}`" target="_blank" class="text-decoration-none text-primary">
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

                <v-list-item v-if="currentVolunteer.squad" class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-account-group" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title>{{ currentVolunteer.squad.name }}</v-list-item-title>
                  <v-list-item-subtitle>Squad</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-heart" :color="currentVolunteer.is_apoiase_supporter ? 'pink' : 'grey'"></v-icon>
                  </template>
                  <v-list-item-title class="d-flex align-center">
                    <span v-if="currentVolunteer.is_apoiase_supporter" class="text-pink font-weight-bold">Apoiador APOIA.se</span>
                    <span v-else>Não é apoiador</span>
                    <v-btn
                      icon="mdi-refresh"
                      size="x-small"
                      variant="text"
                      color="primary"
                      class="ml-2"
                      :loading="isCheckingApoiase"
                      @click="checkApoiaseStatus"
                      title="Verificar status APOIA.se"
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
import { useSquadStore } from '@/stores/squad.js';

const route = useRoute();
const volunteerStore = useVolunteerStore();
const squadStore = useSquadStore();

const selectedStatusId = ref(null);
const selectedSquadId = ref(null);
const isLoadingStatus = ref(false);
const isLoadingSquad = ref(false);
const isCheckingApoiase = ref(false);

const currentVolunteer = computed(() => volunteerStore.currentVolunteer);
const statuses = computed(() => volunteerStore.statuses);
const squads = computed(() => squadStore.squads);

const sortedStatusHistory = computed(() => {
  if (currentVolunteer.value && currentVolunteer.value.status_history) {
    return [...currentVolunteer.value.status_history].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  return [];
});

onMounted(async () => {
  const volunteerId = route.params.id;
  await Promise.all([
    volunteerStore.fetchStatuses(),
    squadStore.fetchAllSquads(),
    volunteerStore.fetchVolunteer(volunteerId)
  ]);
  
  if (currentVolunteer.value) {
    selectedStatusId.value = currentVolunteer.value.status_id;
    selectedSquadId.value = currentVolunteer.value.squad_id;
  }
});

const checkApoiaseStatus = async () => {
  if (!currentVolunteer.value) return;
  
  isCheckingApoiase.value = true;
  try {
    await volunteerStore.checkApoiaseStatus(currentVolunteer.value.id);
  } finally {
    isCheckingApoiase.value = false;
  }
};

const updateVolunteerStatus = async () => {
  if (selectedStatusId.value && currentVolunteer.value && selectedStatusId.value !== currentVolunteer.value.status_id) {
    isLoadingStatus.value = true;
    try {
      await volunteerStore.updateVolunteerStatus(currentVolunteer.value.id, selectedStatusId.value);
    } finally {
      isLoadingStatus.value = false;
    }
  }
};

const updateVolunteerSquad = async () => {
  if (selectedSquadId.value && currentVolunteer.value && selectedSquadId.value !== currentVolunteer.value.squad_id) {
    isLoadingSquad.value = true;
    try {
      await volunteerStore.updateVolunteerSquad(currentVolunteer.value.id, selectedSquadId.value);
    } finally {
      isLoadingSquad.value = false;
    }
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
