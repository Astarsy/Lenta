<template>
    <div class="inputex">
        <input v-model="text"
            @input="onInput">
        <div class="counter ok" :class="{ danger:danger }">{{ counter }}</div>
        <span :class="{ disabled : !is_btn_active }"
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
        minlength:{
            type: Number,
            default: 3
        },
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
        is_btn_active: function(){
            return this.old_text!==this.text
        },
        changed: function(){
            return this.old_text!==this.text
        },
        counter: function (){
            if(undefined===this.text)return this.maxLength
            var r=this.maxLength-this.text.length
            if(this.text.length<this.minlength){
                this.danger=true
                this.msg='Имя слишком короткое'
            }else if(r<0){
                this.danger=true
                this.msg='Имя слишком длинное'
            }else{
                this.danger=false
                this.msg=null
            }
            return r
        }
    }
}
</script>
<style>
.inputex .buttons{
    display: flex;
}
.inputex>*:not(:last-child),
.inputex .button:not(:last-child){
    margin-right: 8px;
}
.inputex .counter{
    display: flex;
    align-self: flex-start;
    cursor: default;
}
.inputex .danger{
    color: red;
}
</style>