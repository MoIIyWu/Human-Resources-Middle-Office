// 设置social的路由规则
import Layout from '@/layout'

export default {
  path: '/social',
  name: 'social_securitys',
  component: Layout,
  children: [
    {
      path: ' ',
      // 这里的组件是employees的页面
      component: () => import('@/views/social'),
      meta: {
        title: '社保',
        icon: 'table'
      }
    }
  ]
}
