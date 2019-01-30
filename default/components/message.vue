<template>
    <div class="msg"
         :class="{ selfmsg : user.id==data.user_id }"
         :style="style">

        <flashmessage v-if="data.message"
            :key="data.id"
            :parent="data"
            :message="data.message"
            @ok="onConfirmPostDel"
            @close="onFlashMessageClosed"></flashmessage>

        <div class="post-title"
            :class="{ 'status-new' : data.status=='new' }">

            <span v-if="user.id!=data.user_id">
                <span>From</span>
                <span class="user-ava-name">
                <img draggable="false" class="avatar"
                     :src="'/img/avatars/'+avatar"
                     @click="onUserClick({id:data.user_id,name:data.user_name,avatar:data.user_avatar})">

                    <span class="user-name"
                        @click="onUserClick({id:data.user_id,name:data.user_name,avatar:data.user_avatar})">{{ data.user_name }}</span>
                </span>
            </span>

            <span v-else>
                <span>To</span>
                <span class="user-ava-name">
                    <img draggable="false" class="avatar"
                         :src="'/img/avatars/'+to_user_avatar"
                         @click="onUserClick({id:data.to_user_id,name:data.to_user_name,avatar:data.to_user_avatar})">

                    <span class="user-name"
                          @click="onUserClick({id:data.to_user_id,name:data.to_user_name,avatar:data.to_user_avatar})">{{ data.to_user_name }}</span>
                </span>

            </span>
            <span>
                <span>{{ data.updated_at | date }}</span>

                <span v-if="user.id!=data.user_id"
                      class="button ok send-msg"
                      @click="$emit('answer-for-message',data)">Ответить</span>

                <span v-if="data.access" class="access" title="Приватная публикация">Приватная</span>
            </span>

            <div v-if="user.id==data.user_id"
                 class="edit"
                 title="Редактировать публикацю"
                 @click="$emit('edit')">✎</div>

        </div>

        <div v-for="item in data.items"
            class="item_box"
            :class="item.fotos_align">

            <div class="item">

                <div class="fotos"
                    :class="foto_class_safe(item)">

                    <div v-for="foto in item.fotos" class="foto">
                        <img draggable="false" :src="getFotoSrc(item,foto)">
                    </div>

                </div>

                <div :class="text_box_class(item)">
                    <div v-html="item.text"></div>
                    <div class="stub" style="clear: both;"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
let flashmessage=require('./flashmessage.vue')
let comments=require('./comments.vue')
module.exports = {
    data: function(){
        return{
            is_comments_open: false
            // user: document.mag_start_data.user
        }
    },
    props:{
        data: Object,
        user:{
            type: Object,
            default: null
        }
    },
    methods: {
        onUserClick(uid){
            this.$emit('user-click',uid)
        },
        text_box_class:function(item){
            return item.tag?item.tag:'text'
        },
        foto_class_safe:function(item){
            let fc=item.fotos_class
            if(!fc)fc='ico'
            return fc
        },
        getFotoSrc(item,foto){
            let fc=item.fotos_class
            if(!fc)fc='ico'
            return '/img/msgfotos/'+fc+'/'+foto.name
        }
    },
    computed:{
        hide_title(){
            return this.tabuser || this.canedit
        },
        avatar: function(){
            if(this.data.user_avatar)return this.data.user_avatar
            else return 'anonim.png'
        },
        to_user_avatar: function(){
            if(this.data.to_user_avatar)return this.data.to_user_avatar
            else return 'anonim.png'
        },
        comment_simbol:function(){
            if(this.is_comments_open)return '^'
            else return 'v'
        },
        // avatar:function(){
        //     return "/img/avatars/"+this.curuser.user_avatar
        // },
        style:function(){
            let bc=document.mag_start_data.colors[this.data.bgci]
            let ststr='background-color:'+bc+';'
            if(this.data.status==='new')ststr+='opacity: 0.5;'
            return ststr
        },
    },
    created(){
//         console.dir(this.data)
    },
    components: {
        flashmessage,
        comments
    }
}
</script>

<style>
    .send-msg{
        margin-left: 20px;
    }
    .msg{
        display: flex;
        flex-flow: column;
        border: 1px solid #eee;
        margin: 4px 0;
        min-width: 60%;
        max-width: 90%;
    }
    .msg.selfmsg{
        align-self: flex-start;
    }
    .msg:not(.selfmsg){
        align-self: flex-end;
    }
</style>