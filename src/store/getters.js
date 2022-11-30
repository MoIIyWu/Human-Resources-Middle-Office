const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 将token值作为公共访问属性
  token: state => state.user.token,
  username: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  menus: state => state.user.userInfo.roles.menus,
  // 放出 permission 模块里面的经过（静态 + 动态）
  routes: state => state.permission.routes,
  points: state => state.user.userInfo.roles.points
}
export default getters
