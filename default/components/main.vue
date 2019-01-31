<template>
    <div class="ldb">

        <flashmessage
            v-if="flash_message"
            :parent="this"
            :message="flash_message"
            @ok="flash_message=null"
            @close="flash_message=null"></flashmessage>

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
        <component v-bind:is="current.comp"
            :key="current.name"
            ref="curcomp"
            :tab="current"
            :subscribes="subscribes"
            :friends="user_friends"
            @open-user-lent="onOpenUserLent"
            @friend="onFriend"
            @subscribe="onSubscribe"></component>
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
                        @open="onUserTabOpen"
                        @unscribe="onUnscribe"></subscribes>
                </keep-alive>

                <keep-alive>
                    <friends v-if="user_friends"
                        :data="user_friends"
                        @open="onUserTabOpen"
                        @unscribe="onUnfriend"></friends>
                </keep-alive>

                <keep-alive>
                    <askfriends v-if="user_askfriends"
                        :data="user_askfriends"
                        @open="onUserTabOpen"
                        @yes="onAskFriendsYes"
                        @no="onAskFriendsNo"></askfriends>
                </keep-alive>
            </div>
        </div>

    </div>
</template>

<script>
let mainlent=require('./mainlent.vue')
let messageslent=require('./messageslent.vue')
let subscribes=require('./subscribes.vue')
let friends=require('./friends.vue')
let askfriends=require('./askfriends.vue')
let flashmessage=require('./flashmessage.vue')
let userbar=require('./userbar.vue')

module.exports = {
    data: function(){
        return {
            tabs: null,
            user_tabs: null,
            flash_message: null,
            timeout: 60000,
            current: null,
            user: null,
            subscribes: null,
            user_friends: null,
            user_askfriends: null,
            refreshTimerId: null,
            curcomp: 'mainlent',
            adding_mode: false,
            message: null
        }
    },
    props: {
    },
    methods: {
        onAskFriendsYes(item){
            // Нажата кнопка Согласиться дружить - отправить запрос,
            // оптимистик: добавить полученные в ответе данные п-ля в Friends
            this.request(this.user_askfriends,item,'yesfriend')
            this.user_friends.push(item)
        },
        onAskFriendsNo(item){
            // Нажата кнопка Отказаться дружить - отправить запрос,
            // оптимистик
            this.request(this.user_askfriends,item,'nofriend')
        },
        onFriend(uid){
            // Нажата кнопка Подружиться - отправить запрос на Дружбу,
            // оптимистик: добавить полученные в ответе данные п-ля в Friends
            let data=new FormData()
            data.append('uid',uid);
            this.$http.post(window.location.origin+"/api/wantfriend",data).then(function(responce){
// console.dir(responce.body)
                    this.flash_message={
                        style: 'ok',
                        type: 'info',
                        text: "Предложение дружбы отправлено"
                    }
                },
                function(responce){
// console.dir(responce.body)
                    this.flash_message={
                        style: 'danger',
                        type: 'info',
                        text: "Не удалось отправить..."
                    }
                })
        },
        onSubscribe(uid){
            // Нажата кнопка Подписаться - отправить запрос на Подписку,
            // оптимистик: добавить полученные в ответе данные п-ля в Subscribes
            var data=new FormData()
            data.append('uid',uid);
            this.$http.post(window.location.origin+"/api/subscribe",data).then(function(responce){
// console.dir(responce.body)
                    var user=responce.body
                    this.flash_message={
                        style: 'ok',
                        type: 'info',
                        text: "Вы успешно подписаны на "+user.name
                    }
                    this.subscribes.push(user)
                },
                function(responce){
// console.dir(responce.body)
                    this.flash_message={
                        style: 'danger',
                        type: 'info',
                        text: "Не удалось подписаться..."
                    }
                })
        },
        onUnscribe(item){
            // Нажата кнопка Отписаться - отаравить запрос на отписку,
            // оптимистик: удалить Вкладку п-ля, Subscribes
            this.request(this.subscribes,item,'unscribe')
        },
        onUnfriend(item){
            // Нажата кнопка Не Дружить - отаравить запрос,
            // оптимистик: удалить Вкладку п-ля, Subscribes
            this.request(this.user_friends,item,'unfriend')
        },
        request(items,item,method){
            // послать запрос и обновить данные инкрементом
            let data=new FormData()
            data.append('id',item.id);
            this.$http.post(window.location.origin+"/api/"+method,data).then(function(responce){
// console.dir(responce.body)
                    this.flash_message={
                        style: 'ok',
                        type: 'info',
                        text: "Готово!"
                    }
                    let s=this.getItemById(items,item.id)
                    if(s)items.splice(items.indexOf(s),1)
                    let tab=this.getItemById(this.user_tabs,item.id)
                    this.onTabClose(tab)
                },
                function(responce){
// console.dir(responce.body)
                    this.flash_message={
                        style: 'danger',
                        type: 'info',
                        text: "Что-то не получилось..."
                    }
                })
        },
        onUserTabOpen(item){
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
            let new_tab={
                id:user.id,
                name:user.name,
                type:'user',
                params:{uid:user.id},
                user: user,
                comp: 'mainlent'
            }
            if(null===this.user_tabs)this.user_tabs=[new_tab]
            else if(null===this.getItemById(this.user_tabs,new_tab.id)){
                this.user_tabs.push(new_tab)
                if(this.user_tabs.length>2)this.user_tabs.shift();
            }
            this.current=new_tab
        },
        getItemById(arr,id){
            if(!arr)return null
            for(let i=0;i<arr.length;i++){
                if(arr[i].id===id)return arr[i]
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
        let d=this.getStartData()
        if(d.user)this.user=d.user
        if(d.subscribes)this.subscribes=d.subscribes
        if(d.friends)this.user_friends=d.friends
        if(d.askfriends)this.user_askfriends=d.askfriends
        console.dir(d)
        this.tabs=d.tabs
        this.timeout=d.timeout
        let cu=this.$root.getCoockie('cur_url')
        this.current=this.tabs[0]
        if(cu){
            let t=this.getTabByType(cu)
            if(null!==t)this.current=t
        }
        this.tick()
    },
    components: {
        mainlent,
        messageslent,
        subscribes,
        friends,
        askfriends,
        flashmessage,
        userbar,
//        addmessage
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
    display: inline-flex;
    width: 100%;
    flex-flow: column;
    overflow: hidden;
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
.r-tabs>*:not(:last-child){
    margin-bottom: 20px;
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
.mini-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    border-radius: 6px;
}
.mini-btn.ok{
    padding: 2px 6px 4px 6px;
}
.mini-btn.cancel{
    padding: 0 6px 2px 6px;
    border-radius: 60px;
}

.tab{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 20px;
    color: #555;
    padding: 5px 2% 5px 8%;
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

.user-ava-name{
    display: flex;
    align-items: center;
}

.user-ava-name{
    cursor: pointer;
}
.user-ava-name>*:not(:last-child){
    margin-right: 8px;
}
.user-ava-name>img{
    width: 40px;
    height: 40px;
    border-radius: 100px;
}
.user-ava-name .name{
    color: #315355;
    font-size: 20px;
}
.user-ava-name .count{
    color: #888;
    font-size: 14px;
    padding-bottom: 1em;
}
</style>