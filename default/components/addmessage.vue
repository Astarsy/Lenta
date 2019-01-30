<template>
    <div class="adder">

        <flashmessage
            v-if="message"
            :parent="this"
            :message="message"
            @close="onFlashMessageClosed"></flashmessage>

        <div class="head">
            <h3 v-if="is_new">Написать сообщение</h3>
            <h3 v-else>Редактировать сообщение</h3>
            <colorpeeker :bgci="data.bgci" @color-choice="onColorChoice"></colorpeeker>
            <!--<toggleinput :access="data.access" @changed="onAccessChanged"></toggleinput>-->
        </div>

        <div class="post"
            :style="{ 'background-color' : bg_color }">

            <span v-if="post.id" class="delete-post" @click.stop="onDelete" title="Удалить сообщение">✘</span>

            <div class="post-title">
                <span>{{ data.updated_at | date }}</span>
            </div>

            <postitem v-for="(item,k) in data.items"
                class="item-box"
                :ref="'item_'+k"
                :key="item_component_key+k"
                :index="k"
                :itemscount="data.items.length"
                :class="getItemClass(item)"
                :item="item"
                :canedit='true'
                @changed="onItemsChanged"
                @editmodechanged="onEditmodeChanged"
                @alignchanged="onAlignChanged"
                @delete="onItemDelete"></postitem>

            <span v-if="data.items.length<max_post_items_count"
                class="add-item-button" 
                :class="{ disabled : edit_mode }"
                @click="onAddItem" 
                title="Добавить абзац">✚</span>
        </div>

        <div class="buttons">
            <span v-if="is_new" class="button ok"
                :class="{ disabled : !can_save }"
                @click="onSendClick">Создать</span>
            <span v-else class="button ok"
                :class="{ disabled : !can_save }"
                @click="onSendClick">Сохранить</span>
            <span class="button cancel"
                @click="onCloseClick">Отменить</span>
        </div>

    </div>
</template>

<script>
let colorpeeker=require('./colorpeeker.vue')
let postitem=require('./addpostitem.vue')
let flashmessage=require('./flashmessage.vue')
let toggleinput=require('./toggleinput.vue')
module.exports = {
    data: function(){
// console.dir(this.post)
        return{
            item_component_key: 0,
            max_items_count: 3,
            data: this.$root.deepCopy(this.post),
            edit_mode: false,
            can_save: this.countItems()>0,
            message: null,
        }
    },
    props:{
        post: Object        
    },
    methods: {
        onItemDelete(elem){
            this.data.items.splice(elem.index,1)
            if(this.data.items.length<1)this.data.items.unshift(this.getNewItem())
            this.item_component_key+=10; // force to redraw
        },
        onFlashMessageClosed(){
            this.message=null
        },
        onDelete(){
            if(this.data.id){
                this.$emit('delete',this.data.id)
            }
        },
        onItemsChanged(){
            this.can_save=this.countItems()>0
        },
        countItems(){
            let count=0;
            Object.entries(this.$refs).forEach(entry=>{
                let item_body=entry[1][0]
                if(item_body.deleted)return
                else count++;
            })
            return count
        },
        onSendClick: function(){
            if(!this.can_save)return

            let items=[]
            let files=[]
            let item_of_file=[]
            let item_counter=0

            Object.entries(this.$refs).forEach(entry=>{
                let k=entry[0]
                let item_body=entry[1][0]

                if(!item_body)return

                let item_data=item_body.data

                if(item_data.deleted)return

                if( !item_data.text
                    && (!item_data.fotos || item_data.fotos.length===0)
                    &&(!item_data.files || item_data.files.length===0))return

//                console.dir(item_data)
//                return

                if(item_data.fotos){
                    item_data.foto_names=[]
                    item_data.foto_ids=[]
                    for(let i=0;i<item_data.fotos.length;i++){
                        let foto=item_data.fotos[i]
                        item_data.foto_names.push(foto.name)
                        item_data.foto_ids.push(foto.id)
                    }
                }

                if(item_data.files){
                    let file_names=[]
                    for(let i=0;i<item_data.files.length;i++){
                        let file=item_data.files[i]
                        file_names.push(file.name)
                        files.push(file)
                        item_of_file.push(item_counter)
                    }
                    item_data.files=file_names
                }

                item_data.filedata=undefined    // не отправлять base64 представление изображения

                items.push(item_data)
                item_counter++;
            })

            let post_to_send={
                id: this.post.id,
                bgci: this.data.bgci,
                access: this.data.access,
                for_message_id: this.data.for_message_id,
                to_user_id: this.data.to_user_id,
                items: items,
                item_of_file: item_of_file
            }
//            Object.assign(post_to_send,post_to_send,this.data)

            this.postPost(post_to_send,files)
        },
        getItemClass:function(item){
            let c=item.fotos_align
            if(this.edit_mode)c+=' edited'
            return c
        },
        onAlignChanged(index,value){
            let item=this.data.items[index]
            item.fotos_align=value
            this.$set(this.data.items,index,item)
        },
        onEditmodeChanged(v){
            this.edit_mode=v
        },
        onAddItem(){
            if(this.edit_mode)return
            this.data.items.splice(this.data.items.length,0,this.getNewItem())
        },
        onColorChoice(v){
            this.data.bgci=v
        },
        onAccessChanged(v){
            this.data.access=v
        },
        postPost(post,files){
            let data=new FormData()
            data.append('data',JSON.stringify(post));

            for(let i=0;i<files.length;i++){
                data.append('userFiles[]',files[i])
            }

            this.$http.post(window.location.origin+"/api/addmsg",data).then(function(responce){

 console.dir(responce)
                    let res_post=responce.body
                    if(undefined===post.id){
                        res_post.is_new=true
                    }
                    this.$emit('message-setn',res_post)
                },
                function(responce){
 console.dir(responce)
                    this.message={
                        style: 'danger',
                        type: 'info',
                        text: "Не удалось создать сообщение..."
                    }
                })
        },
        onCloseClick: function(){
            this.$emit('adder-close')
        },
        getNewItem(){
            return {fotos_align:'center',tag:'text',text:'',fotos:[], fotos_class:'mini'}
        }
    },
    computed:{
        bg_color:function(){
            return document.mag_start_data.colors[this.data.bgci]
        },
        is_new:function(){
            return !this.data.updated_at
        },
        max_post_items_count: function(){
            return document.mag_start_data.max_post_items_count
        }
    },
    mounted(){
        this.onItemsChanged()
    },
    components: {
        colorpeeker,
        postitem,
        flashmessage,
        toggleinput
    }
}
</script>
<style>
</style>