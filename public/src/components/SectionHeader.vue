<template>
  <header id="header" class="header d-flex align-items-center fixed-top" style="background-color: #161166;">
    <div class="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <!-- Close button - shows only on specific pages -->
        <button 
          v-if="shouldShowCloseButton" 
          class="close-btn me-3"
          @click="goBack"
        >
          <i class="bi bi-x-lg"></i>
        </button>
        
        <!-- Logo moved to left and always next to close button when present -->
        <router-link to="/" class="logo d-flex align-items-center">
          <h1 class="sitename algospear-gradient mb-0">AlgoSpear</h1>
        </router-link>
      </div>
      
      <!-- Mobile nav toggle button -->
      <div class="mobile-nav-toggle d-xl-none" @click="toggleMobileNav">
        <i class="bi" :class="isMobileNavOpen ? 'bi-x' : 'bi-list'"></i>
      </div>
      
      <nav id="navmenu" class="navmenu" :class="{ 'mobile-nav-active': isMobileNavOpen }">
        <ul>
          <li><router-link :class="{ 'active-link': $route.name == 'home' }" to="/" @click="closeMobileNav">Home</router-link></li>
          <li class="dropdown" :class="{ 'dropdown-active': isDropdownActive.courses }">
            <a href="#" 
              @click.prevent="toggleDropdown('courses')"
              :class="{ 
                'active-link': 
                  $route.name == 'readings' || 
                  $route.name == 'videos' || 
                  $route.path.startsWith('/readings-fundamental-of-programming') ||
                  $route.path.startsWith('/readings-data-structure') ||
                  $route.path.startsWith('/readings-algorithms')
              }">
              <span>Courses</span> 
              <i class="bi" :class="isDropdownActive.courses ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </a>
            <ul :class="{ 'dropdown-active': isDropdownActive.courses }">
              <li><router-link to="/readings" @click="closeMobileNav">Reading Materials</router-link></li>
              <li><router-link to="/videos" @click="closeMobileNav">Video Tutorials</router-link></li>
            </ul>
          </li>
          <li class="dropdown" :class="{ 'dropdown-active': isDropdownActive.assessment }">
            <a href="#" 
              @click.prevent="toggleDropdown('assessment')"
              :class="{ 
                'active-link': 
                  $route.name == 'excercises' || 
                  $route.name == 'quizzes' ||
                  $route.path === '/excercises?isExerciseOngoing=true' ||
                  $route.path === '/quizzes?isQuizOngoing=true'
              }">
              <span>Assessment</span> 
              <i class="bi" :class="isDropdownActive.assessment ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </a>
            <ul :class="{ 'dropdown-active': isDropdownActive.assessment }">
              <li><router-link to="/excercises" @click="closeMobileNav">Exercises</router-link></li>
              <li><router-link to="/quizzes" @click="closeMobileNav">Quizzes</router-link></li>
            </ul>
          </li>
          <li class="dropdown" :class="{ 'dropdown-active': isDropdownActive.visualization }">
            <a href="#" 
              @click.prevent="toggleDropdown('visualization')"
              :class="{ 
                'active-link': 
                  $route.name == 'datastructures' || 
                  $route.name == 'algorithms' ||
                  $route.path.startsWith('/datastructures-') ||
                  $route.path.startsWith('/algorithms-')
              }">
              <span>Visualization</span> 
              <i class="bi" :class="isDropdownActive.visualization ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </a>
            <ul :class="{ 'dropdown-active': isDropdownActive.visualization }">
              <li><router-link to="/datastructures" @click="closeMobileNav">Data Structure</router-link></li>
              <li><router-link to="/algorithms" @click="closeMobileNav">Algorithms</router-link></li>
            </ul>
          </li>
          <li v-if="!isUserAuthenticated">
            <router-link :class="{ 'active-link': $route.name == 'login' }" to="/login" @click="closeMobileNav">Login</router-link>
          </li>
          <li v-else>
            <button class="btn btn-primary rounded-5" @click="logout()">
              <i class="bi bi-power"></i>Logout
            </button>
          </li>
        </ul>
      </nav>
      
      <!-- Mobile nav backdrop -->
      <div v-if="isMobileNavOpen" class="mobile-nav-backdrop" @click="closeMobileNav"></div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isAuthenticated } from '@/uikit-api';
import Swal from 'sweetalert2';

// Define dropdown types
type DropdownKey = 'courses' | 'assessment' | 'visualization';

export default defineComponent({
  name: "SectionHeader",
  data() {
    return {
      isUserAuthenticated: false,
      isMobileNavOpen: false,
      isDropdownActive: {
        courses: false,
        assessment: false,
        visualization: false
      } as Record<DropdownKey, boolean>
    }
  },
  computed: {
    shouldShowCloseButton(): boolean {
      // Check if current path matches any of the specific paths from the photo
      return this.$route.path.startsWith('/readings-algorithms') ||
             this.$route.path.startsWith('/readings-algorithms-list') ||
             this.$route.path.startsWith('/readings-algorithms-topic') ||
             this.$route.path.startsWith('/readings-data-structure') ||
             this.$route.path.startsWith('/readings-data-structure-list') ||
             this.$route.path.startsWith('/readings-data-structure-topic') ||
             this.$route.path.startsWith('/datastructures-array') ||
             this.$route.path.startsWith('/datastructures-linked-list') ||             
             this.$route.path.startsWith('/datastructures-stack') ||
             this.$route.path.startsWith('/datastructures-queue') ||  
             this.$route.path.startsWith('/datastructures-graph') ||
             this.$route.path.startsWith('/algorithms-sorting') ||
             this.$route.path.startsWith('/algorithms-searching') || 
             
             this.$route.path.startsWith('/readings-fundamental-of-programming');
    }
  },
  methods: {
    checkUserAuthenticated() {
      this.isUserAuthenticated = isAuthenticated()
    },
    logout() {
      Swal.fire({
        title: "Sign Out",
        text: "Confirm your sign out action",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Logout",
      }).then(async (result) => {
        if(result.isConfirmed) {
          localStorage.clear();
          this.checkUserAuthenticated();
          this.closeMobileNav();
          this.$router.replace('/');
        }
      });
    },
    goBack() {
      // Simply go back in browser history
      this.$router.go(-1);
    },
    toggleMobileNav() {
      this.isMobileNavOpen = !this.isMobileNavOpen;
      
      // Prevent body scrolling when menu is open
      if (this.isMobileNavOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    closeMobileNav() {
      this.isMobileNavOpen = false;
      document.body.style.overflow = '';
      
      // Close all dropdowns when closing nav
      Object.keys(this.isDropdownActive).forEach((key) => {
        // Fix: Add type assertion to key
        this.isDropdownActive[key as DropdownKey] = false;
      });
    },
    toggleDropdown(name: DropdownKey) {
      // On mobile, close other dropdowns when opening one
      if (window.innerWidth < 1200) {
        Object.keys(this.isDropdownActive).forEach((key) => {
          // Fix: Add type assertion to key
          if (key !== name) this.isDropdownActive[key as DropdownKey] = false;
        });
      }
      
      this.isDropdownActive[name] = !this.isDropdownActive[name];
    }
  },
  mounted() {
    this.checkUserAuthenticated();
    
    // Close mobile nav when window is resized to desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1200 && this.isMobileNavOpen) {
        this.closeMobileNav();
      }
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (event) => {
      const header = document.getElementById('header');
      if (this.isMobileNavOpen && header && !header.contains(event.target as Node)) {
        this.closeMobileNav();
      }
    });
    
    // Close mobile nav when route changes
    this.$router.afterEach(() => {
      this.closeMobileNav();
    });
  },
  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('resize', () => {});
    document.removeEventListener('click', () => {});
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

/* Close button styles */
.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 50%;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: rgba(0, 255, 255, 0.4);
  transform: scale(1.1);
}

/* Mobile Navigation Styles */
.mobile-nav-toggle {
  display: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  line-height: 0;
  transition: 0.3s;
  position: relative;
  z-index: 9999;
}

@media (max-width: 1199px) {
  .mobile-nav-toggle {
    display: block;
  }

  .navmenu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 75%;
    max-width: 300px;
    height: 100vh;
    background-color: #161166;
    padding: 80px 20px 20px 20px;
    z-index: 999;
    transition: all 0.4s ease;
    overflow-y: auto;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  }

  .navmenu.mobile-nav-active {
    right: 0;
  }

  .navmenu ul {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #161166;

  }

  .navmenu ul li {
    position: relative;
    width: 100%;
  }

  .navmenu ul li a {
    display: block;
    padding: 10px 0;
    color: white;
    font-size: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .navmenu .dropdown ul {
    position: static;
    display: none;
    opacity: 1;
    visibility: visible;
    background: transparent;
    box-shadow: none;
    padding-left: 15px;
    transition: none;
    border-radius: 0;
  }

  .navmenu .dropdown ul.dropdown-active {
    display: block;
  }

  .navmenu .dropdown ul li {
    margin: 0;
  }

  .navmenu .dropdown ul li a {
    font-size: 16px;
    padding: 8px 0;
  }
  
  /* Dropdown arrow icon position */
  .navmenu .dropdown > a > i {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

/* Mobile nav backdrop */
.mobile-nav-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
</style>