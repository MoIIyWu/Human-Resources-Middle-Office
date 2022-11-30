<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabToggle">
        <el-tab-pane label="角色管理" name="role">
          <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table border stripe :data="roleList">
            <el-table-column label="序号" align="center" type="index" width="80" />
            <el-table-column label="角色" align="center" prop="name" />
            <el-table-column label="描述" align="center" prop="description" />
            <el-table-column label="操作" align="center" width="280">
              <template v-slot="{ row }">
                <!-- <pre>{{ row }}</pre> -->
                <el-button size="small" type="success" @click="onAssginPerm(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="onEditRole(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="onDelete(row.id)">删除</el-button></template>
            </el-table-column>
          </el-table>
          <!-- 底部分页 -->
          <el-pagination
            :current-page="pageInfo.page"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="pageInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="company">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            :center="false"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled />
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input v-model="companyInfo.mailbox" disabled />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" disabled />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- 弹窗 -->
      <role-dialog ref="roleDaiLogRef" :isvisible.sync="isvisible" @update-list="loadRoleList" />
      <assignPremDailog ref="assignPremDaiLogRef" :is-show-perm.sync="isShowPerm" />
    </div>
  </div>
</template>

<script>
import { getAllRoleList, getdeptDetailById, delRoleById } from '@/api/role'
import { mapGetters } from 'vuex'
import RoleDialog from './components/role-dialog.vue'
import assignPremDailog from './components/assignPrem-dailog.vue'

export default {
  name: 'SettingPage',
  components: {
    RoleDialog,
    assignPremDailog
  },
  data() {
    return {
      activeName: 'role',
      pageInfo: {
        page: 1, // 第几页
        pagesize: 2 // 每页多少条
      },
      total: 0,
      roleList: [],
      companyInfo: {},
      isvisible: false,
      isShowPerm: false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.loadRoleList()
  },
  methods: {
    handleSizeChange(newPageSize) {
      console.log(`每页 ${newPageSize} 条`)
      this.pageInfo.pagesize = newPageSize
      this.loadRoleList()
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page}`)
      this.pageInfo.page = page
      this.loadRoleList()
    },
    async loadRoleList() {
      const { total, rows } = await getAllRoleList(this.pageInfo)
      // console.log(total)
      this.total = total
      this.roleList = rows
    },
    async loadCompanyInfo() {
      this.companyInfo = await getdeptDetailById(this.companyId)
      // console.log(this.companyInfo)
    },
    handleTabToggle() {
      if (this.activeName === 'company') {
        // await this.loadCompanyInfo()
        // console.log(Object.keys(this.companyInfo))
        if (!Object.keys(this.companyInfo).length) {
          this.loadCompanyInfo()
        }
      }
    },
    async onDelete(roleId) {
      try {
        await this.$confirm('确定删除该角色吗')
        await delRoleById(roleId)
        this.$message.success('删除角色成功')
        if (this.roleList.length === 1) {
          // 判断当前剩的页数是第几页
          // 如果剩的页数大于2，那么就让页数 -- ，否则就赋值等于1
          this.pageInfo.page >= 2 ? this.pageInfo.page-- : this.pageInfo.page = 1
        }
        this.loadRoleList()
      } catch (error) {
        this.$message.info('取消删除')
      }
    },
    addRole() {
      this.isvisible = true
    },
    onEditRole(roleId) {
      // 点击编辑后需要将数据回显到表单里
      // 表单定义在子组件里，所以在子组件里调用接口
      // 调用子组件的方法
      this.$refs.roleDaiLogRef.getRoleDetail(roleId)
      this.isvisible = true
    },
    onAssginPerm(id) {
      this.$refs.assignPremDaiLogRef.getRoleDetail(id)
      this.isShowPerm = true
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .el-row{
    margin-bottom: 20px;
  }
  .el-pagination{
    margin-top: 20px;text-align: center;
  }
  .el-form{
    width: 800px;
    margin-top: 50px;
  }
}
</style>
