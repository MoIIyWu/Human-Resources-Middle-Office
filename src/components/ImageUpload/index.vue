<template>
  <div>
    <!-- file-list：上传的文件列表(显示用户已经上传的图片) -->
    <!-- :before-upload="beforeAvatarUpload" -->
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :before-upload="beforeAvatarUpload"
      :http-request="onHttpRequest"
      :class="{
        'uploadImg':fileList.length === 1
      }"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog title="预览图片" :visible="dialogVisible" @close="onClosed">
      <img :src="dialogImageUrl" alt="" width="100%">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDMZXu8A0b0BA0d4ITZBfuteIv30mMTRPG', // 身份识别 ID
  SecretKey: 'g6JLKAtTs7HLBrOjrswARkxzmV4SQAf0' // 身份密钥
})

export default {
  name: 'ImageUpload',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      currUid: ''
    }
  },
  methods: {
    onRemove(file, fileList) {
    //   console.log(file, fileList)
    // 点击删除的时候将文件列表清空
      this.fileList = []
    },
    // 点击放大按钮预览图片
    onPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onClosed() {
      this.dialogVisible = false
    },
    onChange(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeAvatarUpload({ uid, size, type }) {
    //   console.log(file)
    // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(type)) {
        this.$message.warning(`上传的文件格式${type}不合法`)
        return Promise.reject('上传文件失败')
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024
      if (size > maxSize) {
        this.$message.warning('上传的文件过大，请重新上传')
        return false
      }
      this.currUid = uid
      console.log('检查通过')
      return true
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    onHttpRequest(params) {
    //   console.log(params)
      cos.putObject({
        Bucket: 'mollywu-1315219442', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: params.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        console.log(err || data)
        console.log(data.Location)
        // 判断是否上传成功
        if (!err && data.statusCode === 200) {
          // 将上传文件的地址换成腾讯云的地址
          this.fileList = this.fileList.map(item => {
            console.log(this)
            //   如果上传文件的uid正好是之前检查文件类型时记录的id
            if (item.uid === this.currUid) {
              return {
                url: 'https://' + data.Location,
                upload: true
              }
            }
            return item
          })
        }
      })
    }
  }

}
</script>

<style>

</style>
