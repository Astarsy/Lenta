<template>
    <div class="subscribes askf">
        <h3 v-if="data.length">Предложение дружить:</h3>
        <div v-for="item in data"
             class="askf-item"
             :title="'Открыть ленту '+item.name"
            @click="$emit('open',item)">
            <span class="user-ava-name">
                <img draggable="false" v-if="item.avatar"
                     :src="'/img/avatars/'+item.avatar">
                <span class="name">{{ item.name }}</span>
                <span class="count" title="Всего публикаций">{{ item.post_count }}</span>
            </span>
            <span class="askf-btn-block">
                <span class="mini-btn ok"
                      title="Дружить"
                      @click.stop="$emit('yes',item)">Да</span>
                <span class="mini-btn cancel"
                      title="Не дружить"
                      @click.stop="$emit('no',item)">нет</span>
            </span>
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
    .askf>h3{
        color: #FF4500;
    }
    .askf-item{
        justify-content: center;
    }
    .askf-btn-block{
        display: flex;
        align-items: center;
        flex-flow: row wrap;
        margin: 4px;
    }
    .askf-btn-block>*:not(:last-child){
        margin-right: 4px;
    }
</style>