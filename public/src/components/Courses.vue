<template>
  <div>
    <table class="table table-striped" style="width: 100%">
      <thead class="bg-dark">
        <tr>
          <th colspan="2">{{ title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in list" :key="i">
          <td>
            <small>{{ item?.name }}</small>
          </td>
          <td style="width: 90px">
            <button
              :class="[
                'btn btn-sm',
                isArticleRead(item?.topic_refid)
                  ? 'btn-success'
                  : 'btn-primary',
              ]"
              @click="viewContent(item)"
              :disabled="isButtonDisabled(i)"
            >
              <i v-if="isButtonDisabled(i)" class="bi bi-lock-fill me-1"></i>
              <i
                v-else-if="isArticleRead(item?.topic_refid)"
                class="bi bi-check-circle-fill me-1"
              ></i>
              <i v-else class="bi bi-unlock-fill me-1"></i>
              <span>Read</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// Fix: Use type-only import for PropType
import type { PropType } from "vue";

interface Article {
  topic_refid: string;
  [key: string]: any;
}

interface ListItem {
  name?: string;
  topic_refid?: string;
  [key: string]: any;
}

export default defineComponent({
  emits: ["view"],
  props: {
    title: {
      default: "Untitled",
      type: String,
    },
    articlesRead: {
      type: Array as PropType<Article[]>,
      default: () => [],
    },
    list: {
      type: Array as PropType<ListItem[]>,
      default: () => [],
    },
    unlock: {
      default: 0,
      type: Number,
    },
    btn_disabled: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      ongoing: false,
    };
  },
  methods: {
    viewContent(item: ListItem) {
      if (this.ongoing) {
        this.$toast?.warning("Please complete the ongoing reading first.");
        return;
      }

      this.ongoing = true;
      this.$emit("view", item);
    },
    isArticleRead(topic_refid?: string): boolean {
      if (!topic_refid) return false;
      return this.articlesRead.some(
        (article: Article) => article.topic_refid === topic_refid
      );
    },
    isButtonDisabled(index: number): boolean {
      // If there's an ongoing reading, disable all buttons except the ones already read
      if (this.ongoing && !this.isArticleRead(this.list[index]?.topic_refid)) {
        return true;
      }

      // First item is always enabled if not ongoing
      if (index === 0) {
        return false;
      }

      // For subsequent items, check if all previous items have been read
      for (let i = 0; i < index; i++) {
        if (!this.isArticleRead(this.list[i]?.topic_refid)) {
          return true;
        }
      }

      return false;
    },
  },
  watch: {
    unlock: function (newValue) {
      if (newValue > 0) {
        this.ongoing = false;
      }
    },
  },
  created() {
    // Ensure list is always treated as an array
    if (!Array.isArray(this.list)) {
      console.warn('The "list" prop should be an array');
    }
  },
});
</script>