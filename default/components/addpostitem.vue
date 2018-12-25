<template>
    <div>      
        <div class="back" :class="{ active : edit_mode }" @click.stop="onOk"></div>
        
        <div  v-if="!deleted" class="item" :class="{ edited : edit_mode }" @click="onEditText">

            <div v-if="data.tag=='text' && (data.fotos || is_fileadder_open)"
                class="fotos"
                :class="foto_class_safe">

                <div v-for="(foto,i) in available_fotos()"
                    class="foto"
                    :class="{ edited : edit_mode}">
                    <img :src="getFotoSrc(foto)">
                    <span v-if="edit_mode" class="tools">
                        <span class="tool delete" @click="onDeleteFoto(i)" title="Удалить фото">✘</span>
                    </span>
                </div>

                <div v-for="(i,index) in available_files()"
                    class="foto"
                    :class="{ edited : editmode }">
                    <img :src="i.image">
                    <span v-if="edit_mode" class="tools">
                        <span class="tool delete" @click="$refs.fileadder.onDeleteFoto(i)" title="Удалить фото">✘</span>
                    </span>
                </div>

                <fileadder v-if="is_fileadder_open"
                    ref='fileadder'
                    :key="index"
                    :canadd="canadd()"
                    :editmode="edit_mode"
                    @changed="onFotoChanged"></fileadder>

            </div>


            <span class="tools floating"
                :class="{ tools_fixed : tools_fixed || edit_mode}">

                <span class="tool-set tool ok" @click.stop="onOk" title="Применить изменение текста">✔</span>

                <span class="tool-set">
                    <span v-if="data.tag=='text'" class="tool ok" title="Увеличить шрифт" @click="data.tag='h2'">T</span>
                    <span v-else class="tool ok" title="Уменьшить шрифт" @click="data.tag='text'">t</span>
                </span>

                <span class="tool-set" v-if="data.tag=='text' && (data.fotos || (data.files && data.files.length>0))">

                    <span v-if="foto_class_safe!='mini'" class="tool foto" @click="setFotosClass('mini')" title="Увеличить размет фото">И</span>
                    <span v-if="foto_class_safe!='ico'" class="tool foto" @click="setFotosClass('ico')" title="Уменьшить размет фото">м</span>

                    <span class="tool ok" @click="onAlignChanged('left')" title="Фото слева"><<</span>
                    <span class="tool ok" @click="onAlignChanged('center')" title="Фото по центру">--</span>
                    <span class="tool ok" @click="onAlignChanged('right')" title="Фото справа">>></span>
                </span>
 
                <span v-if="show_add_button" class="tool-set tool ok" @click="onFileadderOpen" title="Добавить фото">+F</span>
                <span v-if="show_fileadder && foto_count()<max_fotos_count" class="tool-set tool ok" @click="onFileadderClose" title="Скрыть выбор фото">-F</span>

                <span v-if="edit_mode" class="tool-set tool cancel" @click.stop="onCancel" title="Отменить изменение текста">✘</span>
            </span> 

            <span v-if="edit_mode" class="delete-item" @click.stop="onDelete" title="Удалить весь абзац и фото">✘</span>

            <span v-if="edit_mode" class="counter"
                :title="counter.title"
                :class="counter.class">{{ counter.text }}</span>

            <div :class="text_box_class">
                <div :ref="ref"
                    placeholder="Напишите здесь что-нибудь интересное или добавьте фото!"
                    :contenteditable="edit_mode"
                    @input="onInput"
                    v-html="item.text"></div>
                <div class="stub" style="clear: both;"></div>
            </div>

        </div>
    </div>

</template>

<script>
var fileadder=require('./file_adder.vue')
module.exports = {
    data: function(){
        return{
            counter: {  text: document.mag_start_data.max_post_item_text_length,
                        class: '',
                        title: 'Максимальная длина текста -'+document.mag_start_data.max_post_item_text_length+'  знаков'
                    },
            edit_mode: false,
            show_fileadder: false,
            tools_fixed: false,
            deleted: false,

            data: this.$root.deepCopy(this.item)
        }
    },
    props:{
        index: Number,
        item: Object,
        itemscount: Number,
        canedit: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        setFotosClass(v){
            this.data.fotos_class=v
        },
        onAlignChanged(value){
            this.data.fotos_align=value
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
        onInput(){
            this.setCounter()
        },
        onOk(){
            var t=this.$refs[this.ref].innerText.trim().substring(0,document.mag_start_data.max_post_item_text_length)
            if(t=='')this.deleted=true
            this.data.text=t
            this.edit_mode=false
            this.show_fileadder=false
            this.$emit('changed')
        },
        onCancel(){
            this.edit_mode=false
            this.$refs[this.ref].innerText=this.item.text
            this.data.files=[]
            this.data.filedata=[]
            this.show_fileadder=false
            this.data=this.$root.deepCopy(this.item)
        },
        onDelete(){
            this.deleted=true
            return this.onOk()
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
        onFotoChanged(files,filedata){
            this.data.files=files
            this.data.filedata=filedata

            this.$forceUpdate()
        },
        getFotoSrc(foto){
            return '/img/fotos/'+this.foto_class_safe+'/'+foto.name
        },
        setCounter(){
            var max_length=document.mag_start_data.max_post_item_text_length
            if(undefined===this.$refs[this.ref])return max_length
            var text=this.$refs[this.ref].innerText
            var r=max_length-text.length
            if(r<0){
                this.counter.title='Сообщение слишком длинное! Последние '+(-r)+' знаков будут потеряны!'
                this.counter.class='danger'
            }else{
                this.counter.title='Длина сообщения '+text.length
                this.counter.class=''
            }
            this.counter.text=r
        },
        available_fotos:function(){
            var fotos=this.data.fotos
            if(undefined===fotos || !(fotos instanceof Array))return[]
            var max=this.max_fotos_count
            var res=fotos.slice(0,max)
            return res
        },
        available_files:function(){
            var files=this.data.filedata
            if(undefined===files || !(files instanceof Array))return[]
            var max=this.max_fotos_count-parseInt(this.available_fotos.length)
            return files.slice(0,max)
        },
        canadd:function(){
            return this.foto_count()<this.max_fotos_count && this.is_fileadder_open && this.show_fileadder
        },
        foto_count:function(){
            var count=this.data.files?this.data.files.length:0
            if(undefined!=this.data.fotos)count+=this.data.fotos.length
            return count
        },
    },
    computed:{
        foto_class_safe:function(){
            var fc=this.data.fotos_class
            if(!fc)fc='ico'
            return fc
        },
        text_box_class:function(){
            var res=this.data.tag?this.data.tag:'text'
            res+=this.edit_mode?' edited':''
            return res
        },
        ref:function(){
            return 'focus_'+this.index
        },
        show_add_button:function(){
            return this.item.tag=='text' && !this.show_fileadder && this.foto_count()<this.max_fotos_count
        },
        is_fileadder_open: function(){
            return this.item.tag==='text' && ((this.data.files && this.data.files.length>0) || this.show_fileadder)
        },
        max_fotos_count:function(){
            return document.mag_start_data.foto[this.foto_class_safe].max_count
        },
    },
    watch:{
        edit_mode:function(n,o){
            this.$emit('editmodechanged',n)
        }
    },
    mounted(){
        if(this.index===this.itemscount-1 && this.item.text==''){
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


.pannel{
    overflow: hidden;
}

div[contenteditable='true']{
    position: relative;
    outline: none;
}

.back{
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: #000;
    opacity: 0;
    transition: opacity .3s ease,width 0s ease .3s;
    z-index: 2;
}
.back.active{
    width: 100%;
    opacity: 0.15;
    transition: opacity .3s ease;
    z-index: 2;
}

.tools{
    position: absolute;
    top: 0;
    right: 0;
    font-weight: normal;
}
.floating{
    top: -36px;
    right: -350px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 2px;
    cursor: pointer;
    transition: right .5s ease;
}
.tools_fixed{
    right: 0;
    background-color: #fff;
}
.tool-set{
    margin-right: 20px;
}
.tool-set:last-child{
    margin-right: 0;
}
.tools,.tool-set{
    display: flex;
    /*flex-flow: column;*/
}
.tools .tool{
    display: inline-flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border: 2px solid;
    border-radius: 6px;
    background-color: #fff;
    opacity: .4;
    cursor: pointer;
}
.tools .tool:last-child{
    margin-right: 0;
}
.tools .tool:first-child{
    margin-left: 0;
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

.delete-item{
    position: absolute;
    top: -30px;
    left: 12px;
    display: inline-flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #C41300;
    background-color: #fff;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    font-size: 18px;
    cursor: pointer;
}
.delete-item:hover{
    opacity: 1;
}

.adder .foto{
    z-index: 1;
}
.adder .item.edited{
    z-index: 3;
    background-color: #fff;
    border-top-right-radius: 0;
}
.adder .item,
.adder .h1,
.adder .h2,
.adder .h3,
.adder .h4,
.adder .text{
    cursor: pointer;
}
.item{
    padding: 4px 0;
    border-radius: 10px;
}
.delete-post:hover,
.adder .item:not(.edited):hover{
    box-shadow: 0 0 2px #888;
}

.text.edited{
    cursor: text;
}

.counter{
    display: flex;
    width: 38px;
    height: 24px;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -24px;
    right: 12px;
    font-size: 16px;
    color: #00AA17;
    background-color: #fff;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    cursor: default;
}
.counter.danger{
    color: red;
    font-weight: bold;
}

</style>