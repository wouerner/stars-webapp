<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="6">
                <h1 v-if="route.meta.type == 'create'">Cadastrar Squad</h1>
                <h1 v-if="route.meta.type == 'update'">Atualizar Squad</h1>
                <v-form>
                    <v-text-field v-model="squad.name" variant="outlined" label="Nome"></v-text-field>
                    <v-text-field v-model="squad.description" variant="outlined" label="Descrição"></v-text-field>
                    <v-btn
color="primary" class="me-4"
                                           @click="submit">Salvar</v-btn>
                    <v-btn 
                       :to="{ name: 'squads-list' }"
                        class="me-4"
                       >Cancelar</v-btn>
                </v-form>

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useSquadStore } from '@/stores/squad';
import { useRoute } from 'vue-router';

import router from "@/router";

const useSquad = useSquadStore();
const route = useRoute();
console.log('params:' , route.params);
const squad = reactive({
    name: '',
    description: '',
    uuid: ''
});

onMounted(async () => {
    if (route.meta.type === 'update') {
        await useSquad.fetch(route.params.uuid);
        const s = useSquad.squad;
        squad.name = s.name;
        squad.description = s.description;
        squad.uuid = s.id || s.uuid;
    }
});

const submit = async () => {
    if (route.meta.type == 'create') {
        await useSquad.create(squad);
        router.push({ name: 'squads-list' });
    } else {
        await useSquad.update(squad);
        router.push({ name: 'squads-list' });
    }
};
</script>
