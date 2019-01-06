<template>
    <div class="profile-js">
        <h1>PROFILE</h1>

        <div class="icon-box">
            <img :src="image_url">
            <fileadder
                :editmode="true"
                title="Сменить аватар"
                @changed="onFotoChanged"
                @active-changed="onFotoActiveChanged"
                @cancel="onFotoCancel"></fileadder>
        </div>

        <inputex
            :value="user.name"
            :maxlength="20"
            @input="onInput"
            @active-changed="onNameChanged"></inputex>

        <div class="button send"
            :class="{ disabled : !is_ok_btn_active }"
            @click="onOk">Готово</div>

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
.profile-js{
    display: flex;
    flex-flow: column;
}
.profile-js>div{
    display: flex;
    align-items: flex-end;
    height: 80px;
    border: 1px solid #ccc;
}
.profile-js .icon-box img{
    display: flex;
    height: 100%;
}
.profile-js .button{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    cursor: pointer;
    border: 1px solid;
    border-radius: 4px;
    user-select: none;
}
.profile-js .button.send{
    color: #0a0;
    border-color: #0a0;
    width: 80px;
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
.profile-js .disabled{
    opacity: .4;
    cursor: default;
}
.icon-box>*:not(:last-child){
    margin-right: 4px;
}
</style>