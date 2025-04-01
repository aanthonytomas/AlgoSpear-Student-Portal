<template>
  <div>
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
                  <input v-model="question.answer_input" type="text" class="form-control">
                </div>
              </div>
              <div class="card-footer d-flex justify-content-between align-items-center">
                <div class="d-flex">
                  <button 
                    class="btn btn-secondary me-2" 
                    @click="onPreviousQuestion" 
                    :disabled="currentQuestionIndex === 0"
                  >
                    Previous
                  </button>
                  <button 
                    class="btn btn-secondary me-2" 
                    @click="onNextQuestion" 
                    :disabled="currentQuestionIndex === list.length - 1"
                  >
                    Next
                  </button>
                </div>
                <button class="btn btn-primary w-50" @click="onSubmitAnswer(i)" :disabled="loading.btn_submit">
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
        <div class="d-flex justify-content-start">
          <button class="btn btn-secondary btn-lg me-4 w-50" @click="onBack()">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { lsGetUser, printDevLog, queryInsertGetID, SystemConnections, timerStartTimer } from '@/uikit-api';
import { defineComponent, toRaw } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import jlconfig from "@/jlconfig.json";
import Swal from 'sweetalert2';
import { useStore } from 'vuex';

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
  components: { Swiper, SwiperSlide },
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
      currentQuestionIndex: 0  // Added to track current question for navigation
    }
  },
  methods: {
    // New method for previous question navigation
    onPreviousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.swiper.slidePrev();
      }
    },

    // New method for next question navigation
    onNextQuestion() {
      if (this.currentQuestionIndex < this.list.length - 1) {
        this.currentQuestionIndex++;
        this.swiper.slideNext();
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
        imageUrl: "/src/assets/img/new-question2.png",
         
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
            imageUrl: "/src/assets/img/new-timesup.png",
             
          }).then(async () => {
            await this.onSaveExcercises().then(async () => {
              this.loading.btn_submit = false;
              if (this.passed == 1) {
                Swal.fire({
                  title: "Congratulations",
                  text: "You passed the exercise with score of " + this.score + " out of " + jlconfig.excercises_limit + ".",
                  imageUrl: "/src/assets/img/new-passed.png",
                   
                }).then(() => {
                  this.$emit('passed');
                });
              } else {
                Swal.fire({
                  title: "You failed",
                  text: "Score are " + this.score + " out of " + jlconfig.excercises_limit + ".",
                  imageUrl: "/src/assets/img/new-failed.png",
                   
                }).then(() => {
                  this.$emit('fail');
                });
              }
            });
          });
        }
      }, this.exercise_duration);
    },
    async onSubmitAnswer(index: number) {
      if(!this.list[index]['answer_input']) {
        this.$toast.warning('Please provide your answer.');
      }
      else {
        var answer_correct  = (this.list[index]['answer']).toLowerCase();
        var answer_input    = (this.list[index]['answer_input']).toLowerCase();
        if(answer_correct == answer_input) {
          this.score = this.score + 1;
          this.list[index]['is_corrrect'] = 1;
        }
        else {
          this.list[index]['is_corrrect'] = 0;
        }
        if(this.swiper.isEnd) {
          if(this.score >= jlconfig.excercises_limit_passing) { this.passed = 1; }
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
            
            if(this.passed == 1) {
              Swal.fire({
                title: "Congratulations",
                text: "You passed the exercise with score of " + this.score + " out of " + jlconfig.excercises_limit + ".",
                imageUrl: "/src/assets/img/new-passed.png",
                 
              }).then(async () => {
                this.$emit('passed');
              });
            }
            else {
              Swal.fire({
                title: "You failed",
                text: "Score are " + this.score + " out of " + jlconfig.excercises_limit + ".",
                icon: "error"
              }).then(async () => {
                this.$emit('fail');
              });
            }
          });
        }
        else {
          this.currentQuestionIndex++; // Update the index when moving to next question
          this.swiper.slideNext();
        }
      }
    },
    async onSaveExcercises() {
      await queryInsertGetID({
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
    },
    onSwiper(swiper: any) {
      this.swiper = swiper;
      // Add event listener to update currentQuestionIndex when slide changes
      swiper.on('slideChange', () => {
        this.currentQuestionIndex = swiper.activeIndex;
      });
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
          this.currentQuestionIndex = 0; // Reset current question index
          this.swiper.slideTo(0);
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
            imageUrl: "/src/assets/img/new-signin.png",
             
          });
        }
      }
    }
  },
  created(){
    this.exercise_duration = jlconfig.exercise_time * 60;
    this.isTimesUp = false; // Initialize the flag when component is created
    this.currentQuestionIndex = 0; // Initialize current question index
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