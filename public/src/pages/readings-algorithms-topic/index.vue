<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container mt-5 py-5">
        <h1 class="text-center mt-5">Algorithms</h1>
        <div class="row mt-5">
          <!-- Changed from col-4 to responsive sizing -->
          <div class="col-lg-4 col-md-5 col-12 mb-4">
            <ElemProgressbar :loading="loading" />
            <div v-if="topic == 'sorting'">
              <ProgressBar :height="40" :percentage="sortingProgress" />
              <CourseList 
              title="Sorting" 
              :unlock="reset_unlock" 
              :btn_disabled="false" 
              :list="list_sorting" 
              :articlesRead="articleRed"
              @view="onViewSorting" />
            </div>

            <div v-if="topic == 'searching'">
              <ProgressBar :height="40" :percentage="searchingProgress" />
              <CourseList 
              title="Searching" 
              :unlock="reset_unlock" 
              :btn_disabled="list_search_locked" 
              :list="list_search" 
              :articlesRead="articleRed"
              @view="onViewSearching" />
            </div>
          </div>
          <!-- Changed from col-8 to responsive sizing -->
          <div class="col-lg-8 col-md-7 col-12">            
            <SectionArticleHeader :article="article" :user="user" :reset="reset" @completed="isArticleGroupDoneLocal()" />
            <div class="text-dark mt-5">
              <div v-if="article?.content" v-html="article?.content"></div>
              <div v-else class="p-md-5 p-3 m-md-5 m-3">
                <div class="card">
                  <div class="card-body">
                    <h3 class="text-center p-md-5 p-3" style="color: #a9a0a0;" id="selectreading">Select reading material to start</h3>
                    <div class="d-flex justify-content-center pb-md-5 pb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#a9a0a0" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
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
    <SectionFooter/>
  </div>
</template>
<script lang="ts">

  import { defineComponent, toRaw } from 'vue';
  import { isArticleGroupDone, fetchAllArticlesSearching, fetchAllArticlesSorting, resetReadingTimeByGroup, lsGetUser, printDevLog, fetchSingleArticleByTopic, scrollToTop, createReadLogs, randomNumbers, queryDelete, SystemConnections, fetchArticleReadsById, isFundamentalDone } from "@/uikit-api";
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import CourseList from "@/components/Courses.vue";
  import SectionArticleHeader from "@/components/SectionArticleHeader.vue";
  import ElemProgressbar from '@/components/ElemProgressbar.vue';
  import Swal from 'sweetalert2';
  import ProgressBar from '@/components/ProgressBar.vue';

  export default defineComponent({
    components: { SectionArticleHeader, ElemProgressbar, CourseList, SectionFooter, SectionHeader, ProgressBar },
    setup() {
      return {
        randomNumbers
      }
    },
    data() {
      return {
        reset: 0,
        reset_unlock: 0,
        timeDisplay: {} as any,
        timeMax: 0,
        loading: false,
        user: {} as any,
        article: {} as any,
        list_sorting: [] as any,
        list_search: [] as any,
        list_search_locked: true,
        articleRed: [] as any,
        sortingProgress: 0,
        searchingProgress: 0,
        topic: this.$route.params.topic,
      }
    },
    methods: {
      async resetSortingReadingTime() {
        await resetReadingTimeByGroup({ user_refid: this.user?.user_refid, group_code: 'SORTING' }).then( async (response) => {
          if(response?.success) {
            window.location.reload();
          }
        });
      },
      async resetSearchReadingTime() {
        await resetReadingTimeByGroup({ user_refid: this.user?.user_refid, group_code: 'SEARCH' }).then( async (response) => {
          if(response?.success) {
            window.location.reload();
          }
        });
      },
      async onViewSorting(event: any) {
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
      async onViewSearching(event: any) {
        await isArticleGroupDone(this.user?.user_refid, 'SORTING').then( async (check) => {
          printDevLog("Check:", toRaw(check));
          if(check?.success) {
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
          }
          else {
            Swal.fire({
              title: "Invalid Action",
              html: check?.message,
              icon: "info"
            });
          }
        });
      },
      async isArticleGroupDoneLocal() {
        await this.loadProgress()
        await isArticleGroupDone(this.user?.user_refid, 'SORTING').then( async (check_sorting) => {
          printDevLog("Done Sorting:", toRaw(check_sorting));
          this.list_search_locked = !check_sorting?.success;
          this.reset_unlock       = randomNumbers();
        });
      },
      async loadProgress(){
        await fetchArticleReadsById(this.user?.user_refid).then( async (list) => {
          this.articleRed = list;
        });

        if(this.topic == "sorting"){
          let sortingDone = 0
          this.list_sorting.forEach((item:any) => {
            if(this.articleRed.some((articleRed:any) => item?.topic_refid == articleRed?.topic_refid)){
              sortingDone++
            }
          })

          this.sortingProgress = Math.floor(sortingDone / this.list_sorting.length * 100)
        }
        else if(this.topic == "searching"){
          let searchingDone = 0
          this.list_search.forEach((item:any) => {
            if(this.articleRed.some((articleRed:any) => item?.topic_refid == articleRed?.topic_refid)){
              searchingDone++
            }
          })

          this.searchingProgress = Math.floor(searchingDone / this.list_search.length * 100)
        }
      }
    },
    async mounted() {
      this.loading = true;
      const user = await lsGetUser() as any;
      if(user?.user_refid) {
        this.user = user;

        await isFundamentalDone(this.user?.user_refid).then( async (response) => {
          if(!response?.success) {
            this.$router.push("/readings");
            Swal.fire({
              title: "Invalid Action",
              html: response?.message,
              icon: "info"
            });
          }
        });
      }
      else {
        this.$toast.warning("Login to log reading history.")
      }
      if(this.topic == "sorting"){
        await fetchAllArticlesSorting().then( async (list_sorting) => {
          this.list_sorting = list_sorting;
        });
      }else if(this.topic == "searching"){
        await fetchAllArticlesSearching().then( async (list_search) => {
          this.list_search = list_search;
        });
      }
      await this.loadProgress()

      await this.isArticleGroupDoneLocal().then( async () => {
        this.loading  = false;
        printDevLog("Data:", this.$data);
      });
    }
  });

</script>