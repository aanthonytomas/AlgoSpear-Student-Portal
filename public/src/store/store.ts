import { createStore } from "vuex";

const store = createStore({
    state: {
      count: 0, // An example state property
      intervalIds: [] as Array<number>
    },
    mutations: {
      increment(state) {
        state.count++;
      },
      decrement(state) {
        state.count--;
      },
      setCount(state, payload) {
        state.count = payload;
      },
      addIntervalId(state, intervalId: number){
        state.intervalIds.push(intervalId)
      }
    },
    actions: {
      incrementAsync({ commit }) {
        setTimeout(() => {
          commit('increment');
        }, 1000);
      },
      addIntervalIds({ commit }){
  
      }
    },
    getters: {
      getCount(state) {
        return state.count;
      },
      getIntervalIds(state){
        return state.intervalIds
      }
    },
  });

export default store;
