<template>
  <header id="header" class="header d-flex align-items-center fixed-top" style="background-color: #161166;">
    <div class="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
      <a href="index.html" class="logo d-flex align-items-center">
        <router-link to="/">
          <h1 class="sitename algospear-gradient">AlgoSpear</h1>
        </router-link>
      </a>
      <nav id="navmenu" class="navmenu">
        <ul>
          <li><router-link :class="{ 'active-link': $route.name == 'home' }" to="/">Home</router-link></li>
          <li class="dropdown">
            <a href="#" :class="{ 
              'active-link': 
                $route.name == 'readings' || 
                $route.name == 'videos' || 
                $route.path.startsWith('/readings-fundamental-of-programming') ||
                $route.path.startsWith('/readings-data-structure') ||
                $route.path.startsWith('/readings-algorithms')
            }">
              <span>Courses</span> 
              <i class="bi bi-chevron-down toggle-dropdown"></i>
            </a>
            <ul>
              <li><router-link to="/readings">Reading Materials</router-link></li>
              <li><router-link to="/videos">Video Tutorials</router-link></li>
            </ul>
          </li>
          <li class="dropdown">
            <a href="#" :class="{ 
              'active-link': 
                $route.name == 'excercises' || 
                $route.name == 'quizzes' ||
                $route.path === '/excercises?isExerciseOngoing=true' ||
                $route.path === '/quizzes?isQuizOngoing=true'
            }">
              <span>Assessment</span> 
              <i class="bi bi-chevron-down toggle-dropdown"></i>
            </a>
            <ul>
              <li><router-link to="/excercises">Exercises</router-link></li>
              <li><router-link to="/quizzes">Quizzes</router-link></li>
            </ul>
          </li>
          <li class="dropdown">
            <a href="#" :class="{ 
              'active-link': 
                $route.name == 'datastructures' || 
                $route.name == 'algorithms' ||
                $route.path.startsWith('/datastructures-') ||
                $route.path.startsWith('/algorithms-')
            }">
              <span>Visualization</span> 
              <i class="bi bi-chevron-down toggle-dropdown"></i>
            </a>
            <ul>
              <li><router-link to="/datastructures">Data Structure</router-link></li>
              <li><router-link to="/algorithms">Algorithms</router-link></li>
            </ul>
          </li>
          <li v-if="!isUserAuthenticated">
            <router-link :class="{ 'active-link': $route.name == 'login' }" to="/login">Login</router-link>
          </li>
          <li v-else>
            <button class="btn btn-primary rounded-5" @click="logout()">
              <i class="bi bi-power"></i>Logout
            </button>
          </li>
        </ul>
        <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isAuthenticated } from '@/uikit-api';
import Swal from 'sweetalert2';

export default defineComponent({
  name: "SectionHeader",
  data(){
    return {
      isUserAuthenticated: false
    }
  },
  methods: {
    checkUserAuthenticated(){
      this.isUserAuthenticated = isAuthenticated()
    },
    logout() {
      Swal.fire({
        title: "Sign Out",
        text: "Confirm your sign out action",
        imageUrl: "/src/assets/img/new-signout.png",
         
        showCancelButton: true,
        confirmButtonText: "Logout",
      }).then( async (result) => {
        if(result.isConfirmed) {
          localStorage.clear();
          this.checkUserAuthenticated()
          this.$router.replace('/');
        }
      });
    }
  },
  mounted (){
    this.checkUserAuthenticated()
  }
});
</script>

<style scoped>
/* Gradient text for AlgoSpear */
.algospear-gradient {
  background: linear-gradient(to right, white 0%, cyan 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* Bling animation for active links */
.active-link {
  position: relative;
  color: cyan !important;
  transition: all 0.3s ease;
  animation: bling 1.5s infinite alternate;
}

@keyframes bling {
  0% {
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
    transform: scale(1.05);
  }
  100% {
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.9);
    transform: scale(1.1);
  }
}
</style>