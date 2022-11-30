import store from '@/store'

export default {
  methods: {
    checkPermission(point) {
      console.log('points', store.getters.points)
      return store.getters.points.includes(point)
    }
  }
}
