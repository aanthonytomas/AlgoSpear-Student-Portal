import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import "@/assets/css/main.css";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import 'aos/dist/aos.css';

import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
//import store from "./store/store";
// import {createStore} from 'vuex/types/index.js'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import store from "./store/store";
import { createHead } from '@unhead/vue';
const head = createHead


// const store = createStore({
//     state: {
//       count: 0, // An example state property
//       intervalIds: [] as Array<number>
//     },
//     mutations: {
//       increment(state) {
//         state.count++;
//       },
//       decrement(state) {
//         state.count--;
//       },
//       setCount(state, payload) {
//         state.count = payload;
//       },
//       addIntervalId(state, intervalId: number){
//         state.intervalIds.push(intervalId)
//       }
//     },
//     actions: {
//       incrementAsync({ commit }) {
//         setTimeout(() => {
//           commit('increment');
//         }, 1000);
//       },
//       addIntervalIds({ commit }){
  
//       }
//     },
//     getters: {
//       getCount(state) {
//         return state.count;
//       },
//       getIntervalIds(state){
//         return state.intervalIds
//       }
//     },
//   });
  

const app = createApp(App)

app.use(router);
app.use(head);
app.use(store)
app.use(ToastPlugin,{
    position: 'bottom'
});

app.mount('#app')
