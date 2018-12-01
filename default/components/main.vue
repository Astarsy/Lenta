<template>
    <div class="lent-default">
        <div class="panel">
            <div class="tabs">
                <div class="tab" 
                    v-for="tab in tabs"
                    v-bind:key="tab.name"
                    v-bind:class="['tab-button',{ active: current.name === tab.name }]"
                    v-on:click="onTabClick(tab)">
                    {{ tab.name }}</div>
                <div class="tab" 
                    v-for="tab in user_tabs"
                    v-bind:key="tab.name"
                    v-bind:class="['tab-button',{ active: current.name === tab.name }]"
                    v-on:click="onTabClick(tab)">
                    {{ tab.name }}
                    <span class="tab-close" 
                        @click.stop="onTabClose(tab)" title="Закрыть вкладку">X</span>
                </div>
                <div class="tab"
                    @click="onTestClick"
                    >Update</div>
            </div>
            <div v-if="!user">
            <a href="http://100tkaney.loc/lenta">Войти</a>
            </div>
            <div v-else>
            <a href="/html/out">Выйти</a>
            </div>
        </div>
        <keep-alive>
        <mainlent
            :key="current.name"
            ref="curcomp"
            :tab="current"
            :canadd="this.current.canadd"
            @open-user-lent="onOpenUserLent"></mainlent>
        </keep-alive>
    </div>
</template>

<script>
var mainlent=require('./mainlent.vue')

module.exports = {
    data: function(){
        return {
            tabs: null,
            user_tabs: null,
            timeout: 60000,
            current: null,
            user: null,
            refreshTimerId: null,
            curcomp: null
        }
    },
    props: {
    },
    methods: {
        onTabClose(tab){
            this.user_tabs.splice(this.user_tabs.indexOf(tab),1)
        },
        onOpenUserLent(user){
            // Создать вкладку пользователя
            var new_tab={
                id:user.id,
                name:user.name,
                type:'user',
                params:{uid:user.id}
            }
            if(null===this.user_tabs)this.user_tabs=[new_tab]
            else if(null===this.getUserTabById(new_tab.id)){
                this.user_tabs.push(new_tab)
                if(this.user_tabs.length>2)this.user_tabs.shift();
            }
            this.current=new_tab
        },
        getUserTabById(uid){
            for(var i=0;i<this.user_tabs.length;i++){
                if(this.user_tabs[i].id===uid)return this.user_tabs[i]
            }
            return null
        },
        onTabClick(tab){
            this.current=tab
        },
        onTestClick:function (e){
            this.$refs.curcomp.request()
        },
        tick(){
            // if(this.$refs.curcomp)this.$refs.curcomp.request()
            this.refreshTimerId=setTimeout(this.tick,this.timeout)
        },
        getStartData(){
                return document.mag_start_data
        }
    },
    created(){
        var d=this.getStartData()
        if(d.user)this.user=d.user
        this.tabs=d.tabs
        this.timeout=d.timeout
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
    background-color: #fff;
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
.button.disabled{
    color: #aaa;
    background-color: #eee;
    border-color: #bbb;
    cursor: default;
}
.button:not(.disabled):hover{
    box-shadow: 0 0 2px #888;
}

.panel{
    display: flex;
    justify-content: space-between;
}
.tabs{
    display: inline-flex;
    margin-left: 20px;
}
.tab{
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width: 100px;
    padding: 4px 16px;
    margin-right: -6px;
    border: 2px solid #ddd;
    border-bottom: none;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    background-color: #f8f8f8;
    user-select: none;
    cursor: pointer;
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
    cursor: default;
    z-index: 1;
}
.tab-close{
    position: absolute;
    top: 2px;
    right: 8px;
    display: flex;
    font-size: 12px;
    cursor: pointer;
}
</style>