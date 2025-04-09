<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container py-5">
        <!-- Reduced padding on mobile -->
        <div class="row m-lg-5 m-3 p-lg-5 p-3">
          <div class="col-12 text-center">
            <h1 class="fw-bold display-6">Data Structures Topics</h1>
            <p class=" pb-3 pb-md-5"><small>Data structures are fundamental concepts in programming that help organize, store, and manage data efficiently for easier access and modification.</small></p>
          </div>
          <!-- First row: Arrays, Linked List, Stacks -->
          <div class="col-lg-4 col-md-6 col-12 mb-5">
            <ProgressBar v-if="isUserAuthenticated()" :percentage="arrayProgressPercentage" :height="40"/>
            <div class="card">
              <img src="/src/assets/img/new-arrays.png" alt="Arrays" class="card-img-top" />
              <div class="card-body">
                <h5>Arrays</h5>
                <p><small>A linear data structure that stores elements in contiguous memory locations, allowing fast indexing but fixed size.</small></p>
                <button 
                  :class="[
                    'btn w-100', 
                    isTopicCompleted('array') ? 'btn-success' : 'btn-primary'
                  ]" 
                  @click="onClickView('/readings-data-structure/array')" >
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('array')" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else class="bi bi-unlock-fill me-1"></i>
                  <span>Read</span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-5">
            <ProgressBar v-if="isUserAuthenticated()" :percentage="linkListProgressPercentage" :height="40"/>
            <div class="card">
              <img src="/src/assets/img/new-linkedlist.png" alt="Linked List" class="card-img-top" />
              <div class="card-body">
                <h5>Linked List</h5>
                <p><small> A dynamic data structure where elements are connected through pointers, enabling efficient insertions and deletions.</small></p>
                <button 
                  :class="[
                    'btn w-100', 
                    isTopicCompleted('linked-list') ? 'btn-success' : 
                    isTopicCompleted('array') ? 'btn-primary' : 'btn-secondary'
                  ]" 
                  @click="onClickLinkedList('/readings-data-structure/linked-list')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('linked-list')" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('array')" class="bi bi-unlock-fill me-1"></i>
                  <i v-else class="bi bi-lock-fill me-1"></i>
                  <span>Read</span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-5">
            <ProgressBar v-if="isUserAuthenticated()" :percentage="stacksProgressPercentage" :height="40"/>
            <div class="card">
              <img src="/src/assets/img/new-stacks.png" alt="Stacks" class="card-img-top" />
              <div class="card-body">
                <h5>Stacks</h5>
                <p><small> A Last-In-First-Out (LIFO) data structure that supports push and pop operations for efficient backtracking.</small></p>
                <button 
                  :class="[
                    'btn w-100', 
                    isTopicCompleted('stacks') ? 'btn-success' : 
                    isTopicCompleted('linked-list') ? 'btn-primary' : 'btn-secondary'
                  ]" 
                  @click="onClickStacks('/readings-data-structure/stacks')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('stacks')" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('linked-list')" class="bi bi-unlock-fill me-1"></i>
                  <i v-else class="bi bi-lock-fill me-1"></i>
                  <span>Read</span>
                </button>
              </div>
            </div>
          </div>
          <!-- Second row: Queues, Graphs -->
          <div class="col-lg-4 col-md-6 col-12 mb-5">
            <ProgressBar v-if="isUserAuthenticated()" :percentage="queuesProgressPercentage" :height="40"/>
            <div class="card">
              <img src="/src/assets/img/new-queues2.png" alt="Queues" class="card-img-top" />
              <div class="card-body">
                <h5>Queues</h5>
                <p><small>  A First-In-First-Out (FIFO) data structure ideal for managing processes in sequential order.</small></p>
                <button 
                  :class="[
                    'btn w-100', 
                    isTopicCompleted('queues') ? 'btn-success' : 
                    isTopicCompleted('stacks') ? 'btn-primary' : 'btn-secondary'
                  ]" 
                  @click="onClickQueues('/readings-data-structure/queues')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('queues')" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('stacks')" class="bi bi-unlock-fill me-1"></i>
                  <i v-else class="bi bi-lock-fill me-1"></i>
                  <span>Read</span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-5">
            <ProgressBar v-if="isUserAuthenticated()" :percentage="graphsProgressPercentage" :height="40"/>
            <div class="card">
              <img src="/src/assets/img/new-graphs.png" alt="Graphs" class="card-img-top" />
              <div class="card-body">
                <h5>Graphs</h5>
                <p><small>  A versatile data structure consisting of nodes (vertices) connected by edges, commonly used to model networks.</small></p>
                <button 
                  :class="[
                    'btn w-100', 
                    isTopicCompleted('graphs') ? 'btn-success' : 
                    isTopicCompleted('queues') ? 'btn-primary' : 'btn-secondary'
                  ]" 
                  @click="onClickGraphs('/readings-data-structure/graphs')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('graphs')" class="bi bi-check-circle-fill me-1"></i>
                  <i v-else-if="isTopicCompleted('queues')" class="bi bi-unlock-fill me-1"></i>
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
  import { lsGetUser, printDevLog, queryURL, isAuthenticated, isFundamentalDone, 
           fetchAllArticlesArrays, fetchAllArticlesLinkedList, fetchAllArticlesStacks, 
           fetchAllArticlesQueues, fetchAllArticlesGraphs, fetchArticleReadsById,
           isArticleGroupDone } from '@/uikit-api';
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import ProgressBar from '@/components/ProgressBar.vue';
  import Swal from 'sweetalert2';

  export default defineComponent({
    name: "CoursesPage",
    components: { SectionFooter, SectionHeader, ProgressBar },
    data() {
      return {
        user: {} as any,
        views: {} as any,
        articleRed: [] as any,
        array_list: [] as any,
        linked_list: [] as any,
        list_stacks: [] as any,
        list_queues: [] as any,
        list_graphs: [] as any,
        topicCompletionStatus: {
          array: false,
          'linked-list': false,
          stacks: false,
          queues: false,
          graphs: false
        } as Record<string, boolean>,
        arrayProgressPercentage: 0,
        linkListProgressPercentage: 0,
        stacksProgressPercentage: 0,
        queuesProgressPercentage: 0,
        graphsProgressPercentage: 0,
        loading: false
      }
    },
    methods: {
      isUserAuthenticated(){
        return isAuthenticated()
      },
      isTopicRead(topicName: string) {
        if (!this.views || !this.user?.user_refid) {
          return false;
        }
        return this.views[topicName] === true;
      },
      isTopicCompleted(topicName: string) {
        return this.topicCompletionStatus[topicName] === true;
      },
      onClickView(route: string){
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              icon: "warning",
               
            });
        }else{
          this.$router.push(route);
        }
      },
      async onClickLinkedList(route: string){
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              icon: "warning",  
               
            });
        } else {
          if(this.isTopicCompleted('array')) {
            this.$router.push(route);
          } else {
            Swal.fire({
              title: "Locked Content",
              html: "You need to complete Arrays first before accessing Linked Lists.",
              icon: "warning",               
            });
          }
        }
      },
      async onClickStacks(route: string){
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              icon: "warning",               
            });
        } else {
          await isArticleGroupDone(this.user?.user_refid, 'LINKED_LIST').then((check) => {
            if(check?.success) {
              this.$router.push(route);
            } else {
              Swal.fire({
                title: "Locked Content",
                html: check?.message || "You need to complete Linked Lists first before accessing Stacks.",
                icon: "warning",                 
              });
            }
          });
        }
      },
      async onClickQueues(route: string){
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              icon: "warning",               
            });
        } else {
          await isArticleGroupDone(this.user?.user_refid, 'STACKS').then((check) => {
            if(check?.success) {
              this.$router.push(route);
            } else {
              Swal.fire({
                title: "Locked Content",
                html: check?.message || "You need to complete Stacks first before accessing Queues.",
                icon: "warning",                 
              });
            }
          });
        }
      },
      async onClickGraphs(route: string){
        if(!isAuthenticated()){
          Swal.fire({
              title: "Sign In Required",
              html: "Please Login first",
              icon: "warning",               
            });
        } else {
          await isArticleGroupDone(this.user?.user_refid, 'QUEUES').then((check) => {
            if(check?.success) {
              this.$router.push(route);
            } else {
              Swal.fire({
                title: "Locked Content",
                html: check?.message || "You need to complete Queues first before accessing Graphs.",
                icon: "warning",                 
              });
            }
          });
        }
      },
      async onFetchViews() {
        await queryURL({ url: "util_quiz/visualViewsChecker?user_refid=" + this.user?.user_refid }).then( async (response) => {
          this.views = response;
        });
      },
      async fetchReadArticles() {
        // Get updated list of read articles
        if(!this.user?.user_refid) return;
        
        await fetchArticleReadsById(this.user?.user_refid).then((list) => {
          this.articleRed = list;
          this.checkAllTopicsCompletion();
          this.calculateProgressPercentages();
        });
      },
      async loadAllArticles() {
        this.loading = true;
        // Fetch all article lists
        await fetchAllArticlesArrays().then((array_list) => {
          this.array_list = toRaw(array_list);
        });
        
        await fetchAllArticlesLinkedList().then((linked_list) => {
          this.linked_list = toRaw(linked_list);
        });
        
        await fetchAllArticlesStacks().then((list_stacks) => {
          this.list_stacks = toRaw(list_stacks);
        });
        
        await fetchAllArticlesQueues().then((list_queues) => {
          this.list_queues = toRaw(list_queues);
        });
        
        await fetchAllArticlesGraphs().then((list_graphs) => {
          this.list_graphs = toRaw(list_graphs);
        });
        this.loading = false;
      },
      checkAllTopicsCompletion() {
        // Check completion status for each topic category
        // A topic is complete when all its articles have been read
        
        // Array completion
        let arrayCompleted = this.array_list.length > 0;
        this.array_list.forEach((article: any) => {
          if(!this.isArticleRead(article?.topic_refid)) {
            arrayCompleted = false;
          }
        });
        this.topicCompletionStatus.array = arrayCompleted;
        
        // Linked List completion
        let linkedListCompleted = this.linked_list.length > 0;
        this.linked_list.forEach((article: any) => {
          if(!this.isArticleRead(article?.topic_refid)) {
            linkedListCompleted = false;
          }
        });
        this.topicCompletionStatus['linked-list'] = linkedListCompleted;
        
        // Stacks completion
        let stacksCompleted = this.list_stacks.length > 0;
        this.list_stacks.forEach((article: any) => {
          if(!this.isArticleRead(article?.topic_refid)) {
            stacksCompleted = false;
          }
        });
        this.topicCompletionStatus.stacks = stacksCompleted;
        
        // Queues completion
        let queuesCompleted = this.list_queues.length > 0;
        this.list_queues.forEach((article: any) => {
          if(!this.isArticleRead(article?.topic_refid)) {
            queuesCompleted = false;
          }
        });
        this.topicCompletionStatus.queues = queuesCompleted;
        
        // Graphs completion
        let graphsCompleted = this.list_graphs.length > 0;
        this.list_graphs.forEach((article: any) => {
          if(!this.isArticleRead(article?.topic_refid)) {
            graphsCompleted = false;
          }
        });
        this.topicCompletionStatus.graphs = graphsCompleted;
      },
      calculateProgressPercentages() {
        // Calculate progress percentages for all topic categories
        
        // Array progress
        let arrayDone = 0;
        this.array_list.forEach((article: any) => {
          if(this.isArticleRead(article?.topic_refid)) {
            arrayDone++;
          }
        });
        this.arrayProgressPercentage = this.array_list.length > 0 ? Math.floor(arrayDone / this.array_list.length * 100) : 0;

        // Linked list progression
        let linkListDone = 0;
        this.linked_list.forEach((article: any) => {
          if(this.isArticleRead(article?.topic_refid)) {
            linkListDone++;
          }
        });
        this.linkListProgressPercentage = this.linked_list.length > 0 ? Math.floor(linkListDone / this.linked_list.length * 100) : 0;

        // Stacks progression
        let stacksDone = 0;
        this.list_stacks.forEach((article: any) => {
          if(this.isArticleRead(article?.topic_refid)) {
            stacksDone++;
          }
        });
        this.stacksProgressPercentage = this.list_stacks.length > 0 ? Math.floor(stacksDone / this.list_stacks.length * 100) : 0;

        // Queues progression
        let queuesDone = 0;
        this.list_queues.forEach((article: any) => {
          if(this.isArticleRead(article?.topic_refid)) {
            queuesDone++;
          }
        });
        this.queuesProgressPercentage = this.list_queues.length > 0 ? Math.floor(queuesDone / this.list_queues.length * 100) : 0;

        // Graphs progression
        let graphsDone = 0;
        this.list_graphs.forEach((article: any) => {
          if(this.isArticleRead(article?.topic_refid)) {
            graphsDone++;
          }
        });
        this.graphsProgressPercentage = this.list_graphs.length > 0 ? Math.floor(graphsDone / this.list_graphs.length * 100) : 0;
      },
      isArticleRead(topic_refid: string): boolean {
        return this.articleRed.some((article: any) => article.topic_refid === topic_refid);
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
            });
          }
        });
        
        // Load all articles and read status
        await this.loadAllArticles();
        await this.fetchReadArticles();
      }
      
      await this.onFetchViews().then(async () => {
        printDevLog("DS Data:", toRaw(this.$data));
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
  
  .card-progress-container {
    position: relative;
    height: 8px;
    width: 100%;
  }
</style>