<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container mt-5 ">
        <div class="row  p-5">
          <div clas="col-12">
            <h1 class="text-center mt-5 fw-bold display-6">Algorithms Visualization</h1>
            <p class="text-center pb-5">Watch algorithms come to life—step through each process visually and reinforce your understanding with saved progress!</p>
          </div>
          <div class="col-4 mb-5">
            <div class="card">
              <img class="visual-image" src="/src/assets/img/gif/sorting.gif" />
              <div class="card-body">
                <h5>Sorting Visualization</h5>
                <p><small>Demonstrate reordering of elements in ascending or descending order.</small></p>
                <button :class="!isUserAuthenticated() ? 'btn btn-secondary w-100' : 'btn btn-primary w-100'" @click="onClickView('/algorithms-sorting')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else class="bi bi-unlock-fill me-1"></i>
                  <span>View</span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-4 mb-5">
            <div class="card">
              <img class="visual-image" src="/src/assets/img/gif/searching.gif" />
              <div class="card-body">
                <h5>Searching Visualization</h5>
                <p><small>Illustrate locating an element within a dataset using various algorithms.</small></p>
                <button :class="!isUserAuthenticated() ? 'btn btn-secondary w-100' : 'btn btn-primary w-100'" @click="onClickView('/algorithms-searching')">
                  <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                  <i v-else class="bi bi-unlock-fill me-1"></i>
                  <span>View</span>
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
  import { lsGetUser, printDevLog, queryURL, isAuthenticated } from '@/uikit-api';
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import Swal from 'sweetalert2';


  export default defineComponent({
    name: "AlgorithmsPage",
    components: { SectionFooter, SectionHeader },
    data() {
      return {
        user: {} as any,
        views: {} as any
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
      }
    },
    async mounted() {
      const user = await lsGetUser() as any;
      if(user?.user_refid) {
        this.user = user;
      }
      await this.onFetchViews().then( async () => {
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
</style>