<template>
    <div class="tabsheet">

        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @ok="onConfirmPostDel"
            @close="onFlashMessageClosed"></flashmessage>

        <div v-if="tab.canadd && !adding_mode" class="my-pannel"
            @click="onAddPostClick">
            <span class="button ok">Создать публикацию</span>
            <span class="user-name">{{ user.name }}</span>
        </div>
        <div v-if="tab.user" class="tab-title">
            <span class="user-title">
                <img draggable="false" v-if="tab.user.avatar" class="avatar"
                    :src="'/img/avatars/'+tab.user.avatar">
                <span class="user-name">{{ tab.user.name }}</span>
            </span>
            <span v-if="user"
                class="button ok"
                @click="onMessage">Написать сообщение</span>

            <span v-if="cansubscribe" class="subscribe-button"
                @click="onSubscribe">Подписаться</span>
            <span v-if="is_subscribed" class="subscribe-text">Вы подписаны</span>

            <span v-if="canfriend" class="subscribe-button"
                @click="onFriend">Подружиться</span>
            <span v-if="is_friend" class="subscribe-text">Друг</span>

        </div>

        <addmessage v-if="adding_mode=='message'"
            :post="edited_post"
            @message-setn="onMessageSent"
            @adder-close="closeAdder"></addmessage>

        <adder v-if="adding_mode=='post'"
            :post="edited_post"
            @delete="onPostDelClick"
            @message-setn="onMessageSent"
            @adder-close="closeAdder"></adder>

        <post v-for="post in posts"
            :curuser="user"
            :data="post"
            :canedit="canedit"
            :tabuser="tab.user"
            @edit="onPostEdit(post)"
            @user-click="onPostUserClick"></post>

        <!--<div class="button"-->
            <!--@click="onMore"-->
            <!--title="ещё">⟲</div>-->

    </div>
</template>

<script>
var adder=require('./adder.vue')
var addmessage=require('./addmessage.vue')
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
            message: null,
            wait_scroll_update_time: 0
        }
    },
    props:{
        tab: Object,
//        canadd: Boolean,
        subscribes:{
            type: Array,
            default: null
        },
        friends:{
            type: Array,
            default: null
        }
    },
    methods: {
        onMessage(){
            // Кнопка Написать сообщение
//            this.$emit('message-to',this.tab.user)
            this.edited_post={
                to_user_id: this.tab.user.id,
                bgci:0,
                items:[
                    {fotos_align: 'center',tag: 'text',text: '',fotos_class:'ico',access:null}
                ]
            }
            this.adding_mode='message'
        },
        onSubscribe(){
            this.$emit('subscribe',this.posts[0].user_id)
        },
        onFriend(){
            this.$emit('friend',this.posts[0].user_id)
        },
        onPostUserClick(user){
            this.$emit('open-user-lent',user)
        },
        onPostEdit(post){
            this.edited_post=post
            this.adding_mode='post'
        },
        onFlashMessageClosed(post){
            this.message=null
//            this.updatePost(post)
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
        onPostDelClick(id){
            // Запросить подтверждение удаления поста, id поста временно сохранить.
            this.message={
                        style: 'danger',
                        type: 'confirm',
                        text: 'Удалённую публикацию будет невозможно восстановить. Удалить навсегда?'
                    }
            this._del_pid=id
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
            this.adding_mode='post'
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
            for(var i=0;i<this.posts.length;i++)if(this.posts[i].id==id)return i
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
                    curpage: this.curpage,
                    postcount: this.posts.length
                }
            }
            if(this.tab.params)options.params=Object.assign(options.params,this.tab.params)
            this.$http.get(window.location.origin+"/api/"+this.tab.type,options).then(function(responce){                

// console.log('last update '+this.lastupdate)
 //console.dir(responce.body.posts)

                    if(responce.body==='Ok'){
                        this.wait_scroll_update_time=Date.now()
                        //console.log('Ok')
                        return
                    }
                    this.wait_scroll_update_time=0
                    if (!responce.body.posts){
                        this.posts.splice(0)
                        return
                    }
                    if(responce.body.posts.length>0){
                        this.updatePosts(responce.body.posts)
                        this.lastupdate=responce.body.lastupdate
                    }
                },function(responce){  
// console.dir(responce.body)                  
                    if(responce.status==403){
                        // try to refresh access for current user by reloading the page
                        // console.log('403')
// console.dir(this.tab)
                        document.cookie='cur_url='+this.tab.type+';path=/;'
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
        onMore(){
            this.curpage++
            this.lastupdate=0

//            console.log('requesting page '+this.curpage)

            this.request()
        },
        onScrollBit(){
            let dt=(Date.now()-this.wait_scroll_update_time)/1000
            if(dt<3)return
            this.wait_scroll_update_time=Date.now()
//            console.log(dt)
            this.onMore()
        },
        onWindowScroll(){
            let scrollHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            )
            let d=window.pageYOffset+window.innerHeight-scrollHeight
            if(d>-20){
//                console.log(d)
                this.onScrollBit()
            }
        }
    },
    created(){
        window.addEventListener('scroll',this.onWindowScroll)
        this.request()
    },
    computed:{
        is_subscribed(){
            if(!this.subscribes)return false
            const tab_author_id=this.tab.id
            for(let i=0;i<this.subscribes.length;i++){
                if(this.subscribes[i].id===tab_author_id)return true
            }
            return false
        },
        is_friend(){
            if(!this.friends)return false
            const tab_friend_id=this.tab.id
            for(let i=0;i<this.friends.length;i++){
                if(this.friends[i].id===tab_friend_id)return true
            }
            return false
        },
        cansubscribe(){
            if(!this.subscribes || !this.posts || !this.posts[0])return false
            let auth_id=this.posts[0].user_id
            for(let i=0;i<this.subscribes.length;i++){
                if(this.subscribes[i].id===auth_id)return false
            }
            return true
        },
        canfriend(){
            // console.dir(this.subscribes)
            // console.dir(this.posts)
            if(!this.friends || !this.posts || !this.posts[0])return false
            let friend_id=this.posts[0].user_id
            for(let i=0;i<this.friends.length;i++){
                if(this.friends[i].id===friend_id)return false
            }
            return true
        },
        canedit: function(){
            return this.tab.canadd && !this.adding_mode
        }
    },
    components: {
        adder,
        addmessage,
        flashmessage,
        post
    }
}    
</script>

<style>
.my-pannel{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 4px 0 0 0;
}
.user-name{
    display: flex;
    font-size: 20px;
    color: #8600D7;
}
.tab-title{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 4px 0;
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
.subscribe-text{
    color: #8600D7;
    font-style: italic;
}
</style>