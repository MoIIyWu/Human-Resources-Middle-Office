<template>
  <el-dialog title="分配权限" :visible="isShowPerm" @close="onClosed">
    <el-tree
      ref="tree"
      :data="permList"
      show-checkbox
      node-key="id"
      default-expand-all
      :check-strictly="true"
      :props="defaultProps"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
      <el-button size="small" @click="onClosed">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getAllpermission } from '@/api/permission'
import { getRoleDetail, assginRolePerm } from '@/api/role'
import { List2Tree } from '@/utils/index'

export default {
  name: 'AssignPremDdailog',
  props: {
    isShowPerm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        roleId: ''
      }
    }
  },
  mounted() {
    this.loadAllPerm()
  },
  methods: {
    async loadAllPerm() {
      const List = await getAllpermission()
      this.permList = List2Tree(List, '0')
    },
    onClosed() {
      this.$emit('update:isShowPerm', false)
    },
    async getRoleDetail(id) {
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      //   setCheckedKeys	通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
      this.$refs.tree.setCheckedKeys(permIds)
    },
    async onConfirm() {
      // getCheckedKeys	若节点可被选择（即 show-checkbox 为 true）
      // 则返回目前被选中的节点的 key 所组成的数组
      try {
        await assginRolePerm({ id: this.roleId, permIds: this.$refs.tree.getCheckedKeys() })
        this.$message.success('添加权限成功')
        this.onClosed()
      } catch (error) {
        this.$message.warning('添加权限失败')
      }
    }
  }
}
</script>

<style>

</style>
