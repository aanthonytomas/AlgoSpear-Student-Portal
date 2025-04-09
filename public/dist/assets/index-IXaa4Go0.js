import{d as v,p as V,S as g,t as f,q as y,_ as E,c as d,e as r,a as h,f as p,k as T,b as q,o as u}from"./index-BI8-wN6e.js";import{S as D,f as A,s as S}from"./SectionArticleHeader-CCJpfBzf.js";import{a as R,i as c}from"./check-DoLmAvQx.js";import{r as k}from"./delete-CmEdqrlN.js";import{P as $,d as B,e as N,g as I,h as G,i as H,a as M}from"./ProgressBar-C1Jg9nOj.js";import{r as m}from"./randomNumber-C27Mv2PT.js";import{S as Q,a as Y}from"./SectionFooter-DD-S-wB-.js";import{C as U}from"./Courses-CPZ5ZO3e.js";import{E as K}from"./ElemProgressbar-Bi_UUSb7.js";import"./config-Cif4XynF.js";import"./fetchSingle-B3L-TOMx.js";import"./format-CV38ky4f.js";import"./count-CTZhag45.js";import"./insertGetID-Brze0Scj.js";import"./timer-OaxQmgbO.js";import"./url-Cahlg-je.js";import"./fetchAll-D6z2HXB4.js";const F=v({components:{SectionArticleHeader:D,ElemProgressbar:K,CourseList:U,SectionFooter:Y,SectionHeader:Q,ProgressBar:$},data(){return{topic:this.$route.params.topic,reset:0,reset_unlock:0,timeDisplay:{},timeMax:0,loading:!1,user:{},array_list:[],linked_list:[],linked_list_locked:!0,list_stacks:[],list_stacks_locked:!0,list_queues:[],list_queues_locked:!0,list_graphs:[],list_graphs_locked:!0,article:{},articleRed:[],arrayProgressPercentage:0,linkListProgressPercentage:0,stacksProgressPercentage:0,queuesProgressPercentage:0,graphsProgressPercentage:0,arrayCompletionAlertShown:!1,linkListCompletionAlertShown:!1,stacksCompletionAlertShown:!1,queuesCompletionAlertShown:!1,graphsCompletionAlertShown:!1}},methods:{async resetArrayReadingTime(){var e;await k({user_refid:(e=this.user)==null?void 0:e.user_refid,group_code:"ARRAY"}).then(async t=>{t!=null&&t.success&&window.location.reload()})},async resetLinkedListReadingTime(){var e;await k({user_refid:(e=this.user)==null?void 0:e.user_refid,group_code:"LINKED_LIST"}).then(async t=>{t!=null&&t.success&&window.location.reload()})},async resetStackReadingTime(){var e;await k({user_refid:(e=this.user)==null?void 0:e.user_refid,group_code:"STACKS"}).then(async t=>{t!=null&&t.success&&window.location.reload()})},async resetQueuesReadingTime(){var e;await k({user_refid:(e=this.user)==null?void 0:e.user_refid,group_code:"QUEUES"}).then(async t=>{t!=null&&t.success&&window.location.reload()})},async resetGraphReadingTime(){var e;await k({user_refid:(e=this.user)==null?void 0:e.user_refid,group_code:"GRAPHS"}).then(async t=>{t!=null&&t.success&&window.location.reload()})},async onView(e){this.loading=!0,await A(e==null?void 0:e.topic_refid).then(async t=>{this.loading=!1,t.length>0?(S(),this.article=t[0],this.reset=m()):this.$toast.warning("No article found")})},async onViewLinkList(e){var t;await c((t=this.user)==null?void 0:t.user_refid,"ARRAYS").then(async s=>{y("Check:",f(s)),s!=null&&s.success?(this.loading=!0,await A(e==null?void 0:e.topic_refid).then(async o=>{this.loading=!1,o.length>0?(S(),this.article=o[0],this.reset=m()):this.$toast.warning("No article found")})):g.fire({title:"Invalid Action",html:s==null?void 0:s.message,icon:"info"})})},async onViewGraphs(e){var t;await c((t=this.user)==null?void 0:t.user_refid,"QUEUES").then(async s=>{y("Check:",f(s)),s!=null&&s.success?(this.loading=!0,await A(e==null?void 0:e.topic_refid).then(async o=>{this.loading=!1,o.length>0?(S(),this.article=o[0],this.reset=m()):this.$toast.warning("No article found")})):g.fire({title:"Invalid Action",html:s==null?void 0:s.message,icon:"info"})})},async onViewStack(e){var t;await c((t=this.user)==null?void 0:t.user_refid,"LINKED_LIST").then(async s=>{y("Check:",f(s)),s!=null&&s.success?(this.loading=!0,await A(e==null?void 0:e.topic_refid).then(async o=>{this.loading=!1,o.length>0?(S(),this.article=o[0],this.reset=m()):this.$toast.warning("No article found")})):g.fire({title:"Invalid Action",html:s==null?void 0:s.message,icon:"info"})})},async onViewQueues(e){var t;await c((t=this.user)==null?void 0:t.user_refid,"STACKS").then(async s=>{y("Check:",f(s)),s!=null&&s.success?(this.loading=!0,await A(e==null?void 0:e.topic_refid).then(async o=>{this.loading=!1,o.length>0?(S(),this.article=o[0],this.reset=m()):this.$toast.warning("No article found")})):g.fire({title:"Invalid Action",html:s==null?void 0:s.message,icon:"info"})})},async isArticleGroupDoneLocal(){var e;await this.loadProgress(),this.reset_unlock=m(),await c((e=this.user)==null?void 0:e.user_refid,"ARRAYS").then(async t=>{var s;this.linked_list_locked=!(t!=null&&t.success),await c((s=this.user)==null?void 0:s.user_refid,"LINKED_LIST").then(async o=>{var n;this.list_stacks_locked=!(o!=null&&o.success),await c((n=this.user)==null?void 0:n.user_refid,"STACKS").then(async l=>{var i;this.list_queues_locked=!(l!=null&&l.success),await c((i=this.user)==null?void 0:i.user_refid,"QUEUES").then(async a=>{this.list_graphs_locked=!(a!=null&&a.success)})})})})},async loadProgress(){var l;await M((l=this.user)==null?void 0:l.user_refid).then(async i=>{this.articleRed=i});let e=0;this.array_list.forEach(i=>{this.articleRed.some(a=>(i==null?void 0:i.topic_refid)==(a==null?void 0:a.topic_refid))&&e++}),this.arrayProgressPercentage=this.array_list.length>0?Math.floor(e/this.array_list.length*100):0,this.arrayProgressPercentage===100&&!this.arrayCompletionAlertShown&&this.topic==="array"&&(this.showCompletionAlert("array"),this.arrayCompletionAlertShown=!0);let t=0;this.linked_list.forEach(i=>{this.articleRed.some(a=>(i==null?void 0:i.topic_refid)==(a==null?void 0:a.topic_refid))&&t++}),this.linkListProgressPercentage=this.linked_list.length>0?Math.floor(t/this.linked_list.length*100):0,this.linkListProgressPercentage===100&&!this.linkListCompletionAlertShown&&this.topic==="linked-list"&&(this.showCompletionAlert("linked-list"),this.linkListCompletionAlertShown=!0);let s=0;this.list_stacks.forEach(i=>{this.articleRed.some(a=>(i==null?void 0:i.topic_refid)==(a==null?void 0:a.topic_refid))&&s++}),this.stacksProgressPercentage=this.list_stacks.length>0?Math.floor(s/this.list_stacks.length*100):0,this.stacksProgressPercentage===100&&!this.stacksCompletionAlertShown&&this.topic==="stacks"&&(this.showCompletionAlert("stacks"),this.stacksCompletionAlertShown=!0);let o=0;this.list_queues.forEach(i=>{this.articleRed.some(a=>(i==null?void 0:i.topic_refid)==(a==null?void 0:a.topic_refid))&&o++}),this.queuesProgressPercentage=this.list_queues.length>0?Math.floor(o/this.list_queues.length*100):0,this.queuesProgressPercentage===100&&!this.queuesCompletionAlertShown&&this.topic==="queues"&&(this.showCompletionAlert("queues"),this.queuesCompletionAlertShown=!0);let n=0;this.list_graphs.forEach(i=>{this.articleRed.some(a=>(i==null?void 0:i.topic_refid)==(a==null?void 0:a.topic_refid))&&n++}),this.graphsProgressPercentage=this.list_graphs.length>0?Math.floor(n/this.list_graphs.length*100):0,this.graphsProgressPercentage===100&&!this.graphsCompletionAlertShown&&this.topic==="graphs"&&(this.showCompletionAlert("graphs"),this.graphsCompletionAlertShown=!0)},showCompletionAlert(e){let t="Congratulations!",s="";switch(e){case"array":s="You've completed the Array topic! Would you like to test your knowledge with some exercises?";break;case"linked-list":s="You've completed the Linked List topic! Would you like to test your knowledge with some exercises?";break;case"stacks":s="You've completed the Stacks topic! Would you like to test your knowledge with some exercises?";break;case"queues":s="You've completed the Queues topic! Would you like to test your knowledge with some exercises?";break;case"graphs":s="You've completed all Data Structure topics! Ready to test your knowledge with exercises?";break}g.fire({title:t,text:s,showCancelButton:!0,cancelButtonColor:"#d33",icon:"success",confirmButtonText:"Yes, take me to exercises",cancelButtonText:"No, continue reading"}).then(o=>{o.isConfirmed&&this.$router.push("/excercises")})}},async mounted(){var t;this.loading=!0;const e=await V();e!=null&&e.user_refid?(this.user=e,await R((t=this.user)==null?void 0:t.user_refid).then(async s=>{s!=null&&s.success||g.fire({title:"Invalid Action",html:s==null?void 0:s.message,icon:"info"}).then(()=>{this.$router.push("/readings")})})):this.$toast.warning("Login to log reading history."),await B().then(async s=>{this.array_list=f(s),await N().then(async o=>{this.linked_list=f(o),await I().then(async n=>{this.list_stacks=n,await G().then(async l=>{this.list_queues=l,await H().then(async i=>{this.list_graphs=i,await this.isArticleGroupDoneLocal().then(async()=>{this.loading=!1,y("Data:",this.$data)})})})})})}),e!=null&&e.user_refid&&await this.loadProgress()}}),W={class:"main"},j={class:"container mt-5 py-5"},z={class:"row mt-5"},J={class:"col-lg-4 col-md-5 col-12 mb-4"},O={class:"sticky-sidebar"},X={key:0},Z={key:1},x={key:2},ee={key:3},se={key:4},te={class:"col-lg-8 col-md-7 col-12"},ie={class:"text-dark mt-5"},ae=["innerHTML"],oe={key:1,class:"p-md-5 p-3 m-md-5 m-3"};function re(e,t,s,o,n,l){var P,b;const i=p("SectionHeader"),a=p("ElemProgressbar"),w=p("ProgressBar"),_=p("CourseList"),C=p("SectionArticleHeader"),L=p("SectionFooter");return u(),d("div",null,[r(i),h("main",W,[h("div",j,[t[2]||(t[2]=h("h1",{class:"text-center mt-5"},"Data Structure",-1)),h("div",z,[h("div",J,[h("div",O,[r(a,{loading:e.loading},null,8,["loading"]),e.topic=="array"?(u(),d("div",X,[r(w,{percentage:e.arrayProgressPercentage,height:40},null,8,["percentage"]),r(_,{title:"Array",articlesRead:e.articleRed,unlock:e.reset_unlock,btn_disabled:!1,list:e.array_list,onView:e.onView},null,8,["articlesRead","unlock","list","onView"])])):e.topic=="linked-list"?(u(),d("div",Z,[r(w,{percentage:e.linkListProgressPercentage,height:40},null,8,["percentage"]),r(_,{title:"Linked List",articlesRead:e.articleRed,unlock:e.reset_unlock,btn_disabled:e.linked_list_locked,list:e.linked_list,onView:e.onViewLinkList},null,8,["articlesRead","unlock","btn_disabled","list","onView"])])):e.topic=="stacks"?(u(),d("div",x,[r(w,{percentage:e.stacksProgressPercentage,height:40},null,8,["percentage"]),r(_,{title:"Stacks",articlesRead:e.articleRed,unlock:e.reset_unlock,btn_disabled:e.list_stacks_locked,list:e.list_stacks,onView:e.onViewStack},null,8,["articlesRead","unlock","btn_disabled","list","onView"])])):e.topic=="queues"?(u(),d("div",ee,[r(w,{percentage:e.queuesProgressPercentage,height:40},null,8,["percentage"]),r(_,{title:"Queues",articlesRead:e.articleRed,unlock:e.reset_unlock,btn_disabled:e.list_queues_locked,list:e.list_queues,onView:e.onViewQueues},null,8,["articlesRead","unlock","btn_disabled","list","onView"])])):e.topic=="graphs"?(u(),d("div",se,[r(w,{percentage:e.graphsProgressPercentage,height:40},null,8,["percentage"]),r(_,{title:"Graphs",articlesRead:e.articleRed,unlock:e.reset_unlock,btn_disabled:e.list_graphs_locked,list:e.list_graphs,onView:e.onViewGraphs},null,8,["articlesRead","unlock","btn_disabled","list","onView"])])):T("",!0)])]),h("div",te,[r(C,{article:e.article,user:e.user,reset:e.reset,onCompleted:t[0]||(t[0]=le=>e.isArticleGroupDoneLocal())},null,8,["article","user","reset"]),h("div",ie,[(P=e.article)!=null&&P.content?(u(),d("div",{key:0,innerHTML:(b=e.article)==null?void 0:b.content},null,8,ae)):(u(),d("div",oe,t[1]||(t[1]=[q('<div class="card" data-v-0a2e9ba1><div class="card-body" data-v-0a2e9ba1><h3 class="text-center p-md-5 p-3" style="color:#a9a0a0;" id="selectreading" data-v-0a2e9ba1>Select reading material to start</h3><div class="d-flex justify-content-center pb-md-5 pb-3" data-v-0a2e9ba1><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#a9a0a0" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16" data-v-0a2e9ba1><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z" data-v-0a2e9ba1></path></svg></div></div></div>',1)])))])])])])]),r(L)])}const Ce=E(F,[["render",re],["__scopeId","data-v-0a2e9ba1"]]);export{Ce as default};
