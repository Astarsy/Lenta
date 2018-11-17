<template>
    <div class="adder">

        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @closed="onFlashMessageClosed"></flashmessage>

        <div class="head">
            <h3 v-if="is_new">Создать публикацию</h3>
            <h3 v-else>Редактировать публикацию</h3>
            <colorpeeker :bgci="data.bgci" @color-choice="onColorChoice"></colorpeeker>
        </div>

        <div class="post"
            :style="{ 'background-color' : bg_color }">

            <span class="delete-post" @click.stop="onDelete" title="Удалить всю публикацию">✘</span>

            <div class="post-title"
                :class="{ 'status-new' : data.status=='new' }">
                <span v-if="data.status=='new'">Новая публикация</span>
                <span>{{ data.updated_at | date }}</span>
            </div>

            <postitem v-for="(item,k) in data.items"
                class="item-box"
                :ref="'item_'+k"
                :key="k"
                :index="k"
                :itemscount="data.items.length"
                :class="getItemClass(item)"
                :item="item"
                :canedit='true'
                @changed="onItemsChanged"
                @editmodechanged="onEditmodeChanged"
                @alignchanged="onAlignChanged"></postitem>

            <span v-if="data.items.length<max_post_items_count"
                class="add-item-button" 
                :class="{ disabled : edit_mode }"
                @click="onAddItem" 
                title="Добавить абзац">✚</span>
        </div>

        <div class="buttons">
            <span v-if="is_new" class="button ok"
                :class="{ disabled : !can_save }"
                @click="onSendClick">Создать</span>
            <span v-else class="button ok"
                :class="{ disabled : !can_save }"
                @click="onSendClick">Сохранить</span>
            <span class="button cancel"
                @click="onCloseClick">Отменить</span>
        </div>

    </div>
</template>

<script>
var colorpeeker=require('./colorpeeker.vue')
var postitem=require('./addpostitem.vue')
var flashmessage=require('./flashmessage.vue')
module.exports = {
    data: function(){
// console.dir(this.post)
        return{         
            max_items_count: 3,
            data: this.$root.deepCopy(this.post),
            edit_mode: false,
            can_save: this.countItems()>0,
            message: null
        }
    },
    props:{
        post: Object        
    },
    methods: {
        onFlashMessageClosed(){
            this.message=null
        },
        onDelete(){
            if(this.data.id){
                this.$emit('delete',this.data.id)
            }
        },
        onItemsChanged(){
            this.can_save=this.countItems()>0
        },
        countItems(){
            var count=0;
            Object.entries(this.$refs).forEach(entry=>{
                var item_body=entry[1][0]
                if(item_body.deleted)return
                else count++;
            })
            return count
        },
        onSendClick: function(){
            var items=[]
            var files=[]
            var item_of_file=[]
            var item_counter=0

            Object.entries(this.$refs).forEach(entry=>{
                var item_body=entry[1][0]

                if(item_body.deleted)return

                if( !item_body.data.text 
                    && (!item_body.fotos || item_body.fotos.length==0)
                    &&(!item_body.files || item_body.files.length==0))return

                var k=entry[0]
                var item_data=entry[1][0].data

                if(item_data.fotos){
                    item_data.foto_names=[]
                    item_data.foto_ids=[]
                    for(var i=0;i<item_data.fotos.length;i++){
                        var foto=item_data.fotos[i]
                        item_data.foto_names.push(foto.name)
                        item_data.foto_ids.push(foto.id)
                    }
                }

                if(item_data.files){
                    item_data.files=[]
                    for(var i=0;i<item_data.files.length;i++){
                        var file=item_data.files[i]
                        item_data.files.push(file.name)
                        files.push(file)
                        item_of_file.push(item_counter)
                    }

                }

                items.push(item_data)
                item_counter++;
            })

            var post_to_send={
                id: this.post.id,
                bgci: this.data.bgci,
                items: items,
                item_of_file: item_of_file
            }

            this.postPost(post_to_send,files)
        },
        getItemClass:function(item){
            var c=item.fotos_align
            if(this.edit_mode)c+=' edited'
            return c
        },
        onAlignChanged(index,value){
            var item=this.data.items[index]
            item.fotos_align=value
            this.$set(this.data.items,index,item)
        },
        onEditmodeChanged(v){
            this.edit_mode=v
        },
        onAddItem(){
            if(this.edit_mode)return
            this.data.items.splice(this.data.items.length,0,
                    {fotos_align:'center',tag:'text',text:'',fotos:[], fotos_class:'mini'}
                )
        },
        onColorChoice(i){
            this.data.bgci=i
        },
        postPost(post,files){
            var data=new FormData()
            data.append('data',JSON.stringify(post));

            for(var i=0;i<files.length;i++){
                data.append('userFiles[]',files[i])
            }

// console.dir(this.method)
            this.$http.post(window.location.origin+"/api/add",data).then(function(responce){
// console.dir(responce.data)
                    if(undefined==post.id){
                        post.id=responce.data
                        post.is_new=true
                    }
                    this.$emit('message-setn',post)
                },
                function(responce){
// console.dir(responce.body)
                })
        },
        onCloseClick: function(){
            this.$emit('adder-close')
        }
    },
    computed:{
        bg_color:function(){
            return document.mag_start_data.colors[this.data.bgci]
        },
        is_new:function(){
            return !this.data.updated_at
        },
        max_post_items_count: function(){
            return document.mag_start_data.max_post_items_count
        }
    },
    mounted(){
        this.onItemsChanged()
    },
    components: {
        colorpeeker,
        postitem,
        flashmessage
    }
}
</script>
<style>
.add-item-button{
    display: inline-flex;
    width: 30px;
    justify-content: center;
    align-self: center;
    font-size: 24px;
    color: #0a0;
    user-select: none;
    cursor: pointer;
}
.add-item-button.disabled{
    color: #aaa;
    cursor: default;
}

.adder{
    display: flex;
    flex-flow: column;
    border: 2px solid #ddd;
    border-radius: 12px;
}
.adder .head{
    display: flex;
    justify-content: space-around;
    padding: 10px 0 0 0;
}
.adder .head *{
    margin: 0;
    color: #555;
}

.buttons{
    display: inline-block;
    margin: 4px 8px;
}

.delete-post{
    position: absolute;
    top: 2px;
    left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    color: #C41300;
    cursor: pointer;
    border-radius: 40px;
    opacity: .5;
}
.delete-post:hover{
    opacity: 1;
}

</style>