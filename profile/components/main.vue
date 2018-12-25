<template>
    <div class="profile-js">
        <h1>PROFILE</h1>

        <div class="icon-box">
            <img :src="image_url">
            <fileadder
                :editmode="true"
                title="Сменить аватар"
                @changed="onFotoChanged"></fileadder>
        </div>

        <inputex
            :value="user.name"
            :maxlength="30"
            @input="onInput"></inputex>
    </div>
</template>

<script>
let fileadder=require('./file_adder.vue')
let inputex=require('./inputex.vue')
module.exports = {
    data: function(){
        return {
            user:document.mag_start_data.user,
            image_url: null,
        }
    },
    props: {
    },
    methods: {
        onInput(text){
            this.$set(this.user,'name',text)
        },
        onFotoChanged(file,file_data){
            this.image_url=file_data.pop().image
        }
    },
    created(){
        let s='/img/avatars/'
        if(this.user.avatar)s+=this.user.avatar
        else s+='anonim.png'
        this.image_url=s
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    cursor: pointer;
    border: 1px solid;
    border-radius: 4px;
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
</style>