<template>
  <div class="preloader" v-if="loading">
    <div class="preloader-content">
      <!-- Visualization container -->
      <div class="visualization-container">
        <!-- Array visualization -->
        <div class="structure-container array-container" v-if="currentStructure === 'array'">
          <div class="structure-title">Array</div>
          <div class="array-wrapper">
            <div class="array-box" v-for="(item, index) in arrayItems" :key="index"
                 :class="{ active: activeIndices.includes(index) }">
              {{ item }}
            </div>
          </div>
        </div>
        
        <!-- Linked List visualization -->
        <div class="structure-container linked-list-container" v-if="currentStructure === 'linkedList'">
          <div class="structure-title">Linked List</div>
          <div class="linked-list">
            <div class="list-node" v-for="(item, index) in linkedListItems" :key="index"
                 :class="{ active: activeIndices.includes(index) }">
              <div class="node-value">{{ item }}</div>
              <div class="node-pointer" v-if="index < linkedListItems.length - 1">→</div>
            </div>
          </div>
        </div>
        
        <!-- Stack visualization -->
        <div class="structure-container stack-container" v-if="currentStructure === 'stack'">
          <div class="structure-title">Stack</div>
          <div class="stack">
            <div class="stack-item" v-for="(item, index) in stackItems" :key="index"
                 :class="{ active: activeIndices.includes(index) }">
              {{ item }}
            </div>
          </div>
        </div>
        
        <!-- Queue visualization -->
        <div class="structure-container queue-container" v-if="currentStructure === 'queue'">
          <div class="structure-title">Queue</div>
          <div class="queue">
            <div class="queue-item" v-for="(item, index) in queueItems" :key="index"
                 :class="{ active: activeIndices.includes(index) }">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Graph visualization -->
        <div class="structure-container graph-container" v-if="currentStructure === 'graph'">
          <div class="structure-title">Graph</div>
          <div class="graph">
            <!-- Dynamic node creation -->
            <div 
              v-for="(node, index) in graphNodes" 
              :key="'node-'+index"
              class="graph-node" 
              :class="{ active: activeIndices.includes(index) }"
              :style="{ top: node.y + 'px', left: node.x + 'px' }"
            >
              {{ node.value }}
            </div>
            
            <!-- Dynamic edge creation using SVG -->
            <svg class="graph-edges" width="100%" height="100%">
              <line 
                v-for="(edge, index) in graphEdges" 
                :key="'edge-'+index"
                :x1="edge.source.x + 20" 
                :y1="edge.source.y + 20" 
                :x2="edge.target.x + 20" 
                :y2="edge.target.y + 20"
                :class="{ active: activeEdges.includes(index) }"
              />
            </svg>
          </div>
        </div>
        
        <!-- Sorting visualization -->
        <div class="structure-container sorting-container" v-if="currentStructure === 'sorting'">
        <div class="structure-title">Sorting Algorithm</div>
        <div class="sorting-bars">
          <div class="bar" v-for="(item, index) in sortingItems" :key="index"
              :class="{ active: activeIndices.includes(index) }"
              :style="{ height: item * 4 + 'px' }">
            <span class="bar-value">{{ item }}</span>
          </div>
        </div>
      </div>

        
        <!-- Searching visualization -->
        <div class="structure-container searching-container" v-if="currentStructure === 'searching'">
          <div class="structure-title">Searching Algorithm</div>
          <div class="searching-array">
            <div class="search-item" v-for="(item, index) in searchItems" :key="index"
                 :class="{ active: activeIndices.includes(index), target: searchTarget === item }">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading text and progress bar -->
      <div class="loader-text">
        <span>{{ loadingText }}</span>
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preloader',
  data() {
    return {
      loading: true,
      progress: 0,
      loadingText: 'Initializing Data Structures & Algorithm...',
      currentStructure: 'array',
      structureIndex: 0,
      structures: ['array', 'linkedList', 'stack', 'queue', 'graph', 'sorting', 'searching'],
      
      // Structure-specific loading texts
      loadingTexts: {
        array: 'Building Arrays...',
        linkedList: 'Constructing Linked Lists...',
        stack: 'Pushing to Stacks...',
        queue: 'Enqueuing Elements...',
        graph: 'Mapping Graph Edges...',
        sorting: 'Executing Sorting Algorithms...',
        searching: 'Implementing Binary Search...'
      },
      
      // General progress texts
      progressTexts: [
        'Initializing Data Structures...',
        'Building Arrays...',
        'Constructing Linked Lists...',
        'Pushing to Stacks...',
        'Enqueuing Elements...',
        'Mapping Graph Edges...',
        'Executing Sorting Algorithms...',
        'Implementing Binary Search...',
        'Analyzing Time Complexity...',
        'Optimizing Space Usage...',
        'Launching AlgoSpear...'
      ],
      
      // Array items
      arrayItems: [5, 2, 9, 1, 7, 6, 3],
      
      // Linked List items
      linkedListItems: [8, 3, 7, 2, 5],
      
      // Stack items
      stackItems: [3, 5, 8, 9, 12],
      
      // Queue items
      queueItems: [4, 7, 2, 9, 6],

      // Graph data
      graphNodes: [
        { value: 1, x: 100, y: 20 },
        { value: 2, x: 40, y: 80 },
        { value: 3, x: 160, y: 80 },
        { value: 4, x: 70, y: 140 },
        { value: 5, x: 130, y: 140 },
        { value: 6, x: 100, y: 200 },
      ],
      graphEdges: [],
      activeEdges: [],
      
      // Sorting items
      sortingItems: [12, 5, 18, 9, 15, 6, 11, 3],
      
      // Search items
      searchItems: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      searchTarget: 23,
      
      // Active indices for animation
      activeIndices: [0],
      
      // Intervals
      mainInterval: null,
      animationInterval: null,
      structureInterval: null,
      
      // Duration for each structure in milliseconds
      structureDuration: 1000,
      
      // Total loading time in milliseconds
      totalLoadTime: 6900 // ~7 seconds total
    }
  },
  mounted() {
    this.initializeGraphEdges();
    this.startLoading();
    this.rotateStructures();
  },
  beforeDestroy() {
    this.clearAllIntervals();
  },
  methods: {
    initializeGraphEdges() {
      // Create edges between nodes
      this.graphEdges = [
        { source: this.graphNodes[0], target: this.graphNodes[1] },
        { source: this.graphNodes[0], target: this.graphNodes[2] },
        { source: this.graphNodes[1], target: this.graphNodes[3] },
        { source: this.graphNodes[2], target: this.graphNodes[3] },
        { source: this.graphNodes[2], target: this.graphNodes[4] },
        { source: this.graphNodes[3], target: this.graphNodes[4] },
        { source: this.graphNodes[3], target: this.graphNodes[5] },
        { source: this.graphNodes[4], target: this.graphNodes[5] },
      ];
    },
    
    clearAllIntervals() {
      clearInterval(this.mainInterval);
      clearInterval(this.animationInterval);
      clearInterval(this.structureInterval);
    },
    
    startLoading() {
      let textIndex = 0;
      const progressIncrement = 100 / (this.totalLoadTime / 50); // Adjust for 50ms interval
      
      this.mainInterval = setInterval(() => {
        this.progress += progressIncrement;
        
        // Change general progress text periodically
        // But don't override the animation-specific text if we're in the middle of animations
        if (Math.floor(this.progress) % 10 === 0 && textIndex < this.progressTexts.length - 1) {
          textIndex++;
          // Only update text if it's one of the initial or final progress messages
          if (this.progress < 10 || this.progress > 90) {
            this.loadingText = this.progressTexts[textIndex];
          }
        }
        
        // Complete loading
        if (this.progress >= 100) {
          this.clearAllIntervals();
          setTimeout(() => {
            this.loading = false;
            this.$emit('loaded');
          }, 500);
        }
      }, 50);
    },
    
    rotateStructures() {
      // Initial animation
      this.animateCurrentStructure();
      
      // Set the initial text to match the current structure
      this.loadingText = this.loadingTexts[this.currentStructure];
      
      // Set up structure rotation every 2 seconds
      this.structureInterval = setInterval(() => {
        // Move to next structure
        this.structureIndex = (this.structureIndex + 1) % this.structures.length;
        this.currentStructure = this.structures[this.structureIndex];
        
        // Update the loading text based on the current structure
        this.loadingText = this.loadingTexts[this.currentStructure];
        
        // Reset active indices
        this.activeIndices = [0];
        this.activeEdges = [];
        
        // Start animating the new structure
        this.animateCurrentStructure();
      }, this.structureDuration);
    },
    
    animateCurrentStructure() {
      clearInterval(this.animationInterval);
      
      switch(this.currentStructure) {
        case 'array':
          this.animateArray();
          break;
        case 'linkedList':
          this.animateLinkedList();
          break;
        case 'stack':
          this.animateStack();
          break;
        case 'queue':
          this.animateQueue();
          break;
        case 'graph':
          this.animateGraph();
          break;
        case 'sorting':
          this.animateSorting();
          break;
        case 'searching':
          this.animateSearching();
          break;
      }
    },
    
    animateArray() {
      let index = 0;
      this.animationInterval = setInterval(() => {
        index = (index + 1) % this.arrayItems.length;
        this.activeIndices = [index];
        
        // Occasionally swap elements
        if (Math.random() > 0.7) {
          const idx1 = Math.floor(Math.random() * this.arrayItems.length);
          const idx2 = Math.floor(Math.random() * this.arrayItems.length);
          
          if (idx1 !== idx2) {
            const temp = this.arrayItems[idx1];
            this.arrayItems[idx1] = this.arrayItems[idx2];
            this.arrayItems[idx2] = temp;
            this.activeIndices = [idx1, idx2];
          }
        }
      }, 300);
    },
    
    animateLinkedList() {
      let index = 0;
      this.animationInterval = setInterval(() => {
        index = (index + 1) % this.linkedListItems.length;
        this.activeIndices = [index];
      }, 300);
    },
    
    animateStack() {
      let pushOrPop = true;
      // Reset stack items before animation
      this.stackItems = [3, 5, 8, 9, 12];
      
      this.animationInterval = setInterval(() => {
        if (pushOrPop && this.stackItems.length < 7) {
          // Push
          const newItem = Math.floor(Math.random() * 20) + 1;
          this.stackItems.push(newItem);
          this.activeIndices = [this.stackItems.length - 1];
        } else if (!pushOrPop && this.stackItems.length > 2) {
          // Pop
          this.activeIndices = [this.stackItems.length - 1];
          setTimeout(() => {
            this.stackItems.pop();
          }, 200);
        }
        pushOrPop = !pushOrPop;
      }, 400); // Slightly faster to fit more actions in 1 second
    },
    
    animateQueue() {
      let addOrRemove = true;
      // Reset queue items before animation
      this.queueItems = [4, 7, 2, 9, 6];
      
      this.animationInterval = setInterval(() => {
        if (addOrRemove && this.queueItems.length < 7) {
          // Enqueue
          const newItem = Math.floor(Math.random() * 20) + 1;
          this.queueItems.push(newItem);
          this.activeIndices = [this.queueItems.length - 1];
        } else if (!addOrRemove && this.queueItems.length > 2) {
          // Dequeue
          this.activeIndices = [0];
          setTimeout(() => {
            this.queueItems.shift();
          }, 200);
        }
        addOrRemove = !addOrRemove;
      }, 400); // Slightly faster to fit more actions in 1 second
    },
    
    animateGraph() {
      // Initialize graph edges if not done yet
      if (this.graphEdges.length === 0) {
        this.initializeGraphEdges();
      }
      
      // Improved graph animation - simulating a traversal
      let currentNode = 0;
      let visitedNodes = [0];
      let pathIndex = 0;
      
      // Define a traversal path
      const traversalPath = [
        { node: 0, edges: [0] },
        { node: 1, edges: [2] },
        { node: 3, edges: [5, 6] },
        { node: 5, edges: [] },
        { node: 4, edges: [7] },
        { node: 5, edges: [] },
        { node: 3, edges: [4] },
        { node: 4, edges: [] },
        { node: 2, edges: [3] },
        { node: 4, edges: [] },
        { node: 2, edges: [] },
        { node: 0, edges: [1] },
        { node: 2, edges: [] }
      ];
      
      this.animationInterval = setInterval(() => {
        if (pathIndex < traversalPath.length) {
          const step = traversalPath[pathIndex];
          
          // Highlight the current node
          this.activeIndices = [step.node];
          
          // Highlight active edges
          this.activeEdges = step.edges;
          
          pathIndex++;
        } else {
          // Reset the traversal
          pathIndex = 0;
          visitedNodes = [0];
        }
      }, 200);
    },
    
    animateSorting() {
      // Reset sorting items before animation
      this.sortingItems = [12, 5, 18, 9, 15, 6, 11, 3];
      let step = 0;
      
      this.animationInterval = setInterval(() => {
        if (step < this.sortingItems.length - 1) {
          for (let i = 0; i < this.sortingItems.length - 1 - step; i++) {
            if (this.sortingItems[i] > this.sortingItems[i + 1]) {
              const temp = this.sortingItems[i];
              this.sortingItems[i] = this.sortingItems[i + 1];
              this.sortingItems[i + 1] = temp;
              this.activeIndices = [i, i + 1];
              break;
            }
          }
          step++;
        } else {
          // Show sorted array highlighted
          this.activeIndices = [...Array(this.sortingItems.length).keys()];
          // Reset to start sorting again
          step = 0;
          this.sortingItems = [12, 5, 18, 9, 15, 6, 11, 3];
        }
      }, 250); // Faster to show more sorting steps in 1 second
    },
    
    animateSearching() {
      let left = 0;
      let right = this.searchItems.length - 1;
      let found = false;
      
      this.animationInterval = setInterval(() => {
        if (left <= right && !found) {
          let mid = Math.floor((left + right) / 2);
          this.activeIndices = [mid];
          
          if (this.searchItems[mid] === this.searchTarget) {
            found = true;
            // Highlight the found item
            this.activeIndices = [mid];
          } else if (this.searchItems[mid] < this.searchTarget) {
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        } else {
          // Reset search
          left = 0;
          right = this.searchItems.length - 1;
          found = false;
        }
      }, 250); // Faster to show more search steps in 1 second
    }
  }
}
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #12114a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: #e6f1ff;
  font-family: 'Courier New', monospace;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
}

.visualization-container {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.structure-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.structure-title {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #4efcb8;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(78, 252, 184, 0.5);
}

/* Array visualization */
.array-wrapper {
  display: flex;
  margin: 20px 0;
}

.array-box {
  width: 40px;
  height: 40px;
  margin: 0 5px;
  background-color: #1a1a5f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid #4b6cc1;
}

.array-box.active {
  background-color: #4efcb8;
  color: #12114a;
  transform: translateY(-10px);
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
}

/* Linked List visualization */
.linked-list {
  display: flex;
  align-items: center;
}

.list-node {
  display: flex;
  align-items: center;
}

.node-value {
  width: 40px;
  height: 40px;
  background-color: #1a1a5f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  border: 1px solid #4b6cc1;
}

.list-node.active .node-value {
  background-color: #4efcb8;
  color: #12114a;
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
}

.node-pointer {
  margin: 0 10px;
  color: #4b6cc1;
  font-size: 20px;
}

/* Stack visualization */
.stack {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}

.stack-item {
  width: 120px;
  height: 30px;
  margin: 2px 0;
  background-color: #1a1a5f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid #4b6cc1;
}

.stack-item.active {
  background-color: #4efcb8;
  color: #12114a;
  transform: translateX(10px);
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
}

/* Queue visualization */
.queue {
  display: flex;
  align-items: center;
}

.queue-item {
  width: 40px;
  height: 40px;
  margin: 0 5px;
  background-color: #1a1a5f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid #4b6cc1;
}

.queue-item.active {
  background-color: #4efcb8;
  color: #12114a;
  transform: translateY(-10px);
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
}

.node {
  width: 40px;
  height: 40px;
  background-color: #1a1a5f;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid #4b6cc1;
  transition: all 0.3s ease;
}

.node.active {
  background-color: #4efcb8;
  color: #12114a;
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
}

.node span {
  font-weight: bold;
}

.root {
  margin: 0 auto 40px;
}

.connections {
  position: absolute;
  width: 100%;
  height: 30px;
  bottom: -30px;
}

.connection {
  position: absolute;
  width: 2px;
  height: 30px;
  background-color: #4b6cc1;
}

.connection.left {
  left: 25%;
  transform: rotate(-30deg);
}

.connection.right {
  right: 25%;
  transform: rotate(30deg);
}

.level-1 {
  display: flex;
  justify-content: space-around;
  width: 300px;
}

.level-2 {
  display: flex;
  justify-content: space-around;
  width: 300px;
  margin-top: 40px;
}

/* Graph visualization */
.graph {
  position: relative;
  width: 260px;
  height: 240px;
}

.graph-node {
  width: 40px;
  height: 40px;
  background-color: #1a1a5f;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border: 1px solid #4b6cc1;
  transition: all 0.3s ease;
  z-index: 2;
}

.graph-node.active {
  background-color: #4efcb8;
  color: #12114a;
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
  transform: scale(1.1);
}

.graph-edges {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.graph-edges line {
  stroke: #4b6cc1;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.graph-edges line.active {
  stroke: #4efcb8;
  stroke-width: 3;
  filter: drop-shadow(0 0 5px rgba(78, 252, 184, 0.7));
}


/* Sorting visualization */
.sorting-bars {
  display: flex;
  align-items: flex-end;
  height: 160px;
}

.bar-value {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  color: #e6f1ff;
  font-size: 12px;
  font-weight: bold;
}

.bar {
  position: relative;
  width: 20px;
  margin: 0 5px;
  background-color: #1a1a5f;
  border: 1px solid #4b6cc1;
  transition: all 0.3s ease;
}

.bar.active {
  background-color: #4efcb8;
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
}

.bar.active .bar-value {
  color: #12114a;
}

/* Searching visualization */
.searching-array {
  display: flex;
}

.search-item {
  width: 40px;
  height: 40px;
  margin: 0 5px;
  background-color: #1a1a5f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid #4b6cc1;
}

.search-item.active {
  background-color: #4efcb8;
  color: #12114a;
  transform: translateY(-10px);
  box-shadow: 0 0 15px rgba(78, 252, 184, 0.7);
}

.search-item.target {
  border: 2px solid #e94560;
}

/* Loading text and progress bar */
.loader-text {
  text-align: center;
  margin-top: 20px;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #1a1a5f;
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4efcb8;
  border-radius: 4px;
  transition: width 0.2s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>