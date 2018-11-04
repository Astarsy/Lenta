<template>
    <div>
        <div class="back" :class="{ active : edit_mode }"></div>

        <div v-if="data.fotos || is_fileadder_open" class="fotos">

            <div v-for="(foto,i) in data.fotos" class="foto">
                <img :src="getFotoSrc(foto)">
                <span class="tools">
                    <span class="delete" @click="onDeleteFoto(i)" title="Удалить фото">✘</span>
                </span>
            </div>

            <fileadder v-if="is_fileadder_open" :key="index" :canadd="canadd" @changed="onFotoChanged"></fileadder>

        </div>


        <div :class="text_box_class">

            <div :ref="ref"
                placeholder="Напишите здесь что-нибудь интересное!"
                :contenteditable="edit_mode">{{ data.text }}</div>

            <span v-if="!edit_mode" class="tools">

                <span v-if="show_add_button" class="ok" @click="onFileadderOpen" title="Добавлять фото">+F</span>
                <span v-if="show_fileadder && foto_count<max_fotos_count" class="cancel" @click="onFileadderClose" title="Скрыть выбор фото">-F</span>

                <span class="edit" @click="onEditText" title="Редактировать абзац">
                    <span class="">✏</span>
                </span>
            </span>
            <span v-else class="tools">
                <span class="ok" @click="onOk" title="Применить изменение текста">✔</span>
                <span class="cancel" @click="onCancel" title="Отменить изменение текста">✘</span>
                <span class="delete" @click="onDeleteText" title="Удалить весь абзац и фото">✘</span>
            </span>
        </div>

    </div>

</template>

<script>
var inputex=require('./inputex.vue')
var fileadder=require('./file_adder.vue')
module.exports = {
    data: function(){
        return{
            edit_mode: false,
            show_fileadder: false,
            max_fotos_count: 2,
            files: []
        }
    },
    props:{
        index: Number,
        data: Object,
        itemscount: Number,
        canedit: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        focus(){
            var el=this.$refs[this.ref]
            el.setAttribute('contenteditable',true)
            el.focus()
        },
        onEditText(){
            this.edit_mode=this.canedit
            this.focus()
        },
        onOk(){
            this.edit_mode=false
        },
        onCancel(){
            this.edit_mode=false
            this.$refs[this.ref].innerText=this.data.text
        },
        onDeleteText(){
            this.data.text=undefined
            this.edit_mode=false
            this.$emit('deleted',this.index)
        },
        onFileadderOpen(){
            this.show_fileadder=true
        },
        onFileadderClose(){
            this.show_fileadder=false
        },
        onDeleteFoto(i){
            this.data.fotos.splice(i,1)
        },
        onFotoChanged(files,align){
            this.files=files
        },
        getFotoSrc(foto){
            return '/img/fotos/'+foto.class+'/'+foto.name
        }
    },
    computed:{
        text_box_class:function(){
            var res=this.data.tag?this.data.tag:'text'
            res+=this.edit_mode?' edited':''
            return res
        },
        ref:function(){
            return 'focus_'+this.index
        },
        show_add_button:function(){
            return this.data.tag=='text' && !this.show_fileadder && this.foto_count<this.max_fotos_count
        },
        is_fileadder_open: function(){
            return this.data.tag==='text' && (this.files.length>0 || this.show_fileadder)
        },
        foto_count:function(){
            var count=this.files.length
            if(undefined!=this.data.fotos)count+=this.data.fotos.length
            return count
        },
        canadd:function(){
            return this.foto_count<this.max_fotos_count && this.is_fileadder_open && this.show_fileadder
        }
    },
    watch:{
        edit_mode:function(n,o){
            this.$emit('editmodechanged',n)
        }
    },
    mounted(){
        if(this.index===this.itemscount-1 && this.data.text==''){
            this.edit_mode=this.canedit
            this.focus()
        }
    },
    components:{
        fileadder
    }
}
</script>
<style>
div:empty::before {
    content: attr(placeholder);
    color: #888;
    font-style: italic;
}

.h2,
.text{
    position: relative;
    z-index: 2;
}
.h2[contenteditable='true'],
.text[contenteditable='true']{
    background-color: #fff;
}
div[contenteditable='true']{
    position: relative;
    outline: none;
    background-color: #fff;
    z-index: 2;
}
.edited .tools{
    z-index: 3;
}

.back{
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: .3;
}
.back.active{    
    display: flex;
    z-index: 2;
}

.item,
.foto{
    position: relative;
}
.foto img{
    max-width: 300px;
    max-height: 300px;
}



.tools{
    position: absolute;
    top: -10px;
    right: 0;
}
.fotos .tools{
    top: 10px;
    right: 10px;
}
.tools>span{
    display: inline-flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border: 2px solid #888;
    border-radius: 6px;
    background-color: #fff;
    opacity: .4;
    cursor: pointer;
    margin-right: 4px;
}
.tools>span:last-child{
    margin-right: 0;
}
.tools span:hover{
    opacity: .9;
    z-index: 1;
}
.tools span.edit{
    padding: 0;
    margin: 0;
    color: #3874A6;
    border-color: #3874A6;
}
.tools span.edit>span{
    transform: rotate(130deg);
}
.tools span.ok{
    color: #0a0;
    border-color: #0a0;
}
.tools span.cancel{
    color: #888;
    border-color: #888;
}
.tools span.delete{
    color: #888;
    border-color: #888;
    font-size: 18px;
    width: 20px;
    height: 20px;
}
.tools span.delete:hover{
    border-color: #a44;
    color: #a44;
}
</style>