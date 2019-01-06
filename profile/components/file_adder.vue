<template>
    <div class="file-adder">
        <flash :message="flash" @close="flash=null"></flash>
        <input :id="fileElem" type="file" accept="image/jpeg" style="display:none" @change.prevent="handleFiles" />
        <div class="button ok" v-if="editmode" @click.stop="onAddClick" :title="title">🔃</div>
        <div :class="{ disabled : !is_btn_active }"
             class="button cancel"
             @click.stop="onCancel" title="Отменить">✘</div>

    </div>
</template>

<script>
let flash=require('./flashmessage.vue')
module.exports = {
    data: function(){
        return{
            flash: null,
            filedata: [],
            align: 'center',
            changed: false
        }
    },
    props:{
        editmode: Boolean,
        title:{
            type:String,
            default:'Выбрать фото'
        }
    },
    methods: {
        onCancel(){
            this.filedata=[]
            this.changed=false
            this.$emit('cancel')
        },
        createImage: function(file){
            var reader = new FileReader()
            var vm=this
            reader.onload= function(e){
                if(e.loaded>6*1024*1024){
                    let s=(e.loaded/1024/1024).toFixed(2)
                    vm.flash={
                        text: 'Файл '+file.name+' слишком большой - ('+s+'Mb)',
                        type: 'info',
                        style: 'danger'
                    }
                    return
                }
                vm.flash=null
                var image=new Image()
                image.onload= function(){
                    // if(image.width<400 || image.height<400)return

                    var r=parseInt(image.width/image.height)
                    vm.filedata.push({
                        image: e.target.result,
                        file: file,
                        ratio: r
                    })
                    vm.changesIsOver()
                }
            image.src=e.target.result
            }
            reader.readAsDataURL(file)
        },
        onAddClick: function(){
            var fileElem=document.getElementById(this.fileElem)
            fileElem.click()
        },
        getFiles(){
            var f=[]
            for(var i=0;i<this.filedata.length;i++){
                f.push(this.filedata[i].file)
            }
            return f
        },
        handleFiles: function(e){
            var files=e.target.files || e.dataTransfer.files
            if(!files.length)return
            for(var i=0; i<files.length;i++){
                if(files[i].type!=='image/jpeg')break
                this.createImage(files[i])
            }
        },
        changesIsOver: function(){
            var fileElem=document.getElementById(this.fileElem)
            this.$emit('changed',this.getFiles(),this.filedata)
            fileElem.value=''
            this.changed=true
        }
    },
    computed:{
        is_btn_active: function(){
            return this.editmode && this.changed
        },
        fileElem:function(){
            return 'fileElem'+this.$vnode.key
        }
    },
    watch: {
        is_btn_active: function (n, o) {
            this.$emit('active-changed', n)
        }
    },
    components: {
        flash
    }
}
</script>
<style>
.file-adder{
    display: flex;
}
.file-adder>*:not(:last-child){
    margin-right: 4px;
}
</style>