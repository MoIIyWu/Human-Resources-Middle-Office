// 设置salarys的路由规则
import Layout from '@/layout'

export default {
  path: '/salarys',
  name: 'salarys',
  component: Layout,
  children: [
    {
      path: ' ',
      // 这里的组件是employees的页面
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资',
        icon: 'money'
      }
    }
  ]
}
