<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container py-5">
        <!-- Reduced padding on mobile -->
        <div class="row m-lg-5 m-3 p-lg-5 p-3">
          <div class="col-12 text-center">
            <h1 class=" fw-bold display-6">Algorithms Topics</h1>
            <p class="pb-3 pb-md-5 "><small>Algorithms are essential techniques in computer science that teach you how to efficiently organize data and quickly locate specific information.</small></p>
          </div>
          <!-- Changed from col-4 to responsive sizing -->
          <div class="col-lg-4 col-md-6 col-12 mb-5">
            <ProgressBar v-if="isUserAuthenticated()" :percentage="sortingProgress" :height="40"/>
            <div class="card">
              <img class="visual-image card-img-top" src="/src/assets/img/new-sorting2.png" alt="Sorting Algorithms" />
              <div class="card-body">
                <h5>Sorting</h5>
                <p><small>A sorting algorithm is a step-by-step procedure used to arrange data in a specific order. It helps organize information to make it easier to read, search, and process efficiently.</small></p>

                <button 
                  :class="['btn w-100', isSortingCompleted ? 'btn-success' : 'btn-primary']" 
                  @click="onClickView('/readings-algorithms/sorting')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else-if="isSortingCompleted" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else class="bi bi-unlock-fill me-1"></i>
                  <span>Read</span>
                </button>
              </div>
            </div>
          </div>
          <!-- Changed from col-4 to responsive sizing -->
          <div class="col-lg-4 col-md-6 col-12 mb-5">
            <ProgressBar v-if="isUserAuthenticated()" :percentage="searchingProgress" :height="40"/>
            <div class="card">
              <img class="visual-image card-img-top" src="/src/assets/img/new-searching2.png" alt="Searching Algorithms" />
              <div class="card-body">
                <h5>Searching</h5>
                <p><small>A searching algorithm is a method used to find specific data within a collection of information. It follows a sequence of steps to locate the desired value quickly and efficiently, either in sorted or unsorted data.</small></p>
                <button 
                  :class="[
                    'btn w-100', 
                    isSearchingCompleted ? 'btn-success' : 
                    isSortingCompleted ? 'btn-primary' : 'btn-secondary'
                  ]" 
                  @click="onClickSearching('/readings-algorithms/searching')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else-if="isSearchingCompleted" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else-if="isSortingCompleted" class="bi bi-unlock-fill me-1"></i>
                  <i v-else class="bi bi-lock-fill me-1"></i>
                  <span>Read</span>
                </button>
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
  import { lsGetUser, printDevLog, queryURL, isAuthenticated, isFundamentalDone, isArticleGroupDone, fetchArticleReadsById, fetchAllArticlesSorting, fetchAllArticlesSearching } from '@/uikit-api';
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import ProgressBar from '@/components/ProgressBar.vue';
  import Swal from 'sweetalert2';

  export default defineComponent({
    name: "AlgorithmsPage",
    components: { SectionFooter, SectionHeader, ProgressBar },
    data() {
      return {
        user: {} as any,
        views: {} as any,
        articleReads: [] as any,
        isSortingCompleted: false,
        isSearchingCompleted: false,
        sortingProgress: 0,
        searchingProgress: 0,
        list_sorting: [] as any,
        list_searching: [] as any
      }
    },
    methods: {
      isUserAuthenticated(){
        return isAuthenticated()
      },
      async onFetchViews() {
        await queryURL({ url: "util_quiz/visualViewsChecker?user_refid=" + this.user?.user_refid }).then( async (response) => {
          this.views = response;
        });
      },
      onClickView(route: string){
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              imageUrl: "/src/assets/img/new-signin.png",
               
            });
        }else{
          this.$router.push(route)
        }
      },
      onClickSearching(route: string){
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              imageUrl: "/src/assets/img/new-signin.png",
               
            });
        } else {
          if(this.isSortingCompleted) {
            this.$router.push(route);
          } else {
            Swal.fire({
              title: "Locked Content",
              html: "Please complete Sorting Algorithms.",
              imageUrl: "/src/assets/img/new-locked.png",
               
            });
          }
        }
      },
      async checkCompletionStatus() {
        if (this.user?.user_refid) {
          // Check sorting completion
          await isArticleGroupDone(this.user.user_refid, 'SORTING').then(response => {
            this.isSortingCompleted = response?.success || false;
          });
          
          // Check searching completion
          await isArticleGroupDone(this.user.user_refid, 'SEARCH').then(response => {
            this.isSearchingCompleted = response?.success || false;
          });
          
          // Get all article reads
          await fetchArticleReadsById(this.user.user_refid).then(list => {
            this.articleReads = list;
            this.calculateProgressPercentages();
          });
        }
      },
      async loadArticleLists() {
        // Load sorting articles
        await fetchAllArticlesSorting().then(list => {
          this.list_sorting = toRaw(list);
        });
        
        // Load searching articles
        await fetchAllArticlesSearching().then(list => {
          this.list_searching = toRaw(list);
        });
        
        await this.calculateProgressPercentages();
      },
      calculateProgressPercentages() {
        // Calculate sorting progress
        let sortingDone = 0;
        if (this.list_sorting.length > 0) {
          this.list_sorting.forEach((article: any) => {
            if (this.isArticleRead(article?.topic_refid)) {
              sortingDone++;
            }
          });
          this.sortingProgress = Math.floor(sortingDone / this.list_sorting.length * 100);
        }
        
        // Calculate searching progress
        let searchingDone = 0;
        if (this.list_searching.length > 0) {
          this.list_searching.forEach((article: any) => {
            if (this.isArticleRead(article?.topic_refid)) {
              searchingDone++;
            }
          });
          this.searchingProgress = Math.floor(searchingDone / this.list_searching.length * 100);
        }
      },
      isArticleRead(topic_refid: string): boolean {
        return this.articleReads.some((article: any) => article.topic_refid === topic_refid);
      }
    },
    async mounted() {
      const user = await lsGetUser() as any;
      if(user?.user_refid) {
        this.user = user;

        await isFundamentalDone(this.user?.user_refid).then(async (response) => {
          if(!response?.success) {
            Swal.fire({
              title: "Invalid Action",
              html: response?.message,
              icon: "info"
            }).then(() => {
              this.$router.push("/readings");
            })
          }
        });
        
        // Load article lists
        await this.loadArticleLists();
        
        // Check completion status for both topics
        await this.checkCompletionStatus();
      }
      
      await this.onFetchViews().then(async () => {
        printDevLog("Algorithms Data:", toRaw(this.$data));
      });
    },
  });
</script>
<style scoped>
  .visual-image {
    width: 100%;
    height: 280px;
    object-fit: contain;
    object-position: center;
  }
</style>