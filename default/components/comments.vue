<template>
    <div class="comments">
        <div v-if="edit_mode"
            class="edit-box">

            <div v-if="can_add" :class="text_box_class">
                <div :ref="ref"
                    placeholder="Оставить комментарий"
                    :contenteditable="edit_mode"
                    @input="onInput"></div>
            </div>

            <div v-if="can_add" class="footer">
                <div class="tool-set">
                    <div v-if="is_comment_ok"
                        class="tool cancel"
                        @click="onCancel">ОТМЕНИТЬ</div>
                    <div v-if="is_comment_ok"
                        class="tool ok"
                        @click="onOk">ГОТОВО</div>
                </div>

                <div v-if="edit_mode" class="count"
                    :title="counter.title"
                    :class="counter.class">{{ counter.text }}</div>
            </div>
        </div>

        <div v-for="item in items" class="comment">
            <div class="l-block">
                <div class="ava-box">
                    <img v-if="item.author_avatar"
                        :src="'/img/avatars/'+item.author_avatar"
                        @click="onAuthorClick({id:item.author_id,name:item.author_name,avatar:item.author_avatar})">
                </div>
            </div>
            <div class="r-block">
                <div>
                    <span class="author">{{ item.author_name }}</span>
                    <span>{{ item.created_at | date }}</span>
                </div>
                <div class="text">{{ item.text }}</div>
            </div>
        </div>

    </div>
</template>

<script>
module.exports = {
    data: function(){
        return{
            lastupdate: null,
            curpage: 0,
            items: [],
            can_add: false,
            edit_mode: true,
            counter: {  text: document.mag_start_data.max_post_item_text_length,
                        class: '',
                        title: 'Максимальная длина -'+document.mag_start_data.max_post_item_text_length+'  знаков'                    },
            is_comment_ok:false
        }
    },
    props:{
        data: Object
    },
    methods: {
        onOk(){
            var t=this.$refs[this.ref].innerText.trim().substring(0,document.mag_start_data.max_post_item_text_length)
            this.sendComment(t)
        },
        onCancel(){
            this.$refs[this.ref].innerText=''
            this.setCounter()
        },
        onInput(){
            this.setCounter()
        },
        onAuthorClick(author){},
        updateItem(item){
            var id=this.getItemIndexById(item.id)
            if(null!==id)this.$set(this.items,id,item)
        },
        sortItems(){
            this.items.sort(function(a,b){
                var tsa=new Date(a.updated_at).getTime()
                var tsb=new Date(b.updated_at).getTime()
                if(tsa>tsb)return -1;
                if(tsa<tsb)return 1;
            })
        },
        getItemIndexById(id){
            // Вернуть индекс по id/null
            for(var i=0;i<this.items.length;i++)if(this.items[i].id===id)return i
            return null
        },
        updateItems(new_items){
            // Обновить все полученные
            for(var i=0;i<new_items.length;i++){
                var pi=this.getItemIndexById(new_items[i].id)
                if(null===pi){
                    this.items.push(new_items[i])
                }else{
                    this.$set(this.items,pi,new_items[i])
                }
            }
            this.sortItems()
        },
        sendComment(t){
            let options={
                params:{
                    lastupdate: this.lastupdate,
                    curpage: this.curpage,
                    pid: this.data.id,
                    text: t
                }
            }
            this.$http.get(window.location.origin+"/api/addcomment",options).then(function(responce){
//console.dir(responce.body)
                    let item=responce.body
                    item.text=t
                    this.items.unshift(item)
                    this.can_add=false
                },function(responce){  
//console.dir(responce.body)
                })            
        },
        request(){
            var options={
                params:{
                    lastupdate: this.lastupdate,
                    curpage: this.curpage,
                    pid: this.data.id
                }
            }
            this.$http.get(window.location.origin+"/api/getcomments",options).then(function(responce){
//console.dir(responce.body)
                    if(responce.body.items.length>0){
                        this.updateItems(responce.body.items)
                        this.lastupdate=responce.body.lastupdate
                    }
                    this.can_add=responce.body.can_add
                },function(responce){  
//console.dir(responce.body)
                })
        },
        setCounter(){
            var max_length=document.mag_start_data.max_post_item_text_length
            if(undefined===this.$refs[this.ref]){
                this.counter.title=''
                this.counter.class='hide'                
                return max_length
            }
            var text=this.$refs[this.ref].innerText
            var r=max_length-text.length
            if(r<0){
                this.is_comment_ok=false
                this.counter.title='Сообщение слишком длинное! Последние '+(-r)+' знаков будут потеряны!'
                this.counter.class='danger'
            }else if(r==max_length){
                this.is_comment_ok=false
                this.counter.title=''
                this.counter.class='hide'
            }else{
                this.is_comment_ok=true
                this.counter.title='Длина сообщения '+text.length
                this.counter.class=''
            }
            this.counter.text=r
        }
    },
    computed:{
        ref:function(){
            return 'comment_'+this.data.id
        },
        cur_user: function(){
            if(document.mag_start_data.user)return document.mag_start_data.user
            else return null
        }
    },
    created(){
        // console.dir(this.data)
        this.request()
        this.setCounter()
    }
}
</script>
<style>
div:empty::before {
    content: attr(placeholder);
    color: #888;
    font-style: italic;
}
div[contenteditable='true']{
    position: relative;
    outline: none;
}

.comments{
    display: flex;
    flex-flow: column;
    border: 1px solid #eee;
    border-radius: 10px;
    margin: 8px;
    padding: 4px 6px;
    font-size: 15px;
    background-color: #fff;
    color: #444;
    cursor: default;
}
.comment{
    display: flex;
}
.comment:not(:last-child){
    margin-bottom: 10px;
}
.l-block{
    margin-right: 10px;
}
.comments .author{
    font-weight: 650;
}
.comments .text{
    margin-left: 12px;
    font-size: 16px;
}
.comments .can-add-btn{
    cursor: pointer;
}

.comments .l-block{
    display: flex;
}
.comments .ava-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid #ccc;    
    border-radius: 200px;
    overflow: hidden;
}
.comments .l-block img{
    max-width: 100%;
    max-height: 100%;
    height: auto;
}

.comments .footer{
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #ccc;
    margin-top: 8px;
    padding-top: 4px;
}
.comments .count{
    color: #00AA17;
    background-color: rgba(0,0,0,0);
}
.comments .count.danger{
    color: red;
    font-weight: bold;
}
.comments .count.hide{
    display: none;
}
.comments .tool-set{
    display: flex;
    justify-content: center;
    align-items: center;
}
.comments .tool{
    display: flex;
    justify-content: center;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
}
.comments .tool:not(:last-child){
    margin-right: 12px;
}
.comments .tool.ok{
    color: #fff;
    background-color: #00BB19;
    padding: 0 5px;
}
.comments .tool.cancel{
    font-weight: 400;    
}
</style>