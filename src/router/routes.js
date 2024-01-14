
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'autores', name: 'autores', component: () => import('pages/Autores/AutoresIndex.vue') },
      { path: 'autores/novo', name: 'autores-new', component: () => import('pages/Autores/AutoresNewUpdate.vue') },
      { path: 'autores/editar/:codAu', name: 'autores-update', component: () => import('pages/Autores/AutoresNewUpdate.vue') },
      { path: 'assuntos', name: 'assuntos', component: () => import('pages/Assuntos/AsPageIndex.vue') },
      { path: 'assuntos/novo', name: 'assuntos-new', component: () => import('pages/Assuntos/AssuntosNewUpdate.vue') },
      { path: 'assuntos/editar/:codAs', name: 'assuntos-update', component: () => import('pages/Assuntos/AssuntosNewUpdate.vue') },
      { path: 'livros', name: 'livros', component: () => import('pages/Livros/LivrosPageIndex.vue') },
      { path: 'livros/novo', name: 'livros-new', component: () => import('src/pages/Livros/LivrosNovoUpdate.vue') },
      { path: 'livros/editar/:codL', name: 'livros-update', component: () => import('pages/Livros/LivrosNovoUpdate.vue') },
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
