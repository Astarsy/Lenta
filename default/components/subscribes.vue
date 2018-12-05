<template>
    <div class="subscribes">
        <div v-for="item in data" title="Открыть ленту"
            @click="onOpen(item)">
            <span class="avatar">
                <img v-if="item.avatar"
                    :src="'/img/avatars/'+item.avatar">
            </span>
            <span class="name">{{ item.name }}</span>
            <span class="count" title="Всего публикаций">{{ item.post_count }}</span>
            <div class="unscribe"
                @click.stop="onUnscribe(item)">
                ❌
                <div class="unscribe-text" title="Отписаться">ОТПИСАТЬСЯ</div>
            </div>
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
        onUnscribe(item){
            this.$emit('unscribe',item)
        },
        onOpen(item){
            this.$emit('open',item)
        }
    },
    created(){
        // console.dir(this._data)
    }
}
</script>
<style>
.subscribes{
    display: flex;
    flex-flow: column;
    margin-top: 12px;
    border: 1px solid #8600D7;
    overflow: hidden;
}
.subscribes>div{
    position: relative;
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
.subscribes .name{
    font-size: 18px;
    font-weight: bold;
    color: #8600D7;
}
.subscribes .count{
    color: #888;
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

.subscribes .unscribe{
    position: absolute;
    top: 2px;
    right: 3px;
    font-size: 12px;
    line-height: 13px;
    color: #ccc;
    opacity: 0;
}
.subscribes>div:hover .unscribe{
    opacity: 1;
}
.subscribes .unscribe-text{
    position: absolute;
    top: 0;
    right: -90px;
    color: #777;
    background-color: #fff;
    transition: all 1s;
}
.subscribes .unscribe:hover .unscribe-text{
    right: 0;
}
</style>