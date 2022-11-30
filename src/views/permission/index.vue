<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template v-slot:right>
          <el-button type="primary" size="small" @click="addPerm(1, '0')">添加权限</el-button>
        </template>
      </PageTools>
      <el-card>
        <el-table border stripe :data="permList" row-key="id" default-expand-all>
          <el-table-column label="名称" align="center" prop="name" width="150px" />
          <el-table-column label="标识" align="center" prop="code" />
          <el-table-column label="描述" align="center" prop="description" />
          <el-table-column label="操作" align="center" width="250px">
            <template v-slot="{ row }">
              <!-- 如果是type = 1 的，就是一级部门，就需要显示添加按钮 -->
              <!-- row.type === 1 ：true，显示 -->
              <!-- <pre>{{ row }}</pre> -->
              <el-button v-if="row.type === 1" type="primary" size="small" @click="addPerm(1, row.id)">添加</el-button>
              <el-button type="warning" size="small" @click="onEdit(row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 添加权限弹窗 -->
    <PermDailog :id="id" ref="permDailogRef" v-model="isVisible" :type="type" @update-list="loadPermission" />
  </div>
</template>

<script>
import { getAllpermission, delPermission } from '@/api/permission'
import { List2Tree } from '@/utils/index'
import PermDailog from './components/perm-dailog.vue'

export default {
  name: 'PermissionPage',
  components: {
    PermDailog
  },
  data() {
    return {
      permList: [],
      isVisible: false,
      type: 1,
      id: ''
    }
  },
  mounted() {
    this.loadPermission()
  },
  methods: {
    async loadPermission() {
      const list = await getAllpermission()
      this.permList = List2Tree(list, '0')
    },
    async onDelete(id) {
      try {
        const res = await this.$confirm('你确定要删除吗')
        if (res === 'confirm') {
          await delPermission(id)
          this.$message.success('删除成功')
          this.loadPermission()
        }
      } catch (error) {
        this.$message.warning('你取消了删除')
      }
    },
    // 里面传入两个参数，type和id
    // type如果是1的话，就是一级部门，pid为'0'
    // type如果是2的话，就是二级部门，pid为它父级部门的id
    // 后端接口需要的是pid
    addPerm(type, id) {
      this.type = type
      this.id = id
      this.isVisible = true
    },
    onEdit(id) {
      this.$refs.permDailogRef.getDetail(id)
      this.isVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card{
  margin-top: 20px;
}
</style>
