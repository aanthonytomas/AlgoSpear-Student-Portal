<template>
  <div v-if="showDescription" class="progress-description">
      {{ progressDescription }}
    </div>
  <div class="progress-container">
    <div
      class="progress my-2"
      :style="{ height: height + 'px', borderRadius: borderRadius + 'px' }"
      @mouseenter="handleHover(true)"
      @mouseleave="handleHover(false)"
    >
      <div
        class="progress-bar"
        role="progressbar"
        :class="[animationClass, {'progress-striped': striped}]"
        :style="{
          width: progressBarWidth + '%',
          borderRadius: borderRadius + 'px',
          background: gradientBackground
        }"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span v-if="showLabel">{{ percentage }}%</span>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from 'vue';

export default defineComponent({
  name: 'EnhancedProgressbar',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 40,
    },
    color: {
      type: String,
      default: 'success', // success, info, warning, danger, primary
    },
    animated: {
      type: Boolean,
      default: true,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    showDescription: {
      type: Boolean,
      default: true,
    },
    borderRadius: {
      type: Number,
      default: 6,
    }
  },
  setup(props) {
    const progressBarWidth = ref(0);
    const isHovered = ref(false);
    const animationClass = computed(() => props.animated ? 'progress-animated' : '');
    
    const progressDescription = computed(() => {
      if (props.percentage == 0) return 'Learn Fundamentals';
      if (props.percentage < 25) return 'Just started';
      if (props.percentage < 50) return 'Making progress';
      if (props.percentage < 75) return 'Getting there';
      if (props.percentage < 100) return 'Almost done';
      return 'Complete!';
    });
    
    const gradientBackground = computed(() => {
      const colorMap: { [key: string]: string } = {
        success: 'linear-gradient(135deg, #28a745, #218838)',
        info: 'linear-gradient(135deg, #17a2b8, #117a8b)',
        warning: 'linear-gradient(135deg, #ffc107, #d39e00)',
        danger: 'linear-gradient(135deg, #dc3545, #bd2130)',
        primary: 'linear-gradient(135deg, #007bff, #0056b3)'
      };
      
      return colorMap[props.color] || colorMap.success;
    });

    const handleHover = (hovering: boolean) => {
      isHovered.value = hovering;
    };

    onMounted(() => {
      // Animate from 0 to the actual value for a nice initial effect
      progressBarWidth.value = 0;
      setTimeout(() => {
        progressBarWidth.value = props.percentage;
      }, 100);
    });

    watch(
      () => props.percentage,
      (newVal) => {
        progressBarWidth.value = newVal;
      }
    );

    return {
      progressBarWidth,
      isHovered,
      handleHover,
      animationClass,
      progressDescription,
      gradientBackground
    };
  },
});
</script>

<style scoped>
.progress-container {
  margin: 1rem 0;
}

.progress {
  background-color: #e9ecef;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
  margin-top: 40px;
}

.progress:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-color: rgba(48, 133, 214, 0.5);
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.progress-animated::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

.progress-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.progress-description {
  text-align: center;
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.25rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>