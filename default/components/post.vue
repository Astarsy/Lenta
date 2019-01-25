<template>
    <div class="post"
        :style="style">

        <flashmessage v-if="data.message"
            :key="data.id"
            :parent="data"
            :message="data.message"
            @ok="onConfirmPostDel"
            @close="onFlashMessageClosed"></flashmessage>

        <div v-if="!hide_title" class="post-title"
            :class="{ 'status-new' : data.status=='new' }">
            <img draggable="false" class="avatar"
                 :src="'/img/avatars/'+avatar"
                 @click="onUserClick({id:data.user_id,name:data.user_name,avatar:data.user_avatar})">
            <span>
                <span class="user-name"
                    @click="onUserClick({id:data.user_id,name:data.user_name,avatar:data.user_avatar})">{{ data.user_name }}</span>
                <span v-if="data.status=='new'">Новая публикация</span>
                <span>{{ data.updated_at | date }}</span>
                <span v-if="data.access" class="access" title="Приватная публикация">Приватная</span>
            </span>
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

        <div class="comment-box">
            <span class="comment-head"
                @click.stop="is_comments_open=!is_comments_open">Комментариев</span>
            <span v-if="data.comments_count>0">{{ data.comments_count }}</span>
            <span v-else>нет</span>
            <span class="comment-simbol">{{ comment_simbol }}</span>
            <comments v-if="is_comments_open"
                :data="data"></comments>
        </div>

        <div v-if="canedit"
            class="edit"
            title="Редактировать публикацю"
            @click="$emit('edit')">✎</div>

    </div>
</template>

<script>
var flashmessage=require('./flashmessage.vue')
var comments=require('./comments.vue')
module.exports = {
    data: function(){
        return{
            is_comments_open: false
            // user: document.mag_start_data.user
        }
    },
    props:{
        data: Object,
        canedit: {
            type: Boolean,
            default: false
        },
        curuser:{
            type: Object,
            default: null
        },
        tabuser:{
            type: Object,
            default: null
        }
    },
    methods: {
        onUserClick(uid){
            this.$emit('user-click',uid)
        },
        text_box_class:function(item){
            var res=item.tag?item.tag:'text'
            return res
        },
        foto_class_safe:function(item){
            var fc=item.fotos_class
            if(!fc)fc='ico'
            return fc
        },
        getFotoSrc(item,foto){
            var fc=item.fotos_class
            if(!fc)fc='ico'
            return '/img/fotos/'+fc+'/'+foto.name
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
        comment_simbol:function(){
            if(this.is_comments_open)return '^'
            else return 'v'
        },
        // avatar:function(){
        //     return "/img/avatars/"+this.curuser.user_avatar
        // },
        style:function(){
            var bc=document.mag_start_data.colors[this.data.bgci]
            var ststr='background-color:'+bc+';'
            if(this.data.status=='new')ststr+='opacity: 0.5;'
            return ststr
        },
    },
    created(){
        // console.dir(this.data)
    },
    components: {
        flashmessage,
        comments
    }
}
</script>

<style>

.post{
    position: relative;
    display: flex;
    flex-flow: column;
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
}
.post .edit{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 4px;
    right: 6px;
    width: 34px;
    height: 34px;
    background-color: #f5f5f5;
    border-radius: 100px;
    border: 1px solid #0772a1;
    color: #0772a1;
    font-size: 28px;
    font-weight: bold;
    transform: rotate(110deg);
    cursor: pointer;
    opacity: .5;
}
.post:hover .edit{
    opacity: 1;
}
.post .edit:hover{
    background-color: #fff;
}
.post-title{
    display: flex;
    align-content: center;
    align-items: center;    
    margin: 2px 8px;
    text-align: center;
}
.post-title.status-new{
    font-style: italic;
}
.post-title>span{
    display: flex;
    align-items: baseline;
}
.avatar{
    border-radius: 80px;
    max-height: 38px;
    max-width: 38px;
    cursor: pointer;
    overflow: hidden;
}
.user-name{
    margin: 0 12px;
    /*font-weight: bold;*/
    cursor: pointer;
}
.post-title .access{
    display: flex;
    justify-content: center;
    align-items: center;
    /*width: 24px;*/
    /*height: 24px;*/
    color: #d77;
    /*font-weight: bold;*/
    margin-left: 10px;
    /*border: 2px solid #d77;*/
    /*border-radius: 100%;*/
    cursor: default;
}


.fotos{
    display: flex;
    justify-content: center;
    overflow: hidden;
}
.fotos div.foto{
    margin-right: 6px;
}
.fotos div.foto:last-child{
    margin-right: 0;
}
.foto img{
    display: flex;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
}
.item_box{
    /*display: block;*/
    /*text-align: center;*/
    margin-bottom: 4px;
}
.item{
    margin: 0 8px;
}
.stub{
    clear: both;
}
.left .fotos{
    float: left;
    margin-right: 8px;
}
.left .text{
    /*margin-right: 4px;*/
}
.right .fotos{
    float: right;
    margin-left: 8px;
}
.comment-box{
    color: #888;
    font-style: italic;
    margin-left: 4px;
    user-select: none;
}
.comment-head{
    cursor: pointer;
}
.comment-simbol{
    font-style: normal;
    font-size: 14px;
}
</style>