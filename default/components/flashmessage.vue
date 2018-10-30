<template>
    <div v-if="msg"
        class="flashmessage">
        <div>
            <div class="button-box">
                <div class="button ico" @click.stop="onClose" title="Скрыть">✘</div>
            </div>
            <div class="text">{{msg}}</div>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return{
            msg: this.text,
        }
    },
    props:{
        text:{
            type: String
        },
        parent: Object,
    },
    watch:{
        text:function(newval,oldval){
            this.msg=newval
        }
    },
    methods:{
        onClose(){
            this.msg=''
            this.$emit('closed',this.parent)
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
    font-size: 14px;
    font-weight: bold;
    color: #f55;
    margin-bottom: 16px;
    z-index: 1;
}
.flashmessage>div{
    display: flex;
    flex-flow: column;
    text-align: center;
    margin: auto;
    background-color: #f8f8f8;    
    border: 2px solid #faa;
    border-radius: 8px;
}
.flashmessage .button-box{
    text-align: right;
}
.flashmessage .button{
    border: none;
}
.flashmessage .text{
    margin: 4px 8px;
}
</style>