Component({
  properties: {
    
    isLogin: {
      type: Boolean,
      value: false
    },
    avatarUrl: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: '测试'
    }

  },
  data: {
    // 组件内部数据
    defaultStates: {}
  },
  methods: {
    // 自定义方法
    toLogin(){
      var toLoginDetail = {} // detail对象，提供给事件监听函数
      var toLoginOption = {} // 触发事件的选项
      this.triggerEvent(
        'toLogin',
        toLoginDetail,
        toLoginOption
      )
    }
  }
})