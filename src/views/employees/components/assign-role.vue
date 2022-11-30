<template>
  <el-dialog title="分配角色" :visible="isShowRoleDialog" @close="onClosed">
    <el-checkbox-group v-model="roleIds">
      <!-- v-model="roleIds" 与用户现有roleIds绑定(回显)-->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="onClosed">取消</el-button>
        <el-button size="small" type="primary" @click="onConfirm">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { getAllRoleList, assginRole } from '@/api/role'

export default {
  name: 'AssignRoleDialog',
  props: {
    isShowRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleList: [],
      roleIds: []
    }
  },
  mounted() {
    this.loadAllRoleList()
  },
  methods: {
    onClosed() {
      this.$emit('update:isShowRoleDialog', false)
    },
    // 先获取所有的角色列表
    async loadAllRoleList() {
      const { rows } = await getAllRoleList()
      this.roleList = rows
    },
    // 根据id获取用户信息
    // 获取到数据以后需要渲染到弹窗，所以在子组件里请求
    async getRoleDetailById(id) {
      // 将获取到的用户现有角色赋值给roleIds
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds || []
    },
    async onConfirm() {
      try {
        // roleIds就是勾选的选项
        await assginRole({ id: this.userId, roleIds: this.roleIds })
        this.$message.success('分配角色成功')
        this.onClosed()
      } catch (error) {
        this.$message.warning('分配角色失败')
      }
    }
  }
}
</script>

<style>

</style>
