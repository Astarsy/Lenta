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
            cur: this.bgci
        }
    },
    props:{
        bgci: 0
    },
    methods: {
        onChoiceClick: function(i){
            this.cur=i
            this.$emit('color-choice',i)
        }
    }
}
</script>
<style>

.colorpeeker{
}
.colorpeeker .cpcolor{
    display: inline-flex;
    align-items: center;
    border:2px solid #999;
    border-radius: 30px;
    width: 30px;
    height: 20px;
    margin-left: 2px;
    opacity: .6;
    cursor: pointer;
}
.colorpeeker .cpcolor.curcolor{
    opacity: 1;
    cursor: default;
}
</style>