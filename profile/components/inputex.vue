<template>
    <div class="inputex" :class="{ danger:danger }">
        <textarea v-model="text"
            @input="onInput"></textarea>
        <div class="ok">{{ counter }}</div>
        <div class="buttons">
            <span class="button ok"
                @click.prevent="onOkClick"
                title="Готово">✔</span>
            <span class="button cancel"
                @click.stop="onCancelClick"
                title="Отменить">✘</span>
        </div>
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
        onOkClick: function(){
            this.$emit('ok')
        },
        onCancelClick: function(){
            this.text=this.old_text
            this.$emit('input', this.old_text)
            this.$emit('cancel')
        },
        onInput(){
            this.$emit('input', this.text)
        }
    },
    computed:{
        counter: function (){
            if(undefined===this.text)return this.maxLength
            var r=this.maxLength-this.text.length
            if(r<5)this.danger=true
            else this.danger=false
            if(r<0)r='Сообщение слишком длинное! Последние '+(-r)+' знаков будут потеряны!'
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
    margin-right: 4px;
}
</style>