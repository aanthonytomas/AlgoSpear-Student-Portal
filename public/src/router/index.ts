import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/uikit-api';
import Swal from 'sweetalert2';
import store from '@/store/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/index.vue'),
      meta: {
        title: "Home",
        requiresAuth: false
      },
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('@/pages/courses/index.vue'),
      meta: {
        title: "Courses",
        requiresAuth: false
      },
    },
    {
      path: '/excercises',
      name: 'excercises',
      component: () => import('@/pages/excercises/index.vue'),
      meta: {
        title: "Exercises",
        requiresAuth: false
      },
    },
    {
      path: '/quizzes',
      name: 'quizzes',
      component: () => import('@/pages/quizzes/index.vue'),
      meta: {
        title: "Quizzes",
        requiresAuth: false
      },
    },
    {
      path: '/visualization',
      name: 'visualization',
      component: () => import('@/pages/visualization/index.vue'),
      meta: {
        title: "Visualization",
        requiresAuth: false
      },
    },
    {
      path: '/readings',
      name: 'readings',
      component: () => import('@/pages/readings/index.vue'),
      meta: {
        title: "Reading Materials",
        requiresAuth: false
      },
    },
    {
      path: '/readings-algorithms',
      name: 'readings_algorithms',
      component: () => import('@/pages/readings-algorithms/index.vue'),
      meta: {
        title: "Reading Algorithms",
        requiresAuth: true
      },
    },
    {
      path: '/readings-algorithms-list',
      name: 'readings_algorithms-list',
      component: () => import('@/pages/readings-algorithms-list/index.vue'),
      meta: {
        title: "Reading Algorithms List",
        requiresAuth: true
      },
    },
    {
      path: '/readings-data-structure',
      name: 'readings-data-structure',
      component: () => import('@/pages/readings-data-structure/index.vue'),
      meta: {
        title: "Data Structure",
        requiresAuth: true
      },
    },
    {
      path: '/readings-data-structure/:topic',
      name: 'readings-data-structure-topic',
      component: () => import('@/pages/readings-data-structure-topic/index.vue'),
      meta: {
        title: "Data Structure Topic",
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/readings-data-structure-list',
      name: 'readings-data-structure-list',
      component: () => import('@/pages/readings-data-structure-list/index.vue'),
      meta: {
        title: "Data Structure List",
        requiresAuth: true
      },
    },
    {
      path: '/readings-fundamental-of-programming',
      name: 'readings_fundamental_of_programming',
      component: () => import('@/pages/readings-fundamental-of-programming/index.vue'),
      meta: {
        title: "Fundamental of Programming",
        requiresAuth: true
      },
    },
    {
      path: '/videos',
      name: 'videos',
      component: () => import('@/pages/videos/index.vue'),
      meta: {
        title: "Video Tutorials",
        requiresAuth: false
      },
    },
    {
      path: '/datastructures',
      name: 'datastructures',
      component: () => import('@/pages/datastructures/index.vue'),
      meta: {
        title: "Data Structures",
        requiresAuth: false
      },
    },
    {
      path: '/algorithms',
      name: 'algorithms',
      component: () => import('@/pages/algorithms/index.vue'),
      meta: {
        title: "Algorithms",
        requiresAuth: false
      },
    },
    {
      path: '/readings-algorithms/:topic',
      name: 'readings-algorithms-topic',
      component: () => import('@/pages/readings-algorithms-topic/index.vue'),
      meta: {
        title: "Algorithms Topic",
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/index.vue'),
      meta: {
        title: "Sign In",
        requiresAuth: false
      },
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('@/pages/sign-up/index.vue'),
      meta: {
        title: "Sign Up",
        requiresAuth: false
      },
    },
    {
      path: '/datastructures-array',
      name: 'datastructures_array',
      component: () => import('@/pages/datastructures-array/index.vue'),
      meta: {
        title: "Array Visualization",
        requiresAuth: true
      },
    },
    {
      path: '/datastructures-graphs',
      name: 'datastructures_graphs',
      component: () => import('@/pages/datastructures-graphs/index.vue'),
      meta: {
        title: "Graphs Visualization",
        requiresAuth: true
      },
    },
    {
      path: '/datastructures-linked-list',
      name: 'datastructures_linked_list',
      component: () => import('@/pages/datastructures-linked-list/index.vue'),
      meta: {
        title: "Linked List Visualization",
        requiresAuth: true
      },
    },
    {
      path: '/datastructures-queues',
      name: 'datastructures_queues',
      component: () => import('@/pages/datastructures-queues/index.vue'),
      meta: {
        title: "Queues Visualization",
        requiresAuth: true
      },
    },
    {
      path: '/datastructures-stacks',
      name: 'datastructures_stacks',
      component: () => import('@/pages/datastructures-stacks/index.vue'),
      meta: {
        title: "Stacks Visualization",
        requiresAuth: true
      },
    },
    {
      path: '/algorithms-searching',
      name: 'algorithms_searching',
      component: () => import('@/pages/algorithms-searching/index.vue'),
      meta: {
        title: "Searching Visualization",
        requiresAuth: true
      },
    },
    {
      path: '/algorithms-sorting',
      name: 'algorithms_sorting',
      component: () => import('@/pages/algorithms-sorting/index.vue'),
      meta: {
        title: "Sorting Visualization",
        requiresAuth: true
      },
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // If the user used browser back/forward buttons and has a saved position, use that
    if (savedPosition) {
      return savedPosition;
    }
    // Otherwise, scroll to top
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = isAuthenticated(); // Example of checking if user is logged in via localStorage
  const isQuizOngoing = from.query.isQuizOngoing === 'true';
  const isExerciseOngoing = from.query.isExerciseOngoing === 'true';
  const isTimesUp = from.query.isTimesUp === 'true'; // Add this line to check if time is up

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: 'login' }); // Redirect to login if the user is not authenticated
    } else {
      // If navigating away from quizzes/exercises and timer is not up
      if ((from.path === "/quizzes" && to.path !== "/quizzes" && isQuizOngoing && !isTimesUp) ||
          (from.path === "/excercises" && to.path !== "/excercises" && isExerciseOngoing && !isTimesUp)) {
        Swal.fire({
          title: "Are you sure?",
          text: "You will lose all your progress, are you sure you want to leave?",
          icon: "warning",
           
          showCancelButton: true,
          confirmButtonText: "Yes, cancel it",
          cancelButtonText: "No, continue"
        }).then(async (result) => {
          if (result.isConfirmed) {
            store?.state.intervalIds.forEach((intervalId: number) => {
              clearInterval(intervalId);
            });
            next();
          } else {
            // User canceled navigation, stay on current page
            next(false);
          }
        });
      } else {
        next(); // Continue to the requested route
      }
    }
  } else {
    // For routes without auth requirement
    if ((from.path === "/quizzes" && to.path !== "/quizzes" && isQuizOngoing && !isTimesUp) ||
        (from.path === "/excercises" && to.path !== "/excercises" && isExerciseOngoing && !isTimesUp)) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will lose all your progress, are you sure you want to leave?",
        icon: "warning",
         
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it",
        cancelButtonText: "No, continue"
      }).then(async (result) => {
        if (result.isConfirmed) {
          store?.state.intervalIds.forEach((intervalId: number) => {
            clearInterval(intervalId);
          });
          next();
        } else {
          // User canceled navigation, stay on current page
          next(false);
        }
      });
    } else {
      next(); // Continue to the requested route
    }
  }
});

router.afterEach((to, from) => {
  console.log('Route has changed from', from.path, 'to', to.path);
  // Perform some post-navigation logic (e.g., analytics, cleanup, etc.)
});

export default router