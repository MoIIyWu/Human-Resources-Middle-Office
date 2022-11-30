<template>
  <!-- <el-dialog title="新增员工" :visible="isVisible" width="50%" @close="onClosed"> -->
  <el-dialog title="新增员工" :visible="value" width="50%" @close="onClosed">
    <el-form ref="employeeFormRef" :model="employeeForm" :rules="employeeFormRules" label-width="100px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="employeeForm.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="employeeForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="employeeForm.timeOfEntry" type="date" placeholder="选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="employeeForm.formOfEmployment" placeholder="请输入聘用形式">
          <el-option v-for="hire in hireType" :key="hire.id" :label="hire.value" :value="hire.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="employeeForm.workNumber" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- options : 用来指定数据源 -->
        <el-cascader
          v-model="deptName"
          placeholder="请选择部门"
          :options="depts"
          :props="{ value:'name', label:'name', checkStrictly:true }"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="employeeForm.correctionTime" type="date" placeholder="选择日期" style="width: 100%;" />
      </el-form-item>
    </el-form>
    <template v-slot:footer class="dialog-footer">
      <el-button size="small" @click="onClosed">取 消</el-button>
      <el-button type="primary" size="small" @click="onConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartment } from '@/api/deps'
import { List2Tree } from '@/utils/index'
import employeeHireType from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'

export default {
  name: 'EmployeeDialog',
  props: {
    // isVisible: {
    //   type: Boolean,
    //   default: false
    // }
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      employeeForm: {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      },
      employeeFormRules: {
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间不能为空', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ]
      },
      depts: [],
      deptName: [], // 选择后的值
      hireType: employeeHireType.hireType
    }
  },
  mounted() {
    this.loadDepartment()
  },
  methods: {
    handleChange(value) {
      // console.log(value)
      this.employeeForm.departmentName = value[value.length - 1]
    },
    async loadDepartment() {
      const res = await getDepartment()
      // console.log(res)
      this.depts = List2Tree(res.depts, '')
    },
    onClosed() {
      this.depts = []
      // resetFields : 对整个表单进行重置，包括表单的验证
      // resetField ： 对表单里的某一项进行重置，包括校验规则
      this.$refs.employeeFormRef.resetFields()
      // this.$emit('update:isVisible', false)
      this.$emit('input', false)
    },
    async onConfirm() {
      try {
        this.$refs.employeeFormRef.validate()
        await addEmployee(this.employeeForm)
        this.$message.success('添加员工成功')
        this.onClosed()
        this.$emit('update-list')
      } catch (error) {
        console.log('添加员工失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
  .el-date-editor.el-input, .el-select, .el-cascader{
    width: 100%;
}
}
</style>
