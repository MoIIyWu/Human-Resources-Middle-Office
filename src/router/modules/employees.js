// 设置employees的路由规则
import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      // 这里的组件是employees的页面
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      path: 'detail/:userId',
      component: () => import('@/views/employees/components/detail'),
      hidden: true,
      props: true
    },
    // 新建打印的路由
    {
      path: 'print/:id',
      component: () => import('@/views/employees/components/print'),
      hidden: true
    }
  ]
}
