var Vue=require('vue')
var main=require('./components/main.vue')

new Vue({
    el:'#lenta-js',
    render: (h) => h(main)
})