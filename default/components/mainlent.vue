<template>
    <div class="pannel">
        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @closed="onFlashMessageClosed"></flashmessage>
        <div class="button"
            v-if="add && !adding_mode"
            @click="onAddPostClick">Создать публикацию</div>

        <adder v-if="adding_mode"
            method="/api/add"
            @message-setn="onMessageSent"
            @adder-close="closeAdder"></adder>

        <div>
            <div 
                class="post-box" 
                v-for="post in posts">
                <flashmessage
                    :key="post.id"
                    v-if="post.message"
                    :parent="post"
                    :message="post.message"
                    @confirmed="onConfirmPostDel"
                    @closed="onFlashMessageClosed"></flashmessage>
                <div class="post"
                    :style="getStyle(post)">
                    <div class="row">
                        <span v-if="post.status=='new'" class="remark">На модерации</span>
                        <span v-if="post.updated_at">{{ post.updated_at | date }}</span>
                        <div v-if="add" class="button ico" title="Удалить"
                            @click="onPostDelClick(post)">✘</div>
                    </div>
                    <span v-if="!add">{{ post.user_name }}</span>

                    <div v-for="(item,i_i) in post.items">
                        <div class="fotos">
                            <img v-for="foto in item.fotos"
                                v-html="foto.html"
                                :src="foto.src"
                                :class="foto.class">
                        </div>
                        <div v-if="!item.edit_mode" class="item">
                            <span v-html="item.html"></span>
                            <span class="sub r125" title="Редактировать текст"
                                @click="onItemEdit(post,item)">✏</span>
                        </div>
                        <div v-else class="item">
                            <inputex
                                v-model="item.text"
                                @ok="onItemEditOk(post,item)"
                                @cancel="onItemEditCancel(post,item)"></inputex>
<!--                             <input v-model="item.text">
                            <span class="sub ok" title="Сохранить"
                                @click="onItemEditOk(post,item)">✔</span>
                            <span class="sub cancel" title="Отменить"
                                @click="onItemEditCancel(post,item)">✘</span> -->
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
var adder=require('./adder.vue')
var flashmessage=require('./flashmessage.vue')
var inputex=require('./inputex.vue')
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
            message: null
        }
    },
    props:{
        type: String,
        add: Boolean
    },
    methods: {
        onItemEdit(post,item){
            item.edit_mode=true
            this.updatePost(post)
        },
        onItemEditOk(post,item){
            var data=new FormData()
            data.append('iid',item.id)
            data.append('text',item.text)
            this.$http.post(window.location.origin+"/api/edititem",data).then(

                function(responce){
                    post.message={
                        style: 'ok',
                        type: 'info',
                        text: 'Готово!'
                    }
                    item.edit_mode=false
                    item=this.setItemHtml(item)
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
        onItemEditCancel(post,item){
            item.edit_mode=false
            this.updatePost(post)            
        },
        onFlashMessageClosed(post){
            post.message=null
            this.updatePost(post)
        },
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
            for(var i=0;i<posts.length;i++){
                for(var j=0;j<posts[i]['items'].length;j++){                    
                    var item=posts[i]['items'][j]
                    for(var n=0;n<item.fotos.length;n++){
                        var foto=item.fotos[n]
                        foto.src='/img/fotos/'+foto.class+'/'+foto.name
                    }
                    if(item.tag){
                        item.o_tag='<'+item.tag+'>'
                        item.c_tag='</'+item.tag+'>'
                        item.html='<'+item.tag+'>'+item.text+'</'+item.tag+'>'
                    }else{
                        item.html=item.text
                    }
                }
            }
            return posts
        },
        setItemHtml(item){
            if(item.tag){
                item.o_tag='<'+item.tag+'>'
                item.c_tag='</'+item.tag+'>'
                item.html='<'+item.tag+'>'+item.text+'</'+item.tag+'>'
            }else{
                item.html=item.text
            }
            return item     
        }
    },
    created(){
        this.refresh()
    },
    components: {
        adder,
        flashmessage,
        inputex
    }
}    
</script>

<style>
.row{
    display: flex;
    justify-content: space-between;
}
.ok{
    color: #0a0;
    border-color: #0a0;
}
.cancel{
    color: #888;
    border-color: #888;
}
.r125{
    opacity: 0.5;
    transform: rotate(155deg);
    transition: all 0.5s ease;
}


.post *{
    margin: 0;
}
.post{
    position: relative;
    display: inline-flex;
    flex-flow: column;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-top: 8px;
}
.post .row>*{
    margin-right: 14px;
}
.post .row>*:last-child{
    margin-right: 0;
}
.post .remark{
    font-style: italic;
}


.post .item{
    position: relative;
    margin: 4px;
    padding: 2px 6px;
    border-radius: 12px;
    cursor: default;
}
/*.post .item:last-child{
    margin-bottom: 0;
}*/
/*.post .item .text:hover{
    background-color: rgba(0,0,0,0.1);
}*/
.post .item h1,
.post .item h2,
.post .item h3{
    text-align: center;
}
.post .item .sub{
    display: inline-block;
    font-size: 24px;
    color: #04f;
}
.post .item .text:hover .sub{
    display: inline-block;
    cursor: pointer;
}
.post .item .text:hover .r125{
    opacity: 1;
    transform: rotate(125deg);
    transition: all 0.5s ease;
}

.ico,
.mini{
    display: inline-block;
    margin: 6px 8px 0 0;
}
.ico:last-child,
.mini:last-child{
    margin-right: 0;
}
.ico{    
    border-radius: 6px;
}
.mini{    
    border-radius: 12px;
}
.button{
    display: inline-block;
    font-weight: bold;
    border-radius: 6px;
    padding: 0 6px 2px 6px;
    cursor: pointer;
    user-select: none;
}
.button.ico{
    display: inline-flex;
    width: 22px;
    height: 22px;
    justify-content: center;
    margin: 0;
    padding: 0;
    color: #000;
    background-color: rgba(0,0,0,0);
    border:1px solid #000;
    opacity: .1;
    transition: opacity 0.4s ease;
}
.button.ico:hover{
    opacity: .8;
    transition: opacity 0.4s ease;
}
.button.ico:active{
    background-color: #fff;
    color: #888;
    border-color: #aaa;
}
</style>