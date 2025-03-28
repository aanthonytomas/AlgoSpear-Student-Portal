<template>
  <div class="d-flex justify-content-center">
    <div class="d-flex align-items-center mt-4" style="width: 250px;">
      <div><i class="bi bi-alarm fs-2 me-2"></i></div>
      <div class="w-100">
        <p class="p-0 m-0" style="line-height: 1;">
          <small>Time: {{ timeDisplay?.formatted ? timeDisplay?.formatted : '00:00:00' }} | Used: {{ timeDisplay?.percentage ? timeDisplay?.percentage?.used +'%' : '0%' }}</small><br/>
          <small>Allocated time</small>
        </p>
        <div v-if="timeDisplay?.percentage" class="progress rounded-0 mt-2" style="height: 6px;">
          <div class="progress-bar progress-bar-striped" role="progressbar" v-bind:style="{ width: timeDisplay?.percentage?.used +'%'}" :aria-valuenow="10" :aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

  import { defineComponent, toRaw } from 'vue';
  import { lsGetUser, printDevLog, queryCount, queryInsertGetID, SystemConnections, timerStartTimer } from '@/uikit-api';
  import jlconfig from "@/jlconfig.json";
import Swal from 'sweetalert2';

  let stopTimer: (() => void) | null = null;

  export default defineComponent({
    props: {
      group_code: {
        default: '' as any,
        type: String
      }
    },
    data() {
      return {
        user: {} as any,
        timeDisplay: {} as any
      }
    },
    methods: {
      startTimer() {
        var duration = 90;
        if(this.group_code) {
          var list      = jlconfig.visualization_time as any;
          var index     = this.group_code;
          duration      = list[index];
        }
        printDevLog("Time Duration:", duration);
        stopTimer = timerStartTimer( async (newTime) => {
          printDevLog("Reading Time:", toRaw(newTime));
          this.timeDisplay = newTime;
          if(newTime?.seconds == 0) {
            await queryInsertGetID({
              connection: SystemConnections()['CONN_NPM_LMS'],
              table: 'visual_views',
              columns: {
                'user_refid': this.user?.user_refid,
                'group_code': this.group_code
              }
            }).then( async () => {
              Swal.fire({
                title: "Completed",
                text: "You have completed the allocated time",
                imageUrl: "/src/assets/img/new-completed.png",
                 
              });
            });
          }
        }, duration); 
      },
      async isViewsExist() {
        await queryCount({
          connection: SystemConnections()['CONN_NPM_LMS'],
          table: 'visual_views',
          where: [
            ['user_refid', this.user?.user_refid],
            ['group_code', this.group_code]
          ]
        }).then( async (done) => {
          if(done > 0) {
            this.$toast.success("You've completed this visual")
          }
          else {
            this.startTimer();
          }
        });
      }
    },
    async mounted() {
      const user = await lsGetUser() as any;
      if(user?.user_refid) {
        this.user = user;
      }
      await this.isViewsExist().then( async () => {
        
        
      });
    },
  });
</script>