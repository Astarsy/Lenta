<template>
    <div class="adder">
        <div class="head">
            <h3 v-if="is_new">Создать публикацию</h3>
            <h3 v-else>Редактировать публикацию</h3>
            <colorpeeker :bgci="bgci" @color-choice="onColorChoice"></colorpeeker>
        </div>

        <div class="post"
            :style="{ 'background-color' : bg_color }">

            <div class="post-title"
                :class="{ 'status-new' : data.status=='new' }">
                <span v-if="data.status=='new'">Новая публикация</span>
                <span>{{ data.updated_at | date }}</span>
            </div>

            <postitem v-for="(item,k) in items"
                class="item-box"
                :ref="'item_'+k"
                :key="k"
                :index="k"
                :itemscount="items.length"
                :class="getItemClass(item)"
                :item="item"
                :canedit='true'
                @deleted="onItemDeleted"
                @editmodechanged="onEditmodeChanged"
                @alignchanged="onAlignChanged"></postitem>

            <span v-if="items.length<max_post_items_count"
                class="add-item-button" 
                :class="{ disabled : edit_mode }"
                @click="onAddItem" 
                title="Добавить абзац">✚</span>
        </div>

        <div class="buttons">
            <span v-if="is_new" class="button ok"
                @click="onSendClick">Создать</span>
            <span v-else class="button ok"
                @click="onSendClick">Сохранить</span>
            <span class="button cancel"
                @click="onCloseClick">Отменить</span>
        </div>

    </div>
</template>

<script>
var colorpeeker=require('./colorpeeker.vue')
var postitem=require('./addpostitem.vue')
module.exports = {
    data: function(){
// console.dir(this.post)
        return{         
            max_items_count: 3,
            items: this.$root.deepCopy(this.post.items),
            data: this.post,
            bgci: this.post.bgci,
            edit_mode: false
        }
    },
    props:{
        method:{
            type: String,
            required: true,
        },
        post: Object        
    },
    methods: {
        onSendClick: function(){
            var items=[]
            var files=[]
            var item_of_file=[]
            var item_counter=0
            Object.entries(this.$refs).forEach(entry=>{
                var k=entry[0]
                var item_data=entry[1][0].data
                var item={
                    id: item_data.id,
                    text: item_data.text,
                    tag: item_data.tag,
                    fotos_class: item_data.fotos_class,
                    fotos_align: item_data.align
                }

                if(item_data.fotos){
                    item.fotos=[]
                    item.foto_ids=[]
                    for(var i=0;i<item_data.fotos.length;i++){
                        var foto=item_data.fotos[i]
                        item.fotos.push(foto.name)
                        item.foto_ids.push(foto.id)
                    }
                }

                if(item_data.files){
                    item.files=[]
                    for(var i=0;i<item_data.files.length;i++){
                        var file=item_data.files[i]
                        item.files.push(file.name)
                        files.push(file)
                        item_of_file.push(item_counter)
                    }

                }

                items.push(item)
                item_counter++;
            })

            var post={
                id: this.post.id,
                bgci: this.bgci,
                items: items,
                item_of_file: item_of_file
            }

            this.postPost(post,files)
        },
        getItemClass:function(item){
            var c=item.align
            if(this.edit_mode)c+=' edited'
            return c
        },
        onAlignChanged(index,value){
            var item=this.items[index]
            item.align=value
            this.$set(this.items,index,item)
        },
        onEditmodeChanged(v){
            this.edit_mode=v
        },
        onAddItem(){
            if(this.edit_mode)return
            this.items.splice(this.items.length,0,
                    {align:'center',tag:'text',text:'',fotos:[], fotos_class:'mini'}
                )
        },
        onItemDeleted(key){
            this.items.splice(key,1)
            this.edit_mode=false
        },
        onColorChoice(i){
            this.bgci=i
        },
        postPost(post,files){
            var data=new FormData()
            data.append('data',JSON.stringify(post));

            for(var i=0;i<files.length;i++){
                data.append('userFiles[]',files[i])
            }

// console.dir(this.method)
            this.$http.post(window.location.origin+this.method,data).then(function(responce){
console.dir(responce.body)
return
                    this.message=responce.data.text
                    this.$emit('message-setn',responce.data)
                },
                function(responce){
console.dir(responce.body)
                })
        },
        onCloseClick: function(){
            this.$emit('adder-close')
        }
    },
    computed:{
        bg_color:function(){
            return document.mag_start_data.colors[this.bgci]
        },
        is_new:function(){
            return !this.data.updated_at
        },
        max_post_items_count: function(){
            return document.mag_start_data.max_post_items_count
        }
    },
    components: {
        colorpeeker,
        postitem
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

</style>