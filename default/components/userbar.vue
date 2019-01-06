<template>

    <div v-if="!user" class="userbar">
        <a v-if="!user" class="button enter" href="http://100tkaney.loc/lenta">
            Войти</a>
    </div>

    <div v-else class="userbar">
        <div class="icon-box">
            <div class="icon"
                    @click="is_open=!is_open">
                <img :src="icon">
            </div>
        </div>
        <div v-if="is_open">
            <a class="button enter" href="/html/profile">Профиль</a>
            <a class="button enter" href="/html/out">Выйти</a>
        </div>
    </div>

</template>

<script>
module.exports = {
    data: function(){
        return{
            is_open:false
        }
    },
    props:{
        user: Object
    },
    methods:{
    },
    computed:{
        icon:function(){
            if(this.user && this.user.avatar)return '/img/avatars/'+this.user.avatar
            else return '/img/avatars/anonim.png'
        }
    },
    created(){
//        console.dir(this.user)
    }
}
</script>
<style>
.userbar{
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
}
.userbar>div{
    display: flex;
    flex-flow: column;
    width: 100%;
}
.userbar>*:not(:last-child),
.userbar>div>*:not(:last-child){
    margin-bottom: 4px;
}
.userbar .icon-box{
    align-items: flex-end;
}
.userbar .icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    padding: 5px;
    background-color: cadetblue;
    cursor: pointer;
}
.userbar img{
    max-width: 100%;
    border-radius: 200px;
}
</style>