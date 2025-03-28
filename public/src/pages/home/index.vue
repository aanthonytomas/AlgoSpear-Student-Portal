<template>
  <div>
    <SectionHeader/>
    <main class="main">
      <SectionSlider/>
      <SectionFeatures/>
      <SectionAbout/> 
      <SectionTeam/>
    </main>
    <SectionFooter/>
  </div>
</template>
<script lang="ts">

  import { defineComponent } from 'vue';
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionSlider from "@/components/SectionSlider.vue";
  import SectionFeatures from "@/components/SectionFeatures.vue";
  import SectionTeam from "@/components/SectionTeam.vue";
  import SectionFooter from "@/components/SectionFooter.vue";
  import SectionAbout from "@/components/SectionAbout.vue";

  export default defineComponent({
    name: "AsessmentPage",
    components: { SectionAbout, SectionFooter, SectionHeader, SectionSlider, SectionFeatures, SectionTeam }
  });

</script>