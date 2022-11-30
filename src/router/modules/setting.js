// 设置setting的路由规则
import Layout from '@/layout'

export default {
  path: '/setting',
  name: 'settings',
  component: Layout,
  children: [
    {
      path: ' ',
      // 这里的组件是employees的页面
      component: () => import('@/views/setting'),
      meta: {
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
