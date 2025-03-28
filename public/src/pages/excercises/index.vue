<template>
  <div>
    <SectionHeader />
    <main class="main">
      <div class="container mt-5 py-5">
        <div class="row pt-5">
          <div class="col-12">
            <h1 class="text-center fw-bold display-6">Exercises</h1>
            <p class="text-center">Please complete reading materials to start exercises</p>
          </div>
          <div class="col-4"></div>
          <div class="col-4"><ElemProgressbar :loading="loading" /></div>
          <div class="col-4"></div>
          <div class="col-12">
            <swiper :slides-per-view="1" :space-between="0" @swiper="onSwiper">
              <swiper-slide class="swiper-no-swiping">
                <TopicList :excercise="excercise" @view="viewExam" />
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
          <div class="col-12">
            <p class="text-center">Quiz will enable once you passed all exercises</p>
            <div class="d-flex justify-content-center">
              <button class="btn btn-primary btn-lg" @click="proceedToQuiz()">
                <i v-if="!all_passed" class="bi bi-lock-fill me-1"></i>
                <i v-else class="bi bi-unlock-fill me-1"></i>
                <span>Proceed to Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <SectionFooter />
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
  isFundamentalDone,
  isArticleGroupDone,
} from '@/uikit-api';
import { Swiper, SwiperSlide } from 'swiper/vue';
import SectionHeader from "@/components/SectionHeader.vue";
import SectionFooter from "@/components/SectionFooter.vue";
import TopicList from './components/TopicList.vue';
import ExamSpace from './components/ExamSpace.vue';
import ElemProgressbar from '@/components/ElemProgressbar.vue';
import jlconfig from "@/jlconfig.json";
import Swal from 'sweetalert2';

declare const confetti: any;

export default defineComponent({
  components: { ElemProgressbar, ExamSpace, TopicList, SectionHeader, SectionFooter, Swiper, SwiperSlide },
  setup() {
    return { jlconfig }
  },
  data() {
    return {
      timeDisplay: {} as any,
      exerciseStarted: false,
      loading: false,
      user: {} as any,
      btn: {
        array: true,
        search: false,
        sorting: false,
        linked_list: false,
        graphs: false,
        stacks: false,
        queues: false
      },
      linked_list_locked: false,
      list_stacks_locked: false,
      list_queues_locked: false,
      list_graphs_locked: false,
      list_arrays_locked: false,
      list_sorting_locked: false,
      list_searching_locked: false,
      swiper: {} as any,
      excercise: {} as any,
      reset: 0,
      category: {} as any,
      questionnaires: {} as any,
      all_passed: false,
      examVue: true,
      confettiRunning: false,
    }
  },
  methods: {
    async isArticleGroupDoneLocal() {
      await isArticleGroupDone(this.user?.user_refid, 'ARRAYS').then(async (check_array) => {
        this.list_arrays_locked = !check_array?.success;
      });
      await isArticleGroupDone(this.user?.user_refid, 'LINKED_LIST').then(async (check_linked_list) => {
        this.linked_list_locked = !check_linked_list?.success;
      });
      await isArticleGroupDone(this.user?.user_refid, 'STACKS').then(async (check_stacks) => {
        this.list_stacks_locked = !check_stacks?.success;
      });
      await isArticleGroupDone(this.user?.user_refid, 'QUEUES').then(async (check_queues) => {
        this.list_queues_locked = !check_queues?.success;
      });
      await isArticleGroupDone(this.user?.user_refid, 'GRAPHS').then(async (check_graphs) => {
        this.list_graphs_locked = !check_graphs?.success;
      });
      await isArticleGroupDone(this.user?.user_refid, 'SORTING').then(async (check_sorting) => {
        this.list_sorting_locked = !check_sorting?.success;
      });
      await isArticleGroupDone(this.user?.user_refid, 'SEARCH').then(async (check_searching) => {
        this.list_searching_locked = !check_searching?.success;
      });
    },

    async initExercises() {
      this.loading = true;
      await queryURL({ url: "util_quiz/initExcercises?user_refid=" + this.user?.user_refid + "&limit=" + jlconfig.excercises_limit }).then(async (excercise) => {
        this.loading = false;
        excercise = excercise.map((ex: any) => {
          let locked: boolean = true;
          if (ex?.header?.name === "Array") locked = this.list_arrays_locked;
          else if (ex?.header?.name === "Linked List") locked = this.linked_list_locked;
          else if (ex?.header?.name === "Stacks") locked = this.list_stacks_locked;
          else if (ex?.header?.name === "Queues") locked = this.list_queues_locked;
          else if (ex?.header?.name === "Graphs") locked = this.list_graphs_locked;
          else if (ex?.header?.name === "Sorting") locked = this.list_sorting_locked;
          else if (ex?.header?.name === "Searching") locked = this.list_searching_locked;
          return { ...ex, locked: locked }
        });
        this.excercise = excercise;
        console.log("exercise, ", this.excercise)
        this.isPassedAll();
      });
    },

    isPassedAll() {
      var passed = 0;
      for (let i = 0; i < this.excercise.length; i++) {
        if (this.excercise[i]['passed']) {
          passed += 1;
        }
      }

      printDevLog("Over all status", { total: this.excercise.length, passed: passed });

      if (this.excercise.length === passed) {
  if (!this.all_passed) { // Trigger once
    this.all_passed = true;
    this.startConfetti(); // 🎉 Start Confetti
    Swal.fire({
      title: "Congratulations!",
      text: "You passed all the exercises, proceed to quiz!",
      imageUrl: "/src/assets/img/new-passedall.png",
       
      confirmButtonText: "Go to Quiz"
    }).then((result) => {
      if (result.isConfirmed) {
        this.stopConfetti(); // 🔥 Stop Confetti if clicked
        this.$router.replace('/quizzes');
      }
    });
  }
}
 else {
        this.all_passed = false;
      }
    },

    startConfetti() {
      if (this.confettiRunning) return;
      this.confettiRunning = true;
      const colors = ["#bb0000", "#161179", "#015551"];
      const end = Date.now() + 10000; // 5 seconds

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end && this.confettiRunning) {
          requestAnimationFrame(frame);
        } else {
          this.confettiRunning = false;
        }
      };

      frame();
    },

    stopConfetti() {
      this.confettiRunning = false;
    },

    async viewExam(exam: any) {
      printDevLog("View Exam", exam);
      if (exam?.passed) {
  Swal.fire({
    title: "Completed",
    text: "You've passed the exercises already",
    imageUrl: "/src/assets/img/new-completed.png",
     
  });
} else {
        this.examVue = true;
        this.loading = true;
        this.category = toRaw(exam);
        // Fixed fetchRandomExcercises call with proper type handling
        await fetchRandomExcercises({ group_refid: exam?.header?.group_refid as any }).then(async (response) => {
          response = response?.filter((exercise: any) => !exercise?.is_choices).slice(0, jlconfig.excercises_limit);
          if (response.length < jlconfig.excercises_limit) {
            Swal.fire({
              title: "Wait",
              text: "Questions in this exercise are not yet prepared.",
              imageUrl: "/src/assets/img/new-wait.png",
               
            });
            this.loading = false;
          } else {
            this.loading = false;
            this.questionnaires = toRaw(response);
            this.reset = randomNumbers();
            this.swiper.slideTo(1);
            this.exerciseStarted = true;
          }
        });
      }
    },

    onSwiper(swiper: any) {
      this.swiper = swiper;
    },

    onBack() {
      this.swiper.slideTo(0);
      this.examVue = false;
    },

    async onPassed() {
      this.swiper.slideTo(0);
      await this.initExercises();
    },

    async onFail() {
      this.swiper.slideTo(0);
      await this.initExercises();
    },

    async proceedToQuiz() {
      this.stopConfetti();
      if (this.all_passed) {
        this.$router.replace('/quizzes');
      } else {
        Swal.fire({
          title: "Invalid Action",
          text: "You need to pass all exercises to proceed to the quiz",
          icon: "info"
        });
      }
    }
  },

  async mounted() {
    var user = await lsGetUser() as any;
    if (user) { this.user = user; }
    await this.isArticleGroupDoneLocal();
    printDevLog("Exercises:", toRaw(this.$data));
    await this.initExercises();
    printDevLog("Exercises:", toRaw(this.$data));
    this.$router.push({ path: this.$route.path, query: {} });
  },

  // Fixed beforeRouteLeave - properly typed parameters
  beforeRouteLeave(to: any, from: any, next: any) {
    this.stopConfetti(); // Stop confetti if user navigates away
    next();
  }
});
</script>


<style scoped>
.btn-outline-primary {
  cursor: not-allowed !important;
}
</style>