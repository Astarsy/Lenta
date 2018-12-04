<template>
    <div class="tabsheet">

        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @confirmed="onConfirmPostDel"
            @closed="onFlashMessageClosed"></flashmessage>

        <div v-if="canadd && !adding_mode" class="my-pannel" 
            @click="onAddPostClick">
            <span class="button ok">Создать публикацию</span>
            <span class="user-name">{{ user.name }}</span>
        </div>

        <div v-if="tab.user" class="tab-title">
            <span class="user-title">
                <img v-if="tab.user.avatar" class="avatar"
                    :src="'/img/avatars/'+tab.user.avatar">
                <span class="user-name">{{ tab.user.name }}</span>
            </span>
            <span class="subscribe-button">Подписаться</span>
        </div>

        <adder v-if="adding_mode"
            :post="edited_post"
            @delete="onPostDelClick"
            @message-setn="onMessageSent"
            @adder-close="closeAdder"></adder>

        <post v-for="post in posts"
            :curuser="user"
            :data="post"
            :canedit="canedit"
            :hidetitle="tab.user"
            @edit="onPostEdit(post)"
            @user-click="onPostUserClick"></post>

    </div>
</template>

<script>
var adder=require('./adder.vue')
var flashmessage=require('./flashmessage.vue')
var post=require('./post.vue')
module.exports={
    data: function(){
        return {
            curpage: 0,
            lastupdate: 0,
            posts: [],
            user: document.mag_start_data.user,
            adding_mode: false,
            edited_post: undefined,
            message: null
        }
    },
    props:{
        tab: Object,
        canadd: Boolean
    },
    methods: {
        onPostUserClick(user){
            this.$emit('open-user-lent',user)
        },
        onPostEdit(post){
            this.edited_post=post,
            this.adding_mode=true
        },
        onFlashMessageClosed(post){
            post.message=null
            this.updatePost(post)
        },
        deletePost(pid){
            var data=new FormData()
            data.append('id',pid);

            this.$http.post(window.location.origin+"/api/del",data).then(function(responce){
// console.dir(responce.body)
                    this.message={
                        style: 'ok',
                        type: 'info',
                        text: "Публикация успешно удалена."
                    }
                    this.adding_mode=false
                    var index=this.getPostIndexById(pid)
                    this.posts.splice(index,1)
                },
                function(responce){
// console.dir(responce.body)
                    this.message={
                        style: 'danger',
                        type: 'info',
                        text: "Не удалось удалить публикацию."
                    }
                })
        },
        onConfirmPostDel(){
            // Подтвердить удаление и удалить пост
            this.message=null
            var pid=this._del_pid
            if(pid){
                this.deletePost(pid)
            }
        },
        onPostDelClick(pid){
            // Зопросить подтверждение удаления поста, id поста временно сохранить.
            this.message={
                        style: 'danger',
                        type: 'confirm',
                        text: 'Удалённую публикацию будет невозможно восстановить. Удалить навсегда?'
                    }
            this._del_pid=pid
        },
        getStyle(post){
            var bc=document.mag_start_data.colors[post.bgci]
            var ststr='background-color:'+bc+';'
            if(post.status=='new')ststr+='opacity: 0.5;'
            return ststr
        },
        onMessageSent(post){
            var text
            if(post.id)text='Публикация успешно сохранена!'
            else text='Публикация успешно создана!'
            this.message={
                        style: 'ok',
                        type: 'info',
                        text: text
                    }
            this.adding_mode=false

            if(post.is_new){
                post.is_new=undefined
                this.posts.unshift(post)
            }
            else this.updatePost(post)

        },
        closeAdder(){
            this.adding_mode=false
        },
        onAddPostClick(){
            this.edited_post={
                    bgci:0,
                    items:[
                        {fotos_align: 'center',tag: 'text',text: '',fotos_class:'ico',access:null}
                        ]
                    }
            this.adding_mode=true
        },
        updatePost(post){
            var pi=this.getPostIndexById(post.id)
            if(null!==pi)this.$set(this.posts,pi,post)
        },
        sortPosts(){
            // Упорядочить посты
            this.posts.sort(function(a,b){
                var tsa=new Date(a.updated_at).getTime()
                var tsb=new Date(b.updated_at).getTime()
                if(tsa>tsb)return -1;
                if(tsa<tsb)return 1;
            })
        },
        getPostIndexById(id){
            // Вернуть индекс поста по id/null
            for(var i=0;i<this.posts.length;i++)if(this.posts[i].id===id)return i
            return null
        },
        updatePosts(new_posts){
            // Обновить все полученные посты
            for(var i=0;i<new_posts.length;i++){
                var pi=this.getPostIndexById(new_posts[i].id)
                if(null===pi){
                    this.posts.push(new_posts[i])
                }else{
                    this.$set(this.posts,pi,new_posts[i])
                }
            }
            this.sortPosts()
        },
        request(){
            var options= {
                params: {
                    lastupdate: this.lastupdate,
                    curpage: this.curpage
                }
            }
            if(this.tab.params)options.params=Object.assign(options.params,this.tab.params)
            this.$http.get(window.location.origin+"/api/"+this.tab.type,options).then(function(responce){                

console.log('last update '+this.lastupdate)
console.dir(responce.body)

                    if(responce.body=='Ok')return
                    if (!responce.body.posts){
                        this.posts.splice(0)
                        return
                    }
                    if(responce.body.posts.length>0){
                        this.updatePosts(responce.body.posts)
                        this.lastupdate=responce.body.lastupdate
                    }
                },function(responce){  
console.dir(responce.body)                  
                    if(responce.status==403){
                        // try to refresh access for current user by reloading the page
                        // console.log('403')
                        window.location='/html/login'
                    }else{                        
                        // this.message={
                        //     style: 'danger',
                        //     type: 'info',
                        //     text: 'Похоже что-то не получилось... Если это повторится, пожалуйста, сообщите нам, мы обязательно поможем!'
                        // }
                    }
                })
        },
    },
    created(){
        this.request()
    },
    computed:{
        canedit:function(){
            return this.canadd && !this.adding_mode
        }
    },
    components: {
        adder,
        flashmessage,
        post
    }
}    
</script>

<style>
.tabsheet{
    display: flex;
    flex-flow: column;
    /*padding: 8px 0 0 0;*/
    /*border-top: 2px solid #ddd;*/
    margin: 0 2px;
    /*width: 80%;*/
}
.my-pannel{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 12px;
}
.user-name{
    display: flex;
    font-weight: bold;
    font-size: 20px;
    color: #8600D7;
}
.tab-title{
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.tab-title .avatar,
.tab-title .user-name{
    cursor: default;
}
.user-title{
    display: flex;
    align-items: center;
}
.subscribe-button{
    font-size: 18px;
    padding: 4px 8px;
    font-weight: bold;
    color: #3b3;
    border: 2px solid #3b3;
    cursor: pointer;
}
</style>