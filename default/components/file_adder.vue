<template>
    <div class="file-adder">
        <flash :message="flash" @close="flash=null"></flash>
        <input :id="fileElem" type="file" accept="image/jpeg" style="display:none" @change.prevent="handleFiles" />
        <div class="foto add-button" v-if="this.canadd" @click.stop="onAddClick" title="Выбрать фото">✚</div>

    </div>
</template>

<script>
var flash=require('./flashmessage.vue')
module.exports = {
    data: function(){
        return{
            flash: null,
            filedata: [],
            align: 'center',
        }
    },
    props:{        
            canadd: Boolean,
            editmode: Boolean
    },
    methods: {
        onDeleteFoto(i){
            this.filedata.splice(i,1)
            this.changesIsOver()
        },
        createImage: function(file){
            var reader = new FileReader()
            var vm=this
            reader.onload= function(e){
                var s=(e.loaded/1024/1024).toFixed(2)
                if(e.loaded>4*1024*1024){
                    vm.flash={
                        text: 'Файл '+file.name+' слишком большой! ('+s+'Mb)',
                        style: 'danger',
                        type: 'info'
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
                if(files[i].type!='image/jpeg')break
                this.createImage(files[i])
            }
        },
        changesIsOver: function(){
            this.$emit('changed',this.getFiles(),this.filedata)
        }
    },
    computed:{
        fileElem:function(){
            return 'fileElem'+this.$vnode.key
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
.add-button{
    display: inline-flex;
    position: relative;
    align-self: center;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #0a0;
    background-color: #fff;
    border: 2px solid #0a0;
    border-radius: 12px;
    width: 60px;
    height: 60px;
    margin-left: 8px;
    cursor: pointer;
    z-index: 3;
}
</style>