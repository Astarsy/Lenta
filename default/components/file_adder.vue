<template>
    <div class="file-adder">
        <div class="descr">
        <h4>Прикрепить изображение</h4>
        <span class="flash-text">( картинка формата jpeg не более 4Мб )</span>
        </div>
        <flash :text="flash" @closed="flash=''"></flash>
        <input id="fileElem" type="file" accept="image/jpeg" style="display:none" @change.prevent="handleFiles" />
        <span class="button icon" v-if="this.filedata.length<this.maxfilescount"
        @click.stop="onAddClick">✚</span>
        <div class="foto" v-for="(i,index) in filedata"
            :class="{ vertical : !i.ratio }">
            <img :src="i.image">
            <span class="button ico" title="Удалить"
                @click.stop="onDelete(index)">✘</span>
        </div>
    </div>
</template>

<script>
var flash=require('./flashmessage.vue')
module.exports = {
    data: function(){
        return{
            flash: '',
            filedata: []
        }
    },
    props:{        
            maxfilescount: 0
    },
    methods: {
        onDelete(i){
            this.filedata.splice(i,1)
        },
        createImage: function(file){
            var reader = new FileReader()
            var vm=this
            reader.onload= function(e){
                var s=(e.loaded/1024/1024).toFixed(2)
                if(e.loaded>4*1024*1024){
                    vm.flash='Файл '+file.name+' слишком большой! ('+s+'Mb)'
                    return
                }
                vm.flash=''
                var image=new Image()
                image.onload= function(){
                    if(image.width<400 || image.height<400)return

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
            var fileElem=document.getElementById("fileElem")
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
                if(this.filedata.length>=this.maxfilescount
                    || files[i].type!='image/jpeg')break
// console.dir(files[i])
                this.createImage(files[i])
            }
        },
        changesIsOver: function(){
            this.$emit('foto-changed',this.getFiles())
        }
    },
    computed:{
        ids: function(){
            var good_ids=[]
            for(var i=0;i<this.goods.length;i++){
                good_ids.push(this.goods[i]['id'])
            }
            return good_ids
        }
    },
    components: {
        flash
    }
}
</script>
<style>
.file-adder h4{
    display: inline-block;
    width: auto;
    margin-bottom: 8px;
}
.file-adder span.button.icon{
    display: inline-block;
    border-color: #8cf;
    /*color: #8cf;*/
    text-align: center;
    vertical-align: top;
    font-size: 30px;
    padding: 4px 12px;
    margin-right: 4px;
}
.file-adder .foto{
    position: relative;
    display: inline-flex;
    width: auto;
    max-width: 85px;
    max-height: 84px;
    margin: 0 8px 8px 0;
}
.file-adder .foto img{
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
}
.file-adder .foto.vertical img{
    display: inline-block;
    width: auto;
    height: 150px;
}
.file-adder .button.ico{
    position: absolute;
    top: 0;
    right: 0;
    margin: 4px;
    font-size: 18px;
    color: #f40;
    border-color: #f40;
    opacity: 1;
    background-color: rgba(0,0,0,.3);
}
.file-adder>.descr{
    display: block;
}
</style>