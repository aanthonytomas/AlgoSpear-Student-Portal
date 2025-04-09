<template>
  <div>
    <SectionHeader />
    <main class="main">
      <div class="container mt-5 py-5">
        <h1 class="text-center mt-5">Data Structure</h1>
        <div class="row mt-5">
          <!-- Sidebar with sticky positioning -->
          <div class="col-lg-4 col-md-5 col-12 mb-4">
            <div class="sticky-sidebar">
              <ElemProgressbar :loading="loading" />
              <div v-if="topic == 'array'">
                <ProgressBar :percentage="arrayProgressPercentage" :height="40" />
                <CourseList title="Array" :articlesRead="articleRed" :unlock="reset_unlock" :btn_disabled="false" :list="array_list" @view="onView" />
              </div>
              <div v-else-if="topic == 'linked-list'">
                <ProgressBar :percentage="linkListProgressPercentage" :height="40" />
                <CourseList title="Linked List" :articlesRead="articleRed" :unlock="reset_unlock" :btn_disabled="linked_list_locked" :list="linked_list" @view="onViewLinkList" />
              </div>
              <div v-else-if="topic == 'stacks'">
                <ProgressBar :percentage="stacksProgressPercentage" :height="40" />
                <CourseList title="Stacks" :articlesRead="articleRed" :unlock="reset_unlock" :btn_disabled="list_stacks_locked" :list="list_stacks" @view="onViewStack" />
              </div>
              <div v-else-if="topic == 'queues'">
                <ProgressBar :percentage="queuesProgressPercentage" :height="40" />
                <CourseList title="Queues" :articlesRead="articleRed" :unlock="reset_unlock" :btn_disabled="list_queues_locked" :list="list_queues" @view="onViewQueues" />
              </div>
              <div v-else-if="topic == 'graphs'">
                <ProgressBar :percentage="graphsProgressPercentage" :height="40" />
                <CourseList title="Graphs" :articlesRead="articleRed" :unlock="reset_unlock" :btn_disabled="list_graphs_locked" :list="list_graphs" @view="onViewGraphs" />
              </div>
            </div>
          </div>
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
  import { fetchAllArticlesGraphs, fetchAllArticlesQueues, fetchAllArticlesStacks, isArticleGroupDone, resetReadingTimeByGroup, lsGetUser, fetchAllArticlesArrays, fetchAllArticlesLinkedList, printDevLog, fetchSingleArticleByTopic, scrollToTop, createReadLogs, randomNumbers, queryDelete, SystemConnections,fetchArticleReadsById,isFundamentalDone } from "@/uikit-api";
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import CourseList from "@/components/Courses.vue";
  import ProgressBar from '@/components/ProgressBar.vue';
  import SectionArticleHeader from "@/components/SectionArticleHeader.vue";
  import ElemProgressbar from '@/components/ElemProgressbar.vue';
  import jlconfig from "@/jlconfig.json";
  import Swal from 'sweetalert2';

  export default defineComponent({
    components: { SectionArticleHeader, ElemProgressbar, CourseList, SectionFooter, SectionHeader, ProgressBar },
    // props: ['topic'],
    data() {
      return {
        topic: this.$route.params.topic,
        reset: 0,
        reset_unlock: 0,
        timeDisplay: {} as any,
        timeMax: 0,
        loading: false,
        user: {} as any,
        array_list: [] as any,
        linked_list: [] as any,
        linked_list_locked: true,
        list_stacks: [] as any,
        list_stacks_locked: true,
        list_queues: [] as any,
        list_queues_locked: true,
        list_graphs:  [] as any,
        list_graphs_locked: true,
        article: {} as any,
        articleRed: [] as any,
        arrayProgressPercentage: 0,
        linkListProgressPercentage: 0,
        stacksProgressPercentage: 0,
        queuesProgressPercentage: 0,
        graphsProgressPercentage: 0,
        arrayCompletionAlertShown: false,
        linkListCompletionAlertShown: false,
        stacksCompletionAlertShown: false,
        queuesCompletionAlertShown: false,
        graphsCompletionAlertShown: false
      }
    },
    methods: {
      async resetArrayReadingTime() {
        await resetReadingTimeByGroup({ user_refid: this.user?.user_refid, group_code: 'ARRAY'}).then( async (response) => {
          if(response?.success) {
            window.location.reload();
          }
        });
      },
      async resetLinkedListReadingTime() {
        await resetReadingTimeByGroup({ user_refid: this.user?.user_refid, group_code:'LINKED_LIST'}).then( async (response) => {
          if(response?.success) {
            window.location.reload();
          }
        });
      },
      async resetStackReadingTime() {
        await resetReadingTimeByGroup({ user_refid: this.user?.user_refid, group_code: 'STACKS'}).then( async (response) => {
          if(response?.success) {
            window.location.reload();
          }
        });
      },
      async resetQueuesReadingTime() {
        await resetReadingTimeByGroup({ user_refid: this.user?.user_refid, group_code:'QUEUES'}).then( async (response) => {
          if(response?.success) {
            window.location.reload();
          }
        });
      },
      async resetGraphReadingTime() {
        await resetReadingTimeByGroup({ user_refid: this.user?.user_refid, group_code: 'GRAPHS'}).then( async (response) => {
          if(response?.success) {
            window.location.reload();
          }
        });
      },
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
      async onViewLinkList(event: any) {
        await isArticleGroupDone(this.user?.user_refid, 'ARRAYS').then( async (check) => {
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
    
      
      async onViewGraphs(event: any) {
        await isArticleGroupDone(this.user?.user_refid, 'QUEUES').then( async (check) => {
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
      async onViewStack(event: any) {
        await isArticleGroupDone(this.user?.user_refid, 'LINKED_LIST').then( async (check) => {
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
      async onViewQueues(event: any) {
        await isArticleGroupDone(this.user?.user_refid, 'STACKS').then( async (check) => {
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
        await this.loadProgress();

        this.reset_unlock = randomNumbers();
        await isArticleGroupDone(this.user?.user_refid, 'ARRAYS').then( async (check_array) => {
          this.linked_list_locked = !check_array?.success;
          await isArticleGroupDone(this.user?.user_refid, 'LINKED_LIST').then( async (check_linked_list) => {
            this.list_stacks_locked = !check_linked_list?.success;
            
            await isArticleGroupDone(this.user?.user_refid, 'STACKS').then( async (check_stacks) => {
              this.list_queues_locked = !check_stacks?.success;
              await isArticleGroupDone(this.user?.user_refid, 'QUEUES').then( async (check_queues) => {
                this.list_graphs_locked = !check_queues?.success;
              });
            });
          });
        });
      },
      async loadProgress() {
        await fetchArticleReadsById(this.user?.user_refid).then( async (list) => {
          this.articleRed = list;
        });
        
        // Calculate progress percentages for each topic
        // Array progress
        let arrayDone = 0;
        this.array_list.forEach((article: any) => {
          if(this.articleRed.some((articleRed: any) => article?.topic_refid == articleRed?.topic_refid)) {
            arrayDone++;
          }
        });
        this.arrayProgressPercentage = this.array_list.length > 0 ? Math.floor(arrayDone / this.array_list.length * 100) : 0;
        
        // Check if array is completed and show alert
        if (this.arrayProgressPercentage === 100 && !this.arrayCompletionAlertShown && this.topic === 'array') {
          this.showCompletionAlert('array');
          this.arrayCompletionAlertShown = true;
        }

        // Linked list progression
        // Linked list progression
        let linkListDone = 0;
        this.linked_list.forEach((article: any) => {
          if(this.articleRed.some((articleRed: any) => article?.topic_refid == articleRed?.topic_refid)) {
            linkListDone++;
          }
        });
        this.linkListProgressPercentage = this.linked_list.length > 0 ? Math.floor(linkListDone / this.linked_list.length * 100) : 0;
        
        // Check if linked list is completed and show alert
        if (this.linkListProgressPercentage === 100 && !this.linkListCompletionAlertShown && this.topic === 'linked-list') {
          this.showCompletionAlert('linked-list');
          this.linkListCompletionAlertShown = true;
        }

        // Stacks progression
        let stacksDone = 0;
        this.list_stacks.forEach((article: any) => {
          if(this.articleRed.some((articleRed: any) => article?.topic_refid == articleRed?.topic_refid)) {
            stacksDone++;
          }
        });
        this.stacksProgressPercentage = this.list_stacks.length > 0 ? Math.floor(stacksDone / this.list_stacks.length * 100) : 0;
        
        // Check if stacks is completed and show alert
        if (this.stacksProgressPercentage === 100 && !this.stacksCompletionAlertShown && this.topic === 'stacks') {
          this.showCompletionAlert('stacks');
          this.stacksCompletionAlertShown = true;
        }

        // Queues progression
        let queuesDone = 0;
        this.list_queues.forEach((article: any) => {
          if(this.articleRed.some((articleRed: any) => article?.topic_refid == articleRed?.topic_refid)) {
            queuesDone++;
          }
        });
        this.queuesProgressPercentage = this.list_queues.length > 0 ? Math.floor(queuesDone / this.list_queues.length * 100) : 0;
        
        // Check if queues is completed and show alert
        if (this.queuesProgressPercentage === 100 && !this.queuesCompletionAlertShown && this.topic === 'queues') {
          this.showCompletionAlert('queues');
          this.queuesCompletionAlertShown = true;
        }

        // Graphs progression
        let graphsDone = 0;
        this.list_graphs.forEach((article: any) => {
          if(this.articleRed.some((articleRed: any) => article?.topic_refid == articleRed?.topic_refid)) {
            graphsDone++;
          }
        });
        this.graphsProgressPercentage = this.list_graphs.length > 0 ? Math.floor(graphsDone / this.list_graphs.length * 100) : 0;
        
        // Check if graphs is completed and show alert
        if (this.graphsProgressPercentage === 100 && !this.graphsCompletionAlertShown && this.topic === 'graphs') {
          this.showCompletionAlert('graphs');
          this.graphsCompletionAlertShown = true;
        }
      },
      
      showCompletionAlert(topicType: string) {
  let title = 'Congratulations!';
  let text = '';
  
  switch(topicType) {
    case 'array':
      text = "You've completed the Array topic! Would you like to test your knowledge with some exercises?";
      break;
    case 'linked-list':
      text = "You've completed the Linked List topic! Would you like to test your knowledge with some exercises?";
      break;
    case 'stacks':
      text = "You've completed the Stacks topic! Would you like to test your knowledge with some exercises?";
      break;
    case 'queues':
      text = "You've completed the Queues topic! Would you like to test your knowledge with some exercises?";
      break;
    case 'graphs':
      text = "You've completed all Data Structure topics! Ready to test your knowledge with exercises?";
      break;
  }
  
  Swal.fire({
    title: title,
    text: text,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    icon: 'success',     
    confirmButtonText: 'Yes, take me to exercises',
    cancelButtonText: 'No, continue reading'
  }).then((result) => {
    if (result.isConfirmed) {
      // Navigate to exercises regardless of what topic was completed
      this.$router.push('/excercises');
    } else {
      // If they want to continue reading, they'll just stay on the current page
      // You could also redirect to the next topic here if desired
    }
  });
},
    },
    async mounted() {
      this.loading = true;
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
      }
      else {
        this.$toast.warning("Login to log reading history.")
      }

      await fetchAllArticlesArrays().then(async (array_list) => {
        this.array_list = toRaw(array_list);
        await fetchAllArticlesLinkedList().then(async (linked_list) => {
          this.linked_list = toRaw(linked_list);
          await fetchAllArticlesStacks().then(async (list_stacks) => {
            this.list_stacks = list_stacks;
            await fetchAllArticlesQueues().then(async (list_queues) => {
              this.list_queues = list_queues;
              await fetchAllArticlesGraphs().then(async (list_graphs) => {
                this.list_graphs = list_graphs;
                await this.isArticleGroupDoneLocal().then(async () => {
                  this.loading = false;
                  printDevLog("Data:", this.$data);
                });
              });
            });
          });
        });
      });

      if(user?.user_refid) {
        await this.loadProgress();
      }
    }
  });
</script>

