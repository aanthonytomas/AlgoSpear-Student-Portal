<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <div class="container-fluid p-0">
        <div class="row mb-3">
          <div class="col-12">
            <h1 class="text-center">Stacks Visualization</h1>
          </div>
        </div>
        <div class="iframe-container">
          <iframe 
            class="visualization-frame border-0" 
            src="https://stacks-visualization.netlify.app/"
            scrolling="no"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </main>
    <SectionFooter/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SectionHeader from "@/components/SectionHeader.vue";
import SectionFooter from "@/components/SectionFooter.vue";

export default defineComponent({
  name: "VisualizationStacksPage",
  components: {  SectionFooter, SectionHeader }
});
</script>

<style scoped>
.iframe-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 10;
  padding-top: 52.25%; /* 16:9 Aspect Ratio */
  margin-bottom: -0px;
}

.visualization-frame {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
}



@media (min-height: 1700px) {
  .iframe-container {
    padding-top: 75vh; /* 75% of viewport height for taller screens */
  }
}


</style>