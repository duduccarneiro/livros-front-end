<template>
  <div>
    <AutoresForm :codAu="codAu" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AutoresForm from '../../components/Autor/AutoresForm.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const codAu = ref()
codAu.value = route.params.codAu

</script>
