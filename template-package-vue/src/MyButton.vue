<script setup>
import { ref } from "vue";

const props = defineProps({
  type: String,
});

const { type } = props;

const count = ref(0);
</script>

<template>
  <button class="my-button" @click="count++">
    my button<br />
    type: {{ type }}<br />
    count: {{ count }}
  </button>
</template>

<style scoped>
.my-button {
  padding: 8px 16px;
}
</style>
