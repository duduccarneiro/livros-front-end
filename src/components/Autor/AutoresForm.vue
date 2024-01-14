<template>
  <div class="col-12 q-pa-sm shadow-1 bg-grey-2">
    <div class="col-12">
      <span class="text-h6 text-weight-bold" v-if="form.codAu">Editar Autor</span>
      <span class="text-h6 text-weight-bold" v-else>Novo Autor</span>
    </div>
    <q-form class="column col-12 q-gutter-y-sm" @submit.prevent="handleSubmit" autocomplete="off">
      <div class="row">
        <div class="column col-xs-12 col-sm-6 col-md-4">
          <label>Nome</label>
          <q-input
            dense
            v-model.trim="form.nome"
            name="descricao"
            filled
            :rules="[
              val => !!val || 'O campo nome é obrigatório',
              val => val.length <= 40 || 'O campo nome deve ter no máximo 40 caracteres',
            ]"
          />
        </div>
      </div>
      <div class="row q-gutter-x-sm">
        <q-btn ref="adicionar" :label="form.codAu?'Atualizar':'Adicionar'" color="primary" type="submit" />
        <q-btn label="Cancelar" flat @click="$router.push('/autores')"/>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const emit = defineEmits(['hideForm', 'updateExternal'])
const props = defineProps(['codAu'])
const $q = useQuasar()
const router = useRouter()
const isLoading = ref(false)
const form = ref({
  codAu: '',
  nome: ''
})

const handleGetAutor = async (codAu) => {
  try {
    isLoading.value = true
    const { data: response } = await api.get(`api/autores/${codAu}`)
    form.value = { ...response.data }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    if( error.response.status === 404 ) {
      router.push('/autor-nao-encontrado')
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Registro não encontrado'
      })
      console.log('Erro 404 mane')
    } else {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Aconteceu algum erro'
      })
    }
  }
}

const handleSubmit = () => {
  if (form.value.codAu) {
    api.patch(`/api/autores/${form.value.codAu}`, {
      nome: form.value.nome
    }).then(() => {
      $q.notify({ type: 'positive', position: 'top', message: 'Autor atualizado' })
      router.replace('/autores')
    }).catch((error) => {
      console.log(error)
      $q.notify({ type: 'negative', position: 'top', message: 'Aconteceu algo errado' })
    })
  } else {
    api.post('/api/autores', {
      nome: form.value.nome
    }).then(() => {
      $q.notify({ type: 'positive', position: 'top', message: 'Autor adicionado' })
      router.replace('/autores')
    }).catch((error) => {
      console.log(error)
      $q.notify({ type: 'negative', position: 'top', message: 'Aconteceu algo errado' })
    })
  }
}

watch(() => props.codAu, () => {
  if (props.codAu) {
    handleGetAutor(props.codAu)
  }
}, {
  immediate: true
})
</script>
