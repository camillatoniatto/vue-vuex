import Vue from 'vue'
import Vuex from 'vuex'

import contadorModule from '@/store/modules/contador'
// import tarefasModule from '@/store/modules/tarefas'

Vue.use(Vuex)

const state = {
    usuario: 'Cleiton'
}

const getters = {
    mensagemBoasVindas: state => `Olá ${state.usuario}`
}

const actions = {
    logar: ({ commit }, usuario) => {
        commit('logar', usuario)
    }
}

const mutations = {
    logar: (state, usuario) => {
        state.usuario = usuario
    }
}

const modules = {
    contador: contadorModule,
    // tarefas: tarefasModule
}

export default new Vuex.Store({
    // strict: true,
    state,
    getters,
    actions,
    mutations,
    modules,
})
