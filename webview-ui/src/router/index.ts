import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'DataScope - 首页'
    }
  },
  {
    path: '/datasource',
    name: 'datasource-list',
    component: () => import('@/views/datasource/DataSourceView.vue'),
    meta: {
      title: '数据源管理'
    }
  },
  {
    path: '/datasource/create',
    name: 'datasource-create',
    component: () => import('@/views/datasource/DataSourceView.vue'),
    meta: {
      title: '创建数据源'
    }
  },
  {
    path: '/datasource/:id',
    name: 'datasource-detail',
    component: () => import('@/views/datasource/DataSourceView.vue'),
    meta: {
      title: '数据源详情'
    }
  },
  {
    path: '/datasource/edit/:id',
    name: 'datasource-edit',
    component: () => import('@/views/datasource/DataSourceView.vue'),
    meta: {
      title: '编辑数据源'
    }
  },
  {
    path: '/datasource/search',
    name: 'datasource-search',
    component: () => import('@/views/datasource/DataSourceView.vue'),
    meta: {
      title: '高级搜索'
    }
  },
  {
    path: '/datasource/search/results',
    name: 'datasource-search-results',
    component: () => import('@/views/datasource/DataSourceView.vue'),
    meta: {
      title: '搜索结果'
    }
  },
  {
    path: '/query',
    name: 'QueryModule',
    component: () => import('@/layouts/QueryLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'QueryList' }
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
        path: 'favorites',
        name: 'QueryFavorites',
        component: () => import('../views/query/QueryFavoriteView.vue'),
        meta: {
          title: '收藏的查询'
        }
      },
      {
        path: 'list',
        name: 'QueryList',
        component: () => import('../views/query/QueryListView.vue'),
        meta: {
          title: '查询服务列表'
        }
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
      },
      {
        path: 'version/management/:id',
        name: 'VersionManagement',
        component: () => import('../views/query/version/VersionManagementView.vue'),
        meta: {
          title: '版本管理'
        }
      },
      {
        path: 'version/:id',
        name: 'QueryVersionDetail',
        component: () => import('../views/query/version/QueryDetailView.vue'),
        meta: {
          title: '查询版本详情'
        }
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