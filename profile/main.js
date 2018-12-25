var Vue=require('vue')
var main=require('./components/main.vue')

new Vue({
    el:'#profile-js',
    render: (h) => h(main)
})