// 设置attendances的路由规则
import Layout from '@/layout'

export default {
  path: '/attendances',
  name: 'attendances',
  component: Layout,
  children: [
    {
      path: ' ',
      // 这里的组件是employees的页面
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤',
        icon: 'skill'
      }
    }
  ]
}
