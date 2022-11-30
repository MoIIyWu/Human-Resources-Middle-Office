<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部区域 -->
      <el-card class="tree-card">
        <!-- 用行布局 -->
        <tree-tools :tree-node="company" :is-root="true" />
        <!-- 树形结构 -->

        <el-tree
          v-loading="loading"
          :data="departs"
          :props="defaultProps"
          node-key="id"
          default-expand-all
        >
          <template v-slot="{ data }">
            <tree-tools :tree-node="data" @del-dept="onDelDept" @add-dept="onAddDept" @edit-dept="onEditDept" />
          </template>
        </el-tree>

        <!-- 新增部门的弹窗dialog -->
        <dep-dialog ref="deptDaiLogRef" :is-show.sync="isShow" :dept-id="deptId" @update-list="onUpdateList" />
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from '@/components/Tree-Tools'
import { getDepartment, delDepartmentById } from '@/api/deps'
import { List2Tree } from '@/utils/index'
import DepDialog from '@/views/departments/components/dep-dialog.vue'

export default {
  name: 'Departments',
  components: {
    TreeTools,
    DepDialog
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name' // 表示 从这个属性显示内容
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      isShow: false,
      deptId: '',
      loading: true
    }
  },
  mounted() {
    this.LoadDepList()
  },
  methods: {
    async LoadDepList() {
      const res = await getDepartment()
      // console.log(res)
      this.company.name = res.companyName
      this.departs = List2Tree(res.depts, '')
      this.loading = false
    },
    async onDelDept(deptId) {
      // console.log(deptId)
      try {
        // 拿到id后调用接口删除
        const result = await this.$confirm('你确定删除吗')
        if (result === 'confirm') {
          await delDepartmentById(deptId)
          this.LoadDepList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    onAddDept(deptId) {
      // 点击按钮的时候获取点击的部门的 id
      this.deptId = deptId
      this.isShow = true
    },
    onUpdateList() {
      this.LoadDepList()
    },
    async onEditDept(id) {
      this.deptId = id
      this.isShow = true
      // 在弹窗组件里调用查询部门详情的方法
      // 在父组件里用$refs属性调用里面定义好的方法
      this.$refs.deptDaiLogRef.getDeptInfo(id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size:14px;
}
</style>
