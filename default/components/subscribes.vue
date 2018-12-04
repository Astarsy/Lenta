<template>
    <div class="subscribes">
        <div v-for="item in data" title="Открыть ленту"
            @click="onClick(item)">
            <span class="avatar">
                <img v-if="item.avatar"
                    :src="'/img/avatars/'+item.avatar">
            </span>
            <span class="name">{{ item.name }}</span>
            <span class="count" title="Всего публикаций">{{ item.post_count }}</span>
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
        data: Array,
    },
    methods: {
        onClick(item){
            this.$emit('click',item)
        }
    },
    created(){
        console.dir(this._data)
    }
}
</script>
<style>
.subscribes{
    display: flex;
    flex-flow: column;
    font-size: 18px;
    font-weight: bold;
    color: #8600D7;
    margin-top: 12px;
    border: 1px solid #8600D7;
}
.subscribes>div{
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: 0;
    cursor: pointer;
}
.subscribes>div:not(:last-child){
    border-bottom: 1px solid #8600D7;
}
.subscribes>div>span:not(:last-child){
    margin-right: 12px;
}
.subscribes .count{
    color: #888;
    font-weight: normal;
    font-size: 14px;
    padding-bottom: 1em;
}
.subscribes .avatar{
    display: flex;
    justify-content: center;
    width: 80px;
}
.subscribes img{
    display: flex;
    max-width: 40px;
    max-height: 40px;
    width: auto;
    height: auto;
}
</style>