<template>
  <div>
    <SectionHeader />
    <main class="main">
      <div class="container mt-5 py-5">
        <h1 class="text-center mt-5">Fundamental of Programming</h1>

        <!-- Improved Responsive Row -->
        <div class="row mt-5">
          <div class="col-lg-4 col-md-5 col-12 mb-4">
            <div class="sticky-sidebar">
              <ElemProgressbar :loading="loading" />
              <ProgressBar :height="40" :percentage="progress" />
              <CourseList 
                title="Fundamental of Programming"
                :btn_disabled="false"
                :list="list"
                :articlesRead="articleRed"
                :unlock="reset_unlock"
                @view="onView" 
              />
            </div>
          </div>

          <div class="col-lg-8 col-md-7 col-12">
            <SectionArticleHeader 
              :article="article" 
              :user="user" 
              :reset="reset" 
              @completed="isArticleGroupDone()" 
            />

            <div class="text-dark mt-5">
              <div v-if="article?.content" v-html="article?.content"></div>

              <div v-else class="p-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h3 class="p-4 text-muted" id="selectreading">
                      Select reading material to start
                    </h3>
                    <div class="d-flex justify-content-center pb-5">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                           width="60" 
                           height="60" 
                           fill="#a9a0a0" 
                           class="bi bi-bookmark-plus-fill" 
                           viewBox="0 0 16 16">
                        <path fill-rule="evenodd" 
                              d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <SectionFooter />
  </div>
</template>
<style scoped>
.sticky-sidebar {
  position: sticky;
  top: 120px;
  z-index: 0;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
}
</style>

<script lang="ts">
  import { defineComponent, toRaw } from 'vue';
  import { resetReadingTimeByGroup, randomNumbers, lsGetUser, fetchAllArticlesFunOfProg, printDevLog, fetchSingleArticleByTopic, scrollToTop, createReadLogs, fetchArticleReadsById } from "@/uikit-api";
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import CourseList from "@/components/Courses.vue";
  import ElemProgressbar from '@/components/ElemProgressbar.vue';
  import SectionArticleHeader from "@/components/SectionArticleHeader.vue";
  import ProgressBar from '@/components/ProgressBar.vue';
  import jlconfig from "@/jlconfig.json";
  import Swal from 'sweetalert2';

  export default defineComponent({
    components: { SectionArticleHeader, ElemProgressbar, CourseList, SectionFooter, SectionHeader, ProgressBar },
    data() {
      return {
        reset: 0,
        reset_unlock: 0,
        loading: false,
        user: {} as any,
        list: [] as any,
        article: {} as any,
        articles_refid: {} as any,
        articleRed: [] as any,
        progress: 0,
        completionAlertShown: false // Track if completion alert has been shown
      }
    },
    methods: {
      async onView(event: any) {
        this.loading = true;
        await fetchSingleArticleByTopic(event?.topic_refid).then( async (article) => {
          this.loading = false;
          if(article.length > 0) {
            scrollToTop();
            this.article  = article[0];
            this.reset    = randomNumbers();
          }
          else {
            this.$toast.warning("No article found");
          }
        });
      },

      async isArticleGroupDone() {
        await this.loadProgress();
        this.reset_unlock = randomNumbers();
        
        // Check if progress is 100% and completion alert hasn't been shown yet
        if (this.progress === 100 && !this.completionAlertShown) {
          this.showCompletionAlert();
        }
      },
      async loadProgress(){
        await fetchArticleReadsById(this.user?.user_refid).then( async (list) => {
          this.articleRed = list || [];
        });

        let funOfProgDone = 0;
        await fetchAllArticlesFunOfProg().then(async (list) => {
          list.forEach((item:any) => {
            if(this.articleRed.some((articleRed:any) => item?.topic_refid == articleRed?.topic_refid)){
              funOfProgDone++;
            }
          });

          this.progress = Math.floor(funOfProgDone / list.length * 100);
          
          // Check if we've reached 100% on load and completion alert hasn't been shown yet
          if (this.progress === 100 && !this.completionAlertShown) {
            this.showCompletionAlert();
          }
        });
      },
      showCompletionAlert() {
        this.completionAlertShown = true;
        
        Swal.fire({
          title: 'Congratulations!',
          text: 'You\'ve unlocked the \'Data Structures\' and \'Algorithms\' topics. Ready to dive in and explore further?',
          icon: 'success',           
          showCancelButton: true,
        //  confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, let\'s go!',
          cancelButtonText: 'No, thanks!'
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to exercises page
            this.$router.push('/readings');
          }
        });
      }
    },
    async mounted() {
      this.loading = true;
      const user = await lsGetUser() as any;
      if(user?.user_refid) {
        this.user = user;

        await fetchArticleReadsById(user?.user_refid).then( async (list) => {
          this.articleRed = list || [];
        });

        await fetchAllArticlesFunOfProg().then( async (list) => {
          this.list = toRaw(list);
          this.articles_refid = this.list?.map((article:any) => article?.topic_refid);
          
          if (Array.isArray(this.articleRed)) {
            this.articleRed = this.articleRed?.filter((article:any) => 
              this.articles_refid.includes(article?.topic_refid));
          }
          
          await this.loadProgress();
          this.loading = false;
          printDevLog("Data:", this.$data);
        });
      }
      else {
        this.$toast.warning("Login to log reading history.");
        await fetchAllArticlesFunOfProg().then( async (list) => {
          this.list = toRaw(list);
          this.loading = false;
          printDevLog("Data:", this.$data);
        });
      }
    },
  });
</script>
