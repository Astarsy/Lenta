<template>
    <div class="ldb">

        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @close="onMsgClosed"></flashmessage>

        <div class="l-panel">
            <div class="tabs">
                <a class="tab logo" href="/html">
                    <img draggable="false" src="/img/etc/logo.png">
                </a>
                <div class="tab" 
                    v-for="tab in tabs"
                    :key="tab.name"
                    :class="['tab-button',{ active: current.name === tab.name }]"
                    @click="onTabClick(tab)">

                    <span class="ico">
                        <img draggable="false" :src="'/img/etc/'+tab.type+'.png'">
                    </span>
                    <span class="text">{{ tab.name }}</span>

                </div>
            </div>
            <div class="user-tabs">
                <div class="tab" 
                    v-for="tab in user_tabs"
                    :key="tab.name"
                    :class="['tab-button',{ active: current.name === tab.name }]"
                    @click="onTabClick(tab)">
                    <span class="text">{{ tab.name }}</span>

                    <span class="tab-close" 
                        @click.stop="onTabClose(tab)" title="Закрыть вкладку">❌</span>
                </div>
            </div>
        </div>
        <keep-alive>
        <mainlent
            :key="current.name"
            ref="curcomp"
            :tab="current"
            :canadd="current.canadd"
            :subscribes="subscribes"
            @open-user-lent="onOpenUserLent"
            @subscribe="onSubscribe"></mainlent>
        </keep-alive>

        <div class="r-panel">
            <div class="r-tabs">

                <userbar
                    :user="user"></userbar>

                <!--<div class="button"-->
                    <!--@click="onTestClick"-->
                    <!--&gt;Update</div>-->

                <keep-alive>
                    <subscribes v-if="subscribes"
                        :data="subscribes"
                        @open="onSubscribeOpen"
                        @unscribe="onUnscribe"></subscribes>
                </keep-alive>
            </div>
        </div>

    </div>
</template>

<script>
var mainlent=require('./mainlent.vue')
var subscribes=require('./subscribes.vue')
var flashmessage=require('./flashmessage.vue')
var userbar=require('./userbar.vue')

module.exports = {
    data: function(){
        return {
            tabs: null,
            user_tabs: null,
            message: null,
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
        onMsgClosed(){
            this.message=null
        },
        onSubscribe(uid){
            // Нажата кнопка Подписаться - отправить запрос на Подписку,
            // оптимистик: добавить полученные в ответе данные п-ля в Subscribes
            var data=new FormData()
            data.append('uid',uid);
            this.$http.post(window.location.origin+"/api/subscribe",data).then(function(responce){
// console.dir(responce.body)
                    var user=responce.body
                    this.message={
                        style: 'ok',
                        type: 'info',
                        text: "Вы успешно подписаны на "+user.name
                    }
                    this.subscribes.push(user)
                },
                function(responce){
// console.dir(responce.body)
                    this.message={
                        style: 'danger',
                        type: 'info',
                        text: "Не удалось подписаться..."
                    }
                })
        },
        onUnscribe(item){
            // Нажата кнопка Отписаться - отаравить запрос на отписку,
            // оптимистик: удалить Вкладку п-ля, Subscribes

            var data=new FormData()
            data.append('id',item.id);

            this.$http.post(window.location.origin+"/api/unscribe",data).then(function(responce){
// console.dir(responce.body)
                    this.message={
                        style: 'ok',
                        type: 'info',
                        text: "Вы успешно отписаны от "+item.name
                    }

                    var s=this.getSubscribeById(item.id)
                    if(s)this.subscribes.splice(this.subscribes.indexOf(s),1)
                    var tab=this.getUserTabById(item.id)
                    this.onTabClose(tab)

                },
                function(responce){
// console.dir(responce.body)
                    this.message={
                        style: 'danger',
                        type: 'info',
                        text: "Не удалось отписаться..."
                    }
                })

        },
        onSubscribeOpen(item){
            // console.dir(item)
            this.onOpenUserLent({
                id:item.id,
                name:item.name,
                type:'user',
                avatar:item.avatar,
                params:{uid:item.id}
            })
        },
        onTabClose(tab){
            if(!this.user_tabs)return null
            this.user_tabs.splice(this.user_tabs.indexOf(tab),1)
            this.current=this.tabs[0]
        },
        onOpenUserLent(user){
            // Создать вкладку пользователя
            var new_tab={
                id:user.id,
                name:user.name,
                type:'user',
                params:{uid:user.id},
                user: user
            }
            if(null===this.user_tabs)this.user_tabs=[new_tab]
            else if(null===this.getUserTabById(new_tab.id)){
                this.user_tabs.push(new_tab)
                if(this.user_tabs.length>2)this.user_tabs.shift();
            }
            this.current=new_tab
        },
        getSubscribeById(uid){
            for(var i=0;i<this.subscribes.length;i++){
                if(this.subscribes[i].id===uid)return this.subscribes[i]
            }
            return null
        },
        getUserTabById(uid){
            if(!this.user_tabs)return null
            for(var i=0;i<this.user_tabs.length;i++){
                if(this.user_tabs[i].id===uid)return this.user_tabs[i]
            }
            return null
        },
        getTabByType(type){
            if(!this.tabs)return null
            for(var i=0;i<this.tabs.length;i++){
                if(this.tabs[i].type===type)return this.tabs[i]
            }
            return null
        },
        onTabClick(tab){           
            if(this.user)document.cookie='cur_url='+tab.type+';path=/;'
            this.current=tab
        },
//        onTestClick:function (e){
//            this.$refs.curcomp.request()
//        },
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
        var cu=this.$root.getCoockie('cur_url')
        this.current=this.tabs[0]
        if(cu){
            var t=this.getTabByType(cu)
            if(null!==t)this.current=t
        }
        this.tick()
    },
    components: {
        mainlent,
        subscribes,
        flashmessage,
        userbar
    }
}
</script>

<style>
html,
body{
    height: 100%;
    margin: 0;
    padding: 0;
}
.ldb .logo{
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.ldb .logo img{
    width: 100%;
    max-width: 142px;
}
.ldb{
    position: relative;
    display: flex;
    min-width: 100%;
    height: inherit;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
}
.ldb .l-panel,
.ldb .r-panel{
    position: fixed;
    display: flex;
    flex-flow: column;
    height: inherit;
    width: 15%;
    background-color: #eee;
}
.ldb .l-panel{
    top: 0;
    left: 0;
}
.ldb .r-panel{
    top: 0;
    right: 0;
}
.ldb .tabsheet{
    display: flex;
    margin: 0 15%;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
}
.tabs{
    display: flex;
    flex-flow: column;
    width: 100%;
}
.user-tabs{
    display: flex;
    flex-flow: column;
    margin-top: 40px;
}
.r-tabs{
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
    color: #888;
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
    flex-wrap: wrap;
    align-items: center;
    font-size: 20px;
    color: #555;
    padding: 5px 10%;
    user-select: none;
    /*cursor: pointer;*/
}
.tab>*{
    display: flex;
}
.tab>*:not(:last-child){
    margin-right: 5px;
}
.tab-button,
.tab-button>*{
    cursor: pointer;
}
.tab-button.active,
.tab-button.active>*{
    color: #FF4500;
    background-color: #fff;
    cursor: default;
    border-right: none;
}
.tab-button:not(.active):hover{
    background-color: #f8f8f8;
}
.tab-button .tab-close{
    position: absolute;
    top: 0;
    right: 4px;
    color: #bbb;
    font-size: 14px;
    cursor: pointer;
}

.fotos.ico .foto{
    display: flex;
    width: 160px;
    height: auto;
}
.fotos.ico .foto>img{
    display: inline-block;
    width: 100%;
    height: 100%;
}

.fotos.mini .foto{
    width: auto;
    height: auto;
}
</style>