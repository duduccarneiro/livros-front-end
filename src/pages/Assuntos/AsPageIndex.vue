<template>
  <q-page padding class="column">
    <div class="row items-center q-gutter-lg q-mb-lg">
      <span class="text-h4">Gerenciamento de Assuntos</span>
      <q-btn ref="adicionar" label="Novo" color="primary" @click="$router.push('/assuntos/novo')"/>
    </div>
    <div class="column col-xs-12 col-sm">
      <q-table
        :rows="listaLivros"
        :columns="columns"
        row-key="id"
        ref="tableLivrosRef"
        :loading="isLoading"
        no-data-label="Nenhum registro encontrado"
        no-results-label="Nenhum registro encontrado"
        @request="handleListLivros"
        binary-state-sort
        v-model:pagination="pagination"
        :filter="filter"
      >
        <template v-slot:top-row="props">
          <q-tr :props="props">
            <q-td
              v-for="item in props.cols"
              :key="item.name"
              :align="item.align"
            >
              <q-input
                v-if="item.name == 'codAs'"
                dense
                v-model="filter.codAs"
                name="descricao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'descricao'"
                dense
                v-model="filter.descricao"
                name="descricao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-btn v-if="item.name == 'acoes'" name="btnApagar" dense color="primary" @click="limparFiltro">
                Limpar Filtros
              </q-btn>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn name="btnEditar" dense color="primary" @click="editarAssunto(props.row)" icon="edit" round >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn name="btnApagar" dense color="negative" @click="showConfirmarExcluir(props.row)" icon="delete_forever" round >
              <q-tooltip>Apagar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar, date } from 'quasar'
import { api } from 'src/boot/axios'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const tableLivrosRef = ref()
const isLoading = ref(false)
const router = useRouter()
const listaLivros = ref([])
const filter = ref({
  codAs: '',
  descricao: '',
})
const pagination = ref({
  sortBy: 'descricao',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const columns = [
  {
    name: 'codAs',
    required: 'true',
    label: 'Código',
    align: 'left',
    field: row => row.codAs,
    sortable: true
  },
  {
    name: 'descricao',
    required: 'true',
    label: 'Descricao',
    align: 'left',
    field: row => row.descricao,
    sortable: true
  },
  {
    name: 'acoes',
    label: 'Ações',
    align: 'center'
  }
]

const handleListLivros = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  try {
    // api.get('sanctum/csrf-cookie')
    isLoading.value = true
    const { data: response } = await api.get('api/assuntos', {
      params: {
        page,
        size: rowsPerPage,
        sort_by: sortBy,
        order: descending ? 'desc' : 'asc',
        'codAs[like]': (props.filter.codAs ? props.filter.codAs + '%' : null),
        'descricao[like]': (props.filter.descricao ? props.filter.descricao + '%' : null),
      }
    })
    pagination.value.rowsNumber = response.meta.total
    pagination.value.page = response.meta.current_page
    pagination.value.rowsPerPage = response.meta.per_page
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
    listaLivros.value = response.data
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    $q.notify({
      type: 'negative',
      position: 'top',
      message: 'Aconteceu algum erro'
    })
  }
}

const listLivros = () => {
  tableLivrosRef.value.requestServerInteraction()
}

onMounted(() => {
  listLivros()
})

const limparFiltro = () => {
  filter.value.codAs = ''
  filter.value.descricao = ''
}

const editarAssunto = (assunto) => {
  router.push(`assuntos/editar/${assunto.codAs}`)
}

function showConfirmarExcluir(assunto) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Confirma a exclusão do Assunto: ${assunto.descricao}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    excluirAssunto(assunto)
  })
}

const excluirAssunto = (assunto) => {
  api.delete(`/api/assuntos/${assunto.codAs}`)
    .then((response) => {
      $q.notify({ type: 'positive', position: 'top', message: 'Assunto apagado com Sucesso' })
      tableLivrosRef.value.requestServerInteraction()
    })
    .catch(({ response }) => {
      $q.notify({ type: 'negative', position: 'top', message: 'Aconteceu algo errado' })
    })
}

</script>
