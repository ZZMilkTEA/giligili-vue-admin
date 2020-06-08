import Vue from 'vue';
import Router from 'vue-router';
import Login from "@/views/Login";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component:Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      beforeEnter:(to,from,next) => {
        let token = localStorage.getItem('token')
        if (to.matched.some(item => item.meta.requireAuth) && (!token)) {
          to.$notify.error({
            title: '获取登陆信息失败，返回登录页',
            message: 'login error',
          });
          next({
            path: '/',
            query: { redirect: to.path }
          })
        } else {
          next();
        }
      },
      component: () => import(/* webpackChunkName: "dashboard" */ './components/Dashboard'),
      children: [
        {
          path: 'appearance',
          name: 'Appearance',
          component: () => import(/* webpackChunkName: "appearance" */ './views/Appearance'),
        },
        {
          path: 'reviewList',
          name: 'ReviewList',
          component: () => import(/* webpackChunkName: "reviewLog" */ './views/ReviewList'),
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import(/* webpackChunkName: "user" */ './views/Users'),
        },
        {
          path: 'reviewList/videos/:id',
          name: 'ReviewVideo',
          component: () => import(/* webpackChunkName: "reviewLog" */ './views/ReviewVideo'),
        },
        {
          path: 'reviewList/audios/:id',
          name: 'ReviewAudio',
          component: () => import(/* webpackChunkName: "reviewLog" */ './views/ReviewAudio'),
        },
        {
          path: 'reportList',
          name: 'ReportList',
          component: () => import(/* webpackChunkName: "report" */ './views/ReportList'),
        },
        {
          path: 'logList',
          name: 'LogList',
          component: () => import(/* webpackChunkName: "report" */ './views/LogList'),
        },
      ],
    },
  ],
});

// router.beforeEach((to,from,next) => {
//   let token = localStorage.getItem('token')
//   if (to.matched.some(item => item.meta.requiresAuth) && (!token)) {
//     next({
//       path: '/',
//       query: { redirect: to.path }
//     })
//   } else {
//     next();
//   }
// });
export default router;
