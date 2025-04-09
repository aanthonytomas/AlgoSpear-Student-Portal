<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container mt-5 py-5">
        <div class="row mt-5">
          <div class="col-4">
            <div style="padding: 47px;"></div>
            <div class="card mb-4" v-for="(video, vi) in sortedVideoGroups" :key="vi">
              <div class="card-header text-white" style="background-color: rgb(22 17 102);">{{ video?.header?.name }}</div>
              <div class="card-body p-0 m-0">
                <div v-if="video?.videos.length == 0" class="alert alert-warning m-3">
                  <p>This category has no uploaded video yet. Try again later.</p>
                </div>
                <table class="table table-striped">
                  <tbody>
                    <tr v-for="(v, i) in sortVideos(video?.videos)" :key="i">
                      <td class="align-middle w-75"><small>{{ v?.title }}</small></td>
                      <td class="text-end">
                        <button 
                          class="btn btn-sm" 
                          :class="[
                            !isUserAuthenticated() ? 'btn-secondary' : 'btn-primary'
                          ]" 
                          @click="onWatchVideo(v)"
                        >
                          <i v-if="!isUserAuthenticated()" class="bi bi-lock-fill me-1"></i>
                          <i v-else class="bi bi-unlock-fill me-1"></i>
                          Watch
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-8">
            <div class="video-container position-sticky top-0 bg-white py-3">
              <h1 class="text-center fw-bold display-6">Video Tutorials</h1>
              <p class="text-center">For more interactive learning we provide videos as further references for each topic</p>
              <div class="ratio ratio-16x9 mb-3">
                <iframe 
                  v-if="video_code" 
                  :src="`https://www.youtube.com/embed/${ video_code }`" 
                  ref="iframe" 
                  allow="autoplay; encrypted-media" 
                  allowfullscreen
                >
                </iframe>
                <div v-else class="d-flex align-items-center justify-content-center border">
                  <p class="text-center">Select a video to watch</p>
                </div>
              </div>
              <h3>{{ video_title }}</h3>
              <p>{{ video_description }}</p>
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
import SectionHeader from "@/components/SectionHeader.vue";
import SectionFooter from "@/components/SectionFooter.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { printDevLog, queryURL, isAuthenticated } from '@/uikit-api';
import Swal from 'sweetalert2';

export default defineComponent({
  name: "VideosPage",
  components: { SectionFooter, SectionHeader, Swiper, SwiperSlide },
  data() {
    return {
      swiper: {} as any,
      videos: {} as Record<string, any>,
      video_code: 'Ck0Zjh91D4s?si=17rChn_QnalHDkAw',
      video_title: '',
      video_description: ''
    }
  },
  computed: {
    sortedVideoGroups() {
      // Create a deep copy of videos to avoid mutating original data
      const videoGroups = JSON.parse(JSON.stringify(this.videos));
      
      // Sort video groups if they exist
      if (videoGroups && Object.keys(videoGroups).length) {
        return Object.keys(videoGroups)
          .sort((a, b) => {
            // Assuming each group has a header with a dataid
            const dataIdA = videoGroups[a]?.header?.dataid || Infinity;
            const dataIdB = videoGroups[b]?.header?.dataid || Infinity;
            return dataIdA - dataIdB;
          })
          .reduce((sorted: Record<string, any>, key: string) => {
            sorted[key] = videoGroups[key];
            return sorted;
          }, {});
      }
      return videoGroups;
    }
  },
  methods: {
    sortVideos(videos: any[]) {
      // Sort videos within a group based on dataid
      return videos.sort((a, b) => {
        const dataIdA = a?.dataid || Infinity;
        const dataIdB = b?.dataid || Infinity;
        return dataIdA - dataIdB;
      });
    },
    onSwiper(swiper: any) {
      this.swiper = swiper;
    },
    onChangeVideo(index: number) {
      this.swiper.slideTo(index);
    },
    async onFetchVideos() {
      await queryURL({ url: "util_quiz/videoTutorials" }).then(async (videos) => {
        this.videos = videos;
      });
    },
    isUserAuthenticated() {
      return isAuthenticated()
    },
    onWatchVideo(video: any) {
      if (this.isUserAuthenticated()) {
        this.video_code = video?.video_code;
        this.video_title = video?.title;
        this.video_description = video?.description;
        printDevLog("Video:", toRaw(video));
      } else {
        Swal.fire({
          title: "Sign In Required",
          html: "Please Login first",
          icon: "warning",           
        }).then(async () => {
          this.$router.replace('/login');
        });
      }
    },
    receiveMessage(event: MessageEvent) {
      console.log(event.origin)
      if (event.origin !== 'http://localhost:5173') {
        return;
      }
      console.log('Received message from iframe:', event.data);
    },
    addIframePlayListener() {
      window.addEventListener('message', this.receiveMessage);
    },
  },
  async mounted() {
    await this.onFetchVideos().then(async () => {
      printDevLog("Videos:", toRaw(this.$data));
    });
    
    this.addIframePlayListener();
  },
  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage);
  }
});
</script>

<style scoped>
.video-container {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding-top: 20px;
  padding-bottom: 20px;

}

.video-container iframe {
  width: 100%;
  height: 100%;
  border-radius: 8px;

}
</style>