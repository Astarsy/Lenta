<template>
    <div class="lent-default">
        <button
            @click="onTestClick"
            >Update</button>
        <button
            v-for="tab in tabs"
            v-bind:key="tab.name"
            v-bind:class="['tab-button',{ active: current.name === tab.name }]"
            v-on:click="onTabClick(tab)">
            {{ tab.name }}</button>
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
</style>