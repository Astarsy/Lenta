<template>
    <div class="adder">
        <div class="head">
            <h3>Создать публикацию</h3>
            <colorpeeker :curColor="backcolor" @color-choice="onColorChoice"></colorpeeker>
        </div>

        <div class="post"
            :style="{ 'background-color' : bgColor }">

            <div class="post-title">
                <span>Новая публикация</span>
                <span>11:11 11.11.18</span>
            </div>

            <postitem v-for="(item,k) in items"
                class="item"
                :key="k"
                :index="k"
                :itemscount="items.length"
                :class="item.align"
                :data="item"
                :canedit='true'
                @deleted="onItemDeleted"
                @editmodechanged="onEditmodeChanged"
                @alignchanged="onAlignChanged"></postitem>

            <span v-if="items.length<max_post_items_count"
                class="add-item-button" 
                :class="{ disabled : disable_add }"
                @click="onAddItem" 
                title="Добавить абзац">✚</span>
        </div>

        <div class="buttons">
            <span class="button send"
                @click.prevent="onSendClick">Создать</span>
            <span class="button cancel"
                @click.stop="onCloseClick">Отменить</span>
        </div>

    </div>
</template>

<script>
var colorpeeker=require('./colorpeeker.vue')
var postitem=require('./postitem.vue')
module.exports = {
    data: function(){
        return{         
            text1: '',
            text2: '',
            max_items_count: 3,
            items: [
                { align: 'center',tag: 'h2', text: 'Заголовок публикации' },
                { align: 'center',tag: 'text',text: 'Очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации, очень длинный текст публикации...',fotos: [{name:'f1.jpg'},],fotos_class:'mini'}
            ],
            bgColorIndex: 0,
            bgColor: '#fff',
            maxLength: 200,
            foto_align: null,
            disable_add: false
        }
    },
    props:{
        method:{
            type: String,
            required: true
        }
    },
    methods: {
        onAlignChanged(index,value){
            var item=this.items[index]
            item.align=value
            this.$set(this.items,index,item)
        },
        onEditmodeChanged(v){
            this.disable_add=v
        },
        onAddItem(){
            if(this.disable_add)return
            this.items.splice(this.items.length,0,{align:'center',tag:'text',text:''})
        },
        onItemDeleted(key){
            this.items.splice(key,1)
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
    border-right: none;
    border-left: none;
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

.post{
    display: flex;
    flex-flow: column;
    border-right: none;
    border-left: none;
    border-radius: 12px;
}
.post *{
    /*display: flex;*/
}
.post-title{
    margin: 2px 8px;
}
.post-title>span{
    margin-left: 20px;
}
.post-title>span:first-child{
    margin-left: 0;
    font-style: italic;
}


.fotos,
.foto{
    display: inline-flex;
}
.fotos>div{
    margin-right: 6px;
}
.fotos>div:last-child{
    margin-right: 0;
}
.foto img{
    border-radius: 12px;
}
.item{
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
}
.right .fotos{
    float: right;
    margin-left: 10px;
}
.h2{
    font-size: 24px;
    font-weight: bold;
    color: #555;
    text-align: center;
}
.text{
    text-align: left;
}

.fotos.mini img{
    max-width: 300px;
    max-height: 300px;
}
.fotos.ico img{
    max-width: 84px;
    max-height: 84px;
}

</style>