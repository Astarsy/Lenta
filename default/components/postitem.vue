<template>
    <div>
        <div class="back" :class="{ active : edit_mode }"></div>

        <div v-if="data.fotos || is_fileadder_open"
            class="fotos"
            :class="fotos_class">

            <div v-for="(foto,i) in data.fotos" class="foto">
                <img :src="getFotoSrc(foto)">
                <span class="tools">
                    <span class="tool delete" @click="onDeleteFoto(i)" title="Удалить фото">✘</span>
                </span>
            </div>

            <fileadder v-if="is_fileadder_open" :key="index" :canadd="canadd" @changed="onFotoChanged"></fileadder>

        </div>


        <div :class="text_box_class">

            <div :ref="ref"
                placeholder="Напишите здесь что-нибудь интересное!"
                :contenteditable="edit_mode"
                v-html="data.text"></div>

            <span class="tools">

                <span v-if="data.fotos">
                    <span v-if="fotos_class!='mini'" class="tool foto" @click="fotos_class='mini'" title="Увеличить размет фото">И</span>
                    <span v-if="fotos_class!='ico'" class="tool foto" @click="fotos_class='ico'" title="Уменьшить размет фото">м</span>

                    <span class="tool ok" @click="onAlignChanged('left')" title="Фото слева"><<</span>
                    <span class="tool ok" @click="onAlignChanged('center')" title="Фото по центру">--</span>
                    <span class="tool ok" @click="onAlignChanged('right')" title="Фото справа">>></span>
                </span>

                <span v-if="show_add_button" class="tool ok" @click="onFileadderOpen" title="Добавить фото">+F</span>
                <span v-if="show_fileadder && foto_count<max_fotos_count" class="tool cancel" @click="onFileadderClose" title="Скрыть выбор фото">-F</span>

                <span v-if="edit_mode" class="tool ok" @click="onOk" title="Применить изменение текста">✔</span>
                
                <span v-if="edit_mode" class="tool delete" @click="onDeleteText" title="Удалить весь абзац и фото">✘</span>
                
                <span v-if="edit_mode" class="tool cancel" @click="onCancel" title="Отменить изменение текста">✘</span>

                <span v-if="!edit_mode" class="tool edit" @click="onEditText" title="Редактировать абзац">
                    <span class="">✏</span>
                </span>

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
            files: [],
            fotos_class: this.data.fotos_class
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
        onAlignChanged(value){
            this.$emit('alignchanged',this.index,value)
        },
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
            return '/img/fotos/'+this.fotos_class+'/'+foto.name
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
.text,
.item,
.foto{
    position: relative;
}
.h2[contenteditable='true'],
.text[contenteditable='true']{
    background-color: #fff;
}
div[contenteditable='true']{
    position: relative;
    outline: none;
    background-color: #fff;
}
.edited .tools{
}

.back{
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: #000;
    opacity: .1;
    transition: opacity .2s ease,width 0s ease .2s;
}
.back.active{
    width: 100%;
    opacity: 0.5;
    transition: opacity .2s ease;
}


.foto{
    z-index: 1;
}

.tools{
    position: absolute;
    top: 0;
    right: 0;
}
.tools .tool{
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
.tools .tool:last-child{
    margin-right: 0;
}
.tools .tool:hover{
    opacity: .9;
}
.tools .tool.edit{
    padding: 0;
    margin: 0;
    color: #3874A6;
    border-color: #3874A6;
}
.tools .tool.edit>span{
    transform: rotate(130deg);
}
.tools .tool.ok{
    color: #0a0;
    border-color: #0a0;
}
.tools .tool.cancel{
    color: #888;
    border-color: #888;
}
.tools .tool.delete{
    color: #888;
    border-color: #888;
    font-size: 18px;
    width: 20px;
    height: 20px;
}
.tools .tool.delete:hover{
    border-color: #a44;
    color: #a44;
}
</style>