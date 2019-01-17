<template>
    <div v-if="message"
        id="_flm_"
         :class="message.style">
        <div class="sys-buttons">
            <div class="button-close" @click="onClose" title="Скрыть">✘</div>
        </div>
        
        <div class="msg">{{ message.text }}</div>

        <div v-if="message.type=='info'" class="buttons">
            <span class="button ok" @click="onClose">Закрыть</span>
        </div>
        <div v-else-if="message.type=='confirm'" class="buttons">
            <span class="button ok" @click="onOk">Подтвердить</span>
            <span class="button cancel" @click="onClose">Отменить</span>                
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return{
        }
    },
    props:{
        message: Object
    },
    methods:{
        onOk(){
            this.$emit('ok')
        },
        onClose(){
            this.$emit('close')
        }
    }
}
</script>
<style>
#_flm_{
    position: absolute;
    display: flex;
    align-self: center;
    flex-flow: column;
    justify-content: center;
    font-size: 22px;
    /*background-color: rgba(250,250,250,0.8);*/
    background-color: #f8f8f8;
    border: 2px solid;
    border-radius: 8px;
    padding: 2% 5%;
    margin-top: 6%;
    z-index: 10;
}
#_flm_.danger,
#_flm_.danger .ok{
    color: #f55;
    border-color: #f88;
}
#_flm_.info{
    color: #55f;
    border-color: #88f;
}
#_flm_.ok{
    color: #00AA17;
    border-color: #00AA17;
}
#_flm_ .sys-buttons{
    text-align: right;
}
#_flm_ .buttons{
    text-align: center;
}
#_flm_ .button{
    width: auto;
    height: auto;
    padding: 2px 6px;
}
#_flm_ .button-close{
    position: absolute;
    top: 4px;
    right: 4px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    cursor: pointer;
}
#_flm_ .msg{
    font-size: 24px;
    margin: 10px 0 20px 0;
    cursor: default;
}
</style>