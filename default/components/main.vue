<template>
    <div class="lent-default">
        <div class="tabs">
            <div class="button tab" 
                v-for="tab in tabs"
                v-bind:key="tab.name"
                v-bind:class="['tab-button',{ active: current.name === tab.name }]"
                v-on:click="onTabClick(tab)">
                {{ tab.name }}</div>
            <div class="button cancel tab"
                @click="onTestClick"
                >Update</div>
        </div>
        <keep-alive>
        <mainlent
            :key="current.name"
            ref="curcomp"
            :type="current.type"
            :add="this.current.add"></mainlent>
        </keep-alive>
    </div>
</template>

<script>
var mainlent=require('./mainlent.vue')

module.exports = {
    data: function(){
        return {
            tabs: null,
            current: null,
            refreshTimerId: null,
            curcomp: null
        }
    },
    props: {
    },
    methods: {
        onTabClick(tab){
            this.current=tab
        },
        onTestClick:function (e){
            this.$refs.curcomp.refresh()
        },
        tick(){
            // console.dir(this.$refs.curcomp)
            if(this.$refs.curcomp)this.$refs.curcomp.refresh()
            // this.refreshTimerId=setTimeout(this.tick,5000)
        },
        getStartData(){
            // Предполагается загрузка этого массива с сервера
                return document.mag_start_data
        }
    },
    created(){
        var d=this.getStartData()
        this.tabs=d.tabs
        this.current=this.tabs[0]
        this.tick()
    },
    components: {
        mainlent,
    }
}
</script>

<style>
.button{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    border: 1px solid #aaa;
    border-radius: 10px;
    color: #666;
    padding: 4px 12px;
    cursor: pointer;
}
.ok{
    color: #00AA17;
    border-color: #00AA17;
}
.cancel{
    border-radius: 100px;
    padding: 0 8px;
    font-size: 16px;
}

.tabs{
    display: inline-flex;
    margin-left: 20px;
}
.tab{
    padding: 4px 16px;
    margin-right: -6px;
    border-width: 2px;
    border-color: #ddd;
    border-bottom: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background-color: #f8f8f8;
    z-index: 0;
}
.tab:last-child{
    margin-left: 12px;
}
.tab.active{
    background-color: #fff;
    border-color: #d8d8d8;
    border-bottom: 2px solid #fff;
    margin-bottom: -2px;
    z-index: 2;
}
</style>