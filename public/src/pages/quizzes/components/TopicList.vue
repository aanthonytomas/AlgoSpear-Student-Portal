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
                  <td>: {{ jlconfig.quiz_limit }}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>:
                    <span v-if="topic?.completed && topic?.passed" class="badge bg-success">Passed</span>
                    <span v-else-if="topic?.completed && !topic?.passed" class="badge bg-danger">Fail</span>
                    <span v-else class="badge bg-secondary">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer d-flex justify-content-end">
            <button 
              class="btn w-100" 
              :class="[
                topic?.passed ? 'btn-success' : 
                (locked || !isUserAuthenticated() ? 'btn-secondary' : 'btn-primary')
              ]" 
              @click="handleButtonClick(topic)"
            >
              <i v-if="locked || !isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
              <i v-else-if="topic?.passed" class="bi bi-check-circle-fill text-white me-1"></i>
              <i v-else class="bi bi-unlock-fill me-1"></i>
              <span>
                {{ 
                  topic?.passed ? 'PASSED' : 
                  (topic?.attempts > 0 && !topic?.passed ? 'Take again' : 
                  (topic?.attempts > 0 && topic?.passed ? 'Passed' : 'Start Now'))
                }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue';
import { isAuthenticated } from '@/uikit-api';
import Swal from 'sweetalert2';
import jlconfig from "@/jlconfig.json";

export default defineComponent({
  name: "TopicList",
  emits: ['view'],
  props: {
    excercise: {
      default: () => ({}),
      type: Object
    },
    locked: {
      default: true
    }
  },
  setup() {
    return {
      jlconfig
    }
  },
  
  methods: {
    calculateTotalAttempts(topic: any) {
      // If user is not authenticated, return 0
      if (!this.isUserAuthenticated()) {
        return 0;
      }

      // Ensure we're handling both object and array cases
      if (Array.isArray(topic?.attempts)) {
        return topic.attempts.length;
      }
      return topic?.attempts || 0;
    },

    calculateHighestScore(topic: any) {
      // If user is not authenticated, return 0
      if (!this.isUserAuthenticated()) {
        return 0;
      }

      // If attempts is an array, find the highest score
      if (Array.isArray(topic?.attempts)) {
        const scores = topic.attempts.map((attempt: any) => attempt.score || 0);
        return Math.max(...scores, 0);
      }
      // Fallback to existing highest_score or 0
      return topic?.highest_score || 0;
    },

    isUserAuthenticated() {
      return isAuthenticated()
    },
    
    handleButtonClick(topic: any) {
      if (topic?.passed) {
        this.showCompletionAlert(topic);
      } else if (this.locked || !this.isUserAuthenticated()) {
        if (!this.isUserAuthenticated()) {
          this.showLoginAlert();
        } else {
          this.$toast.warning('All exercise must be passed');
        }
      } else {
        this.onSelectExam(topic);
      }
    },
    
    showCompletionAlert(topic: any) {
      // Check if all quizzes are passed
      const allPassed = Object.values(this.excercise).every((t: any) => t?.passed);
      
      Swal.fire({
        title: "Congratulations!",
        text: allPassed ? "You've passed the quiz" : "You've passed this quiz, take another quiz",
        icon: allPassed ? "success" : "info",         
      });
    },
    
    showLoginAlert() {
      Swal.fire({
        title: "Sign In Required",
        text: "You need to sign in to start a quiz",
        icon: "warning",         
      }).then(async () => {
        this.$router.replace('/login');
      });
    },
    
    onSelectExam(exam: any) {
      if (this.isUserAuthenticated()) {
        this.$emit('view', toRaw(exam));
      } else {
        this.showLoginAlert();
      }
    }
  }
});
</script>