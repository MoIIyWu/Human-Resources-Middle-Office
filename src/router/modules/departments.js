// 设置departments的路由规则
import Layout from '@/layout'

export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [
    {
      path: ' ',
      // 这里的组件是employees的页面
      component: () => import('@/views/departments'),
      meta: {
        title: '组织架构',
        icon: 'tree'
      }
    }
  ]
}
