<template>
  <div class="dashboard-container">
    <ImageUpload />
  </div>
</template>

<script>

export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
