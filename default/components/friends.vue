<template>
    <div class="subscribes friends">
        <h3 class="sbs-status" v-if="data.length">Друзья:</h3>
        <p class="sbs-status" v-else>Друзей пока нет</p>
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
                <div class="unscribe-text" title="Удалить из друзей">УДАЛИТЬ</div>
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
//         console.dir(this.data)
    }
}
</script>
<style>
    .friends>h3{
        color: #19a18e;
    }
</style>