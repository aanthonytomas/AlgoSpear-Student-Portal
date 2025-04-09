<template>
  <div class="p-5 mx-5">
    <div class="row">
      <div class="col-4 mb-5" v-for="(topic, ti) in excercise" :key="ti">
        <div class="card">
          <img src="/src/assets/img/new-banner.png" />
          <div class="card-body">
            <h3>{{ topic?.header?.name }}</h3>
            <table>
              <tbody>
                <tr>
                  <td style="width: 180px;">Number of items</td>
                  <td>: {{ jlconfig.excercises_limit }}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>:
                    <span v-if="topic?.passed" class="badge bg-success">Passed</span>
                    <span v-else-if="topic?.attempt > 0" class="badge bg-danger">Fail</span>
                    <span v-else class="badge bg-secondary">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer d-flex justify-content-end">
            <button class="btn w-100" :class="topic?.locked ? 'btn-secondary' : topic?.passed ? 'btn-success' : 'btn-primary'" @click="onSelectExam(topic, topic?.locked)">
              <i v-if="topic?.locked" class="bi bi-lock-fill me-1"></i>
              <i v-else-if="topic?.passed" class="bi bi-check-circle-fill me-1"></i>
              <i v-else class="bi bi-unlock-fill me-1"></i>
              <span>{{ topic?.locked ? "Locked" : topic?.passed ? 'Passed' : (topic?.attempt > 0 ? 'Take again' : 'Start Now') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue';
import Swal from 'sweetalert2';
import { isAuthenticated } from '@/uikit-api';
import jlconfig from "@/jlconfig.json";

export default defineComponent({
  name: "TopicList",
  emits: ['view'],
  props: {
    excercise: {
      default: {},
      type: Object
    }
  },
  setup() {
    return {
      jlconfig
    }
  },
  methods: {
    onSelectExam(exam: any, lock: boolean) {
      if (isAuthenticated()) {
        if (lock) {
          Swal.fire({
            title: "Locked Topic",
            text: "You did not read all the materials of this topic",
            icon: "warning",
          });
        } else {
          this.$emit('view', toRaw(exam));
        }
      } else {
        Swal.fire({
          title: "Sign In Required",
          html: "Please Login first",
          icon: "warning",
        });
      }
    }
  }
});
</script>
