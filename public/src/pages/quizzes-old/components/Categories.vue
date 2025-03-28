<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th class="text-white" style="background-color: #161166;"><small>Category</small></th>
        <th class="text-white" style="background-color: #161166;"><small>Total</small></th>
        <th class="text-white" style="background-color: #161166;"><small>Score</small></th>
        <th class="text-white" style="background-color: #161166;width: 80px;"><small></small></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(cat, ci) in category" :key="ci">
        <td>{{ cat?.header?.name }}</td>
        <td class="text-center">{{ (cat?.questions).length }}</td>
        <td class="text-center">{{ cat?.score }}</td>
        <td>
          <button 
            class="btn btn-primary btn-sm w-100" 
            @click="()=>{ $emit('start', { category: toRaw(cat), index: ci}) }"
            :disabled="cat?.completed"
          >{{ cat?.completed ? 'Done':'Start' }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">

  import { defineComponent, toRaw } from 'vue';

  export default defineComponent({
    name: "Categories",
    emits: ['start'],
    props: {
      title: {
        default: 'Untitled',
        type: String
      },
      category: {
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