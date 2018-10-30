<template>
    <div class="pannel">
        <div class="button"
            v-if="this.add && !adding_mode"
            @click="onAddPostClick">Создать публикацию</div>

        <adder v-if="adding_mode"
            method="/api/add"
            @message-setn="onMessageSent"
            @adder-close="closeAdder"></adder>

        <div>
            <div 
                class="post-box" 
                v-for="post in this.posts">
                <flashmessage
                    :key="post.id"
                    v-if="post.message"
                    :parent="post"
                    :text="post.message"
                    @closed="onFlashMessageClosed"></flashmessage>
                <div class="post"
                    :style="getStyle(post)">
                    <div class="row">
                        <span v-if="post.status=='new'" class="remark">На модерации</span>
                        <span v-if="post.updated_at">{{ post.updated_at | date }}</span>
                        <div v-if="add" class="button ico" title="Удалить"
                            @click="onPostDelClick(post)">✘</div>
                    </div>
                    <span v-if="post.user_name">{{ post.user_name }}</span>
<!--                     <div 
                        v-for="item in post.items"
                        :key="item.id"
                        v-html="item.text"
                        :class="item.class"></div> -->
                    <div v-for="item in post.items">
                        <img v-for="foto in item.fotos"
                            v-html="foto.html"
                            :src="foto.src"
                            :class="foto.class">
                        <div v-if="!item.edit_mode" v-html="item.html"></div>
                        <div v-else>edit</div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
var adder=require('./adder.vue')
var flashmessage=require('./flashmessage.vue')
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
        onFlashMessageClosed(post){
            post.message=null
        },
        onPostDelClick(post){
            // Послать запрос на удаление поста и,
            // если Ok - optimistic delete
            var data=new FormData()
            data.append('id',post.id)
            this.$http.post(window.location.origin+"/api/delete",data).then(
                function(responce){
                    var i=this.getPostIndexById(post.id)
                    if(null!==i)this.posts.splice(i,1)
                },function(responce){
                    var pi=this.getPostIndexById(post.id)
                    post.message=responce.body
                    this.$set(this.posts,pi,post)
                })
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
console.dir(responce.body.posts)                
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
        }
    },
    //     parsePosts(posts){
    //         for(var i=0;i<posts.length;i++){
    //             for(var j=0;j<posts[i]['items'].length;j++){                    
    //                 var item=posts[i]['items'][j]
    //                 var html=''
    //                 if(item['fotos'].length!=0){
    //                     var html='<div class="fotos">'
    //                     var path=window.location.origin+'/img/fotos/'
    //                     for(var h=0;h<item['fotos'].length;h++){
    //                         var foto=item['fotos'][h]
    //                         var cls=foto['class']
    //                         html+='<img class="'+cls+'"src="'+path+cls+'/'+foto['name']+'">'
    //                     }
    //                     html+='</div>'
    //                 }
    //                 html+='<div class="text" title="Редактировать текст">'
    //                 if(null===item['tag']){
    //                     html+=item['text']
    //                 }else{
    //                     var tag=item['tag']
    //                     var tag_o='<'+tag+'>'
    //                     var tag_c='</'+tag+'>'
    //                     html+=tag_o+item['text']+tag_c
    //                 }
    //                 html+='</div>'
    //                 item['text']=html
    //             }
    //         }
    //         return posts
    //     }
    // },
    created(){
        this.refresh()
    },
    components: {
        adder,
        flashmessage
    }
}    
</script>

<style>
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
    padding: 8px;
}
.post .row{
    display: flex;
    justify-content: space-between;
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
    color: #fff;
    font-weight: bold;
    background-color: #4c2;
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