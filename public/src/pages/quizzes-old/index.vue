<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container mt-5 py-5">
        <div class="row mt-5 pt-5">
          <div class="col-3">
            <Categories title="Categories" :category="excercise" @start="onStartCategory" />
          </div>
          <div class="col-9">
            <div>
              <h1 class="text-center">Quiz</h1>
            </div>
            <div v-if="selected">
              <h2 class="text-center">{{ selected?.category?.header?.name }}</h2>
              <swiper class="pt-3" :slides-per-view="1" :space-between="0" @swiper="onSwiper">
                <swiper-slide class="swiper-no-swiping" v-for="(ques, qi) in selected?.category?.questions">
                  <div class="card">
                    <div class="card-header">Question {{ qi + 1 }} of {{ (selected?.category?.questions).length }}</div>
                    <div class="card-body">
                      <p>{{ ques?.question }}</p>
                      <input v-model="ques.answer_input" type="text" class="form-control" />
                      <button class="btn btn-primary btn-lg mt-4" @click="onSubmitAnswer(qi)" :disabled="checking">{{ checking ? 'Checking...':'Submit Answer' }}</button>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
            <Completed v-else-if="completed" :excercise="excercise" @reload="reloadExcercise" />
            <QuizeDefault v-else />
          </div>
        </div>
      </div>
    </main>
    <SectionFooter/>
  </div>
</template>
<script lang="ts">

  import { defineComponent, toRaw } from 'vue';
  import { createStudentQuiz, queryURL, printDevLog, lsGetUser, queryInsertGetID, SystemConnections } from "@/uikit-api";
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import Categories from "./components/Categories.vue";
  import QuizeDefault from "./components/QuizeDefault.vue";
  import Completed from "./components/Completed.vue";
  import jlconfig from "@/jlconfig.json";
  import Swal from 'sweetalert2';

  export default defineComponent({
    name: "ExcercisesPage",
    components: { Completed, QuizeDefault, Categories, SectionFooter, SectionHeader, Swiper, SwiperSlide },
    data() {
      return {
        user: {} as any,
        swiper: {} as any,
        excercise: {} as any,
        selected: null as any,
        checking: false,
        completed: false
      }
    },
    methods: {
      onSwiper(swiper: any) {
        this.swiper = swiper;
      },
      async reloadExcercise() {
        Swal.fire({
          title: "Confirmation",
          text: "Start exercises over again?",
          imageUrl: "/src/assets/img/new-ques.png",
           
          showCancelButton: true,
          confirmButtonText: "Start Again"
        }).then( async (result) => {
          if(result.isConfirmed) {
            this.excercise  = {};
            this.selected   = null;
            this.checking   = false;
            this.completed  = false;
            await this.initExercises();
          }
        });
      },
      async initExercises() {
        await queryURL({ url: "util_quiz/initQuiz?limit=" + jlconfig.quiz_limit }).then( async (excercise) => {
          this.excercise = excercise;
        });
      },
      onStartCategory(cat: any) {
        if((this.selected && this.swiper.isEnd == false)) {
          Swal.fire({
            title: "Invalid Action",
            text: "Please complete the " + this.selected?.category?.header?.name + " before starting new exercises.",
            icon: "error"
          });
        }
        else {
          printDevLog("Start:", toRaw(cat));
          this.selected = cat;
        }
      },
      onSubmitAnswer(ques_index: number) {
        this.checking       = true;
        var answer_taker    = this.selected?.category?.questions[ques_index]?.answer_input;
        var answer_correct  = this.selected?.category?.questions[ques_index]?.answer;
        var current_score   = this.excercise[this.selected?.index]['score'];
        var category_name   = this.selected?.category?.header?.name;
        if(!answer_taker) {
          this.$toast.warning("Please provide your answer.");
          this.checking     = false;
        }
        else {

          this.excercise[this.selected?.index]['questions'][ques_index]['answer_input'] = answer_taker;
          answer_taker      = answer_taker.toLowerCase();
          answer_correct    = answer_correct.toLowerCase();

          if(answer_taker == answer_correct) {
            current_score   = current_score + 1;
            this.excercise[this.selected?.index]['questions'][ques_index]['is_corrrect'] = true;
            this.excercise[this.selected?.index]['score'] = current_score;
            this.$toast.success("Correct!");
          }
          else {
            this.excercise[this.selected?.index]['questions'][ques_index]['is_corrrect'] = false;
            this.$toast.warning("Wrong!");
          }
          setTimeout( async () => {
            this.checking     = false;
            if(this.swiper.isEnd) {
              Swal.fire({
                title: "End of exercise for " + category_name + "!",
                text: "You got " + current_score + " out of " + jlconfig.excercises_limit,
                icon: "info"
              }).then( async () => {
                this.excercise[this.selected?.index]['completed'] = true;
                this.selected = null;
                if(this.isAllCompleted()) {
                  this.$toast.success("All completed!");
                  this.saveQuiz();
                }
              });
            }
            else {
              this.swiper.slideNext();
            }
          },1200);
        }
        
        printDevLog("answer_taker:", answer_taker);
        printDevLog("answer_correct:", answer_correct);
        printDevLog("current_score:", current_score);
      },
      isAllCompleted() {
        var completed = true;
        for(let i = 0; i < this.excercise.length; i++) {
          if(this.excercise[i]['completed'] == false) {
            this.completed = false;
            return false;
          }
        }
        this.completed = true;
        return completed;
      },
      async saveQuiz() {
        await createStudentQuiz({
          user_refid: this.user?.user_refid, 
          user_name: this.user?.lastname + ', ' + this.user?.firstname, 
          quiz_json: this.excercise
        });
      }
    },
    async mounted() {
      var user = lsGetUser() as any;
      if(user?.user_refid) {
        this.user = user;
        await this.initExercises().then( async () => {
          printDevLog("Exercises:", toRaw(this.$data));
        });
      }
      else {
        Swal.fire({
          title: "Sign In Required",
          text: "To take a quiz, you need to sign in.",
          icon: "warning"
        }).then( async () => {
          this.$router.replace("/login");
        });
      }
    },
  });

</script>