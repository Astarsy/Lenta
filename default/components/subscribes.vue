<template>
    <div class="subscribes">
        <h3 class="sbs-status" v-if="data.length">Вы подписаны:</h3>
        <p class="sbs-status" v-else>Вы ни на кого не подписаны</p>
        <div v-for="item in data" :title="'Открыть ленту '+item.name"
            @click="$emit('open',item)">
            <span class="user-ava-name">
                <img draggable="false" v-if="item.avatar"
                    :src="'/img/avatars/'+item.avatar">
                <span class="name">{{ item.name }}</span>
                <span class="count" title="Всего публикаций">{{ item.post_count }}</span>
            </span>
            <div class="unscribe"
                @click.stop="$emit('unscribe',item)">
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
    color: #4e4dff;
}
.subscribes>div{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 2px 2%;
    cursor: pointer;
}
.subscribes>div:hover{
    background-color: #f8f8f8;
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