var Vue=require('vue')
var VueResource = require('vue-resource')

Vue.use(VueResource);

var main=require('./components/main.vue')

new Vue({
    el:'#profile-js',
    render: (h) => h(main)
})