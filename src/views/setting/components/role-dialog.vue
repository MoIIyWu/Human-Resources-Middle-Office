<template>
  <el-dialog :title="`${title}角色`" width="40%" :visible="isvisible" @close="onClosed">
    <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="roleForm.description" placeholder="请输入角色描述" />
      </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <template v-slot:footer class="dialog-footer">
      <el-button size="small" @click="onClosed">取 消</el-button>
      <el-button type="primary" size="small" @click="onConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addRole, getRoleDetail, editRole } from '@/api/role'
export default {
  name: 'RoleDialog',
  props: {
    isvisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      roleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '编辑' : '添加'
    }
  },
  methods: {
    onClosed() {
      //   点击关闭的时候表单的值清空
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleFormRef.resetFields()
      // 通知父组件关闭弹窗
      this.$emit('update:isvisible', false)
    },
    async onConfirm() {
      try {
        if (this.roleForm.id) {
          await this.$refs.roleFormRef.validate()
          await editRole(this.roleForm)
        } else {
          // 点 确定 的时候验证表单
          await this.$refs.roleFormRef.validate()
          await addRole(this.roleForm)
        }
        this.$message.success(`${this.roleForm.id ? '编辑' : '添加'}角色成功`)
        // 通知父组件关闭弹窗(表单的值清空)并且刷新列表
        this.onClosed()
        this.$emit('update-list')
      } catch (error) {
        this.$message.warning('校验不通过')
      }
    },
    async getRoleDetail(id) {
      // 将请求来的数据回显到表单
      this.roleForm = await getRoleDetail(id)
    }
  }
}
</script>

<style>

</style>
