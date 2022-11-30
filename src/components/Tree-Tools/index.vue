<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width:100%">
    <!-- 左侧的内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧的内容 -->
    <el-col :span="12">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TreeTool',
  props: {
    treeNode: {
      type: Object,
      default: () => {}
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'add':
          this.$emit('add-dept', this.treeNode.id)
          break
        case 'edit':
          this.$emit('edit-dept', this.treeNode.id)
          break
        case 'delete':
          // 删除部门，通知父组件
          this.$emit('del-dept', this.treeNode.id)
          break
      }
    }
  }
}
</script>

<style>

</style>
