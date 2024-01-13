<template>
  <div class="col-12 q-pa-sm shadow-1 bg-grey-2">
    <div class="col-12">
      <span class="text-h6 text-weight-bold" v-if="form.codAs">Editar Assunto</span>
      <span class="text-h6 text-weight-bold" v-else>Novo Assunto</span>
    </div>
    <q-form class="column col-12 q-gutter-y-sm" @submit.prevent="handleSubmit" autocomplete="off">
      <div class="row">
        <div class="column col-xs-12 col-sm-6 col-md-4">
          <label>Descrição</label>
          <q-input
            dense
            v-model.trim="form.descricao"
            name="descricao"
            filled
            :rules="[
              val => !!val || 'O campo descricao é obrigatório',
              val => val.length < 40 || 'O campo descricao deve ter no máximo 40 caracteres',
            ]"
          />
        </div>
      </div>
      <div class="row q-gutter-x-sm">
        <q-btn ref="adicionar" :label="form.codAs?'Atualizar':'Adicionar'" color="primary" type="submit" />
        <q-btn label="Cancelar" flat @click="$router.push('/assuntos')"/>
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
const props = defineProps(['codAs'])
const $q = useQuasar()
const router = useRouter()
const isLoading = ref(false)
const form = ref({
  codAs: '',
  descricao: ''
})

const handleGetAssunto = async (codAs) => {
  try {
    isLoading.value = true
    const { data: response } = await api.get(`api/assuntos/${codAs}`)
    form.value = { ...response.data }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    if( error.response.status === 404 ) {
      //todo: ver se redireciona para a tela anterior automaticamente ou se encaminha para tela de erro 404
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
  if (form.value.codAs) {
    api.patch(`/api/assuntos/${form.value.codAs}`, {
      descricao: form.value.descricao
    }).then(() => {
      $q.notify({ type: 'positive', position: 'top', message: 'Assunto atualizado' })
      router.replace('/assuntos')
    }).catch((error) => {
      console.log(error)
      $q.notify({ type: 'negative', position: 'top', message: 'Aconteceu algo errado' })
    })
  } else {
    api.post('/api/assuntos', {
      descricao: form.value.descricao
    }).then(() => {
      $q.notify({ type: 'positive', position: 'top', message: 'Assunto adicionado' })
      router.replace('/assuntos')
    }).catch((error) => {
      console.log(error)
      $q.notify({ type: 'negative', position: 'top', message: 'Aconteceu algo errado' })
    })
  }
}

watch(() => props.codAs, () => {
  if (props.codAs) {
    handleGetAssunto(props.codAs)
  }
}, {
  immediate: true
})
</script>
