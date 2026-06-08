const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/IndexPage.vue'),
      },
      {
        path: 'pricing',
        name: 'pricing',
        component: () => import('src/pages/PricingPage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('src/pages/AboutPage.vue'),
      },
    ],
  },

  {
    path: '/auth',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'auth',
        component: () => import('src/pages/LoginPage.vue'),
      },
    ],
  },

  {
    path: '/wage-calculator',
    component: () => import('src/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('src/pages/DashboardPage.vue'),
      },
    ],
  },
  // ─── Admin Routes (requiresAuth + requiresAdmin) ───
  {
    path: '/admin',
    component: () => import('src/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: { name: 'admin-plans' },
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('src/pages/admin/AdminDashboardPage.vue'),
      },
      {
        path: 'plans',
        name: 'admin-plans',
        component: () => import('src/pages/admin/SubscriptionPlansPage.vue'),
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('src/pages/admin/AdminUsersPage.vue'),
      },
      {
        path: 'coupons',
        name: 'admin-coupons',
        component: () => import('src/pages/admin/AdminCouponsPage.vue'),
      },
      {
        path: 'analytics',
        name: 'admin-coupons-analytics',
        component: () => import('src/pages/admin/Couponanalyticspage.vue'),
      },
      {
        path: 'invoices',
        name: 'admin-invoices',
        component: () => import('src/pages/admin/AdminInvoicesPage.vue'),
      },
      {
        path: 'rules',
        name: 'admin-rules',
        component: () => import('src/pages/admin/AdminRulesPage.vue'),
      },
      {
        path: 'rule-groups',
        name: 'admin-rule-groups',
        component: () => import('src/pages/admin/AdminRuleGroupsPage.vue'),
      },
      {
        path: 'salary-restructuring',
        name: 'admin-salary-restructuring',
        component: () => import('src/pages/admin/SalaryRestructuringPage.vue'),
      },
      {
        path: 'state',
        name: 'admin-state',
        component: () => import('src/pages/admin/StatePage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/',
  },
]

export default routes
