<template>
  <div class="container mb-4 custom-mt">
    <h1 class="text-center">Quiz Results</h1>
    <div class="row">
      <div class="col-sm-0 col-lg-3"></div>
      <div class="col-sm-12 col-lg-12">
        <div class="card mb-4 mt-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Quiz Summary</span>
            <span class="badge bg-primary">Score: {{ score }} / {{ questions.length }}</span>
          </div>
          <div class="card-body">
            <div class="progress mb-3" style="height: 30px;">
              <div class="progress-bar bg-success" role="progressbar"
                   :style="{ width: (score / questions.length * 100) + '%' }"
                   :aria-valuenow="score / questions.length * 100" aria-valuemin="0" aria-valuemax="100">
                {{ Math.round(score / questions.length * 100) }}%
              </div>
            </div>
            <div v-if="isPassed" class="alert alert-success mb-3">
              <i class="bi bi-check-circle-fill me-2"></i> Congratulations! You passed the quiz.
            </div>
            <div v-else class="alert alert-danger mb-3">
              <i class="bi bi-x-circle-fill me-2"></i> You did not pass the quiz.
            </div>

            <div class="d-flex align-items-center mb-3">
              <div><i class="bi bi-alarm fs-3 text-primary me-2"></i></div>
              <div>Remaining Time: {{ timeUsed }}</div>
            </div>

            <div>
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
                      <tr v-for="(question, i) in typedQuestions" :key="i" @click="showQuestionDetails(i)" role="button" class="question-row">
                        <td>{{ i + 1 }}</td>
                        <td>{{ truncateQuestion(question.question, 86) }}</td>
                        <td :class="question.is_correct === 1 ? 'text-success fw-bold' : 'text-danger fw-bold'">
                          {{ formatAnswerWithoutPrefix(question) }}
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
          <p class="mb-3">{{ selectedQuestion?.question }}</p>
          <div v-if="!!selectedQuestion?.is_choices">
            <div v-for="(choice, letter) in choices" :key="letter"
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
                       'bg-success-dark text-white': selectedQuestion?.is_correct === 1,
                       'bg-danger text-white': selectedQuestion?.is_correct === 0
                     }"
                     :value="selectedQuestion?.answer_input" disabled>
            </div>
            <div v-if="selectedQuestion?.is_correct === 0" class="input-group mb-3">
              <span class="input-group-text">Correct Answer</span>
              <input type="text" class="form-control bg-success-light" :value="selectedQuestion?.answer" disabled>
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

// Define the interface for a question
interface Question {
  question: string;
  is_correct: number;
  answer_input: string;
  answer: string;
  is_choices: boolean;
  choice_a?: string;
  choice_b?: string;
  choice_c?: string;
  choice_d?: string;
}

// Define the interface for category - make it more generic
interface Category {
  id?: number;
  name?: string;
  [key: string]: any; // Allow any additional properties
}

export default defineComponent({
  name: "QuizResultPreview",
  emits: ['back', 'retry'],
  props: {
    category: {
      type: Object as () => Category,
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
    // Change "passed" to be a Boolean flag.
    passed: {
      type: Boolean,
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
      selectedQuestion: null as Question | null,
      showQuestionModal: false,
      choices: {} as Record<string, string>
    }
  },
  computed: {
    typedQuestions(): Question[] {
      return this.questions as Question[];
    },
    isPassed(): boolean {
      // Now that `passed` is a Boolean, simply return its value
      return this.passed;
    }
  },
  methods: {
    onBack() {
      this.$emit('back');
    },
    onRetry() {
      Swal.fire({
        title: "Try Again?",
        text: "You will restart the quiz with new questions. Are you sure?",
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
      this.selectedQuestion = (this.questions as Question[])[index];

      // Prepare choices for the selected question if applicable
      if (this.selectedQuestion && this.selectedQuestion.is_choices) {
        this.choices = {
          'a': this.selectedQuestion.choice_a || '',
          'b': this.selectedQuestion.choice_b || '',
          'c': this.selectedQuestion.choice_c || '',
          'd': this.selectedQuestion.choice_d || ''
        };
      }

      // Show the modal and disable body scrolling
      this.showQuestionModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeQuestionModal() {
      this.showQuestionModal = false;
      document.body.style.overflow = '';
    },
    getChoiceClass(letter: string) {
      if (!this.selectedQuestion) return {};

      return {
        'bg-success-dark': this.selectedQuestion.is_correct === 1 &&
                           this.selectedQuestion.answer_input === letter,
        'bg-danger': this.selectedQuestion.is_correct === 0 &&
                     this.selectedQuestion.answer_input === letter,
        'bg-success-light': this.selectedQuestion.is_correct === 0 &&
                           this.selectedQuestion.answer.toLowerCase() === letter
      };
    },
    truncateQuestion(text: string, maxLength: number): string {
      if (text && text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text || '';
    },
    formatAnswerWithoutPrefix(question: Question): string {
      if (question.is_choices) {
        const choices: Record<string, string> = {
          'a': question.choice_a || '',
          'b': question.choice_b || '',
          'c': question.choice_c || '',
          'd': question.choice_d || ''
        };

        const answerText = choices[question.answer_input] || '';
        if (answerText) {
          return this.truncateQuestion(answerText, 55);
        }
        return 'Not answered';
      } else {
        return question.answer_input || 'Not answered';
      }
    }
  },
  beforeUnmount() {
    // Re-enable scrolling if the modal was open
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* (Your styles remain unchanged) */
.container {
  max-width: 100%;
}

.custom-mt {
  margin-top: -50px !important;
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

/* Custom modal styles */
.question-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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
  border-spacing: 0 8px;
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
  position: relative;
  z-index: 0;
}

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
