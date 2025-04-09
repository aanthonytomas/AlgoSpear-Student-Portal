import{d as A,p as w,S as a,q as P,t as c,i as u,_ as v,c as n,e as b,a as t,f as k,s as h,k as g,n as m,o}from"./index-BI8-wN6e.js";import{a as L,i as y}from"./check-DoLmAvQx.js";import{q as S}from"./url-Cahlg-je.js";import{P as q,d as R,e as T,g as U,h as $,i as D,a as E}from"./ProgressBar-C1Jg9nOj.js";import{S as F,a as I}from"./SectionFooter-DD-S-wB-.js";import"./config-Cif4XynF.js";import"./count-CTZhag45.js";import"./format-CV38ky4f.js";import"./fetchAll-D6z2HXB4.js";const B=A({name:"CoursesPage",components:{SectionFooter:I,SectionHeader:F,ProgressBar:q},data(){return{user:{},views:{},articleRed:[],array_list:[],linked_list:[],list_stacks:[],list_queues:[],list_graphs:[],topicCompletionStatus:{array:!1,"linked-list":!1,stacks:!1,queues:!1,graphs:!1},arrayProgressPercentage:0,linkListProgressPercentage:0,stacksProgressPercentage:0,queuesProgressPercentage:0,graphsProgressPercentage:0,loading:!1}},methods:{isUserAuthenticated(){return u()},isTopicRead(s){var e;return!this.views||!((e=this.user)!=null&&e.user_refid)?!1:this.views[s]===!0},isTopicCompleted(s){return this.topicCompletionStatus[s]===!0},onClickView(s){u()?this.$router.push(s):a.fire({title:"Sign In Required",html:"Please Login first",icon:"warning"})},async onClickLinkedList(s){u()?this.isTopicCompleted("array")?this.$router.push(s):a.fire({title:"Locked Content",html:"You need to complete Arrays first before accessing Linked Lists.",icon:"warning"}):a.fire({title:"Sign In Required",html:"Please Login first",icon:"warning"})},async onClickStacks(s){var e;u()?await y((e=this.user)==null?void 0:e.user_refid,"LINKED_LIST").then(l=>{l!=null&&l.success?this.$router.push(s):a.fire({title:"Locked Content",html:(l==null?void 0:l.message)||"You need to complete Linked Lists first before accessing Stacks.",icon:"warning"})}):a.fire({title:"Sign In Required",html:"Please Login first",icon:"warning"})},async onClickQueues(s){var e;u()?await y((e=this.user)==null?void 0:e.user_refid,"STACKS").then(l=>{l!=null&&l.success?this.$router.push(s):a.fire({title:"Locked Content",html:(l==null?void 0:l.message)||"You need to complete Stacks first before accessing Queues.",icon:"warning"})}):a.fire({title:"Sign In Required",html:"Please Login first",icon:"warning"})},async onClickGraphs(s){var e;u()?await y((e=this.user)==null?void 0:e.user_refid,"QUEUES").then(l=>{l!=null&&l.success?this.$router.push(s):a.fire({title:"Locked Content",html:(l==null?void 0:l.message)||"You need to complete Queues first before accessing Graphs.",icon:"warning"})}):a.fire({title:"Sign In Required",html:"Please Login first",icon:"warning"})},async onFetchViews(){var s;await S({url:"util_quiz/visualViewsChecker?user_refid="+((s=this.user)==null?void 0:s.user_refid)}).then(async e=>{this.views=e})},async fetchReadArticles(){var s,e;(s=this.user)!=null&&s.user_refid&&await E((e=this.user)==null?void 0:e.user_refid).then(l=>{this.articleRed=l,this.checkAllTopicsCompletion(),this.calculateProgressPercentages()})},async loadAllArticles(){this.loading=!0,await R().then(s=>{this.array_list=c(s)}),await T().then(s=>{this.linked_list=c(s)}),await U().then(s=>{this.list_stacks=c(s)}),await $().then(s=>{this.list_queues=c(s)}),await D().then(s=>{this.list_graphs=c(s)}),this.loading=!1},checkAllTopicsCompletion(){let s=this.array_list.length>0;this.array_list.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)||(s=!1)}),this.topicCompletionStatus.array=s;let e=this.linked_list.length>0;this.linked_list.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)||(e=!1)}),this.topicCompletionStatus["linked-list"]=e;let l=this.list_stacks.length>0;this.list_stacks.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)||(l=!1)}),this.topicCompletionStatus.stacks=l;let r=this.list_queues.length>0;this.list_queues.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)||(r=!1)}),this.topicCompletionStatus.queues=r;let d=this.list_graphs.length>0;this.list_graphs.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)||(d=!1)}),this.topicCompletionStatus.graphs=d},calculateProgressPercentages(){let s=0;this.array_list.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)&&s++}),this.arrayProgressPercentage=this.array_list.length>0?Math.floor(s/this.array_list.length*100):0;let e=0;this.linked_list.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)&&e++}),this.linkListProgressPercentage=this.linked_list.length>0?Math.floor(e/this.linked_list.length*100):0;let l=0;this.list_stacks.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)&&l++}),this.stacksProgressPercentage=this.list_stacks.length>0?Math.floor(l/this.list_stacks.length*100):0;let r=0;this.list_queues.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)&&r++}),this.queuesProgressPercentage=this.list_queues.length>0?Math.floor(r/this.list_queues.length*100):0;let d=0;this.list_graphs.forEach(i=>{this.isArticleRead(i==null?void 0:i.topic_refid)&&d++}),this.graphsProgressPercentage=this.list_graphs.length>0?Math.floor(d/this.list_graphs.length*100):0},isArticleRead(s){return this.articleRed.some(e=>e.topic_refid===s)}},async mounted(){var e;const s=await w();s!=null&&s.user_refid&&(this.user=s,await L((e=this.user)==null?void 0:e.user_refid).then(async l=>{l!=null&&l.success||a.fire({title:"Invalid Action",html:l==null?void 0:l.message,icon:"info"}).then(()=>{this.$router.push("/readings")})}),await this.loadAllArticles(),await this.fetchReadArticles()),await this.onFetchViews().then(async()=>{P("DS Data:",c(this.$data))})}}),G="/assets/new-arrays-BjOE2Xnu.png",Q="/assets/new-linkedlist-D6GXT3YM.png",V="/assets/new-stacks-B7Jnn0Cx.png",M="/assets/new-queues2-ZHF1iow9.png",H="/assets/new-graphs-DyF0vU8H.png",O={class:"main"},Y={class:"container py-5"},z={class:"row m-lg-5 m-3 p-lg-5 p-3"},N={class:"col-lg-4 col-md-6 col-12 mb-5"},K={class:"card"},X={class:"card-body"},j={key:0,class:"bi bi-lock-fill me-1"},J={key:1,class:"bi bi-check-circle-fill me-1"},Z={key:2,class:"bi bi-unlock-fill me-1"},W={class:"col-lg-4 col-md-6 col-12 mb-5"},x={class:"card"},ss={class:"card-body"},es={key:0,class:"bi bi-lock-fill me-1"},ts={key:1,class:"bi bi-check-circle-fill me-1"},is={key:2,class:"bi bi-unlock-fill me-1"},ls={key:3,class:"bi bi-lock-fill me-1"},os={class:"col-lg-4 col-md-6 col-12 mb-5"},ns={class:"card"},as={class:"card-body"},rs={key:0,class:"bi bi-lock-fill me-1"},ds={key:1,class:"bi bi-check-circle-fill me-1"},cs={key:2,class:"bi bi-unlock-fill me-1"},us={key:3,class:"bi bi-lock-fill me-1"},ps={class:"col-lg-4 col-md-6 col-12 mb-5"},hs={class:"card"},gs={class:"card-body"},ms={key:0,class:"bi bi-lock-fill me-1"},fs={key:1,class:"bi bi-check-circle-fill me-1"},ks={key:2,class:"bi bi-unlock-fill me-1"},ys={key:3,class:"bi bi-lock-fill me-1"},bs={class:"col-lg-4 col-md-6 col-12 mb-5"},_s={class:"card"},Cs={class:"card-body"},As={key:0,class:"bi bi-lock-fill me-1"},ws={key:1,class:"bi bi-check-circle-fill me-1"},Ps={key:2,class:"bi bi-unlock-fill me-1"},vs={key:3,class:"bi bi-lock-fill me-1"};function Ls(s,e,l,r,d,i){const _=k("SectionHeader"),p=k("ProgressBar"),C=k("SectionFooter");return o(),n("div",null,[b(_),t("main",O,[t("div",Y,[t("div",z,[e[25]||(e[25]=t("div",{class:"col-12 text-center"},[t("h1",{class:"fw-bold display-6"},"Data Structures Topics"),t("p",{class:"pb-3 pb-md-5"},[t("small",null,"Data structures are fundamental concepts in programming that help organize, store, and manage data efficiently for easier access and modification.")])],-1)),t("div",N,[s.isUserAuthenticated()?(o(),h(p,{key:0,percentage:s.arrayProgressPercentage,height:40},null,8,["percentage"])):g("",!0),t("div",K,[e[8]||(e[8]=t("img",{src:G,alt:"Arrays",class:"card-img-top"},null,-1)),t("div",X,[e[6]||(e[6]=t("h5",null,"Arrays",-1)),e[7]||(e[7]=t("p",null,[t("small",null,"A linear data structure that stores elements in contiguous memory locations, allowing fast indexing but fixed size.")],-1)),t("button",{class:m(["btn w-100",s.isTopicCompleted("array")?"btn-success":"btn-primary"]),onClick:e[0]||(e[0]=f=>s.onClickView("/readings-data-structure/array"))},[s.isUserAuthenticated()?s.isTopicCompleted("array")?(o(),n("i",J)):(o(),n("i",Z)):(o(),n("i",j)),e[5]||(e[5]=t("span",null,"Read",-1))],2)])])]),t("div",W,[s.isUserAuthenticated()?(o(),h(p,{key:0,percentage:s.linkListProgressPercentage,height:40},null,8,["percentage"])):g("",!0),t("div",x,[e[12]||(e[12]=t("img",{src:Q,alt:"Linked List",class:"card-img-top"},null,-1)),t("div",ss,[e[10]||(e[10]=t("h5",null,"Linked List",-1)),e[11]||(e[11]=t("p",null,[t("small",null," A dynamic data structure where elements are connected through pointers, enabling efficient insertions and deletions.")],-1)),t("button",{class:m(["btn w-100",s.isTopicCompleted("linked-list")?"btn-success":s.isTopicCompleted("array")?"btn-primary":"btn-secondary"]),onClick:e[1]||(e[1]=f=>s.onClickLinkedList("/readings-data-structure/linked-list"))},[s.isUserAuthenticated()?s.isTopicCompleted("linked-list")?(o(),n("i",ts)):s.isTopicCompleted("array")?(o(),n("i",is)):(o(),n("i",ls)):(o(),n("i",es)),e[9]||(e[9]=t("span",null,"Read",-1))],2)])])]),t("div",os,[s.isUserAuthenticated()?(o(),h(p,{key:0,percentage:s.stacksProgressPercentage,height:40},null,8,["percentage"])):g("",!0),t("div",ns,[e[16]||(e[16]=t("img",{src:V,alt:"Stacks",class:"card-img-top"},null,-1)),t("div",as,[e[14]||(e[14]=t("h5",null,"Stacks",-1)),e[15]||(e[15]=t("p",null,[t("small",null," A Last-In-First-Out (LIFO) data structure that supports push and pop operations for efficient backtracking.")],-1)),t("button",{class:m(["btn w-100",s.isTopicCompleted("stacks")?"btn-success":s.isTopicCompleted("linked-list")?"btn-primary":"btn-secondary"]),onClick:e[2]||(e[2]=f=>s.onClickStacks("/readings-data-structure/stacks"))},[s.isUserAuthenticated()?s.isTopicCompleted("stacks")?(o(),n("i",ds)):s.isTopicCompleted("linked-list")?(o(),n("i",cs)):(o(),n("i",us)):(o(),n("i",rs)),e[13]||(e[13]=t("span",null,"Read",-1))],2)])])]),t("div",ps,[s.isUserAuthenticated()?(o(),h(p,{key:0,percentage:s.queuesProgressPercentage,height:40},null,8,["percentage"])):g("",!0),t("div",hs,[e[20]||(e[20]=t("img",{src:M,alt:"Queues",class:"card-img-top"},null,-1)),t("div",gs,[e[18]||(e[18]=t("h5",null,"Queues",-1)),e[19]||(e[19]=t("p",null,[t("small",null," A First-In-First-Out (FIFO) data structure ideal for managing processes in sequential order.")],-1)),t("button",{class:m(["btn w-100",s.isTopicCompleted("queues")?"btn-success":s.isTopicCompleted("stacks")?"btn-primary":"btn-secondary"]),onClick:e[3]||(e[3]=f=>s.onClickQueues("/readings-data-structure/queues"))},[s.isUserAuthenticated()?s.isTopicCompleted("queues")?(o(),n("i",fs)):s.isTopicCompleted("stacks")?(o(),n("i",ks)):(o(),n("i",ys)):(o(),n("i",ms)),e[17]||(e[17]=t("span",null,"Read",-1))],2)])])]),t("div",bs,[s.isUserAuthenticated()?(o(),h(p,{key:0,percentage:s.graphsProgressPercentage,height:40},null,8,["percentage"])):g("",!0),t("div",_s,[e[24]||(e[24]=t("img",{src:H,alt:"Graphs",class:"card-img-top"},null,-1)),t("div",Cs,[e[22]||(e[22]=t("h5",null,"Graphs",-1)),e[23]||(e[23]=t("p",null,[t("small",null," A versatile data structure consisting of nodes (vertices) connected by edges, commonly used to model networks.")],-1)),t("button",{class:m(["btn w-100",s.isTopicCompleted("graphs")?"btn-success":s.isTopicCompleted("queues")?"btn-primary":"btn-secondary"]),onClick:e[4]||(e[4]=f=>s.onClickGraphs("/readings-data-structure/graphs"))},[s.isUserAuthenticated()?s.isTopicCompleted("graphs")?(o(),n("i",ws)):s.isTopicCompleted("queues")?(o(),n("i",Ps)):(o(),n("i",vs)):(o(),n("i",As)),e[21]||(e[21]=t("span",null,"Read",-1))],2)])])])])])]),b(C)])}const Is=v(B,[["render",Ls],["__scopeId","data-v-6e60af55"]]);export{Is as default};
