<template>
  <div>
    <AssuntosForm :codAs="codAs" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AssuntosForm from '../../components/Assunto/AssuntosForm.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const codAs = ref()
codAs.value = route.params.codAs

</script>
