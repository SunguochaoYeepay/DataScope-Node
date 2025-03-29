import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/datasource',
    name: 'DataSource',
    component: () => import('../views/datasource/DataSourceView.vue')
  },
  {
    path: '/query',
    name: 'QueryModule',
    children: [
      {
        path: '',
        name: 'QueryList',
        component: () => import('../views/query/QueryList.vue')
      },
      {
        path: 'editor',
        name: 'QueryEditor',
        component: () => import('../views/query/QueryEditor.vue')
      },
      {
        path: 'history',
        name: 'QueryHistory',
        component: () => import('../views/query/QueryHistory.vue')
      },
      {
        path: 'analytics/:id',
        name: 'QueryAnalytics',
        component: () => import('../views/query/QueryAnalytics.vue')
      },
      {
        path: 'detail/:id',
        name: 'QueryDetail',
        component: () => import('../views/query/QueryDetail.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings/SettingsView.vue')
  },
  {
    path: '/integration',
    name: 'IntegrationModule',
    children: [
      {
        path: '',
        name: 'IntegrationList',
        component: () => import('../views/integration/IntegrationList.vue')
      },
      {
        path: 'create',
        name: 'IntegrationCreate',
        component: () => import('../views/integration/FullIntegrationEdit.vue')
      },
      {
        path: 'edit/:id',
        name: 'IntegrationEdit',
        component: () => import('../views/integration/FullIntegrationEdit.vue')
      },
      {
        path: 'simple/create',
        name: 'SimpleIntegrationCreate',
        redirect: '/integration/create'
      },
      {
        path: 'simple/edit/:id',
        name: 'SimpleIntegrationEdit',
        redirect: to => ({ path: `/integration/edit/${to.params.id}` })
      },
      {
        path: 'preview/:id',
        name: 'IntegrationPreview',
        component: () => import('../views/integration/IntegrationPreview.vue')
      },
      {
        path: 'preview/:id/:type',
        name: 'IntegrationPreviewWithType',
        component: () => import('../views/integration/IntegrationPreview.vue')
      },
      {
        path: 'minimal',
        name: 'MinimalPage',
        component: () => import('../views/integration/MinimalPage.vue')
      }
    ]
  },
  {
    path: '/examples',
    name: 'Examples',
    children: [
      {
        path: '',
        name: 'ExamplesIndex',
        component: () => import('../views/examples/ExamplesIndex.vue')
      },
      {
        path: 'table',
        name: 'TableExample',
        component: () => import('../views/examples/TableExample.vue')
      },
      {
        path: 'form',
        name: 'FormExample',
        component: () => import('../views/examples/FormExample.vue')
      },
      {
        path: 'message',
        name: 'MessageExample',
        component: () => import('../views/examples/MessageExample.vue')
      },
      {
        path: 'loading',
        name: 'LoadingExample',
        component: () => import('../views/examples/LoadingExample.vue')
      },
      {
        path: 'modal',
        name: 'ModalExample',
        component: () => import('../views/examples/ModalExample.vue')
      },
      {
        path: 'test',
        name: 'TestView',
        component: () => import('../views/examples/TestView.vue')
      }
    ]
  },
  // 捕获所有未匹配的路由并重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router