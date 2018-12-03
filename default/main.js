var Vue=require('vue')
var VueResource = require('vue-resource')

Vue.use(VueResource);

Vue.filter('date',function(val){
    if(val){
        var date=new Date(val)        
        var dd = date.getDate()
        if (dd < 10) dd = '0' + dd
        var mm = date.getMonth() + 1
        if (mm < 10) mm = '0' + mm
        var yy = date.getFullYear() % 100
        // if (yy < 10) yy = '0' + yy
        var hh=date.getHours()
        var ii=date.getMinutes()
        if (ii < 10) ii = '0' + ii
        return dd + '.' + mm + '.' + yy + ' в '+hh+':'+ii
    }
})

var main=require('./components/main.vue')

new Vue({
    mixins:[
    {
        methods:{
            deepCopy(oldObj) {
                var newObj = oldObj;
                if (oldObj && typeof oldObj === 'object') {
                    newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
                    for (var i in oldObj) {
                        newObj[i] = this.deepCopy(oldObj[i]);
                    }
                }
                return newObj;
            }
        }
    }
    ],
    el:'#_lent_',
    render: (h) => h(main)
})