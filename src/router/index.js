import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// user
import RegistryView from '../views/user/RegistryView.vue'
import LoginView from '@/views/user/LoginView.vue'
import ProfileView from '../views/user/ProfileView.vue'
import UserRegisterView from '../views/user/UserRegisterView.vue'

// squad 
import SquadsView from '../views/squad/SquadsView.vue'
import SquadView from '../views/squad/SquadView.vue'
import SquadCreateView from '../views/squad/CreateView.vue'
import SquadsListView from '../views/squad/SquadsListView.vue' // New import

import VolunteersView from '@/views/volunteer/VolunteersView.vue'
import VolunteerDetailsView from '@/views/volunteer/VolunteerDetailsView.vue'
import PublicProfileView from '@/views/volunteer/PublicProfileView.vue'
import RequestEditView from '@/views/volunteer/RequestEditView.vue'
import EditProfileView from '@/views/volunteer/EditProfileView.vue'

import { useAuthStore } from '@/stores/auth';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/u/:id',
      name: 'public-profile',
      component: PublicProfileView,
      meta: {
        auth: false
      }
    },
    {
      path: '/',
      name: 'registry',
      component: RegistryView
    },
    {
      path: '/register',
      name: 'user-register',
      component: UserRegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/volunteer/request-edit',
      name: 'request-edit',
      component: RequestEditView,
      meta: {
        auth: false
      }
    },
    {
      path: '/volunteer/edit/:token',
      name: 'edit-profile-token',
      component: EditProfileView,
      meta: {
        auth: false
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView, 
        meta : {
            auth: true
        }
    },
    {
      path: '/squads/:uuid',
      name: 'squads',
      component: SquadsView, 
        meta : {
            auth: true
        }

    },
    {
      path: '/squad/:uuid',
      name: 'squad-by-id',
      component: SquadView,
      props: true, 
        meta : {
            auth: true
        }

    },
    {
      path: '/squad/create',
      name: 'squad-create',
      component: SquadCreateView,
        meta : {
            auth: true,
            type: 'create'
        }
    },
    {
      path: '/squads', // New route for listing all squads
      name: 'squads-list',
      component: SquadsListView,
      meta: {
        auth: true
      }
    },
    {
      path: '/squad/:uuid/update',
      name: 'squad-update',
      component: SquadCreateView,
        meta : {
            auth: true,
            type: 'update'
        }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
        meta : {
            auth: true
        }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/user/SearchView.vue'),
        meta : {
            auth: false 
        }
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: VolunteersView,
        meta : {
            auth: true
        }
    },
    {
      path: '/volunteers/:id', // New route for volunteer details
      name: 'volunteer-details',
      component: VolunteerDetailsView,
      props: true,
        meta: {
            auth: true
        }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    const auth = useAuthStore();

    if (to.meta.auth === true && (token === '' || token === null)) {
        router.push({ name: 'login' })
    } 

    if (auth.auth.name === '') {
        auth.loginByToken()
    }

    return next()
});

export default router
