<template>
  <el-dialog :title="title" :visible="value" width="40%" @close="onClosed">
    <el-form ref="perFormRef" label-width="100px" :model="perForm" :rules="perFormRules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="perForm.name" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="perForm.code" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="perForm.description" />
      </el-form-item>
      <el-form-item label="开启">
        <!-- active-value	: switch 打开时的值 -->
        <!-- inactive-value : switch 关闭时的值 -->
        <el-switch
          v-model="perForm.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template>
      <el-row type="flex" justify="center">
        <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
        <el-button size="small" @click="onClosed">取消</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { addPermission, editPermission, getPermissionById } from '@/api/permission'

export default {
  name: 'PermDailog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      perForm: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      perFormRules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.perForm.id ? '编辑权限' : '新增权限'
    }
  },
  methods: {
    onClosed() {
      // 关闭之前清空表单和表单的验证
      this.$refs.perFormRef.resetFields()
      this.perForm = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.$emit('input', false)
    },
    async onConfirm() {
      // 点确定之前进行表单验证
      this.$refs.perFormRef.validate()
      try {
        //   有id是编辑，没有id是添加
        if (this.perForm.id) {
          await editPermission(this.perForm)
          this.$message.success('编辑权限成功')
        } else {
          await addPermission({ ...this.perForm, pid: this.id, type: this.type })
          this.$message.success('添加权限成功')
        }
        this.$emit('update-list')
        this.onClosed()
      } catch (error) {
        if (!error) {
          this.$message.warning('校验未通过，请检查')
        }
      }
    },
    async getDetail(id) {
      this.perForm = await getPermissionById(id)
    }
  }
}
</script>

<style>

</style>
