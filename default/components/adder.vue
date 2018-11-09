<template>
    <div class="adder">
        <div class="head">
            <h3 v-if="is_new">Создать публикацию</h3>
            <h3 v-else>Редактировать публикацию</h3>
            <colorpeeker :curColor="backcolor" @color-choice="onColorChoice"></colorpeeker>
        </div>

        <div class="post"
            :style="{ 'background-color' : bgColor }">

            <div class="post-title"
                :class="{ 'status-new' : data.status=='new' }">
                <span v-if="data.status=='new'">Новая публикация</span>
                <span>{{ data.updated_at | date }}</span>
            </div>

            <postitem v-for="(item,k) in data.items"
                class="item-box"
                :key="k"
                :index="k"
                :itemscount="data.items.length"
                :class="getItemClass(item)"
                :data="item"
                :canedit='true'
                @deleted="onItemDeleted"
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
                @click.prevent="onSendClick">Создать</span>
            <span v-else class="button ok"
                @click.prevent="onSendClick">Сохранить</span>

            <span class="button cancel"
                @click.stop="onCloseClick">Отменить</span>
        </div>

    </div>
</template>

<script>
var colorpeeker=require('./colorpeeker.vue')
var postitem=require('./addpostitem.vue')
module.exports = {
    data: function(){
        return{         
            text1: '',
            text2: '',
            max_items_count: 3,
            data: this.post,
            bgColorIndex: 0,
            bgColor: '#fff',
            maxLength: 200,
            foto_align: null,
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
        getItemClass:function(item){
            var c=item.align
            if(this.edit_mode)c+=' edited'
            return c
        },
        onAlignChanged(index,value){
            var item=this.data.items[index]
            item.align=value
            this.$set(this.data.items,index,item)
        },
        onEditmodeChanged(v){
            this.edit_mode=v
        },
        onAddItem(){
            if(this.edit_mode)return
            this.data.items.splice(this.data.items.length,0,{align:'center',tag:'text',text:'',fotos_class:'mini'})
        },
        onItemDeleted(key){
            this.data.items.splice(key,1)
            this.edit_mode=false
        },
        onColorChoice(i,c){
            this.bgColorIndex=i
            this.bgColor=c
        },
        postMessage(text){
            this.message=this.message.trim().substr(0,this.maxLength)
            if(this.message.length<1)return
            var data=new FormData()
            if(this.id)data.append('id',this.id)
            // резерв на случай с несколькими items и tags
            var items=[this.message,]
            var tags=['',]
            for(var i=0;i<items.length;i++){
                data.append('items[]',items[i])
                data.append('tags[]',tags[i])
            }
            data.append('bgci',this.bgColorIndex)

            for(var i=0;i<this.files.length;i++){
                data.append('userFiles[]',this.files[i])
                // индекс соответствия файла итему
                data.append('itemOfFile[]',0)
                // и класс файла
                data.append('classOfFile[]','ico')
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
        onSendClick: function(){
            this.postMessage(this.message)
        },
        onCloseClick: function(){
            this.$emit('adder-close')
        }
    },
    computed:{
        is_new:function(){
            return !this.data.updated_at
        },
        max_post_items_count: function(){
            return document.mag_start_data.max_post_items_count
        },
        placeholder: function (){
            return "Напишите сообщение (не более "+ this.maxLength +" знаков)"
        },
        counter: function (){
            var r=this.maxLength-this.message.length
            if(r<0)r='Сообщение слишком длинное! Последние '+(-r)+' знаков будут потеряны!'
            return r
        }
    },
    // mounted(){
    //     console.dir(this.items)
    // },
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


.fotos{
    display: flex;
    justify-content: center;
}
.foto{
    display: inline-flex;
}
.fotos div.foto{
    margin-right: 6px;
}
.fotos div.foto:last-child{
    margin-right: 0;
}
.foto img{
    border-radius: 12px;
}
.item-box{
    display: block;
    text-align: center;
    margin-bottom: 12px;
}
.stub{
    clear: both;
}
.left .fotos{
    float: left;
    margin-right: 10px;
    padding-left: 4px;
}
.right .fotos{
    float: right;
    margin-left: 10px;
    padding-right: 4px;
}

.fotos.mini img{
    width: 300px;
    height: 300px;
}
.fotos img,
.fotos.ico img{
    width: 84px;
    height: 84px;
}

.buttons{
    display: inline-block;
    margin: 4px 8px;
}

</style>