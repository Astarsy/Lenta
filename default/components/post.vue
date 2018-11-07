<template>
    <div class="post"
        :style="style">

        <flashmessage v-if="data.message"
            :key="data.id"
            :parent="data"
            :message="data.message"
            @confirmed="onConfirmPostDel"
            @closed="onFlashMessageClosed"></flashmessage>

        <div class="post-title">
            <span>Новая публикация</span>
            <span>11:11 11.11.18</span>
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
        data: Object
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
        console.dir(this.data)
    },
    components: {
        flashmessage
    }
}
</script>
<style>
</style>