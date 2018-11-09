<template>
    <div class="post"
        :style="style">

        <flashmessage v-if="data.message"
            :key="data.id"
            :parent="data"
            :message="data.message"
            @confirmed="onConfirmPostDel"
            @closed="onFlashMessageClosed"></flashmessage>

        <div class="post-title"
            :class="{ 'status-new' : data.status=='new' }">
            <span v-if="data.status=='new'">Новая публикация</span>
            <span>{{ data.updated_at | date }}</span>
        </div>

        <div v-for="item in data.items"
            class="item"
            :class="item.align">
            <div v-if="item.fotos"
                class="fotos"
                :class="fotos_class">

                <div v-for="(foto,i) in item.fotos"
                    class="foto">
                    <img :src="getFotoSrc(item,foto)">
                </div>
            </div>

            <div :class="item.tag">{{ item.text }}</div>

        </div>

        <div v-if="canedit"
            class="edit"
            title="Редактировать публикацю"
            @click="$emit('edit')">✎</div>

    </div>
</template>

<script>
var flashmessage=require('./flashmessage.vue')
module.exports = {
    data: function(){
        return{
        }
    },
    props:{
        data: Object,
        canedit: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getFotoSrc(item,foto){
            var fc=item.fotos_class
            if(!fc)fc='ico'
            return '/img/fotos/'+fc+'/'+foto.name
        }
    },
    computed:{
        style:function(){
            var bc=document.mag_start_data.colors[this.data.bgci]
            var ststr='background-color:'+bc+';'
            if(this.data.status=='new')ststr+='opacity: 0.5;'
            return ststr
        },
    },
    created(){
        // console.dir(this.data)
    },
    components: {
        flashmessage
    }
}
</script>

<style>

.post{
    display: flex;
    flex-flow: column;
    border-right: none;
    border-left: none;
    border-radius: 12px;
    padding-bottom: 4px;
}
.post .edit{
    position: absolute;
    top: 0;
    right: 4px;
    color: #0772a1;
    font-size: 20px;
    font-weight: bold;
    transform: rotate(110deg);
    cursor: pointer;
    opacity: .1;
}
.post:hover .edit{
    opacity: 1;
}
.post-title{
    margin: 2px 8px;
}
.post-title.status-new{
    font-style: italic;
}
.post-title>span{
    margin-left: 20px;
}

</style>