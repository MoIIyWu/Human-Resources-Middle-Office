<template>
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
import { batchEmployee } from '@/api/employees'

export default {
  name: 'ImportPage',
  methods: {
    async onSuccess({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment'
      }

      // 定义需要维护的对象的数组
      const needResolveFields = ['timeOfEntry', 'correctionTime']

      const data = results.map(item => {
        // results是上传的Excel里面所有数据，是一个数组，里面是一个个对象(Excel表格里的每一行信息)
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // item是result里的每一项
          if (needResolveFields.includes(userRelations[key])) {
            // console.log(userRelations[key])
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            // userInfo的键就是userRelations的值(userRelations[key])
            // userInfo的值就是item的值
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })

      // 发起请求
      try {
        await batchEmployee(data)
        this.$message.success('导入员工表成功')
        this.$router.go(-1)
        // this.$router.push('/employees')
      } catch (error) {
        this.$message.warning('批量导入失败')
      }
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
