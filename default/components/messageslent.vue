<template>
    <div class="tabsheet">

        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @ok="onConfirmPostDel"
            @close="onFlashMessageClosed"></flashmessage>

        <addmessage v-if="edited_post"
                    :post="edited_post"
                    @delete="onMsgDelClick"
                    @message-setn="onMsgSent"
                    @adder-close="closeAdder"></addmessage>

        <message
            v-for="post in posts"
            :user="user"
            :data="post"
            @answer-for-message="onMessage"
            @edit="onPostEdit(post)"
            @user-click="onPostUserClick"></message>

    </div>
</template>

<script>
let addmessage=require('./addmessage.vue')
let flashmessage=require('./flashmessage.vue')
let message=require('./message.vue')
module.exports={
    data: function(){
        return {
            curpage: 0,
            lastupdate: 0,
            posts: [],
            user: document.mag_start_data.user,
            edited_post: null,
            f_message: null,
            wait_scroll_update_time: 0
        }
    },
    props:{
        tab: Object,
    },
    methods: {
        closeAdder(){
            this.edited_post=null
        },
        onMsgDelClick(id){
            // Запросить подтверждение удаления поста, id поста временно сохранить.
            this.message={
                style: 'danger',
                type: 'confirm',
                text: 'Удалённую публикацию будет невозможно восстановить. Удалить навсегда?'
            }
            this._del_pid=id
        },
        onMsgSent(){},
        onMessage(for_message){
            // Нажата кнопка Ответить
            this.edited_post={
                for_message_id: for_message.id,
                bgci:0,
                items:[
                    {fotos_align: 'center',tag: 'text',text: '',fotos_class:'ico',access:null}
                ]
            }
        },
        onPostEdit(post){
            this.edited_post=post
        },
        onPostUserClick(user){
            this.$emit('open-user-lent',user)
        },
        onPostUserClick(user){
            this.$emit('open-user-lent',user)
        },
        onFlashMessageClosed(post){
            this.f_message=null
//            this.updatePost(post)
        },
        deletePost(pid){
            let data=new FormData()
            data.append('id',pid);

            this.$http.post(window.location.origin+"/api/delmsg",data).then(function(responce){
// console.dir(responce.body)
                    this.f_message={
                        style: 'ok',
                        type: 'info',
                        text: "Сообщение успешно удалено."
                    }
                    let index=this.getPostIndexById(pid)
                    this.posts.splice(index,1)
                },
                function(responce){
// console.dir(responce.body)
                    this.f_message={
                        style: 'danger',
                        type: 'info',
                        text: "Не удалось удалить сообщение."
                    }
                })
        },
        onConfirmPostDel(){
            // Подтвердить удаление и удалить пост
            this.f_message=null
            let pid=this._del_pid
            if(pid){
                this.deletePost(pid)
            }
        },
        onPostDelClick(pid){
            // Запросить подтверждение удаления поста, id поста временно сохранить.
            this.f_message={
                        style: 'danger',
                        type: 'confirm',
                        text: 'Удалённое сообщение будет невозможно восстановить. Удалить навсегда?'
                    }
            this._del_pid=pid
        },
        getStyle(post){
            let bc=document.mag_start_data.colors[post.bgci]
            let ststr='background-color:'+bc+';'
            if(post.status==='new')ststr+='opacity: 0.5;'
            return ststr
        },
        closeAdder(){
            this.edited_post=null
        },
        onMessageSent(post){
            let text
            if(post.id)text='Публикация успешно сохранена!'
            else text='Публикация успешно создана!'
            this.f_message={
                        style: 'ok',
                        type: 'info',
                        text: text
                    }

            if(post.is_new){
                post.is_new=undefined
                this.posts.unshift(post)
            }
            else this.updatePost(post)

        },
        updatePost(post){
            let pi=this.getPostIndexById(post.id)
            if(null!==pi)this.$set(this.posts,pi,post)
        },
        sortPosts(){
            // Упорядочить посты
            this.posts.sort(function(a,b){
                let tsa=new Date(a.updated_at).getTime()
                let tsb=new Date(b.updated_at).getTime()
                if(tsa>tsb)return -1;
                if(tsa<tsb)return 1;
            })
        },
        getPostIndexById(id){
            // Вернуть индекс поста по id/null
            for(let i=0;i<this.posts.length;i++)if(this.posts[i].id===id)return i
            return null
        },
        updatePosts(new_posts){
            // Обновить все полученные посты
            for(let i=0;i<new_posts.length;i++){
                let pi=this.getPostIndexById(new_posts[i].id)
                if(null===pi){
                    this.posts.push(new_posts[i])
                }else{
                    this.$set(this.posts,pi,new_posts[i])
                }
            }
            this.sortPosts()
        },
        request(){
            let options= {
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
                        // this.f_message={
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
    components: {
        addmessage,
        flashmessage,
        message
    }
}    
</script>

<style>
</style>