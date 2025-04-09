import{S as $,a as N}from"./SectionFooter-DD-S-wB-.js";import{S as v}from"./config-Cif4XynF.js";import{q as x}from"./insertGetID-Brze0Scj.js";import{d as D,p as C,q as y,t as V,S as z,_ as b,c as l,a as s,k as q,j as g,l as j,o as c,e as h,f as S}from"./index-BI8-wN6e.js";import{q as k}from"./count-CTZhag45.js";import{j as M}from"./jlconfig-C6IE3CR_.js";import{t as A}from"./timer-OaxQmgbO.js";import"./format-CV38ky4f.js";const B=D({props:{group_code:{default:"",type:String}},data(){return{user:{},timeDisplay:{}}},methods:{startTimer(){var e=90;if(this.group_code){var t=M.visualization_time,n=this.group_code;e=t[n]}y("Time Duration:",e),A(async i=>{var a;y("Reading Time:",V(i)),this.timeDisplay=i,(i==null?void 0:i.seconds)==0&&await x({connection:v().CONN_NPM_LMS,table:"visual_views",columns:{user_refid:(a=this.user)==null?void 0:a.user_refid,group_code:this.group_code}}).then(async()=>{z.fire({title:"Completed",text:"You have completed the allocated time",icon:"success"})})},e)},async isViewsExist(){var e;await k({connection:v().CONN_NPM_LMS,table:"visual_views",where:[["user_refid",(e=this.user)==null?void 0:e.user_refid],["group_code",this.group_code]]}).then(async t=>{t>0?this.$toast.success("You've completed this visual"):this.startTimer()})}},async mounted(){const e=await C();e!=null&&e.user_refid&&(this.user=e),await this.isViewsExist().then(async()=>{})}}),E={class:"d-flex justify-content-center"},F={class:"d-flex align-items-center mt-4",style:{width:"250px"}},H={class:"w-100"},I={class:"p-0 m-0",style:{"line-height":"1"}},L={key:0,class:"progress rounded-0 mt-2",style:{height:"6px"}};function P(e,t,n,i,a,w){var o,r,d,m,p,u,f,_;return c(),l("div",E,[s("div",F,[t[2]||(t[2]=s("div",null,[s("i",{class:"bi bi-alarm fs-2 me-2"})],-1)),s("div",H,[s("p",I,[s("small",null,"Time: "+g((o=e.timeDisplay)!=null&&o.formatted?(r=e.timeDisplay)==null?void 0:r.formatted:"00:00:00")+" | Used: "+g((d=e.timeDisplay)!=null&&d.percentage?((p=(m=e.timeDisplay)==null?void 0:m.percentage)==null?void 0:p.used)+"%":"0%"),1),t[0]||(t[0]=s("br",null,null,-1)),t[1]||(t[1]=s("small",null,"Allocated time",-1))]),(u=e.timeDisplay)!=null&&u.percentage?(c(),l("div",L,[s("div",{class:"progress-bar progress-bar-striped",role:"progressbar",style:j({width:((_=(f=e.timeDisplay)==null?void 0:f.percentage)==null?void 0:_.used)+"%"}),"aria-valuenow":10,"aria-valuemin":0,"aria-valuemax":"100"},null,4)])):q("",!0)])])])}const G=b(B,[["render",P]]),O=D({name:"VisualizationArrayPage",components:{SectionVisualizationTimer:G,SectionFooter:N,SectionHeader:$}});function R(e,t,n,i,a,w){const o=S("SectionHeader"),r=S("SectionFooter");return c(),l("div",null,[h(o),t[0]||(t[0]=s("main",{class:"main"},[s("div",{class:"container-fluid p-0"},[s("div",{class:"row mb-3"},[s("div",{class:"col-12"},[s("h1",{class:"text-center"},"Sorting Algorithm Visualization")])]),s("div",{class:"iframe-container"},[s("iframe",{class:"visualization-frame border-0",src:"https://sort-visualizations.netlify.app",scrolling:"no",allowfullscreen:""})])])],-1)),h(r)])}const Z=b(O,[["render",R],["__scopeId","data-v-c7166b5d"]]);export{Z as default};
