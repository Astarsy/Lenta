<template>
    <div class="ldb">
        <div class="l-panel">
            <div class="tabs">
                <div class="tab" 
                    v-for="tab in tabs"
                    v-bind:key="tab.name"
                    v-bind:class="['tab-button',{ active: current.name === tab.name }]"
                    v-on:click="onTabClick(tab)">
                    {{ tab.name }}</div>
            </div>
            <div class="user-tabs">
                <div class="tab" 
                    v-for="tab in user_tabs"
                    v-bind:key="tab.name"
                    v-bind:class="['tab-button',{ active: current.name === tab.name }]"
                    v-on:click="onTabClick(tab)">
                    {{ tab.name }}
                    <span class="tab-close" 
                        @click.stop="onTabClose(tab)" title="Закрыть вкладку">X</span>
                </div>
            </div>
        </div>
        <keep-alive>
        <mainlent
            :key="current.name"
            ref="curcomp"
            :tab="current"
            :canadd="current.canadd"
            @open-user-lent="onOpenUserLent"></mainlent>
        </keep-alive>
        <div class="r-panel">
            <div class="r-tabs">
                <a v-if="!user" class="button enter" href="http://100tkaney.loc/lenta">
                Войти</a>
                <a v-else class="button enter" href="/html/out">
                Выйти</a>
                <div class="button"
                    @click="onTestClick"
                    >Update</div>
                <keep-alive>
                    <subscribes v-if="subscribes"
                        :data="subscribes"
                        @click="onSubscribeClick"></subscribes>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
var mainlent=require('./mainlent.vue')
var subscribes=require('./subscribes.vue')

module.exports = {
    data: function(){
        return {
            tabs: null,
            user_tabs: null,
            timeout: 60000,
            current: null,
            user: null,
            subscribes: null,
            refreshTimerId: null,
            curcomp: null
        }
    },
    props: {
    },
    methods: {
        onSubscribeClick(item){
            this.onOpenUserLent({id:item.id,name:item.name,type:'user',params:{uid:item.id}})
        },
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
        if(d.subscribes)this.subscribes=d.subscribes
        this.tabs=d.tabs
        this.timeout=d.timeout
        this.current=this.tabs[0]
        this.tick()
    },
    components: {
        mainlent,
        subscribes
    }
}
</script>

<style>
html,
body{
    margin: 0;
    padding: 0;
}
.ldb{
    display: flex;
    min-width: 100%;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
}
.ldb .l-panel,
.ldb .r-panel{
    position: relative;
    display: flex;
    flex: 1 1 15%;
    height: 100%;
    width: 100%;
    max-width: 15%;
}
.ldb .tabsheet{
    flex: 4 1 60%;
}
.tabs{
    position: fixed;
    width: inherit;
    max-width: inherit;
    top: 0;
    left: 0;
    display: flex;
    flex-flow: column;
}
.user-tabs{
    position: fixed;
    bottom: 5%;
    left: 0;
    display: flex;
    flex-flow: column;
    width: inherit;
    max-width: inherit;
}
.r-tabs{
    position: fixed;
    width: inherit;
    max-width: inherit;
    top: 0;
    right: 0;
    display: flex;
    flex-flow: column;
}
.ldb .r-panel{
    flex-flow: column;

}

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

a.button{
    text-decoration: none;
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

.tab{
    position: relative;
    display: flex;
    align-self: flex-end;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width: 100px;
    height: 100px;

    /*padding: 4px 16px;*/
    /*margin-right: -6px;*/
    color: #8600D7;
    border: 1px solid #8600D7;
    /*border-bottom: none;*/
    /*border-top-right-radius: 20px;*/
    /*border-top-left-radius: 20px;*/
    /*background-color: #f8f8f8;*/
    user-select: none;
    cursor: pointer;
    z-index: 0;
}
.tab:not(:last-child){
    border-bottom: none;
}
.tab.active{
    /*margin-top: 0;*/
    background-color: #fff;
    /*border-color: #d8d8d8;*/
    /*border-bottom: 2px solid #fff;*/
    /*margin-bottom: -2px;*/
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