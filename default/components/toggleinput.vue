<template>
    <div class="toggleinput" :class="state">
        <span class="toggle" @click="onClick">
            <span class="stick"></span>
        </span>        
        <span class="label" title="Приватную публикацию увидит только приватная группа">Приватная</span>

    </div>
</template>

<script>
module.exports = {
    data: function(){
        return{
            states:[
                null,'private'
            ],
            state: this.access
        }
    },
    props:{
        access:{
            type: String,
            default: null
        }
    },
    methods: {
        onClick(){
            var i=this.states.indexOf(this.state)
            if(i<0)i=0
            else{
                i++;
                if(i>=this.states.length)i=0
            }
            this.state=this.states[i]
            this.$emit('changed',this.state)
        }
    },
}
</script>
<style>
.toggleinput{
    display: flex;
    user-select: none;
}
.toggleinput .toggle{
    display: flex;
    align-items: center;
    width: 30px;
    height: 20px;
    border: 2px solid #aaa;
    border-radius: 20px;
    padding: 0 2px;
    cursor: pointer;

    justify-content: flex-start;
    background-color: rgba(255,255,255,0);
}
.toggleinput .stick{
    display: flex;
    width: 16px;
    height: 16px;
    border-radius: 20px;
    background-color: #aaa;
}
.toggleinput .label{
    margin-left: 8px;
    font-weight: bold;
    opacity: 0.6;
}
.toggleinput.private .toggle{
    justify-content: flex-end;
    background-color: rgba(255,235,235,1);
    border-color: #d77;
}
.toggleinput.private .stick{
    background-color: #d77;
}
.toggleinput.private .label{
    opacity: 1;
}
</style>