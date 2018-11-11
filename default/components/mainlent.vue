<template>
    <div class="tabsheet">

        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @closed="onFlashMessageClosed"></flashmessage>

        <div class="button ok"
            v-if="add && !adding_mode"
            @click="onAddPostClick">Создать публикацию</div>

        <adder v-if="adding_mode"
            method="/api/add"
            :post="edited_post"
            @message-setn="onMessageSent"
            @adder-close="closeAdder"></adder>

        <post v-for="post in posts"
            :data="post"
            :canedit="canedit"
            @edit="onPostEdit(post)"></post>

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
            user:{
                id: '25'
            },
            adding_mode: false,
            edited_post: undefined,
            message: null
        }
    },
    props:{
        type: String,
        add: Boolean
    },
    methods: {
        onPostEdit(post){
            this.edited_post=post,
            this.adding_mode=true
        },
        onFlashMessageClosed(post){
            post.message=null
            this.updatePost(post)
        },
        // onItemEdit(post,item){
        //     item.edit_mode=true
        //     this.updatePost(post)
        // },
        // onItemEditOk(post,item){
        //     var data=new FormData()
        //     data.append('iid',item.id)
        //     data.append('text',item.text)
        //     this.$http.post(window.location.origin+"/api/edititem",data).then(

        //         function(responce){
        //             post.message={
        //                 style: 'ok',
        //                 type: 'info',
        //                 text: 'Готово!'
        //             }
        //             item.edit_mode=false
        //             item=this.setItemHtml(item)
        //             this.updatePost(post)
        //         },

        //         function(responce){
        //             post.message={
        //                 style: 'danger',
        //                 type: 'info',
        //                 text: responce.body
        //             }
        //             this.updatePost(post)
        //         })
        // },
        // onItemEditCancel(post,item){
        //     item.edit_mode=false
        //     this.updatePost(post)            
        // },
        delPost(post){
            // Послать запрос на удаление поста и,
            // если Ok - optimistic delete
            var data=new FormData()
            data.append('id',post.id)
            this.$http.post(window.location.origin+"/api/delete",data).then(

                function(responce){
                    var i=this.getPostIndexById(post.id)
                    if(null!==i)this.posts.splice(i,1)
                    this.message={
                        style: 'ok',
                        type: 'info',
                        text: 'Готово!'
                    }
                    this.updatePost(post)
                },

                function(responce){
                    post.message={
                        style: 'danger',
                        type: 'info',
                        text: responce.body
                    }
                    this.updatePost(post)
                })
        },
        onConfirmPostDel(post){
            // Подтвердить удаление и удалить пост
            post.message=null
            this.updatePost(post)

            return  this.delPost(post)
        },
        onPostDelClick(post){
            // Зопросить подтверждение удаления поста
            post.message={
                        style: 'danger',
                        type: 'confirm',
                        text: 'Удалённую публикацию будет невозможно восстановить. Удалить?'
                    }
                    this.updatePost(post)
        },
        getStyle(post){
            var bc=document.mag_start_data.colors[post.bgci]
            var ststr='background-color:'+bc+';'
            if(post.status=='new')ststr+='opacity: 0.5;'
            return ststr
        },
        onMessageSent(){},
        closeAdder(){
            this.adding_mode=false
        },
        onAddPostClick(){
            this.edited_post={
                    bgci:0,
                    items:[
                        {align: 'center',tag: 'text',text: '',fotos_class:'ico'}
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
                    // console.log('length='+this.posts.length)
            for(var i=0;i<this.posts.length;i++){
                if(this.posts[i].id===id){
                    // console.log(id+'==='+this.posts[i].id)
                    return i
                }//else console.log(id+'!=='+this.posts[i].id)
            }
            return null
        },
        updatePosts(new_posts){
            // Обновить все полученные посты
            for(var i=0;i<new_posts.length;i++){
                var pi=this.getPostIndexById(new_posts[i].id)
                if(null===pi){
                    this.posts.push(new_posts[i])
                }else{
                    // console.log('posts['+pi+']===new_posts['+i)
                    this.$set(this.posts,pi,new_posts[i])
                }
            }
            this.sortPosts()
            // console.dir(this.posts)
        },
        request(){
            var options= {
                params: {
                    lastupdate: this.lastupdate,
                    curpage: this.curpage
                }
            }
            this.$http.get(window.location.origin+"/api/"+this.type,options).then(function(responce){                
                    if(responce.body=='Ok')return
                    if (!responce.body.posts){
                        this.posts.splice(0)
                        return
                    }
                    if(responce.body.posts.length>0){
                        this.updatePosts(this.parsePosts(responce.body.posts))
                        // this.lastupdate=responce.body.lastupdate

                    }
                },function(){
                    this.posts.splice(0)
                })
        },
        refresh(){
            this.request()
        },
        parsePosts(posts){
            // for(var i=0;i<posts.length;i++){
            //     for(var j=0;j<posts[i]['items'].length;j++){                    
            //         var item=posts[i]['items'][j]
            //         for(var n=0;n<item.fotos.length;n++){
            //             var foto=item.fotos[n]
            //             foto.src='/img/fotos/'+foto.class+'/'+foto.name
            //         }
            //         if(item.tag){
            //             item.o_tag='<'+item.tag+'>'
            //             item.c_tag='</'+item.tag+'>'
            //             item.html='<'+item.tag+'>'+item.text+'</'+item.tag+'>'
            //         }else{
            //             item.html=item.text
            //         }
            //     }
            // }
            return posts
        },
    },
    created(){
        this.refresh()
    },
    computed:{
        canedit:function(){
            return this.add && !this.adding_mode
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
    padding: 8px 0 0 0;
    border-top: 2px solid #ddd;
}
.post{
    position: relative;
    display: inline-flex;
    flex-flow: column;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-top: 8px;
}
</style>