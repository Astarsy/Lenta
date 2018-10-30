<template>
    <div class="colorpeeker">        
        <span v-for="(c,i) in colors"
            class="cpcolor"
            :class="{ curcolor : cur==i }"
            :style="{ 'background-color' : c }"
            @click.stop="onChoiceClick(i)"></span>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return{
            colors: document.mag_start_data.colors,
            cur: 0
        }
    },
    props:{
        curColor: {
            type: String,
            default: '#fff'
        }
    },
    methods: {
        getIndex(color){
            for(var i=0;i<this.colors.length;i++){
                if(this.colors[i]==color){
                    return i
                }
                return 0
            }
        },
        onChoiceClick: function(i){
            this.cur=i
            this.$emit('color-choice',this.cur,this.colors[i])
        }
    },
    created(){
        this.cur=this.getIndex(this.curColor)
    }
}
</script>
<style>
.colorpeeker{
    display: inline-block;
}
.colorpeeker .cpcolor{
    display: inline-block;
    border:1px solid #ccc;
    border-radius: 3px;
    width: 16px;
    height: 16px;
    margin-left: 3px;
}
.colorpeeker .cpcolor.curcolor{
    border-width: 2px;
    border-color: #aaa;
}
</style>