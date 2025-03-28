<template>
  <div class="auth-wrapper">
    <SectionHeader />
    <main class="main py-5">
      <div class="auth-container mt-5">
        <div class="card mt-5 border-0">
          <div class="card-body p-5">
            <div class="auth-form">
              <div class="text-center mb-4">
                <h1 class="display-6 fw-bold">AlgoSpear</h1>
                <p class="text-muted">Create your account</p>
              </div>
              
              <form @submit.prevent="register">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <label class="form-label">First Name</label>
                    <input 
                      v-model="form.firstname" 
                      class="form-control form-control-lg" 
                      type="text" 
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-4">
                    <label class="form-label">Last Name</label>
                    <input 
                      v-model="form.lastname" 
                      class="form-control form-control-lg" 
                      type="text" 
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
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
                      placeholder="Choose a username (min. 5 characters)"
                      required
                    />
                  </div>
                  <small class="text-muted">Username must be at least 5 characters</small>
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
                      type="password" 
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <small class="text-muted">Password must be at least 8 characters</small>
                </div>
                
                <div class="mb-4">
                  <label class="form-label">Confirm Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-lock-fill"></i>
                    </span>
                    <input 
                      v-model="form.confirm_password" 
                      class="form-control form-control-lg border-start-0" 
                      type="password" 
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
                
                <div class="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg" 
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ loading ? 'Creating account...' : 'Create Account' }}
                  </button>
                </div>
              </form>
              
              <div class="text-center mt-4">
                <p class="text-muted mb-0">Already have an account?</p>
                <router-link to="/login" class="btn btn-outline-primary mt-2">Sign in</router-link>
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
import { createStudent, isAuthenticated } from '@/uikit-api';
import SectionHeader from "@/components/SectionHeader.vue";
import SectionFooter from "@/components/SectionFooter.vue";

export default defineComponent({
  name: "SignUpPage",
  components: { SectionFooter, SectionHeader },
  data() {
    return {
      loading: false,
      form: {
        email: '',         // This will be used as username now
        password: '',
        confirm_password: '',
        firstname: '',
        lastname: '',
        created_by: ''
      }
    }
  },
  methods: {
    resetData() {
      this.form.email = '';
      this.form.firstname = '';
      this.form.lastname = '';
      this.form.created_by = '';
      this.form.password = '';
      this.form.confirm_password = '';
    },
    async register() {
      // Basic form validation
      if (this.form.password !== this.form.confirm_password) {
        this.$toast.warning('Passwords do not match');
        return;
      }
      
      // Username validation
      if (this.form.email.length < 5) {
        this.$toast.warning('Username must be at least 5 characters');
        return;
      }
      
      this.loading = true;
      try {
        const response = await createStudent(this.form);
        if (response.success) {
          this.resetData();
          this.$toast.success(response?.message || 'Account created successfully');
          // Redirect to login page after successful registration
          setTimeout(() => {
            this.$router.push('/login');
          }, 1500);
        } else {
          this.$toast.warning(response?.message || 'Registration failed');
        }
      } catch (error) {
        this.$toast.error('An error occurred while creating your account');
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


.auth-form {
  width: 100%;
}

/* Ensures the label aligns to the left with Flexbox */
.form-label {
  display: flex; /* Applies Flexbox */
  justify-content: flex-start; /* Aligns the label to the left */
  align-items: center; /* Centers the label vertically relative to input */
  margin-bottom: 0.5rem; /* Adds spacing below the label */
  font-weight: 500; /* Optional: Makes the label slightly bold for readability */
  text-align: left; /* Explicitly ensures left-alignment */
}

.form-control,
.input-group {
  display: flex; /* Ensures inputs and groups align properly */
  justify-content: flex-start; /* Aligns contents to the left */
  align-items: center;
}


.btn-primary {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.input-group-text {
  color: #6c757d;
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
  background-color: #f8f9fa; /* Page background */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers content vertically */
  align-items: center; /* Centers content horizontally */
  width: 100%; /* Full width for responsiveness */
  max-width: 90%; /* Ensures the container doesn't exceed the screen width */
  padding: 0;
  margin: 0 auto; /* Horizontal centering */
  box-sizing: border-box;
}

.card {
  background: transparent; /* Transparent background */
  width: 100%; /* Takes full width of its container */
  max-width: 600px; /* Sets an upper limit for the card width */
  border: none; /* Removes any border styling */
  padding: 20px; /* Internal content spacing */
  margin: 0 auto; /* Horizontal centering */
  box-shadow: none; /* No shadow */
  text-align: center; /* Aligns card content */
}


/* Hover Effect for the Card */
.card:hover {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.0); /* Stronger shadow on hover */
  border-color: #3085d6; /* Optional: Highlight border on hover */
}

/* Card Header Styling */
.card-header {
  font-size: 18px; /* Distinct font size for the header */
  font-weight: bold;
  color: var(--heading-color); /* Use a consistent heading color */
  border-bottom: 1px solid rgba(0, 0, 0, 0.0); /* Subtle separator */
  padding-bottom: 10px;
  margin-bottom: 15px;
}

/* Card Body Styling */
.card-body {
  font-size: 16px; /* Comfortable reading size */
  color: var(--default-color); /* Use your global text color */
  line-height: 1.5; /* Improves readability for longer text */
  display: flex;
  flex-direction: column;
  gap: 10px; /* Adds consistent spacing between elements */
}

/* Card Footer Styling */
.card-footer {
  font-size: 14px;
  text-align: right; /* Align footer content (e.g., buttons) to the right */
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1); /* Subtle top border */
  color: var(--secondary-color); /* Muted color for footer text */
}

</style>