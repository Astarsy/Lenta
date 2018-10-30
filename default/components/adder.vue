<template>
    <div class="adder" :class="{ danger:danger }">
        <div class="adder-head">
            <h3>Создать публикацию</h3>
            <fileadder @foto-changed="onFotosChanged" 
                :maxfilescount="max_files_count"></fileadder>
            <colorpeeker :curColor="backcolor" @color-choice="onColorChoice"></colorpeeker>
        </div>
        <textarea v-model="message"
            :style="{ 'background-color' : bgColor }"
            :placeholder="placeholder"></textarea>
        <div class="counter">{{ counter }}</div>
        <div class="buttuns">
            <span class="button send"
                :class="{ disabled : message.length==0 }"
                @click.prevent="onSendClick">Отправить</span>
            <span class="button cancel"
                @click.stop="onCloseClick">Отменить</span>
        </div>
    </div>
</template>

<script>
var fileadder=require('./file_adder.vue')
var colorpeeker=require('./colorpeeker.vue')
module.exports = {
    data: function(){
        return{            
            max_files_count: 1,
            files:[],
            message: this.text,
            bgColorIndex: 0,
            bgColor: this.backcolor,
            maxLength: 200,
            danger: false
        }
    },
    props:{
        id:{
            type: String,
            default: null
        },
        text:{
            type: String,
            default: ''
        },
        backcolor:{
            type: String,
            default: '#fff'
        },
        method:{
            type: String,
            required: true
        }
    },
    methods: {
        onColorChoice(i,c){
            this.bgColorIndex=i
            this.bgColor=c
        },
        onFotosChanged(files){
            this.files=files
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
        placeholder: function (){
            return "Напишите сообщение (не более "+ this.maxLength +" знаков)"
        },
        counter: function (){
            var r=this.maxLength-this.message.length
            if(r<5)this.danger=true
            else this.danger=false
            if(r<0)r='Сообщение слишком длинное! Последние '+(-r)+' знаков будут потеряны!'
            return r
        }
    },
    components: {
        fileadder,
        colorpeeker
    }
}
</script>
<style>
.adder{
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    padding-bottom: 0;
    margin: 0 10px 8px 10px;
    background-color: #fff;
}
.buttuns{
    padding: 8px 0;
}
.adder-head>h3{
    margin: 0;
}
.adder textarea{
    vertical-align: bottom;
    display: inline-block;
    width: 100%;
    margin-bottom: 8px;
    height: 4em; 
    border: 2px solid #ddd;
    border-radius: 8px;
    resize: none;
    outline: none;
}
.danger{
    color: #f33;
}
.counter{
    float: right;
    margin-bottom: 8px;
}
.counter.danger{
    color: red;
}
</style>