Component({
  properties: {
    // 这里定义了 headerText 属性，属性值可以在组件使用时指定
    headerText: {
      type: String,
      value: '默认标题文案',
    }
  },
  data: {
    // 组件内部数据
    defaultStates: {}
  },
  methods: {
    // 自定义方法
    customMethod: function(){}
  }
})