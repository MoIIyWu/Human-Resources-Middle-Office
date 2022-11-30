<template>
  <el-card>
    <el-tabs type="border-card">
      <el-tab-pane label="登录账户设置">
        <el-form ref="uerInfoRef" :model="uerInfo" label-width="80px" :rules="uerInfoRules">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="uerInfo.username" placeholder="请设置用户姓名" />
          </el-form-item>
          <el-form-item label="密码" prop="psd">
            <el-input v-model="uerInfo.psd" placeholder="请设置用户密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSaveUserInfo">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人信息">
        <component :is="userInfo" />
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <component :is="jobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById, saveUserInfo } from '@/api/user'
import userInfo from './user-info.vue'
import jobInfo from './job-info.vue'

export default {
  name: 'DetailPage',
  components: {
    userInfo,
    jobInfo
  },
  data() {
    return {
      userId: this.$route.params.userId,
      uerInfo: {
        username: '',
        psd: ''
      },
      userInfo,
      jobInfo,
      uerInfoRules: {
        username: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        psd: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.uerInfo = await getUserDetailById(this.userId)
    },
    async onSaveUserInfo() {
      try {
        const baseUserInfo = { ...this.uerInfo, password: this.uerInfo.psd }
        await this.$refs.uerInfoRef.validate()
        await saveUserInfo(baseUserInfo)
        this.$message.success('更新成功')
      } catch (error) {
        console.log('更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}
</style>
