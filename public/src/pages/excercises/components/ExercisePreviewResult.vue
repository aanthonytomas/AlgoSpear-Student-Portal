<template>
    <div class="container mb-4 custom-mt">
      <h1 class="text-center">Exercise Results</h1>
      <div class="row">
        <div class="col-sm-0 col-lg-3"></div>
        <div class="col-sm-12 col-lg-12">
          <div class="card mb-4 mt-2 sticky-card" :class="{ 'is-sticky': isSticky }">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>Exercise Summary</span>
              <span class="badge bg-primary">Score: {{ score }} / {{ questions.length }}</span>
            </div>
            <div class="card-body">
              <div class="progress mb-3" style="height: 20px;">
                <div class="progress-bar bg-success" role="progressbar"
                     v-bind:style="{ width: (score / questions.length * 100) + '%' }"
                     :aria-valuenow="score / questions.length * 100" :aria-valuemin="0" aria-valuemax="100">
                  {{ Math.round(score / questions.length * 100) }}%
                </div>
              </div>
              <div v-if="passed" class="alert alert-success mb-3">
                <i class="bi bi-check-circle-fill me-2"></i> Congratulations! You passed the exercise.
              </div>
              <div v-else class="alert alert-danger mb-3">
                <i class="bi bi-x-circle-fill me-2"></i> You did not pass the exercise.
              </div>
  
              <div class="d-flex align-items-center mb-3">
                <div><i class="bi bi-alarm fs-3 text-primary me-2"></i></div>
                <div>Remaining Time: {{ timeUsed }}</div>
              </div>
  
              <div class="">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <strong>Questions Overview</strong>
                    <p>Select list to view</p>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table table-hover table-striped mb-0">
                      <thead>
                        <tr>
                          <th style="width: 10%;">#</th>
                          <th style="width: 55%;">Question</th>
                          <th style="width: 35%;">Your Answer</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(question, i) in questions" :key="i" @click="showQuestionDetails(i)" role="button" class="question-row">
                          <td>{{ i + 1 }}</td>
                          <td>{{ question.question }}</td>
                          <td :class="question.is_corrrect === 1 ? 'text-success fw-bold' : 'text-danger fw-bold'">
                            {{ formatAnswerWithoutPrefix(question) }}
                            <i v-if="question.is_corrrect === 1" class="bi bi-check-circle-fill text-success ms-1"></i>
                            <i v-else class="bi bi-x-circle-fill text-danger ms-1"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-secondary" @click="onBack">Back to Categories</button>
              <button class="btn btn-primary" @click="onRetry">Try Again</button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="showQuestionModal" class="question-modal-overlay" @click="closeQuestionModal">
        <div class="question-modal-content" @click.stop>
          <div class="question-modal-header">
            <h5>Question {{ selectedQuestionIndex + 1 }}</h5>
            <button type="button" class="btn-close" @click="closeQuestionModal"></button>
          </div>
          <div class="question-modal-body">
            <p class="mb-3">{{ selectedQuestion.question }}</p>
  
            <div v-if="!!selectedQuestion.is_choices">
              <div v-for="(choice, letter, index) in choices" :key="letter"
                   class="choice-option p-3 mb-2 rounded"
                   :class="getChoiceClass(letter)">
                {{ choice }}
              </div>
            </div>
            <div v-else>
              <div class="input-group mb-3">
                <span class="input-group-text">Your Answer</span>
                <input type="text" class="form-control"
                       :class="{
                         'bg-success-dark text-white': selectedQuestion.is_corrrect === 1,
                         'bg-danger text-white': selectedQuestion.is_corrrect === 0
                       }"
                       :value="selectedQuestion.answer_input" disabled>
              </div>
              <div v-if="selectedQuestion.is_corrrect === 0" class="input-group mb-3">
                <span class="input-group-text">Correct Answer</span>
                <input type="text" class="form-control bg-success-light" :value="selectedQuestion.answer" disabled>
              </div>
            </div>
          </div>
          <div class="question-modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeQuestionModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import Swal from 'sweetalert2';
  
  export default defineComponent({
    name: "ExercisePreviewResult",
    emits: ['back', 'retry'],
    props: {
      category: {
        type: Object,
        required: true
      },
      questions: {
        type: Array,
        required: true
      },
      score: {
        type: Number,
        required: true
      },
      passed: {
        type: Number,
        required: true
      },
      timeUsed: {
        type: String,
        required: true,
        default: '00:00'
      }
    },
    data() {
      return {
        selectedQuestionIndex: 0,
        selectedQuestion: null as any,
        showQuestionModal: false,
        choices: {} as Record<string, string>,
        isSticky: false
      }
    },
    mounted() {
      // Add scroll event listener to handle sticky behavior
      window.addEventListener('scroll', this.handleScroll);
      // Initialize sticky state
      this.handleScroll();
    },
    beforeUnmount() {
      // Remove event listener when component is unmounted
      window.removeEventListener('scroll', this.handleScroll);
      
      // Make sure to re-enable scrolling if component is unmounted with modal open
      document.body.style.overflow = '';
    },
    methods: {
      handleScroll() {
        // Get the distance from the top of the page
        const scrollPosition = window.scrollY;
        // Set isSticky to true if we've scrolled past a certain point
        this.isSticky = scrollPosition > 100;
      },
      onBack() {
        this.$emit('back');
      },
      onRetry() {
        Swal.fire({
          title: "Try Again?",
          text: "You will restart the exercise with new questions. Are you sure?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, restart",
          cancelButtonText: "No, stay here"
        }).then((result) => {
          if(result.isConfirmed) {
            this.$emit('retry');
          }
        });
      },
      showQuestionDetails(index: number) {
        this.selectedQuestionIndex = index;
        this.selectedQuestion = this.questions[index];
  
        // Prepare choices for the selected question
        if (this.selectedQuestion && this.selectedQuestion.is_choices) {
          this.choices = {
            'a': this.selectedQuestion.choice_a,
            'b': this.selectedQuestion.choice_b,
            'c': this.selectedQuestion.choice_c,
            'd': this.selectedQuestion.choice_d
          };
        }
  
        // Show our custom modal
        this.showQuestionModal = true;
  
        // Prevent scrolling on the body when modal is open
        document.body.style.overflow = 'hidden';
      },
      closeQuestionModal() {
        this.showQuestionModal = false;
  
        // Re-enable scrolling on the body
        document.body.style.overflow = '';
      },
      getChoiceClass(letter: string) {
        if (!this.selectedQuestion) return {};
  
        return {
          'bg-success-dark': this.selectedQuestion.is_corrrect === 1 &&
                             this.selectedQuestion.answer_input === letter,
          'bg-danger': this.selectedQuestion.is_corrrect === 0 &&
                       this.selectedQuestion.answer_input === letter,
          'bg-success-light': this.selectedQuestion.is_corrrect === 0 &&
                              this.selectedQuestion.answer.toLowerCase() === letter
        };
      },
      truncateQuestion(text: string, maxLength: number): string {
        if (text && text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text || '';
      },
      formatAnswerWithoutPrefix(question: any): string {
        if (question.is_choices) {
          const choices: Record<string, string> = {
            'a': question.choice_a,
            'b': question.choice_b,
            'c': question.choice_c,
            'd': question.choice_d
          };
  
          // Return only the answer text without any prefix
          const answerText = choices[question.answer_input] || '';
  
          if (answerText) {
            return this.truncateQuestion(answerText, 40);
          }
  
          return 'Not answered';
        } else {
          // For text input questions, just return the answer text
          return question.answer_input || 'Not answered';
        }
      }
    }
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  
  .custom-mt {
    margin-top: -50px !important; /* Adjust the value as needed */
  }
  
  .bg-success-dark {
    background-color: #198754 !important;
    color: white;
  }
  
  .bg-success-light {
    background-color: #01f36638 !important;
    color: #0f5132;
  }
  
  .bg-danger {
    background-color: #dc3545 !important;
    color: white;
  }
  
  .question-row {
    cursor: pointer;
  }
  
  .question-row:hover {
    background-color: #f8f9fa;
  }
  
  /* Sticky card styles */
  .sticky-card {
    position: sticky;
    top: 20px;
    z-index: 100;
    transition: all 0.3s ease;
  }
  
  .sticky-card.is-sticky {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  /* Add some padding to ensure we can scroll down enough to see the sticky effect */
  .container::after {
    content: "";
    display: block;
    height: 100vh; /* This creates space below the card */
    width: 100%;
  }
  
  /* Custom modal styles */
  .question-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(5px); /* Apply the blur effect */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    margin-top: -900px;
  }
  
  .question-modal-content {

    background-color: white;
    border-radius: 4px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .question-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
  }
  
  .question-modal-body {
    padding: 1rem;
  }
  
  .question-modal-footer {
    padding: 1rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
  }
  
  .choice-option {
    transition: background-color 0.2s;
  }

  .table {
  border-collapse: separate;
  border-spacing: 0 8px; /* Adds space between rows for modern appearance */
  width: 100%;
  background: transparent;
}

.table thead th {
  background: linear-gradient(135deg, #1e1283, #5127b8);
  color: white;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  border: none;
}

.table tbody tr {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative; /* Needed for pseudo-elements */
  z-index: 0; /* Layer management for effects */
}

/* Apply hover effects to table rows instead */
tbody tr {
  transition: all 0.3s ease-in-out;
  border-left: 3px solid transparent;
}

tbody tr:hover {
  transform: translateY(-3px);
  border-left: 3px solid #3085d6;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  background-color: rgba(240, 245, 255, 0.5);
}
  </style>