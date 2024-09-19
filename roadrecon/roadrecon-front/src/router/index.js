import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Users from '../views/Users.vue'
import Groups from '../views/Groups.vue'
import Devices from '../views/Devices.vue'
import AdministrativeUnits from '../views/AdministrativeUnits.vue'
import DirectoryRoles from '../views/DirectoryRoles.vue'
import Applications from '../views/Applications.vue'
import ServicePrincipals from '../views/ServicePrincipals.vue'
import ApplicationRoles from '../views/ApplicationRoles.vue'
import OAuth2Permissions from '../views/OAuth2Permissions.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/Users',
      name: 'users',
      component: Users
    },
    {
      path: '/Groups',
      name: 'groups',
      component: Groups
    },
    {
      path: '/Devices',
      name: 'devices',
      component: Devices
    },
    {
      path: '/AdministrativeUnits',
      name: 'administrativeunits',
      component: AdministrativeUnits
    },
    {
      path: '/DirectoryRoles',
      name: 'directoryroles',
      component: DirectoryRoles
    },
    {
      path: '/Applications',
      name: 'applications',
      component: Applications
    },
    {
      path: '/ServicePrincipals',
      name: 'serviceprincipals',
      component: ServicePrincipals
    },
    {
      path: '/ApplicationRoles',
      name: 'applicationroles',
      component: ApplicationRoles
    },
    {
      path: '/OAuth2Permissions',
      name: 'oauth2permissions',
      component: OAuth2Permissions
    }
  ]
})

export default router
