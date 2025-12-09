<template>
  <v-container>
    <h1 class="text-h4 mb-6">Dashboard</h1>

    <div v-if="dashboardStore.loading" class="d-flex justify-center align-center" style="min-height: 300px;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="dashboardStore.stats">
      <!-- Total Registered Today -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="primary" variant="tonal" class="pa-4">
            <v-card-item>
              <v-card-title class="text-h5">Novos Voluntários Hoje</v-card-title>
              <v-card-subtitle>Cadastrados desde 00:00</v-card-subtitle>
            </v-card-item>
            <v-card-text class="d-flex align-center justify-center">
              <span class="text-h2 font-weight-bold">{{ dashboardStore.stats.total_volunteers_registered_today }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <h2 class="text-h5 mb-4">Voluntários por Status</h2>
      <v-row>
        <v-col
          v-for="statusStat in dashboardStore.stats.total_volunteers_by_status"
          :key="statusStat.status"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card 
            v-ripple 
            class="h-100 cursor-pointer"
            elevation="2"
            @click="navigateToVolunteers(statusStat.status)"
          >
            <v-card-item>
              <v-card-title class="d-flex justify-space-between align-center">
                <span>{{ statusStat.status }}</span>
                <v-icon :color="getStatusColor(statusStat.status)" icon="mdi-circle-slice-8"></v-icon>
              </v-card-title>
            </v-card-item>
            <v-card-text>
              <div class="text-h3 font-weight-bold mb-2">{{ statusStat.count }}</div>
              <div class="text-caption text-medium-emphasis">Voluntários</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-alert v-else type="error" variant="tonal" class="mt-4">
      Não foi possível carregar os dados do dashboard.
    </v-alert>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '@/stores/dashboard';
import { useVolunteerStore } from '@/stores/volunteer';

const dashboardStore = useDashboardStore();
const volunteerStore = useVolunteerStore();
const router = useRouter();

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchStats(),
    volunteerStore.fetchStatuses()
  ]);
});

const navigateToVolunteers = (statusName) => {
  const status = volunteerStore.statuses.find(s => s.name === statusName);
  if (status) {
    router.push({ name: 'volunteers', query: { status: status.id } });
  }
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
