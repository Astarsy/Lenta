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
            Object.entries(this.$refs).forEach(entry=>{
                var k=entry[0]
                var v=entry[1]
console.dir(v[0].data)
            })
            // this.postPost()
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
        postPost(){
            var data=new FormData()
            data.append('id',this.id)

            var items=this.items
            for(var i=0;i<items.length;i++){
                data.append('items[]',items[i])
            }

            console.dir(items)

            return
            // data.append('bgci',this.bgColorIndex)

            // for(var i=0;i<this.files.length;i++){
            //     data.append('userFiles[]',this.files[i])
            //     // индекс соответствия файла итему
            //     data.append('itemOfFile[]',0)
            //     // и класс файла
            //     data.append('classOfFile[]','ico')
            // }

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