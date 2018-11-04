<template>
    <div class="inputex" :class="{ danger:danger }">
        <textarea v-model="text"
            @input="onInput"></textarea>
        <div class="counter">{{ counter }}</div>
        <div class="buttons">
            <span class="button ok"
                @click.prevent="onOkClick"
                title="Готово">✔</span>
            <span class="button cancel"
                @click.stop="onCloseClick"
                title="Отменить">✘</span>
        </div>
    </div>
</template>

<script>
var colorpeeker=require('./colorpeeker.vue')
module.exports = {
    data: function(){
        return{
            old_text: this.value,
            text: this.value,
            maxLength: 200,
            danger: false
        }
    },
    props:{
        value: String
    },
    methods: {
        onOkClick: function(){
            this.$emit('ok')
        },
        onCloseClick: function(){
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