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

.h1,.h2,.h3,.h4{
    font-weight: bold;
    color: #555;
    text-align: center;
}
.h1{ font-size: 32px; }
.h2{ font-size: 24px; }
.h3{ font-size: 20px; }
.h4{ font-size: 16px; }
.text{
    text-align: left;
}
.h2,
.text,
.item,
.foto{
    position: relative;
    cursor: default;
}



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
    user-select: none;
}
.ok{
    color: #00AA17;
    border-color: #00AA17;
}
.cancel{
    border-radius: 100px;
    font-size: 16px;
}

.tabs{
    display: inline-flex;
    margin-left: 20px;
}
.tab{
    width: 100px;
    margin-top: 2px;
    padding: 4px 16px;
    margin-right: -6px;
    border-width: 2px;
    border-color: #ccc;
    border-bottom: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background-color: #f8f8f8;
    user-select: none;
    z-index: 0;
}
.tab:last-child{
    margin-left: 12px;
}
.tab.active{
    margin-top: 0;
    background-color: #fff;
    border-color: #d8d8d8;
    border-bottom: 2px solid #fff;
    margin-bottom: -2px;
    z-index: 1;
}
</style>