// 设置approvals的路由规则
import Layout from '@/layout'

export default {
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: ' ',
      // 这里的组件是employees的页面
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批',
        icon: 'tree-table'
      }
    }
  ]
}
