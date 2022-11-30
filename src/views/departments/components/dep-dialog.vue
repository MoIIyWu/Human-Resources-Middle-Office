<template>
  <el-dialog
    ref=""
    :title="`${title}部门`"
    width="40%"
    :visible="isShow"
    :before-close="onClose"
  >
    <el-form ref="deptFormRef" :model="deptForm" :rules="deptFormRules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptForm.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="deptForm.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="deptForm.manager" placeholder="请选择部门负责人" @focus="onFocus">
          <el-option v-for="item in simpleList" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="deptForm.introduce" type="textarea" />
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getSimpleList, getDepartment, addDepartment, getDeptInfoById, editDeptsById } from '@/api/deps'
export default {
  name: 'DepDialog',
  props: {
    isShow: Boolean,
    deptId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    const checkDeptName = async(rule, value, callback) => {
      // console.log(this.deptId)
      // 在触发表单失焦事件的时候，获取所有部门
      const { depts } = await getDepartment()
      // 去找点击时这个部门的所有子部门
      // 然后拿输入的值和部门下的名字比较，看有没有一样的
      // console.log(depts.filter(depts => this.deptId === depts.pid))
      // console.log(value)

      // todo: 表单验证的时候判断 是编辑还是新增
      // if 'edit':this.deptForm.id has value, if 'add', this.deptForm.id donnot have vulue
      // console.log(this.deptForm.id)
      let isRepeat
      if (this.deptForm.id) {
        // console.log(depts.filter(dept => dept.pid === this.deptForm.pid && dept.id !== this.deptForm.id))
        isRepeat = depts.filter(dept => dept.pid === this.deptForm.pid && dept.id !== this.deptForm.id)
          .some(item => item.name === value)
      } else {
        isRepeat = depts.filter(depts => this.deptId === depts.pid).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`已经有${value}了`)) : callback()
    }
    const checkDeptCode = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      // console.log(depts)
      let isRepeat
      if (this.deptForm.id) {
        // console.log(depts.filter(dept => dept.id !== this.deptForm.id))
        isRepeat = depts.filter(dept => dept.id !== this.deptForm.id).some(item => item.code === value)
      } else {
        isRepeat = depts.some(depts => depts.code === value)
      }
      isRepeat ? callback(new Error(`已经有${value}了`)) : callback()
    }
    return {
      deptForm: {
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: ''
      },
      simpleList: [],
      deptFormRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          // 自定义校验规则
          { validator: checkDeptName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkDeptCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择部门负责人', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 200, message: '部门介绍要求1-200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.deptForm.id ? '编辑' : '新增'
    }
  },
  methods: {
    async onFocus() {
      // 在聚焦的时候获取员工的信息
      const result = await getSimpleList()
      this.simpleList = result
    },
    async onConfirm() {
      // todo: 点确定的时候要判断是 编辑 还是 新增
      try {
        if (this.deptForm.id) {
          // 走编辑的请求
          await this.$refs.deptFormRef.validate()
          await editDeptsById(this.deptForm)
        } else {
          // 验证整个表单的信息
          // console.log(this.$refs.deptFormRef)
          await this.$refs.deptFormRef.validate()
          // 将点击时部门的id给即将要添加的部门的pid
          this.deptForm.pid = this.deptId
          // 调用接口,将整个表单数据填进去
          addDepartment(this.deptForm)
        }
        // 提示用户操作成功
        this.$message.success(`${this.deptForm.id ? '编辑' : '新增'}部门成功`)
        // 添加成功后关闭dialog
        this.$emit('update:isShow', false)
        // 刷新列表
        this.$emit('update-list')
      } catch (error) {
        console.log('验证不通过')
      }
    },
    onClose() {
      // 手动清空表单
      this.deptForm = {
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: ''
      }
      // 关闭表单后清空内容,然后关闭弹窗
      this.$refs.deptFormRef.resetFields()
      this.$emit('update:isShow', false)
    },
    // 定义根据id查询部门信息的方法
    async getDeptInfo(id) {
      this.deptForm = await getDeptInfoById(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-select{
    width: 100%;
  }
}
</style>
