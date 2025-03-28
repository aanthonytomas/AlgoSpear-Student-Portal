<template>
  <div class="w-100" style="overflow: hidden;">
    <div class="progress rounded-0" :class="{ 'isloading': loading, 'notloading': !loading }" role="progressbar" style="height: 3px;">
      <div class="progress-bar progress-bar-striped indeterminate"></div>
    </div>
  </div>
</template>
<script lang="ts">

  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "ElemProgressbar",
    props: {
      loading: {
        default: false,
        type: Boolean
      }
    }
  });

</script>
<style scoped>
  .isloading {
    opacity: 1 !important;
  }
  .notloading {
    opacity: 0 !important;
  }
  .progress-bar.indeterminate {
    position: relative;
    animation: progress-indeterminate 0.80s linear infinite;
  }

  @keyframes progress-indeterminate {
    from { left: -25%; width: 25%; }
    to { left: 100%; width: 25%;}
  }
</style>