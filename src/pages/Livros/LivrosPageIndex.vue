<template>
  <q-page padding class="column">
    <div class="row items-center q-gutter-lg q-mb-lg">
      <span class="text-h4">Gerenciamento de Livros</span>
      <q-btn
        ref="adicionar"
        label="Novo"
        color="primary"
        @click="$router.push('/livros/novo')"
      />
      <q-btn
        :href="`${api.defaults.baseURL}api/livros/relatorio`"
        label="Relarório de Livros por autor"
        color="primary"
        download
      />
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
                v-if="item.name == 'codL'"
                dense
                v-model="filter.codL"
                name="codL"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'titulo'"
                dense
                v-model="filter.titulo"
                name="titulo"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'editora'"
                dense
                v-model="filter.editora"
                name="editora"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'edicao'"
                dense
                v-model="filter.edicao"
                name="edicao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'anoPublicacao'"
                dense
                v-model="filter.anoPublicacao"
                name="anoPublicacao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-btn
                v-if="item.name == 'acoes'"
                name="btnApagar"
                dense
                color="primary"
                @click="limparFiltro"
              >
                Limpar Filtros
              </q-btn>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              name="btnEditar"
              dense
              color="primary"
              @click="editarLivro(props.row)"
              icon="edit"
              round
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              name="btnApagar"
              dense
              color="negative"
              @click="showConfirmarExcluir(props.row)"
              icon="delete_forever"
              round
            >
              <q-tooltip>Apagar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar, date } from "quasar"
import { api } from "src/boot/axios"
import { onBeforeUnmount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
console.log(api.defaults.baseURL)
const $q = useQuasar()
const tableLivrosRef = ref()
const isLoading = ref(false)
const router = useRouter()
const listaLivros = ref([])
const filter = ref({
  codL: "",
  titulo: "",
  editora: "",
  edicao: "",
  anoPublicacao: "",
})
const pagination = ref({
  sortBy: "titulo",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const columns = [
  {
    name: "codL",
    required: "true",
    label: "Código",
    align: "left",
    field: (row) => row.codL,
    sortable: true,
  },
  {
    name: "titulo",
    required: "true",
    label: "Título",
    align: "left",
    field: (row) => row.titulo,
    sortable: true,
  },
  {
    name: "editora",
    required: "true",
    label: "Editora",
    align: "left",
    field: (row) => row.editora,
    sortable: true,
  },
  {
    name: "edicao",
    required: "true",
    label: "Edição",
    align: "left",
    field: (row) => row.edicao,
    sortable: true,
  },
  {
    name: "anoPublicacao",
    required: "true",
    label: "Ano de publicação",
    align: "left",
    field: (row) => row.anoPublicacao,
    sortable: true,
  },
  {
    name: "acoes",
    label: "Ações",
    align: "center",
  },
]

const handleListLivros = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  try {
    // api.get('sanctum/csrf-cookie')
    isLoading.value = true
    const { data: response } = await api.get("api/livros", {
      params: {
        page,
        size: rowsPerPage,
        sort_by: sortBy,
        order: descending ? "desc" : "asc",
        "codL[like]": props.filter.codL ? props.filter.codL + "%" : null,
        "titulo[like]": props.filter.titulo ? props.filter.titulo + "%" : null,
        "editora[like]": props.filter.editora ? props.filter.editora + "%" : null,
        "edicao[like]": props.filter.edicao ? props.filter.edicao + "%" : null,
        "anoPublicacao[like]": props.filter.anoPublicacao ? props.filter.anoPublicacao + "%" : null,
      },
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
      type: "negative",
      position: "top",
      message: "Aconteceu algum erro",
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
  filter.value.codL = ''
  filter.value.titulo = ''
  filter.value.editora = ''
  filter.value.edicao = ''
  filter.value.anoPublicacao = ''
}

const editarLivro = (livro) => {
  router.push(`livros/editar/${livro.codL}`)
}

function showConfirmarExcluir(livro) {
  $q.dialog({
    title: "Confirmar exclusão",
    message: `Confirma a exclusão do Livro: ${livro.titulo}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    excluirLivro(livro)
  })
}

const excluirLivro = (livro) => {
  api
    .delete(`/api/livros/${livro.codL}`)
    .then((response) => {
      $q.notify({
        type: "positive",
        position: "top",
        message: "Livro apagado com Sucesso",
      })
      tableLivrosRef.value.requestServerInteraction()
    })
    .catch(({ response }) => {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Aconteceu algo errado",
      })
    })
}
</script>
