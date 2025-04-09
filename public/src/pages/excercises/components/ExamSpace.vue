<template>
  <div>
    <!-- Exercise Taking View -->
    <div v-if="!showResults">
      <h1 class="text-center">{{ category?.header?.name }}</h1>
      <div class="row">
        <div class="col-sm-0 col-lg-3"></div>
        <div class="col-sm-12 col-lg-6">
          <!-- Improved timer that aligns with card -->
          <div class="mb-3 mt-2">
            <div class="p-3">
              <div class="d-flex align-items-center">
                <div><i class="bi bi-alarm fs-3 me-3 text-primary"></i></div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center">
                    <p class="p-0 m-0 fw-bold">
                      {{ timeDisplay?.formatted ? timeDisplay?.formatted : '00:00:00' }}
                    </p>
                    <span class="badge bg-primary">
                      Used: {{ timeDisplay?.percentage ? timeDisplay?.percentage?.used +'%' : '0%' }}
                    </span>
                  </div>
                  <div v-if="timeDisplay?.percentage" class="progress mt-2" style="height: 8px;">
                    <div class="progress-bar progress-bar-striped bg-primary" role="progressbar" 
                         v-bind:style="{ width: timeDisplay?.percentage?.used +'%' }" 
                         :aria-valuenow="timeDisplay?.percentage?.used" :aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <swiper :slides-per-view="1" @swiper="onSwiper">
            <swiper-slide class="swiper-no-swiping" v-for="(question, i) in list" :key="i">
              <div class="card mb-4 mt-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <span>Question: {{ i + 1 }}</span>
                  <span class="badge bg-secondary">{{ i + 1 }} of {{ list.length }}</span>
                </div>
                <div class="card-body">
                  <p>{{ question?.question }}</p>
                  <div v-if="!!question?.is_choices">
                    <div class="form-check mb-2">
                      <input v-model="question.answer_input" class="form-check-input" type="radio" :name="'flexRadioDefault_' + i" :id="'choice_a_' + i" value="a">
                      <label class="form-check-label" :for="'choice_a_' + i">
                        {{ question?.choice_a }}
                      </label>
                    </div>
                    <div class="form-check mb-2">
                      <input v-model="question.answer_input" class="form-check-input" type="radio" :name="'flexRadioDefault_' + i" :id="'choice_b_' + i" value="b">
                      <label class="form-check-label" :for="'choice_b_' + i">
                        {{ question?.choice_b }}
                      </label>
                    </div>
                    <div class="form-check mb-2">
                      <input v-model="question.answer_input" class="form-check-input" type="radio" :name="'flexRadioDefault_' + i" :id="'choice_c_' + i" value="c">
                      <label class="form-check-label" :for="'choice_c_' + i">
                        {{ question?.choice_c }}
                      </label>
                    </div>
                    <div class="form-check mb-2">
                      <input v-model="question.answer_input" class="form-check-input" type="radio" :name="'flexRadioDefault_' + i" :id="'choice_d_' + i" value="d">
                      <label class="form-check-label" :for="'choice_d_' + i">
                        {{ question?.choice_d }}
                      </label>
                    </div>
                  </div>
                  <div v-else class="input-group mb-3">
                    <span class="input-group-text">Answer</span>
                    <input v-model.trim="question.answer_input" type="text" class="form-control">
                  </div>
                </div>
                <div class="card-footer d-flex justify-content-between">
                  <button class="btn btn-secondary w-49" @click="onPrevious()" :disabled="!canNavigatePrevious">Previous</button>
                  <button class="btn btn-primary w-49" @click="onSubmitAnswer(i)" :disabled="loading.btn_submit">
                    <span v-if="loading.btn_submit">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Please wait..
                    </span>
                    <span v-else>Submit Answer</span>
                  </button>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-sm-0 col-lg-3"></div>
        <div class="col-sm-12 col-lg-6 d-flex justify-content-start">
          <button class="btn btn-secondary w-50" @click="onBack()">Back</button>
        </div>
      </div>
    </div>

    <!-- Exercise Results View -->
    <exercise-preview-result 
      v-if="showResults"
      :category="category"
      :questions="list"
      :score="score"
      :passed="passed"
      :timeUsed="timeDisplay?.formatted || '00:00:00'"
      @back="onResultsBack"
      @retry="onResultsRetry"
    />
  </div>
</template>

<script lang="ts">
import { lsGetUser, printDevLog, queryInsertGetID, SystemConnections, timerStartTimer } from '@/uikit-api';
import { defineComponent, toRaw } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import jlconfig from "@/jlconfig.json";
import Swal from 'sweetalert2';
import { useStore } from 'vuex';
import ExercisePreviewResult from './ExercisePreviewResult.vue';

export default defineComponent({
  name: "TopicList",
  emits: ['back', 'passed', 'fail'],
  props: {
    reset: {
      default: 0,
      type: Number
    },
    category: {
      default: {},
      type: Object
    },
    questionnaires: {
      default: {},
      type: Object
    }
  },
  components: { Swiper, SwiperSlide, ExercisePreviewResult },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      loading: {
        btn_submit: false
      },
      user: {} as any,
      swiper: {} as any,
      list: [] as any,
      score: 0,
      passed: 0,
      timeDisplay: {} as any,
      exercise_duration: 0,
      backButton: false,
      stopTimer: null as null | (() => void),
      isUserTryingToLeave: false,
      isTimesUp: false,  // Flag to track if time is up
      answeredQuestions: [] as number[], // Track which questions have been answered
      canNavigatePrevious: false, // Control whether the Previous button is enabled
      showResults: false // Toggle between exercise taking and results view
    }
  },
  methods: {
    onPrevious() {
      if (this.swiper.activeIndex > 0) {
        this.swiper.slidePrev();
      }
    },
    async onBack(){
      // Skip confirmation dialog if timer is already up
      if (this.isTimesUp) {
        if (this.timeDisplay?.intervalID) {
          clearInterval(this.timeDisplay.intervalID);
        }
        this.$router.push({
          path: this.$route.path,
          query: {}
        });
        this.$emit('back');
        return;
      }
      
      Swal.fire({
        title: "Are you sure?",
        text: "You will lose all your progress, are you sure you want to leave?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel",
        cancelButtonText: "No, continue"
      }).then(async (result) => {
        if(result.isConfirmed){
          if (this.timeDisplay?.intervalID) {
            clearInterval(this.timeDisplay.intervalID);
          }
          this.$router.push({
            path: this.$route.path,
            query: {}
          });
          this.$emit('back');
        }
      });
    },
    async startTimer() {
      this.stopTimer = timerStartTimer(async (newTime) => {
        printDevLog("Reading Time:", toRaw(newTime));
        this.timeDisplay = newTime;
        if (newTime?.seconds == 0) {
          console.log("time is up");
          this.isTimesUp = true; // Set the flag when time is up
          
          // Remove the isExerciseOngoing query parameter to prevent confirmation dialogs
          this.$router.push({
            path: this.$route.path,
            query: { isTimesUp: 'true' }  // Set a new query param to indicate time is up
          });
          
          if (this.timeDisplay?.intervalID) {
            clearInterval(this.timeDisplay.intervalID);
          }
          
          Swal.fire({
            title: "Time's up",
            text: "Your exercise time has ended.",
            icon: "info"
          }).then(async () => {
            await this.onSaveExcercises().then(async () => {
              this.loading.btn_submit = false;
              this.showResults = true; // Show the results view instead of using separate alerts
            });
          });
        }
      }, this.exercise_duration);
    },
    // Helper method to normalize answers for comparison
    normalizeAnswer(answer: string): string {
      // Trim spaces, convert to lowercase, and normalize other potential formatting issues
      return answer.trim().toLowerCase();
    },
    async onSubmitAnswer(index: number) {
      if(!this.list[index]['answer_input']) {
        this.$toast.warning('Please provide your answer.');
      }
      else {
        // Normalize both answers for comparison
        const answer_correct = this.normalizeAnswer(this.list[index]['answer']);
        const answer_input = this.normalizeAnswer(this.list[index]['answer_input']);
        
        if(answer_correct === answer_input) {
          this.score = this.score + 1;
          this.list[index]['is_corrrect'] = 1;
        }
        else {
          this.list[index]['is_corrrect'] = 0;
        }
        
        // Add this question to answered questions array if not already there
        if (!this.answeredQuestions.includes(index)) {
          this.answeredQuestions.push(index);
        }

        // Enable Previous button after at least one question is answered
        if (this.answeredQuestions.length > 0) {
          this.canNavigatePrevious = true;
        }
        
        if(this.swiper.isEnd) {
          if(this.score >= jlconfig.excercises_limit_passing) { 
            this.passed = 1; 
          }
          this.loading.btn_submit = true;
          await this.onSaveExcercises().then(async () => {
            this.loading.btn_submit = false;
            if (this.timeDisplay?.intervalID) {
              clearInterval(this.timeDisplay.intervalID);
            }
            this.isTimesUp = true; // Mark as complete to prevent back confirmation
            
            // Update router query parameters to remove isExerciseOngoing
            this.$router.push({
              path: this.$route.path,
              query: {}
            });
            
            const resultMessage = this.passed
              ? `Congratulations! You passed the exercise with a score of ${this.score}/${jlconfig.excercises_limit}.`
              : `You failed the exercise with a score of ${this.score}/${jlconfig.excercises_limit}. Better luck next time!`;

            const resultIcon = this.passed ? "success" : "error";

            await Swal.fire({
              title: this.passed ? "Exercise Passed!" : "Exercise Failed",
              text: resultMessage,
              icon: resultIcon,
              confirmButtonText: "View Results"
            });
            
            this.showResults = true; // Show the results view
          });
        }
        else {
          this.swiper.slideNext();
        }
      }
    },
    async onSaveExcercises() {
    const result = await queryInsertGetID({
      connection: SystemConnections()['CONN_NPM_LMS'],
      table: 'questionnaire_category_done',
      columns: {
        'user_refid': this.user?.user_refid,
        'category_refid': this.category?.header?.group_refid,
        'total': jlconfig.excercises_limit,
        'score': this.score,
        'passed': this.passed
      }
    });
    
    // Emit proper event with updated data to refresh parent component
    if (this.passed) {
      this.$emit('passed', {
        categoryId: this.category?.header?.group_refid,
        score: this.score
      });
    } else {
      this.$emit('fail', {
        categoryId: this.category?.header?.group_refid,
        score: this.score
      });
    }
    
    return result;
  },
    onSwiper(swiper: any) {
      this.swiper = swiper;
    },
    onResultsBack() {
      // Return to exercise list
      this.$emit('back');
    },
    onResultsRetry() {
      // Reset and retry the exercise
      this.showResults = false;
      this.score = 0;
      this.passed = 0;
      this.isTimesUp = false;
      this.answeredQuestions = [];
      this.canNavigatePrevious = false;
      
      // Reset all answers
      this.list.forEach((question: any) => {
        question.answer_input = '';
        question.is_corrrect = 0;
      });
      
      this.swiper.slideTo(0);
      this.startTimer();
    }
  },
  watch: {
    timeDisplay: function(value, prevVal){
      if(value?.intervalID !== prevVal?.intervalID){
        this.store.commit('addIntervalId', value?.intervalID);
        console.log("added interval id");
      }
    },
    reset: async function () {
      if(this.reset > 0) {
        var user = await lsGetUser() as any;
        if(user) {
          this.user = user;
          this.list = this.questionnaires;
          this.score = 0;
          this.passed = 0;
          this.isTimesUp = false; // Reset the times up flag when starting a new exercise
          this.showResults = false; // Make sure we're in exercise taking mode
          this.swiper.slideTo(0);
          this.answeredQuestions = []; // Reset answered questions tracking
          this.canNavigatePrevious = false; // Disable Previous button on reset
          printDevLog("Props:", toRaw(this.$props));
          printDevLog("Data:", toRaw(this.$data));
          
          this.$router.push({
            path: this.$route.path,
            query: { isExerciseOngoing: 'true' }
          });
          
          this.startTimer();
        }
        else {
          this.$router.replace('/login');
          Swal.fire({
            title: "Sign In Required",
            text: "You need to sign in to start an exercise",
            icon: "info"
          });
        }
      }
    }
  },
  created(){
    this.exercise_duration = jlconfig.exercise_time * 60;
    this.isTimesUp = false; // Initialize the flag when component is created
    this.answeredQuestions = []; // Initialize answered questions tracking
    this.canNavigatePrevious = false; // Initialize Previous button as disabled
    this.showResults = false; // Start in exercise taking mode
  },
  beforeUnmount(){
    console.log("Component Destroyed!");
    // Make sure to clear interval if component is destroyed
    if (this.timeDisplay?.intervalID) {
      clearInterval(this.timeDisplay.intervalID);
    }
  }
});
</script>

<style scoped>
.w-49 {
  width: 49%;
}
</style>