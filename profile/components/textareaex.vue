<template>
    <div class="textareaex">
        <textarea v-model="text"
                  @input="onInput"></textarea>
        <div class="counter ok" :class="{ danger:danger }">{{ counter }}</div>
        <span :class="{ disabled : this.text===this.old_text }"
            class="button cancel"
            @click.stop="onCancelClick"
            title="Отменить">✘</span>
        <div v-if="danger" class="msg">{{ msg }}</div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return{
            old_text: this.value,
            text: this.value,
            maxLength: this.maxlength,
            danger: false
        }
    },
    props:{
        value: String,
        maxlength: Number
    },
    methods: {
        onCancelClick: function(){
            if(this.text===this.old_text)return
            this.text=this.old_text
            this.$emit('input',this.text,this.old_text)
        },
        onInput(){
            this.$emit('input',this.text,this.old_text)
        },
        reset(){
            this.old_text=this.value
        }
    },
    computed:{
        counter: function (){
            if(undefined===this.text)return this.maxLength
            let r=this.maxLength-this.text.length
            if(r<0){
                this.danger=true
                this.msg='Текст слишком длинный'
            }else{
                this.danger=false
                this.msg=null
            }
            return r
        }
    },
}
</script>
<style>
.textareaex{
    display: flex;
}
.textareaex .buttons{
    display: flex;
}
.textareaex>*:not(:last-child),
.textareaex .button:not(:last-child){
    margin-right: 8px;
}
.textareaex .counter{
    display: flex;
    align-self: flex-start;
    cursor: default;
}
.textareaex .danger{
    color: red;
}
</style>