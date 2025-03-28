<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h3>{{ article?.description ? article?.description : 'No seclection'  }}</h3>
      </div>
      <div>
        <div class="d-flex align-items-center">
          <div><i class="bi bi-alarm fs-2 me-2"></i></div>
          <div>
            <p class="p-0 m-0" style="line-height: 1;">
              <small>Time: {{ timeDisplay?.formatted ? timeDisplay?.formatted : '00:00:00' }} | Used: {{ timeDisplay?.percentage ? timeDisplay?.percentage?.used +'%' : '0%' }}</small><br/>
              <small>Allocated reading time</small>
            </p>
            <div v-if="timeDisplay?.percentage" class="progress rounded-0 mt-2" style="height: 6px;">
              <div class="progress-bar progress-bar-striped" role="progressbar" v-bind:style="{ width: timeDisplay?.percentage?.used +'%'}" :aria-valuenow="10" :aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script lang="ts">

  import { defineComponent, toRaw } from 'vue';
  import { createReadLogs, printDevLog, queryCount, SystemConnections, timerStartTimer } from '@/uikit-api';
  import Swal from 'sweetalert2';

  let stopTimer: (() => void) | null = null;

  export default defineComponent({
    name: "SectionArticleHeader",
    emits: ['completed'],
    props: {
      article: {
        default: {} as any,
        type: Object
      },
      user: {
        default: {} as any,
        type: Object
      },
      reset: {
        default: 0,
        type: Number
      }
    },
    data() {
      return {
        timeDisplay: {} as any
      }
    },
    methods: {
      startTimer() {
        stopTimer = timerStartTimer( async (newTime) => {
          printDevLog("Reading Time:", toRaw(newTime));
          this.timeDisplay = newTime;
          if(newTime?.seconds == 0) {
            await createReadLogs({ article_refid: this.article?.article_refid, topic_refid: this.article?.topic_refid, user_refid: this.user?.user_refid}).then( async (logs) => {
              console.log("asdasd: ",logs);
              Swal.fire({
                title: "Completed",
                text: "Allocated reading time completed",
                imageUrl: "/src/assets/img/new-completed.png",
                 
              }).then( async () => {
                printDevLog("Reading Status:","Completed");
                this.$emit('completed');
              });
            });
          }
        },this.article?.reading_time); 
      }
    },
    watch: {
      reset: async function () {
        if(this.reset > 0) {
          await queryCount({
            connection: SystemConnections()['CONN_NPM_LMS'],
            table: 'article_reads',
            where: [
              ['article_refid', this.article?.article_refid],
              ['user_refid', this.user?.user_refid]
            ]
          }).then( async (seen) => {
            printDevLog("Seen:", seen);
            if(seen == 1) {
              this.$emit('completed')
              // Swal.fire({
              //   title: "Completed",
              //   text: "Allocated reading time completed",
              //   icon: "success"
              // }).then( async () => {
              //   printDevLog("Reading Status:","Completed Already");
              //   this.$emit('completed');
              // });
            }
            else {
              this.startTimer();
            }
          });
        }
      }
    }
  });

</script>