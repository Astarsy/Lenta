<template>
    <div class="subscribes">
        <h3 class="sbs-status" v-if="data.length">Вы подписаны:</h3>
        <p class="sbs-status" v-else>Вы ни на кого не подписаны</p>
        <div v-for="item in data" :title="'Открыть ленту '+item.name"
            @click="onOpen(item)">
            <span class="avatar">
                <img draggable="false" v-if="item.avatar"
                    :src="'/img/avatars/'+item.avatar">
            </span>
            <span class="user-name">{{ item.name }}</span>
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
    overflow: hidden;
}
.sbs-status,
.subscribes>h3{
    text-align: center;
    font-weight: 600;
    margin: 4px 0 0 0;
    color: #555;
}
.subscribes>div{
    position: relative;
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: 2px 0 2px 6%;
    cursor: pointer;
}
.subscribes>div:hover{
    background-color: #f8f8f8;
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
    color: #FF4500;
}
</style>