<template>
    <div class="profile-js">

        <div class="left">
            <a class="logo" href="/html">
                <img draggable="false" src="/img/etc/logo.png">
            </a>
        </div>

        <div class="center">

            <h1>Личные данные</h1>

            <div class="nick">
                <span class="label">Имя на сайте</span>
                <inputex
                        :value="user.name"
                        :maxlength="20"
                        @input="onInput"
                        @active-changed="onNameChanged"></inputex>
            </div>

            <div class="avatar">
                <span class="label">Аватар</span>
                <img draggable="false" :src="image_url">
                <fileadder
                    :editmode="true"
                    title="Сменить аватар"
                    @changed="onFotoChanged"
                    @active-changed="onFotoActiveChanged"
                    @cancel="onFotoCancel"></fileadder>
            </div>

            <div class="buttons">

                <div class="button send"
                    :class="{ disabled : !is_ok_btn_active }"
                    @click="onOk">Сохранить</div>

                <div class="back">
                    <a href="/html">Вернуться в Ленту</a>
                </div>

            </div>

        </div>

        <div class="right">
        </div>

    </div>
</template>

<script>
let fileadder=require('./file_adder.vue')
let inputex=require('./inputex.vue')
module.exports = {
    data: function(){
        return {
            user: document.mag_start_data.user,
            image_url: null,
            is_name_changed: false,
            is_avatar_changed: false,
            file: null
        }
    },
    methods: {
        onOk(){
            if(!this.is_ok_btn_active)return
            this.request()
        },
        onFotoActiveChanged(v){
            this.is_avatar_changed=v
        },
        onNameChanged(v){
            this.is_name_changed=v
        },
        onInput(text){
            this.$set(this.user,'name',text)
        },
        onFotoCancel(){
            this.image_url=this.getAvatarUrl(this.user.avatar)
        },
        onFotoChanged(files,file_data){
            this.image_url=file_data.pop().image
            this.file=files[0]
        },
        request(){
            let data=new FormData()
            if(this.is_name_changed)data.append('name',this.user.name)
            if(this.is_avatar_changed)data.append('userFiles[]',this.file)
            this.$http.post(window.location.origin+"/api/saveprofile",data).then(function(responce){
 console.dir(responce.body)
                },
                function(responce){
 console.dir(responce)
                })
        },
        getAvatarUrl(n){
            return '/img/avatars/'+this.getAvatarName(n)
        },
        getAvatarName(n){
            if(n)return n
            else return 'anonim.png'
        }
    },
    created(){
        this.image_url=this.getAvatarUrl(this.user.avatar)
    },
    computed:{
        is_ok_btn_active: function(){
            return this.is_name_changed || this.is_avatar_changed
        }
    },
    components: {
        fileadder,
        inputex
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
img{
    user-select: none;
}
.profile-js{
    display: flex;
    align-items: flex-start;
    height: 100%;
}

.profile-js .left{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 20%;
    min-width: 140px;
    height: 100%;
    background-color: #f8f8f8;
}
.profile-js .logo{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    background-color: #fff;
    padding: 10px 0;
}

.profile-js .center{
    display: flex;
    flex-flow: column;
    width: 60%;
    background-color: #fff;
    padding: 0 10px;
}
.profile-js .center h1{
    text-align: center;
    color: #888;
}
.profile-js .center>div:not(:last-child){
    border-bottom: 1px solid #eee;
}
.profile-js .center>div{
    display: flex;
    align-items: center;
    /*background-color: #eee;*/
    padding: 20px 0;
}
.profile-js .label{
    display: flex;
    width: 15%;
    padding-left: 10px;
}
.profile-js .nick .inputex{
    display: flex;
}
.profile-js .nick .inputex input{
    font-size: 18px;
    padding: 2px 4px;
    border: 1px solid #bbb;
    border-radius: 10px;
}
.profile-js .nick .inputex .counter{
    font-size: 12px;
}
.profile-js .avatar img{
    display: flex;
    width: 66px;
    margin-right: 20px;
    border: 1px solid #bbb;
    border-radius: 12px;
}
.profile-js .buttons{
    display: flex;
    justify-content: space-around;
}

.profile-js .right{
    display: flex;
    width: 20%;
    height: 100%;
    background-color: #f8f8f8;
}

.profile-js .button{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px solid;
    border-radius: 8px;
    user-select: none;
    padding: 4px 8px;
}
.profile-js .button.send{
    color: #0a0;
    border-color: #0a0;
}
.profile-js .ok,
.profile-js .button.ok{
    color: #0a0;
    border-color: #0a0;
}
.profile-js .button.cancel{
    color: #aaa;
    border-color: #aaa;
}
.profile-js .button.disabled{
    opacity: .6;
    color: #aaa;
    border-color: #aaa;
    cursor: default;
}
.profile-js .back>a{
    display: flex;
    font-size: 18px;
    font-weight: bold;
    color: #FF4500;
    border: 2px solid #FF4500;
    border-radius: 120px;
    padding: 8px 16px;
    cursor: pointer;
    text-decoration: none;
}
</style>