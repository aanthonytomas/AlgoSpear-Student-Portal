<template>
  <div class="auth-wrapper">
    <SectionHeader />
    <main class="main mt-5">
      <div class="auth-container mt-5">
        <div class="card mt-5 border-0">
          <div class="card-body p-5">
            <div class="auth-form">
              <div class="text-center mb-5">
                <h1 class="display-6 fw-bold">AlgoSpear</h1>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <form @submit.prevent="login">
                <div class="mb-4">
                  <label class="form-label">Username</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-person"></i>
                    </span>
                    <input 
                      v-model="form.email" 
                      class="form-control form-control-lg border-start-0" 
                      type="text" 
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input 
                      v-model="form.password" 
                      class="form-control form-control-lg border-start-0" 
                      :type="showPassword ? 'text' : 'password'" 
                      placeholder="Enter your password"
                      required
                    />
                    <span class="input-group-text bg-light cursor-pointer" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                    </span>
                  </div>
                </div>

                <div class="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg" 
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ loading ? 'Signing in...' : 'Sign In' }}
                  </button>
                </div>
              </form>

              <div class="text-center mt-4">
                <p class="text-muted mb-0">Don't have an account?</p>
                <router-link to="/sign-up" class="btn btn-outline-primary mt-2">Create an account</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <SectionFooter />
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { userStudentSignIn, isAuthenticated } from '@/uikit-api';
import SectionHeader from "@/components/SectionHeader.vue";
import SectionFooter from "@/components/SectionFooter.vue";

export default defineComponent({
  name: "LoginPage",
  components: { SectionFooter, SectionHeader },
  data() {
    return {
      loading: false,
      showPassword: false, // State to toggle password visibility
      form: {
        email: '', // Still named email but used as username
        password: ''
      }
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Toggle the visibility state
    },
    async login() {
      this.loading = true;
      try {
        const response = await userStudentSignIn(this.form);
        if (response.success) {
          this.$router.replace('/');
        } else {
          this.$toast.warning(response?.message || 'Login failed');
        }
      } catch (error) {
        this.$toast.error('An error occurred while signing in');
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    if (isAuthenticated()) {
      this.$router.replace('/');
    }
  }
});
</script>


<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.auth-container {
  width: 100%;
  max-width: 550px;
  padding: 1rem;
}

.auth-form {
  width: 100%;
}

.form-label {
  display: flex;
  justify-content: flex-start; /* Aligns label content to the left */
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: left;
}

.form-control-lg {
  padding: 0.75rem 1rem;
}

.input-group-text {
  color: #6c757d;
  cursor: pointer; /* Adds pointer cursor for the eye icon */
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.card {
  min-width: 400px;
  background: transparent;
  border: none;
  padding: 20px;
  overflow: hidden;
  box-shadow: none;
}

</style>