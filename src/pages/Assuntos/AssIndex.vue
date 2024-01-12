<template>
  <q-page padding class="column">
    <div>
      <p class="text-h4">Gerenciamento de Assuntos</p>
    </div>
    <div class="column col-xs-12 col-sm bg-grey-3">
      <q-table
        :rows="listaAtendimentosTriagem"
        :columns="columns"
        row-key="id"
        ref="tableEmTriagemRef"
        :loading="isLoading"
        no-data-label="Nenhum registro encontrado"
        no-results-label="Nenhum registro encontrado"
        @request="handleListEmtriagem"
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
                v-if="item.name == 'numero_ocorrencia'"
                dense
                v-model="filter.numeroOcorrencia"
                name="descricao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'solicitante'"
                dense
                v-model="filter.solicitante"
                name="descricao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'telefone'"
                dense
                v-model="filter.telefone"
                name="descricao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'nome_paciente'"
                dense
                v-model="filter.nomePaciente"
                name="descricao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'bairro_descricao'"
                dense
                v-model="filter.bairroDescricao"
                name="bairro_descricao"
                filled
                debounce="800"
                autocomplete="off"
              />
              <q-input
                v-if="item.name == 'local_atendimento'"
                dense
                v-model="filter.localAtendimento"
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

        <template #body="props">
          <q-tr :props="props">
            <q-td class="cursor-pointer" :style="colunas.style" v-for="colunas in props.cols" :key="colunas.name" @click="redirecionarRegulacao(props.row.id)">
              {{ colunas.value }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body-cell-solicitante="props">
          <q-td :props="props">
            <div>
              <router-link :to="`/atendimentos/regulacao-medica/${props.row.id}`" replace>{{ props.value }}</router-link>
            </div>
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
const tableEmTriagemRef = ref()
const isLoading = ref(false)
const router = useRouter()
const listaAtendimentosTriagem = ref([])
const filter = ref({
  numeroOcorrencia: '',
  solicitante: '',
  telefone: '',
  nomePaciente: '',
  bairroDescricao: '',
  localAtendimento: ''
})
const pagination = ref({
  sortBy: 'hora_abertura',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const columns = [
  {
    name: 'codigo',
    required: 'true',
    label: 'Código',
    align: 'left',
    field: row => row.numero_ocorrencia,
    sortable: true
  },
  {
    name: 'hora_abertura',
    required: 'true',
    label: 'Hora da abertura',
    align: 'left',
    field: row => row.hora_abertura,
    format: val => date.formatDate(val, 'DD-MM-YYYY HH:mm'),
    sortable: true
  },
  {
    name: 'solicitante',
    required: 'true',
    label: 'Solicitante',
    align: 'left',
    field: row => row.solicitante,
    sortable: true
  },
  {
    name: 'telefone',
    required: 'true',
    label: 'Telefone',
    align: 'left',
    field: row => row.telefone,
    sortable: true
  },
  {
    name: 'nome_paciente',
    required: 'true',
    label: 'Paciente',
    align: 'left',
    field: row => row.nome_paciente,
    sortable: true
  },
  {
    name: 'idade_paciente',
    required: 'true',
    label: 'Idade do paciente',
    align: 'left',
    field: row => row.idade_paciente,
    sortable: true
  },
  {
    name: 'bairro_descricao',
    required: 'true',
    label: 'Bairro',
    align: 'left',
    field: row => row?.bairro?.descricao,
    sortable: true
  },
  {
    name: 'local_atendimento',
    required: 'true',
    label: 'Local',
    align: 'left',
    field: row => row.local_atendimento,
    sortable: true
  }
]

const handleListEmtriagem = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  try {
    // api.get('sanctum/csrf-cookie')
    isLoading.value = true
    const { data: response } = await api.get('api/em-triagem', {
      params: {
        page,
        size: rowsPerPage,
        sort_by: sortBy,
        order: descending ? 'desc' : 'asc',
        'numero_ocorrencia[like]': (props.filter.numeroOcorrencia ? props.filter.numeroOcorrencia + '%' : null),
        'solicitante[like]': (props.filter.solicitante ? props.filter.solicitante + '%' : null),
        'telefone[like]': (props.filter.telefone ? props.filter.telefone + '%' : null),
        'nome_paciente[like]': (props.filter.nomePaciente ? props.filter.nomePaciente + '%' : null),
        'bairro_descricao[like]': (props.filter.bairroDescricao ? props.filter.bairroDescricao + '%' : null),
        'local_atendimento[like]': (props.filter.localAtendimento ? props.filter.localAtendimento + '%' : null)
      }
    })
    pagination.value.rowsNumber = response.meta.total
    pagination.value.page = response.meta.current_page
    pagination.value.rowsPerPage = response.meta.per_page
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending

    listaAtendimentosTriagem.value = response.data
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

const listEmTriagem = () => {
  tableEmTriagemRef.value.requestServerInteraction()
}

onMounted(() => {
  listEmTriagem()
})

const intervalId = setInterval(listEmTriagem, 30 * 1000)

const redirecionarRegulacao = (id) => {
  router.replace(`/atendimentos/regulacao-medica/${id}`)
}

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

</script>
