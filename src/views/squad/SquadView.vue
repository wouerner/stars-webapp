<template>
	<v-container>
		<v-sheet class="pa-4 rounded-lg mb-4">
			<h1 class="mb-8">Detalhes da Squad</h1>
			<v-form v-if="squad">
				<div class="d-flex align-items-center ga-8">
					<div>
						<v-avatar
						 size="140"
                         color="grey-darken-3"
						>
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
						color="primary"
                        :to="{ name: 'squad-update', params: { uuid: squad.id || squad.uuid } }"
					>
						Editar
					</v-btn>
					<v-btn
						color="tertiary"
						@click="cancel"
					>
						Voltar
					</v-btn>
				</div>
			</v-form>
            <div v-else>
                <v-progress-circular indeterminate></v-progress-circular>
            </div>
		</v-sheet>
	</v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSquadStore } from '@/stores/squad';

const router = useRouter();
const route = useRoute();
const squadStore = useSquadStore();
const squad = ref(null);

onMounted(async () => {
    await squadStore.fetch(route.params.uuid);
    squad.value = squadStore.squad;
});

function cancel() {
	router.back();
}
</script>
