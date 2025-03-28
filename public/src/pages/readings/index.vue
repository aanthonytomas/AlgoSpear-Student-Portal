<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container mt-4 py-5">
        <p class="text-light "> s</p>
        <h1 id="learning-materials" class="mt-5 text-center display-6 fw-bold">Reading Materials</h1>
        <p class="text-center">Track your progress as you learn essential DSA concepts—never lose what you've mastered!</p>
        <div class="p-5">
          <div class="row mt-0">
            <!-- Changed from col-4 to col-lg-4 col-md-6 col-12 for better responsiveness -->
            <div class="col-lg-4 col-md-6 col-12 mb-4">
              <ProgressBar v-if="isUserAuthenticated()" :percentage="fundamentalsOfPrgramming"/>
              <div class="card">
                <img src="/src/assets/img/new-fundamentals.png" alt="Programming Fundamentals" class="card-img-top" />
                <div class="card-body">
                  <h5>Fundamental of Programming</h5>
                  <p>Programming fundamentals are the essential building blocks of software development, including variables, data types, control structures, functions, and algorithms.</p>
                </div>
                <div class="card-footer">
                  <button 
                  :class="!isUserAuthenticated() ? 'btn btn-secondary w-100' : 
                        fundamentalsOfPrgramming === 100 ? 'btn btn-success w-100' : 
                        'btn btn-primary w-100'" 
                  @click="readFundamentalOfProgramming()"
                >
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-2"></i>
                  <i v-else-if="fundamentalsOfPrgramming === 100" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else class="bi bi-unlock-fill me-1"></i>
                  <span>Read</span>
                </button>
                </div>
              </div>
            </div>
            <!-- Changed from col-4 to col-lg-4 col-md-6 col-12 for better responsiveness -->
            <div class="col-lg-4 col-md-6 col-12 mb-4">
              <ProgressBar v-if="isUserAuthenticated()" :percentage="dataStructureProgress"/>
              <div class="card">
                <img src="/src/assets/img/new-datastructures.png" alt="Data Structure" class="card-img-top" />
                <div class="card-body">
                  <h5>Data Structure</h5>
                  <p>Data structures are a specific way of organizing data in a specialized format on a computer so that the information can be organized, processed, stored, and retrieved quickly and effectively.</p>
                </div>
                <ElemProgressbar :loading="loading.data_struc" />
                <div class="card-footer">
                  <button 
                  :class="!isUserAuthenticated() || fundamentalsOfPrgramming !== 100 ? 'btn btn-secondary w-100' : 
                        dataStructureProgress === 100 ? 'btn btn-success w-100' : 
                        'btn btn-primary w-100'" 
                  @click="readDataStructure()" 
                  :disabled="loading.data_struc"
                >
                  <i v-if="!isUserAuthenticated() || fundamentalsOfPrgramming !== 100" class="bi bi-lock-fill me-2"></i>
                  <i v-else-if="dataStructureProgress === 100" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else class="bi bi-unlock-fill me-1"></i>
                  <span>{{ loading.data_struc ? 'Wait..':'Read' }}</span>
                </button>
                </div>
              </div>
            </div>
            <!-- Changed from col-4 to col-lg-4 col-md-6 col-12 for better responsiveness -->
            <div class="col-lg-4 col-md-6 col-12 mb-4">
              <ProgressBar v-if="isUserAuthenticated()" :percentage="algoProgress"/>
              <div class="card">
                <img src="/src/assets/img/new-algorithm.png" alt="Algorithms" class="card-img-top" />
                <div class="card-body">
                  <h5>Algorithms</h5>
                  <p>A programming algorithm is a procedure or formula used for solving a problem. It is based on conducting a sequence of specified actions in which these actions describe how to do someting.</p>
                </div>
                <ElemProgressbar :loading="loading.algo" />
                <div class="card-footer">
                  <button 
                  :class="!isUserAuthenticated() || fundamentalsOfPrgramming !== 100 ? 'btn btn-secondary w-100' : 
                        algoProgress === 100 ? 'btn btn-success w-100' : 
                        'btn btn-primary w-100'" 
                  @click="readAlgorithms()" 
                  :disabled="loading.algo"
                >
                  <i v-if="!isUserAuthenticated() || fundamentalsOfPrgramming !== 100" class="bi bi-lock-fill me-2"></i>
                  <i v-else-if="algoProgress === 100" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else class="bi bi-unlock-fill me-1"></i>
                  <span>{{ loading.algo ? 'Wait..':'Read' }}</span>
                </button>
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
  import { isArticleGroupDone, isFundamentalDone, createReadLogs, scrollToTop, fetchAllArticlesFunOfProg, fetchAllArticlesGraphs, fetchAllArticlesQueues, fetchAllArticlesStacks, fetchAllArticlesArrays, fetchAllArticlesLinkedList, printDevLog, fetchSingleArticleByTopic, lsGetUser, isAuthenticated,
     fetchArticleReadsById, fetchAllArticleTopic } from "@/uikit-api";
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import ProgressBar from '@/components/ProgressBar.vue';
  import Courses from "@/components/Courses.vue";
  import Swal from 'sweetalert2';
  import ElemProgressbar from '@/components/ElemProgressbar.vue';

  export default defineComponent({
    name: "ReadingsPage",
    components: { ElemProgressbar, Courses, SectionFooter, SectionHeader, ProgressBar},
    data() {
      return {
        user: {} as any,
        loading: {
          fun_of_prog: false,
          data_struc: false,
          algo: false
        },
        articleRed: {} as any,
        articles: {} as any,
        fundamentalsOfPrgramming: 0,
        algoProgress: 0,
        dataStructureProgress: 0
      }
    },
    methods: {
      isUserAuthenticated(){
        return isAuthenticated()
      },
      async readFundamentalOfProgramming() {
        if(isAuthenticated()){
          this.$router.push("/readings-fundamental-of-programming");
        }else{
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              imageUrl: "/src/assets/img/new-signin.png",
               
            });
        }
      },
      async readDataStructure() {
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              imageUrl: "/src/assets/img/new-signin.png",
               
            });
        }else if(this.fundamentalsOfPrgramming !== 100){
          Swal.fire({
              title: "Locked Content",
              html: "Please complete Fundamentals of Programming first",
              imageUrl: "/src/assets/img/new-locked.png",
               
            });
        }else{
          this.loading.data_struc = true;
          await isFundamentalDone(this.user?.user_refid).then( async (response) => {
            this.loading.data_struc = false;
            if(response?.success) {
              this.$router.push("/readings-data-structure-list");
              // this.$router.push("/readings-data-structure");
            }
            else {
              Swal.fire({
                title: "Invalid Action",
                html: response?.message,
                icon: "info"
              });
            }
          });
        }
      },
      async readAlgorithms() {
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              imageUrl: "/src/assets/img/new-signin.png",
               
            });
        }else if(this.fundamentalsOfPrgramming !== 100){
          Swal.fire({
              title: "Locked Content",
              html: "Please complete Fundamentals of Programming first",
              imageUrl: "/src/assets/img/new-locked.png",
               
            });
        }else{
          this.loading.algo = true;
          await isFundamentalDone(this.user?.user_refid).then( async (response) => {
            this.loading.algo = false;
            if(response?.success) {
              this.$router.push("/readings-algorithms-list");
              //this.$router.push("/readings-algorithms");
            }
            else {
              Swal.fire({
                title: "Invalid Action",
                html: response?.message,
                icon: "info"
              });
            }
          });
        }
      },
    },
    async mounted() {
      const user = await lsGetUser() as any;
      if(user?.user_refid) {
        this.user = user;

        await fetchAllArticleTopic().then( async (list) => {
          this.articles = list;
        });

        await fetchArticleReadsById(user?.user_refid).then( async (list) => {
          this.articleRed = list;
        });

        //fundamental of programming 
        let articleFunOfProg = this.articles.filter((article: any) => article?.group_code == 'FUN_OF_PROG')
        let funOfProgDone = 0
        articleFunOfProg.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            funOfProgDone++
          }
        });
        this.fundamentalsOfPrgramming = Math.floor(funOfProgDone / articleFunOfProg.length * 100)


        //data structures

        let articleArrays = this.articles.filter((article: any) => article?.group_code == 'ARRAYS')
        let articlelinkList = this.articles.filter((article: any) => article?.group_code == 'LINKED_LIST')
        let articleStacks = this.articles.filter((article: any) => article?.group_code == 'STACKS')
        let articleQueues = this.articles.filter((article: any) => article?.group_code == 'QUEUES')
        let articleGraphs = this.articles.filter((article: any) => article?.group_code == 'GRAPHS')

        let graphsCount = 0
        articleGraphs.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            graphsCount++
          }
        });

        let arrayCount = 0
        articleArrays.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            arrayCount++
          }
        });

        let linkListCount = 0
        articlelinkList.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            linkListCount++
          }
        });

        let stacksCount = 0
        articleStacks.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            stacksCount++
          }
        });

        let queuesCount = 0
        articleQueues.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            queuesCount++
          }
        });

        this.dataStructureProgress = Math.floor((queuesCount + stacksCount + linkListCount + arrayCount + graphsCount) / (articleQueues.length + articleStacks.length + articlelinkList.length + articleArrays.length + articleGraphs.length) * 100)


        //algorithms
        let articleSearch = this.articles.filter((article: any) => article?.group_code == 'SEARCH')
        let searchCount = 0
        articleSearch.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            searchCount++
          }
        });

        let articleSorting = this.articles.filter((article: any) => article?.group_code == 'SORTING')
        let sortingCount = 0
        articleSorting.forEach((article: any) => {
          if(this.articleRed.some((articleRed:any) => article?.topic_refid == articleRed?.topic_refid)){
            sortingCount++
          }
        });
        this.algoProgress = Math.floor((sortingCount + searchCount) / (articleSorting.length + articleSearch.length) * 100)

      }
    }
  });

</script>
<style scoped>
 
  #learning-materials h1 {
    margin-top: 20px;
  }

  </style>