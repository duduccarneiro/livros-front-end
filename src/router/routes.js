
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'assuntos', name: 'assuntos', component: () => import('pages/Assuntos/AssIndex.vue') },
      { path: 'autores', name: 'autores', component: () => import('pages/Autores/AutoresIndex.vue') },
      { path: 'autores/editar/:codAu', name: 'autores-update', component: () => import('pages/Autores/AutoresNewUpdate.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
