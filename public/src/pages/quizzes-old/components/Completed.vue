<template>
	<div>
		<h2 class="text-center">Excercise Responses</h2>
		<div class="card mt-4" v-for="(exc, ei) in excercise" :key="ei">
			<div class="card-header">{{ exc?.header?.name }}</div>
			<div class="card-body p-0">
				<table class="table table-striped">
					<thead>
						<tr>
							<th class="bg-dark text-white"><small>No</small></th>
							<th class="bg-dark text-white"><small>Question</small></th>
							<th class="bg-dark text-white" style="width: 50px;"></th>
							<th class="bg-dark text-white" style="width: 120px;"><small>Your answer</small></th>
							<th class="bg-dark text-white" style="width: 120px;"><small>Correct answer</small></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(q, i) in exc?.questions" :key="i">
							<td><small>{{ i + 1 }}</small></td>
							<td><small>{{ q?.question }}</small></td>
							<td>
								<i v-if="q?.is_corrrect" class="bi bi-check-circle-fill text-success fs-5" title="Correct Answer"></i>
								<i v-else class="bi bi-x-circle-fill text-danger fs-5" title="Wrong Answer"></i>
							</td>
							<td><small>{{ q?.answer_input }}</small></td>
							<td><small>{{ q?.answer }}</small></td>
						</tr>
					</tbody>
				</table>
				<p class="px-4">Score: {{ exc?.score }}</p>
			</div>
		</div>
	</div>
</template>
<script lang="ts">

  import { defineComponent, toRaw } from 'vue';

  export default defineComponent({
    name: "Completed",
    emits: ['reload'],
    props: {
      excercise: {
        default: {},
        type: Object
      }
    },
    setup() {
      return {
        toRaw
      }
    }
  });

</script>