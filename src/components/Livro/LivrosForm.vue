<template>
  <div class="col-12 q-pa-sm shadow-1 bg-grey-2">
    <div class="col-12">
      <span class="text-h6 text-weight-bold" v-if="form.codL">Editar Livro</span>
      <span class="text-h6 text-weight-bold" v-else>Novo Livro</span>
    </div>
    <q-form class="column col-12 q-gutter-y-sm" @submit.prevent="handleSubmit" autocomplete="off">
      <div class="row q-col-gutter-x-md">
        <div class="column col-xs-12 col-sm-12 col-md-6">
          <label>Título</label>
          <q-input
            dense
            v-model.trim="form.titulo"
            name="titulo"
            filled
            :rules="[
              val => !!val || 'O campo título é obrigatório',
              val => val.length < 40 || 'O campo título deve ter no máximo 40 caracteres',
            ]"
          />
        </div>
        <div class="column col-xs-12 col-sm-12 col-md-6">
          <label>Editora</label>
          <q-input
            dense
            v-model.trim="form.editora"
            name="editora"
            filled
            :rules="[
              val => !!val || 'O campo editora é obrigatório',
              val => val.length < 40 || 'O campo editora deve ter no máximo 40 caracteres',
            ]"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div class="column col-xs-3 col-sm-2 col-md-2">
          <label>Edição</label>
          <q-input
            dense
            v-model.trim="form.edicao"
            name="edicao"
            filled
            :rules="[
              val => !!val || 'O campo edição é obrigatório',
              val => Number(val) || 'O campo edição deve ser um número',
            ]"
          />
        </div>
        <div class="column col-xs-4 col-sm-3 col-md-2">
          <label>Ano publicacao</label>
          <q-input
            dense
            v-model.trim="form.anoPublicacao"
            name="anoPublicacao"
            filled
            :rules="[
              val => !!val || 'O campo ano de publicacao é obrigatório',
              val => Number(val) || 'O campo ano de publicacao deve ser um número',
              val => val.length <= 4 || 'O campo ano de publicacao deve ser ano com até 4 caracteres',
            ]"
          />
        </div>
        <div class="column col-xs-4 col-sm-3 col-md-2">
          <label>Valor</label>
          <q-input
            dense
            v-model.trim="form.valor"
            name="valor"
            filled
            mask="#,##"
            fill-mask="0"
            reverse-fill-mask
            input-class="text-right"
            @focus="$event.target.select()"
            :rules="[
              val => !!val || 'O campo valor de publicacao é obrigatório',
            ]"
            prefix="R$"
          />
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-9 col-md-5">
          <q-card class="my-card bg-grey-3">
            <q-card-section>
              <div class="column col-xs-4 col-sm-3 col-md-2">
                <label class="text-body1 text-weight-medium">Autores</label>
                <q-select
                  filled
                  v-model="autorSelecionado"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="autoresFilteredList"
                  option-value="codAu"
                  option-label="nome"
                  @filter="filterFn"
                  hint="Digite para filtrar"
                  style="padding-bottom: 32px"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Nenhum autor
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div>
              <q-list bordered separator>
                <q-item v-if="!form.autores?.length">
                  <q-item-section overline>Nenhum autor selecionado</q-item-section>
                </q-item>
                <q-item v-for="item in form.autores" :key="item.codAu" v-ripple>
                  <q-item-section overline>{{ item.nome }}</q-item-section>
                  <q-item-section avatar>
                    <q-icon class="cursor-pointer" color="primary" name="remove" @click="removerAutor(item.codAu)">
                      <q-tooltip>
                        Remover autor
                      </q-tooltip>
                    </q-icon>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-9 col-md-5">
          <q-card class="my-card bg-grey-3">
            <q-card-section>
              <div class="column col-xs-4 col-sm-3 col-md-2">
                <label class="text-body1 text-weight-medium">Assuntos</label>
                <q-select
                  filled
                  v-model="assuntoSelecionado"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="assuntosFilteredList"
                  option-value="codAs"
                  option-label="descricao"
                  @filter="assuntosFilterFn"
                  hint="Digite para filtrar"
                  style="padding-bottom: 32px"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Nenhum assunto
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div>
              <q-list bordered separator>
                <q-item v-if="!form.assuntos?.length">
                  <q-item-section overline>Nenhum assunto selecionado</q-item-section>
                </q-item>
                <q-item v-for="item in form.assuntos" :key="item.codAs" v-ripple>
                  <q-item-section overline>{{ item.descricao }}</q-item-section>
                  <q-item-section avatar>
                    <q-icon class="cursor-pointer" color="primary" name="remove" @click="removerAssunto(item.codAs)">
                      <q-tooltip>
                        Remover assunto
                      </q-tooltip>
                    </q-icon>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-gutter-x-sm">
        <q-btn ref="adicionar" :label="form.codL?'Atualizar':'Adicionar'" color="primary" type="submit" />
        <q-btn label="Cancelar" flat @click="$router.push('/livros')"/>
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
const props = defineProps(['codL'])
const $q = useQuasar()
const router = useRouter()
const isLoading = ref(false)
const form = ref({
  codL: '',
  titulo: '',
  editora: '',
  edicao: '',
  anoPublicacao: '',
  valor: '0,00',
  autores: [],
  assuntos: [],
})

const autoresList = ref()
const autoresFilteredList = ref()
const autorSelecionado = ref()

const assuntosList = ref()
const assuntosFilteredList = ref()
const assuntoSelecionado = ref()

const handleGetLivro = async (codL) => {
  try {
    isLoading.value = true
    const { data: response } = await api.get(`api/livros/${codL}`)
    form.value = { ...response.data }
    if(form.value.autores == undefined){
      form.value.autores = []
    }
    if(form.value.assuntos == undefined){
      form.value.assuntos = []
    }
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
  if (form.value.codL) {
    api.patch(`/api/livros/${form.value.codL}`, {
      titulo: form.value.titulo,
      editora: form.value.editora,
      edicao: form.value.edicao,
      anoPublicacao: form.value.anoPublicacao,
      valor: form.value.valor.replace(",", "."),
      autores: pluck(form.value.autores, 'codAu'),
      assuntos: pluck(form.value.assuntos, 'codAs'),
    }).then(() => {
      $q.notify({ type: 'positive', position: 'top', message: 'Livro atualizado' })
      router.replace('/livros')
    }).catch((error) => {
      console.log(error)
      $q.notify({ type: 'negative', position: 'top', message: 'Aconteceu algo errado' })
    })
  } else {
    api.post('/api/livros', {
      titulo: form.value.titulo,
      editora: form.value.editora,
      edicao: form.value.edicao,
      anoPublicacao: form.value.anoPublicacao,
      valor: form.value.valor.replace(",", "."),
      autores: pluck(form.value.autores, 'codAu'),
      assuntos: pluck(form.value.assuntos, 'codAs'),
    }).then(() => {
      $q.notify({ type: 'positive', position: 'top', message: 'Livro adicionado' })
      router.replace('/livros')
    }).catch((error) => {
      console.log(error)
      $q.notify({ type: 'negative', position: 'top', message: 'Aconteceu algo errado' })
    })
  }
}

const getAutores = async () => {
  const { data: response } = await api.get('api/autores', {
    params: {
      sort_by: 'nome',
      order: 'asc',
    }
  })
  autoresList.value = response.data
}

const getAssuntos = async () => {
  const { data: response } = await api.get('api/assuntos', {
    params: {
      sort_by: 'descricao',
      order: 'asc',
    }
  })
  assuntosList.value = response.data
}

getAutores()
getAssuntos()

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    autoresFilteredList.value = autoresList.value.filter(v => v.nome.toLowerCase().indexOf(needle) > -1)
  })
}

const assuntosFilterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    assuntosFilteredList.value = assuntosList.value.filter(v => v.descricao.toLowerCase().indexOf(needle) > -1)
  })
}

watch(() => autorSelecionado.value, () => {
  if(form.value.autores == undefined){
    form.value.autores = []
  }
  const index = form.value.autores.findIndex(item => item.codAu === autorSelecionado.value.codAu)
  if( index === -1) {
    form.value.autores.push(autorSelecionado.value)
  }
})

const removerAutor = (codAu) => {
  const index = form.value.autores.findIndex((item => item.codAu === codAu))
  form.value.autores.splice(index, 1)
}

watch(() => assuntoSelecionado.value, () => {
  if(form.value.assuntos == undefined){
    form.value.assuntos = []
  }
  const index = form.value.assuntos.findIndex(item => item.codAs === assuntoSelecionado.value.codAs)
  if( index === -1) {
    form.value.assuntos.push(assuntoSelecionado.value)
  }
})

const removerAssunto = (codAs) => {
  const index = form.value.assuntos.findIndex((item => item.codAs === codAs))
  form.value.assuntos.splice(index, 1)
}

const pluck = (arr, key) => arr.map(i => i[key])

watch(() => props.codL, () => {
  if (props.codL) {
    handleGetLivro(props.codL)
  }
}, {
  immediate: true
})
</script>
