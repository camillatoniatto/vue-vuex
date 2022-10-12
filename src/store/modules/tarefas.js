import apiClient from '@/services/api'

const CRIAR_TAREFA = 'CRIAR_TAREFA'
const EDITAR_TAREFA = 'EDITAR_TAREFA'
const DELETAR_TAREFA = 'DELETAR_TAREFA'
const LISTAR_TAREFAS = 'LISTAR_TAREFAS'
const SELECIONAR_TAREFA = 'SELECIONAR_TAREFA'
const SETAR_ERRO = 'SETAR_ERRO'

const state = {
    erro: undefined,
    tarefas: [],
    tarefaSelecionada: undefined
}

const services = {
    getTarefas() {
        return apiClient.get('/tarefas')
    },
    getTarefa(id) {
        return apiClient.get(`tarefas/${id}`)
    },
    postTarefa(tarefa) {
        return apiClient.post(`tarefas`, tarefa)
    },
    putTarefa(tarefa) {
        return apiClient.put(`tarefas/${tarefa.id}`, tarefa)
    },
    deleteTarefa(id) {
        return apiClient.delete(`tarefas/${id}`)
    }
}

const getters = {
    tarefasConcluidas: (state) => state.tarefas.filter(t => t.concluido),
    tarefasAFazer: state => state.tarefas.filter(t => !t.concluido),
    totalTarefasConcluidas: (state, getters) => getters.tarefasConcluidas.length,
    buscarTarefaPorId: state => id => state.tarefas.find(t => t.id === id),
    boasVindas: (state, getters, rootState, rootGetters) => rootGetters.mensagemBoasVindas
}

const mutations = {
    [CRIAR_TAREFA]: (state, {tarefa}) => {
        state.tarefas.push(tarefa)
    },
    [LISTAR_TAREFAS]: (state, {tarefas}) => {
        state.tarefas = tarefas
    },
    [EDITAR_TAREFA]: (state, {tarefa}) => {
        const indice = state.tarefas.findIndex(t => t.id === tarefa.id)
        state.tarefas.splice(indice, 1, tarefa)
    },
    [DELETAR_TAREFA]: (state, {tarefa}) => {
        const indice = state.tarefas.findIndex(t => t.id === tarefa.id)
        state.tarefas.splice(indice, 1, tarefa)
    },
    [SELECIONAR_TAREFA]: (state, {tarefa}) => {
        state.tarefaSelecionada = tarefa
    },
    [SETAR_ERRO]: (state, {erro}) => {
        state.erro = erro
    }
}

const actions = {
    concluirTarefa: async ({dispatch}, payload) => {
        const tarefa = Object.assign({}, payload.tarefa)
        tarefa.concluido = !tarefa.concluido
        dispatch('editarTarefa', { tarefa: tarefa })
    },
    criarTarefa: ({commit}, {tarefa}) => {
        return services.postTarefa(tarefa)
        .then(response => commit(CRIAR_TAREFA, { tarefa: response.data }))
        .catch(erro => commit(SETAR_ERRO, {erro: erro}))
    },
    listarTarefas: async ({commit}) => {
        try {
            const response = await services.getTarefas()
            commit(LISTAR_TAREFAS, { tarefas: response.data })
        } catch(erro){
            commit(SETAR_ERRO, {erro: erro})
        }

    },
    editarTarefa: async ({commit}, {tarefa}) => {
        const response = await services.putTarefa(tarefa)
        commit(EDITAR_TAREFA, { tarefa: response.data })
    },
    deletarTarefa: async ({commit}, {tarefa}) => {
        const response = await services.deleteTarefa(tarefa)
        commit(DELETAR_TAREFA, { tarefa: response.data })
    },
    selecionarTarefa: ({commit}, payload) => {
        commit(SELECIONAR_TAREFA, payload)
    },
    resetarTarefaSelecionada: ({commit}) => {
        commit(SELECIONAR_TAREFA, {tarefa: undefined})
    },
        // // commit('logar') //tarefas/logar (não funciona)
        // // commit('logar', 'Cleiton o Gatuno', { root: true }) //logar
        // dispatch('logar', 'Cleiton o Gatuno', { root: true }) //logar
        // // dispatch('logar', null, { root: true }) // caso n tiver payload
}

const tarefasModule = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

const MODULE_NAME = 'tarefas'
export default (rootStore) => {
    if(!(MODULE_NAME in rootStore._modules.root._children)){
        rootStore.registerModule(MODULE_NAME, tarefasModule)
    }
}