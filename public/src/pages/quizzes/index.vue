<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container mt-5 py-5">
        <div class="row pt-5">
          <div class="col-12">
            <h1 class="text-center fw-bold display-6">Quiz</h1>
            <p class="text-center">Select category to start</p>
          </div>
          <div class="col-4"></div>
          <div class="col-4"><ElemProgressbar :loading="loading"/></div>
          <div class="col-4"></div>
          <div class="col-12">
            <swiper :slides-per-view="1" :space-between="0" @swiper="onSwiper">
              <swiper-slide class="swiper-no-swiping">
                <TopicList 
                  :excercise="excercise" 
                  :locked="lockedQuiz" 
                  @view="viewExam" 
                />
              </swiper-slide>
              <swiper-slide v-if="examVue" class="swiper-no-swiping">
                <ExamSpace 
                  :reset="reset"
                  :category="category" 
                  :questionnaires="questionnaires" 
                  @back="onBack"
                  @passed="onPassed"
                  @fail="onFail"
                />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </main>
    <SectionFooter/>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue';
import { 
  lsGetUser, 
  fetchRandomExcercises, 
  printDevLog, 
  queryURL, 
  randomNumbers, 
  fetchExerciseById, 
  fetchAllQuestionnaireCategory,
} from '@/uikit-api';
import { Swiper, SwiperSlide } from 'swiper/vue';
import SectionHeader from "@/components/SectionHeader.vue";
import SectionFooter from "@/components/SectionFooter.vue";
import TopicList from './components/TopicList.vue';
import ExamSpace from './components/ExamSpace.vue';
import ElemProgressbar from '@/components/ElemProgressbar.vue';
import jlconfig from "@/jlconfig.json";
import Swal from 'sweetalert2';
import { useStore } from 'vuex';

declare const confetti: any;

interface Exercise {
  header: {
    name: string;
    group_refid: string;
  };
  passed?: boolean;
  completed?: boolean;
  attempts?: any[];
  highest_score?: number;
  total_attempts?: number;
}

export default defineComponent({
  components: { 
    ElemProgressbar, 
    ExamSpace, 
    TopicList, 
    SectionHeader, 
    SectionFooter, 
    Swiper, 
    SwiperSlide 
  },
  setup() {
    const store = useStore();
    return {
      jlconfig,
      store
    }
  },
  data() {
    return {
      loading: false,
      user: {} as any,
      excercise: [] as Exercise[],
      reset: 0,
      category: {} as any,
      categories: [] as any[],
      exercises: [] as any[],
      questionnaires: {} as any,
      lockedQuiz: true,
      examVue: false,
      confettiRunning: false,
      swiper: {} as any,
    }
  },
  methods: {
    async initExercises() {
      this.loading = true;
      
      try {
        // Fetch user, exercises, and categories concurrently
        const [user, excerciseResponse, existingExercises, categories] = await Promise.all([
          lsGetUser(),
          queryURL({ 
            url: `util_quiz/initQuiz?user_refid=${this.user?.user_refid}&limit=${jlconfig.excercises_limit}` 
          }),
          fetchExerciseById(this.user?.user_refid),
          fetchAllQuestionnaireCategory()
        ]);

        // Update user if not already set
        if (user) { 
          this.user = user; 
        }

        // Process and enrich exercise data with attempts
        const enrichedExercises = excerciseResponse.map((exercise: Exercise) => {
          // Find all attempts for this specific exercise
          const exerciseAttempts = existingExercises.filter(
            (attempt: any) => attempt.category_refid === exercise.header.group_refid
          );

          return {
            ...exercise,
            attempts: exerciseAttempts,
            highest_score: Math.max(...exerciseAttempts.map((a: any) => a.score || 0), 0),
            total_attempts: exerciseAttempts.length
          };
        });

        this.loading = false;
        this.excercise = enrichedExercises;
        this.exercises = existingExercises.filter((exercise: any) => exercise?.passed);
        this.categories = categories;

        // Check if all categories are passed
        const allCategoriesPassed = this.categories?.every((category: any) => {
          let categoryRefId = category?.group_refid;
          return this.exercises?.some((exercise: any) => 
            exercise?.category_refid == categoryRefId && exercise?.passed
          );
        });

        this.lockedQuiz = !allCategoriesPassed;
        
        if (allCategoriesPassed) {
          this.startQuizPassedCelebration();
        }

        printDevLog("Quiz Status", {
          locked: this.lockedQuiz,
          exercises: this.excercise
        });

      } catch (error) {
        console.error("Error initializing exercises:", error);
        this.loading = false;
        Swal.fire({
          title: "Error",
          text: "Failed to load exercises. Please try again.",
          icon: "error"
        });
      }
    },

    startQuizPassedCelebration() {
      // Prevent multiple celebrations
      if (this.confettiRunning) return;
      
      const allExercisesPassed = this.excercise?.every((exercise: Exercise) => exercise?.passed);
      
      if (!allExercisesPassed) return;

      this.confettiRunning = true;
      const colors = ["#bb0000", "#161179", "#015551"];
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          this.confettiRunning = false;
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: colors
        });
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: colors
        });
      }, 250);

      // Show congratulations alert
      Swal.fire({
        title: "Congratulations!",
        text: "You've passed all quizzes!",
        icon: "success",
        imageUrl: "/src/assets/img/new-awards.png",
         
        confirmButtonText: "Great!"
      });
    },

    async viewExam(exam: Exercise) {
      printDevLog("View Exam", exam);
      
      // Check if exam is already passed
      if(exam?.passed) {
        Swal.fire({
          title: "Completed",
          text: "You've passed the quiz already",
          imageUrl: "/src/assets/img/new-locked.png",
           
        });
        return;
      }

      // Prepare for new exam
      this.examVue = true;
      this.loading = true;
      this.category = toRaw(exam);

      try {
        // Fetch random exercises for this category
        const response = await fetchRandomExcercises({ 
          group_refid: exam?.header?.group_refid 
        });

        // Filter and limit questionnaires
        const filteredQuestionnaires = response
          ?.filter((exercise: any) => exercise?.is_choices)
          .slice(0, jlconfig.quiz_limit);

        // Validate questionnaire count
        if(filteredQuestionnaires.length < jlconfig.quiz_limit){
          Swal.fire({
            title: "Wait",
            text: "Questions in this quiz are not yet prepared.",
            imageUrl: "/src/assets/img/new-question.png",
             
          });
          this.loading = false;
          return;
        }

        // Prepare for exam
        this.loading = false;
        this.questionnaires = toRaw(filteredQuestionnaires);
        this.reset = randomNumbers();
        this.swiper.slideTo(1);

      } catch (error) {
        console.error("Error fetching exam:", error);
        this.loading = false;
        Swal.fire({
          title: "Error",
          text: "Failed to load exam. Please try again.",
          icon: "error"
        });
      }
    },

    onSwiper(swiper: any) {
      this.swiper = swiper;
    },

    onBack() {
      this.swiper.slideTo(0);
      this.examVue = false;
      this.clearIntervals();
    },

    clearIntervals() {
      // Clear any remaining interval IDs
      if (this.store && this.store.state.intervalIds) {
        this.store.state.intervalIds.forEach((id: number) => {
          clearInterval(id);
        });
        this.store.commit('clearIntervalIds');
      }
    },

    async onPassed() {
      this.swiper.slideTo(0);
      await this.initExercises();
      this.clearIntervals();
    },

    async onFail() {
      this.swiper.slideTo(0);
      await this.initExercises();
      this.clearIntervals();
    }
  },

  async mounted() {
    try {
      var user = await lsGetUser() as any;
      if(user) { this.user = user; }
      
      await this.initExercises().then(async () => {
        printDevLog("Quiz:", toRaw(this.$data));
      });

      // Clear route query
      this.$router.push({
        path: this.$route.path,
        query: {}
      });
    } catch (error) {
      console.error("Mounted error:", error);
    }
  },

  beforeDestroy() {
    this.clearIntervals();
  }
});
</script>

<style scoped>
.btn-outline-primary {
  cursor: not-allowed !important;
}
</style>