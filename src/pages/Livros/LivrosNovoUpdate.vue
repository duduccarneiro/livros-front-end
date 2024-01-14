<template>
  <div>
    <LivrosForm :codL="codL" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LivrosForm from '../../components/Livro/LivrosForm.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const codL = ref()
codL.value = route.params.codL
</script>
