<template>
  <section class="hero section dark-background">
    <img src="/src/assets/img/hero-bg-2.jpg" alt="" class="hero-bg">
    <div class="container py-5">
      <swiper 
        :autoplay="{delay: 6000, disableOnInteraction: true }"
        :navigation="false"
        :slides-per-view="1"
        :centeredSlides="true"
        :space-between="0"
        :modules="modules"
        :pagination="{ clickable: true }"
        @autoplayTimeLeft="onAutoplayTimeLeft">
        <swiper-slide>
          <div class="row gy-4 justify-content-between">
            <div class="col-lg-4 order-lg-last hero-img py-5">
              <img src="/src/assets/img/structured-data.png" class="img-fluid animated" alt="">
            </div>
            <div class="col-lg-6 d-flex flex-column justify-content-center">
              <h1 class="text-white">Comprehend <span>Data Struct</span>ures & <span>Algorith</span>ms</h1>
              <p class="text-white"><small>Learn Data Structures and Algorithms with interactive lessons and hands-on coding challenges. <strong>Track your progress</strong> to stay motivated and measure your growth. Build a strong foundation for user's education and career.</small></p>
              <div class="d-flex">
                <router-link class="btn-get-started fw-bold" to="/readings" >
                  
                  <i class="bi bi-book"></i> Learn Now

                </router-link>
              </div>
            </div>
          </div>
        </swiper-slide>
        
        <swiper-slide>
          <div class="row gy-4 justify-content-between">
            <div class="col-lg-4 order-lg-last hero-img py-5">
              <img src="/src/assets/img/visualize.png" class="img-fluid animated" alt="">
            </div>
            <div class="col-lg-6 d-flex flex-column justify-content-center">
              <h1 class="text-white"><span>Visuali</span>ze The Concepts</h1>
              <p class="text-white"><small>Understand Data Structures and Algorithms better with interactive visualizations. Our platform simplifies complex workflows, by viewing live action algorithms that making learning more intuitive and engaging. </small></p>
              <div class="d-flex">
                <router-link class="btn-get-started fw-bold" to="/datastructures" >
                  <i class="bi bi-bar-chart me-1 "></i> Visualize Now
                </router-link>
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="row gy-4 justify-content-between">
            <div class="col-lg-4 order-lg-last hero-img py-5">
              <img src="/src/assets/img/testing.png" class="img-fluid animated" alt="">
            </div>
            <div class="col-lg-6 d-flex flex-column justify-content-center">
              <h1 class="text-white"><span>Evalua</span>te Your Learning</h1>
              <p class="text-white"><small>Assess your understanding of Data Structures and Algorithms with interactive exercises and quizzes. Identify areas for improvement as you learn. Strengthen your problem-solving skills through assessments.</small></p>
              <div class="d-flex">
                <router-link class="btn-get-started fw-bold" to="/excercises" >
                  <i class="bi bi-clipboard-check me-1"></i> Assess Now
                </router-link>
              </div>
            </div>
          </div>
        </swiper-slide>
        <template #container-end>
          <div class="autoplay-progress">
            <svg viewBox="0 0 48 48" ref="progressCircle">
              <circle cx="24" cy="24" r="20"></circle>
            </svg>
            <span ref="progressContent">1</span>
          </div>
        </template>
      </swiper>
    </div>
    <svg class="hero-waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28 " preserveAspectRatio="none">
      <defs>
        <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
      </defs>
      <g class="wave1">
        <use xlink:href="#wave-path" x="50" y="3"></use>
      </g>
      <g class="wave2">
        <use xlink:href="#wave-path" x="50" y="0"></use>
      </g>
      <g class="wave3">
        <use xlink:href="#wave-path" x="50" y="9"></use>
      </g>
    </svg>
  </section>
</template>
<script lang="ts">

  import { defineComponent, ref } from "vue";
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay, Pagination, Navigation } from 'swiper/modules';

  
  export default defineComponent({
    name: "SectionCarousel",
    components: { Swiper, SwiperSlide },
    setup() {
      const progressCircle = ref(null) as any;
      const progressContent = ref(null)as any;
      const onAutoplayTimeLeft = (s: any, time: any, progress: any) => {
        progressCircle.value.style.setProperty('--progress', 1 - progress);
        progressContent.value.textContent = `${Math.ceil(time / 1000)}s`;
      };
      return {
        onAutoplayTimeLeft,
        progressCircle,
        progressContent,
        modules: [Autoplay, Pagination, Navigation],
      };
    }
  });

</script>
<style scope>
  .autoplay-progress {
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 10;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
  }
  .autoplay-progress svg {
    --progress: 0;
    position: absolute;
    left: 0;
    top: 0px;
    z-index: 10;
    width: 100%;
    height: 100%;
    stroke-width: 4px;
    stroke: white;
    fill: none;
    stroke-dashoffset: calc(125.6px * (1 - var(--progress)));
    stroke-dasharray: 125.6;
    transform: rotate(-90deg);
  }
</style>