<template>
  <v-container class="fill-height bg-background pa-0" fluid>
    <v-row justify="center" class="ma-0 h-100">
      <v-col cols="12" sm="8" md="5" lg="4" class="pa-4 h-100 overflow-y-auto">
        
        <!-- Loading State -->
        <div v-if="!volunteer && !error" class="d-flex justify-center align-center h-100">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="d-flex flex-column justify-center align-center h-100 text-center">
          <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4"></v-icon>
          <h2 class="text-h5 text-medium-emphasis">Voluntário não encontrado</h2>
          <v-btn variant="text" color="primary" class="mt-4" to="/">Voltar para Home</v-btn>
        </div>

        <!-- Content -->
        <div v-else class="d-flex flex-column gap-4 pb-6">
          
          <!-- Header Card -->
          <v-card class="rounded-xl overflow-hidden mb-2" elevation="1">
            <!-- Banner -->
            <div class="position-relative banner-gradient" style="height: 100px;">
            </div>
            
            <!-- Profile Info -->
            <div class="d-flex flex-column align-center text-center px-4 pb-6 mt-n12">
              <v-avatar size="96" class="elevation-3 mb-3 border-4 border-surface">
                 <v-img v-if="volunteer.avatar" :src="volunteer.avatar" cover></v-img>
                 <span v-else class="text-h4 font-weight-bold text-white bg-gradient-primary w-100 h-100 d-flex align-center justify-center">
                   {{ getInitials(volunteer.name) }}
                 </span>
              </v-avatar>
              
              <h1 class="text-h5 font-weight-bold text-high-emphasis">{{ volunteer.name }}</h1>
              <p class="text-body-2 text-medium-emphasis mt-1">
                {{ volunteer.jobtitle?.title || 'Voluntário' }} • SouJunior
              </p>

              <div class="d-flex gap-3 w-100 mt-6">
                <v-btn 
                    v-if="volunteer.linkedin" 
                    class="flex-grow-1 text-capitalize rounded-lg" 
                    color="success" 
                    elevation="2"
                    height="44" 
                    :href="volunteer.linkedin" 
                    target="_blank">
                  Conectar
                </v-btn>
                 <v-btn 
                    v-else 
                    class="flex-grow-1 text-capitalize rounded-lg" 
                    variant="tonal"
                    height="44" 
                    disabled>
                  Conectar
                </v-btn>
              </div>
            </div>
          </v-card>

          <!-- Details Card -->
          <v-card class="rounded-xl mb-2" elevation="1">
            <div class="px-6 py-4 border-b">
              <h2 class="text-subtitle-1 font-weight-bold">Contato & Cargo</h2>
            </div>
            
            <v-list class="py-0" lines="two">
              <!-- LinkedIn -->
              <v-list-item v-if="volunteer.linkedin" :href="volunteer.linkedin" target="_blank" link class="px-6 py-3">
                 <template #prepend>
                   <v-avatar color="blue" variant="tonal" class="mr-4 rounded-circle">
                     <v-icon icon="mdi-linkedin"></v-icon>
                   </v-avatar>
                 </template>
                 <v-list-item-title class="text-body-2 font-weight-medium text-truncate">
                    {{ volunteer.linkedin.replace('https://', '').replace('www.', '') }}
                 </v-list-item-title>
                 <v-list-item-subtitle class="text-caption">LinkedIn</v-list-item-subtitle>
                 <template #append>
                   <v-icon size="small" class="text-medium-emphasis" icon="mdi-chevron-right"></v-icon>
                 </template>
              </v-list-item>
              
              <v-divider v-if="volunteer.linkedin" inset></v-divider>

              <!-- Discord -->
              <v-list-item v-if="volunteer.discord" class="px-6 py-3">
                 <template #prepend>
                   <v-avatar color="deep-purple-accent-2" variant="tonal" class="mr-4 rounded-circle">
                     <v-icon icon="mdi-discord"></v-icon>
                   </v-avatar>
                 </template>
                 <v-list-item-title class="text-body-2 font-weight-medium">{{ volunteer.discord }}</v-list-item-title>
                 <v-list-item-subtitle class="text-caption">Discord</v-list-item-subtitle>
                 <template #append>
                    <v-btn variant="text" size="small" color="success" class="text-none px-0" @click="copyToClipboard(volunteer.discord)">
                      Copiar
                    </v-btn>
                 </template>
              </v-list-item>

              <v-divider v-if="volunteer.discord" inset></v-divider>

              <!-- Cargo -->
              <v-list-item v-if="volunteer.jobtitle" class="px-6 py-3">
                 <template #prepend>
                   <v-avatar color="orange-darken-1" variant="tonal" class="mr-4 rounded-circle">
                     <v-icon icon="mdi-briefcase"></v-icon>
                   </v-avatar>
                 </template>
                 <v-list-item-title class="text-body-2 font-weight-medium">{{ volunteer.jobtitle.title }}</v-list-item-title>
                 <v-list-item-subtitle class="text-caption">Cargo</v-list-item-subtitle>
              </v-list-item>

              <v-divider v-if="volunteer.jobtitle" inset></v-divider>

              <!-- Status -->
              <v-list-item v-if="volunteer.status" class="px-6 py-3">
                 <template #prepend>
                   <v-avatar color="green-darken-1" variant="tonal" class="mr-4 rounded-circle">
                     <v-icon icon="mdi-heart-pulse"></v-icon>
                   </v-avatar>
                 </template>
                 <v-list-item-title class="d-flex align-center">
                    <v-chip :color="getStatusColor(volunteer.status.name)" size="x-small" label class="font-weight-bold text-uppercase">
                      {{ volunteer.status.name }}
                    </v-chip>
                 </v-list-item-title>
                 <v-list-item-subtitle class="text-caption mt-1">Status Atual</v-list-item-subtitle>
              </v-list-item>

              <v-divider v-if="volunteer.status" inset></v-divider>

              <!-- Squad -->
              <v-list-item v-if="volunteer.squad" class="px-6 py-3">
                 <template #prepend>
                   <v-avatar color="pink-darken-1" variant="tonal" class="mr-4 rounded-circle">
                     <v-icon icon="mdi-account-group"></v-icon>
                   </v-avatar>
                 </template>
                 <v-list-item-title class="text-body-2 font-weight-medium">{{ volunteer.squad.name }}</v-list-item-title>
                 <v-list-item-subtitle class="text-caption">Squad</v-list-item-subtitle>
              </v-list-item>

              <v-divider v-if="volunteer.squad && volunteer.is_apoiase_supporter" inset></v-divider>

              <!-- Apoiador APOIA.se -->
              <v-list-item v-if="volunteer.is_apoiase_supporter" class="px-6 py-3">
                 <template #prepend>
                   <v-avatar color="pink-accent-2" variant="tonal" class="mr-4 rounded-circle">
                     <v-icon icon="mdi-heart"></v-icon>
                   </v-avatar>
                 </template>
                 <v-list-item-title class="text-body-2 font-weight-bold text-pink">
                    Apoiador Oficial
                 </v-list-item-title>
                 <v-list-item-subtitle class="text-caption">APOIA.se</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- History Card -->
          <v-card class="rounded-xl" elevation="1">
             <div class="px-6 py-4 border-b">
              <h2 class="text-subtitle-1 font-weight-bold">Histórico na SouJunior</h2>
            </div>
            <div class="px-4 py-4">
                 <v-timeline density="compact" align="start" side="end" truncate-line="start" class="custom-timeline">
                  <v-timeline-item
                    v-for="historyItem in sortedStatusHistory"
                    :key="historyItem.id"
                    :dot-color="getStatusColor(historyItem.status.name)"
                    size="x-small"
                    fill-dot
                  >
                    <div class="mb-4">
                      <div class="text-subtitle-2 font-weight-bold">{{ historyItem.status.name }}</div>
                      <div class="text-caption text-medium-emphasis">{{ formatDateTime(historyItem.created_at) }}</div>
                      <!-- <div class="text-body-2 mt-1">{{ historyItem.status.description }}</div> -->
                    </div>
                  </v-timeline-item>
                </v-timeline>
                <div v-if="!sortedStatusHistory.length" class="text-center text-caption text-medium-emphasis pa-4">
                  Nenhum histórico disponível.
                </div>
            </div>
          </v-card>

        </div>
      </v-col>
    </v-row>
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

const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Add feedback (toast/snackbar)
};
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
}
.banner-gradient {
    background: linear-gradient(to right, #E0E0E0, #F5F5F5);
}
.v-theme--dark .banner-gradient {
    background: linear-gradient(to right, #333333, #424242);
}
.gap-2 {
    gap: 8px;
}
.gap-3 {
    gap: 12px;
}
.gap-4 {
    gap: 16px;
}
.border-4 {
    border-width: 4px !important;
}
.border-surface {
    border-color: rgb(var(--v-theme-surface)) !important;
}
.border-b {
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
:deep(.v-timeline--vertical.v-timeline) {
    height: auto;
}
:deep(.v-list-item__prepend) {
    margin-right: 0 !important;
}
</style>
