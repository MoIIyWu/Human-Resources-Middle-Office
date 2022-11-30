<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :is-show-left="true">
        <template v-slot:left>
          共有{{ total }}条数据
        </template>
        <template v-slot:right>
          <el-button type="danger" size="small" @click="List2Excel">excel导出</el-button>
          <el-button type="success" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button v-if="checkPermission('aa')" type="primary" size="small" @click="onAddEmployee">新增员工</el-button>
        </template>
      </page-tools>
      <el-card class="card-box">
        <el-table border stripe :data="rowList">
          <el-table-column label="序号" type="index" width="50px" align="center" />
          <el-table-column label="姓名" prop="username" align="center" />
          <el-table-column label="头像" prop="staffPhoto" width="110px" align="center">
            <template v-slot="{ row }">
              <div @click="showQr(row.staffPhoto)">

                <el-avatar :size="80" :src="row.staffPhoto">
                  <!-- 图片加载失败的 fallback 行为 -->
                  <!-- <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"> -->
                  <img src="@/assets/common/head.jpg" alt="">
                </el-avatar>
              </div>
            </template>

            <!-- <template v-slot="{ row }"> -->
            <!-- <pre>
                {{ row }}
              </pre> -->
            <!-- <img v-imagerror="defaultImg" :src="row.staffPhoto" alt="" class="staffPhoto"> -->
            <!-- </template> -->
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" width="110px" align="center" />
          <el-table-column label="工号" prop="workNumber" align="center" />
          <!-- 处理聘用形式 -->
          <!-- <el-table-column label="聘用形式" prop="formOfEmployment" align="center" :formatter="formatEmployees" /> -->
          <el-table-column label="聘用形式" prop="formOfEmployment" align="center">
            <template v-slot="{ row }">
              {{ row.formOfEmployment | formatterEnum }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" align="center" />
          <el-table-column label="入职时间" prop="timeOfEntry" width="100px" align="center">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableStatus" align="center">
            <template v-slot="{ row }">
              <!-- {{ row.enableStatus }} -->
              <el-switch
                :value="row.enableStatus == 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260px" align="center">
            <template v-slot="{ row }">
              <!-- <pre>{{ row }}</pre> -->
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="onAssginRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="onDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-pagination
        :current-page="pageInfo.page"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- <employee-dialog :is-visible.sync="isVisible" /> -->
      <employee-dialog v-model="isVisible" @update-list="loadEmployeeList" />

      <!-- 二维码的弹窗 -->
      <el-dialog
        title="二维码"
        width="30%"
        :visible="isShwoQr"
        @close="onCloseQr"
      >
        <el-row type="flex" justify="center">
          <!-- canvas 标签 -->
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
    </div>

    <!-- 分配角色弹窗 -->
    <RoleDialog ref="assignRoleRef" :is-show-role-dialog.sync="isShowRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
// import PageTools from '@/components/PageTools/index.vue'
import { getEmployeeList, deleteEmployee } from '@/api/employees'
// import defaultImg from '@/assets/common/head.jpg'
import employees from '@/api/constant/employees'
import employeeDialog from './components/employee-dialog.vue'
import QrCode from 'qrcode'
import RoleDialog from './components/assign-role.vue'

export default {
  name: 'EmployeesPage',
  components: {
    // PageTools
    employeeDialog,
    RoleDialog
  },
  data() {
    return {
      pageInfo: {
        page: 1,
        size: 5
      },
      total: 0,
      rowList: [],
      isVisible: false,
      // defaultImg
      hireType: employees.hireType,
      isShwoQr: false,
      isShowRoleDialog: false,
      userId: ''
    }
  },
  mounted() {
    this.loadEmployeeList()
  },
  methods: {
    handleSizeChange(newSize) {
      // console.log(`每页 ${newSize} 条`)
      this.pageInfo.size = newSize
      this.loadEmployeeList()
    },
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${newPage}`)
      this.pageInfo.page = newPage
      this.loadEmployeeList()
    },
    errorHandler() {
      return true
    },
    async loadEmployeeList() {
      const { rows, total } = await getEmployeeList(this.pageInfo)
      rows.forEach(item => {
        item.enableStatus = 1
      })
      this.rowList = rows
      this.total = total
    },
    // formatEmployees(row, column, cellValue, index) {
    //   // cellValue 就是当前单元格的值
    //   // 拿每个单元格的值与hireType的id做比较，看看有没有一样的
    //   const hire = this.hireType.find(hire => hire.id === +cellValue)
    //   return hire ? hire.value : '未知'
    // }
    async onDelete(employeeId) {
      try {
        await this.$confirm('确定要删除该员工吗')
        await deleteEmployee(employeeId)
        this.$message.success('删除成功')
        if (this.rowList.length === 1) {
          this.pageInfo.page >= 2 ? this.pageInfo.page-- : this.pageInfo.page = 1
        }
        this.loadEmployeeList()
      } catch (error) {
        this.$message.warning('你取消了删除')
      }
    },
    onAddEmployee() {
      this.isVisible = true
    },
    // 将列表导出成Excel
    List2Excel() {
      // 需要维护的数据
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载的形式
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取员工列表
        const { rows } = await getEmployeeList({ page: 1, size: this.total })

        // 将用户的信息转化为与表格相对应的
        const data = this.formatData(rows, headers)

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data, // data 数据是导出的具体数据，二维数组的格式，自己定义出维护数组的方法
          filename: '',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatData(rowsList, headers) {
      return rowsList.map(item => {
        return Object.values(headers).map(key => {
          if (key === 'timeOfEntry' || key === 'correctionTime') {
            return this.formatDate(item[key])
          } else if (key === 'formOfEmployment') {
            const person = this.hireType.find(hire => hire.id === +item[key])
            return person?.value ?? '未知'
          } else {
            return item[key]
          }
        })
      })
    },
    formatDate(numb) {
      const date = new Date(numb)
      const year = date.getFullYear()
      const month = (date.getMonth() + '').padStart(2, '0')
      const day = (date.getDate() + '').padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    // 点击图片的时候出现二维码
    showQr(url) {
      // console.log(url)
      // 如果有url的话，就打开弹窗
      if (url) {
        this.isShwoQr = true
        // 参数1:真实的 dom 元素
        // 参数2:转成二维码的信息
        // 由于myCanvas是组件，组件的更新是异步的，所有要用$nextTick
        // 不然会报错 Error in v-on handler: "TypeError: Cannot read properties of undefined (reading 'getContext')"
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('目前还没上传头像')
      }
    },
    onCloseQr() {
      this.isShwoQr = false
    },
    // 点击角色按钮出现分配角色弹窗
    async onAssginRole(roleId) {
      this.isShowRoleDialog = true
      // console.log(roleId)
      // 调用父组件的方法
      this.userId = roleId
      this.$refs.assignRoleRef.getRoleDetailById(roleId)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .card-box{
    margin-top: 20px;
  }
   .el-pagination{
      margin-top: 20px;
      text-align: center;
    }
    // .staffPhoto{
    //   width: 80px;
    //   height: 80px;
    //   border-radius: 50%;
    // }
}
</style>
