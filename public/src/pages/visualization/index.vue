<template>
  <div>
    <SectionHeader/>
    <main class="main">
      
    </main>
    <SectionFooter/>
  </div>
</template>
<script lang="ts">

  import { defineComponent } from 'vue';
  import SectionHeader from "@/components/SectionHeader.vue";
  import SectionFooter from "@/components/SectionFooter.vue";

  export default defineComponent({
    name: "VisualizationPage",
    components: { SectionFooter, SectionHeader }
  });

</script>