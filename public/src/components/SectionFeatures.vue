<template>
  <section id="about" class="about section">
    <div class="container">
      <div class="row align-items-xl-center gy-5">
        <div class="col-xl-5 content">
          <h3>AlgoSpear</h3>
          <h2 class="mt-4">Features</h2>
          <p>AlgoSpear is a Learning Management system with the goal of making learning enjoyable by replacing traditional learning methods into interactive learning concept using the known latest technology.</p>
        </div>
        <div class="col-xl-7">
          <div class="row gy-4 icon-boxes">
            <div class="col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div class="icon-box">
                <i class="bi bi-buildings"></i>
                <h3>Learning Assessment</h3>
                <p>Learn and master the Data Strucutures and Algorithms and Test your learnings by taking assessment.</p>
              </div>
            </div>
            <div class="col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div class="icon-box">
                <i class="bi bi-clipboard-pulse"></i>
                <h3>Visualize Concepts</h3>
                <p>Does reading and images are not enough to understand the concepts? Welcome to the world of Visualization!</p>
              </div>
            </div>
            <div class="col-md-6" data-aos="fade-up" data-aos-delay="400">
              <div class="icon-box">
                <i class="bi bi-command"></i>
                <h3>Learning Progress</h3>
                <p>Track your own progress of learning the fundamentals of DSA and never lose your own journey of learning.</p>
              </div>
            </div>
            <div class="col-md-6" data-aos="fade-up" data-aos-delay="500">
              <div class="icon-box">
                <i class="bi bi-graph-up-arrow"></i>
                <h3>Interactive</h3>
                <p>Make your learning process enjoyable with our advance graphics data presentation and screen animations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">

  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "SectionFeatures"
  });

</script>