<template>
    <div v-if="message"
         class="flashmessage"
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
    .flashmessage{
        position: absolute;
        display: flex;
        align-self: center;
        flex-flow: column;
        justify-content: center;
        font-size: 22px;
        background-color: #f8f8f8;
        border: 2px solid;
        border-radius: 8px;
        padding: 12px;
        z-index: 10;
    }
    .flashmessage.danger,
    .flashmessage.danger .ok{
        color: #f55;
        border-color: #f88;
    }
    .flashmessage.info{
        color: #55f;
        border-color: #88f;
    }
    .flashmessage.ok{
        color: #00AA17;
        border-color: #00AA17;
    }
    .flashmessage .sys-buttons{
        text-align: right;
    }
    .flashmessage .buttons{
        text-align: center;
    }
    .flashmessage .button{
        width: auto;
        height: auto;
        padding: 2px 6px;
    }
    .flashmessage .button-close{
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
    .flashmessage .msg{
        margin: 10px 0 20px 0;
        cursor: default;
    }
</style>