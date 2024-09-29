import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './pages/Dashboard.vue'
import Users from './pages/Users.vue'
import Groups from './pages/Groups.vue'
import Devices from './pages/Devices.vue'
import AdministrativeUnits from './pages/AdministrativeUnits.vue'
import DirectoryRoles from './pages/DirectoryRoles.vue'
import Applications from './pages/Applications.vue'
import ServicePrincipals from './pages/ServicePrincipals.vue'
import ApplicationRoles from './pages/ApplicationRoles.vue'
import OAuth2Permissions from './pages/OAuth2Permissions.vue'
import RowDetail from './pages/RowDetail.vue'

const routerHistory = createWebHistory()

export const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    props: {name: 'Dashboard'}
  },
  {
    path: '/Users',
    name: 'Users',
    component: Users,
    props: {name: 'Users'}
  },
  {
    path: '/Groups',
    name: 'Groups',
    component: Groups,
    props: {name: 'Groups'}
  },
  {
    path: '/Devices',
    name: 'Devices',
    component: Devices,
    props: {name: 'Devices'}
  },
  {
    path: '/AdministrativeUnits',
    name: 'Administrative Units',
    component: AdministrativeUnits,
    props: {name: 'Administrative Units'}
  },
  {
    path: '/DirectoryRoles',
    name: 'Directory Roles',
    component: DirectoryRoles,
    props: {name: 'Directory Roles'}
  },
  {
    path: '/Applications',
    name: 'Applications',
    component: Applications,
    props: {name: 'Applications'}
  },
  {
    path: '/ServicePrincipals',
    name: 'Service Principals',
    component: ServicePrincipals,
    props: {name: 'ServicePrincipals'}
  },
  {
    path: '/ApplicationRoles',
    name: 'Application Roles',
    component: ApplicationRoles,
    props: {name: 'Application Roles'}
  },
  {
    path: '/OAuth2Permissions',
    name: 'Oauth2 Permissions',
    component: OAuth2Permissions,
    props: {name: 'OAuth2 Permissions'}
  },
  {
    path: '/:objectType/:objectId',
    name: 'RowDetail',
    component: RowDetail,
    hideNavbar: true,
  }
]

const router = createRouter({
  history: routerHistory,
  routes: routes
})

export default router
