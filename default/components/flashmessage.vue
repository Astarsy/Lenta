<template>
    <div v-if="msg"
        class="flashmessage">
        <div :class="message.style">
            <div class="button-box">
                <div class="button ico" @click="onClose" title="Скрыть">✘</div>
            </div>
            <div class="text">{{msg}}</div>
            <div v-if="type=='info'">
                <span class="button ok" @click="onClose">Закрыть</span>
            </div>
            <div v-else-if="type=='confirm'">
                <span class="button ok" @click="onOk">Подтвердить</span>
                <span class="button cancel" @click="onClose">Отменить</span>                
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return{
            msg: null,
            type: null
        }
    },
    props:{
        message: Object,
        parent: Object,
    },
    watch:{
        text:function(newval,oldval){
            this.msg=newval
        }
    },
    methods:{
        onOk(){
            this.msg=''
            this.$emit('confirmed',this.parent)
        },
        onClose(){
            this.msg=''
            this.$emit('closed',this.parent)
        }
    },
    created(){
        if(undefined!==this.message){
            this.msg=this.message.text
            this.type=this.message.type
        }
    }
}
</script>
<style>
.flashmessage{
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 18px;
    z-index: 1;
}
.flashmessage>div{
    display: flex;
    flex-flow: column;
    text-align: center;
    margin: auto;
    background-color: #f8f8f8;    
    border: 2px solid;
    border-radius: 8px;
    padding-bottom: 8px;
}
.flashmessage>.danger{
    color: #f55;
    border-color: #f88;
}
.flashmessage>.info{
    color: #55f;
    border-color: #88f;
}
.flashmessage>.ok{
    color: #4c2;
    border-color: #4c2;
}
.flashmessage .button-box{
    text-align: right;
}
.flashmessage .button{
    font-weight: normal;
    background-color: transparent;
}
.flashmessage .button.ok{
    color: #4c2;
    border: 1px solid #4c2;
    padding: 4px 10px;
}
.flashmessage .button.cancel{
    color: #aaa;
    border: 1px solid #aaa;
    padding: 0 8px;
    margin-left: 10px;
}
.flashmessage .button.ico{
    border: none;
}
.flashmessage .text{
    margin: 0 8px 10px 8px;
}
</style>