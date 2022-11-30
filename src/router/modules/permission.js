// 设置permission的路由规则
import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: ' ',
      // 这里的组件是employees的页面
      component: () => import('@/views/permission'),
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
