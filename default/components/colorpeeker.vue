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
.colorpeeker .cpcolor{
    display: inline-flex;
    border:1px solid #ccc;
    border-radius: 3px;
    width: 22px;
    height: 22px;
    margin-left: 2px;
    cursor: pointer;
}
.colorpeeker .cpcolor.curcolor{
    border-width: 2px;
    border-color: #aaa;
}
</style>