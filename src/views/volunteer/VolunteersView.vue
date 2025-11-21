<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Voluntários</h1>
        <v-list>
          <v-list-item v-for="volunteer in volunteerStore.volunteers" :key="volunteer.id">
            <v-list-item-content>
              <v-list-item-title>{{ volunteer.name }} ({{ volunteer.email }})</v-list-item-title>
              <v-list-item-subtitle>{{ volunteer.linkedin }}</v-list-item-subtitle>
              <v-list-item-subtitle>
                <v-chip :color="volunteer.is_active ? 'green' : 'red'">
                  {{ volunteer.is_active ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useVolunteerStore } from '@/stores/volunteer';

const volunteerStore = useVolunteerStore();

onMounted(() => {
  volunteerStore.fetchAll();
});
</script>

<style scoped>
/* Adicione estilos específicos aqui, se necessário */
</style>