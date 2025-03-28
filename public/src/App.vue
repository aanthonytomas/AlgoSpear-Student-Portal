<template>
  <Preloader v-if="!appLoaded" @loaded="onPreloaderFinished" />
  <RouterView v-if="appLoaded" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { useHead } from '@unhead/vue';
import Aos from 'aos';
import Preloader from './components/Preloader.vue';

export default defineComponent({
  name: 'MainApp',
  components: { 
    RouterView,
    Preloader 
  },
  data() {
    return {
      appLoaded: false
    }
  },
  watch: {
    $route: async function () {
      const route = this.$route;
      useHead({
        title: route.meta?.title + ''
      })
    }
  },
  methods: {
    onPreloaderFinished() {
      this.appLoaded = true;
    }
  },
  async mounted() {
    setTimeout(() => {
      Aos.init();
    }, 1500);
  }
});
</script>