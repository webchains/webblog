<template>
  <b-container>
      <b-row v-if="address">
          <b-col><p v-if="hide">{{addressHash}}</p><p v-else>{{address}}</p></b-col>
      </b-row>
      <b-row>
          <b-col><p><router-link :to="{name: 'postid', params: {postid: post._id}}">{{post.title}}</router-link></p></b-col>
      </b-row>
      <b-row v-if="post.media">
          <b-col>
    <img :src="node + '/files/' + post.media" :alt="post.media" v-if="/\.(jpe?g|png|gif|bmp|webp)$/i.test(post.media)" class="mediaSize">
    <video v-else-if="/\.(ogg|webm|3gp|flv|mp4)$/i.test(post.media)" :src="node + '/files/' + post.media" controls class="mediaSize"></video>
    <audio v-else-if="/\.(mp3|aac|wma|wav|flac)$/i.test(post.media)" :src="node + '/files/' + post.media" controls class="mediaSize"></audio>
    <p v-else class="actual">media: <a :href="node + '/files/' + post.media">{{post.media}}</a></p>
          </b-col>
      </b-row>
      <b-row v-if="post.text">
          <b-col><p><read-more more-str="read more" :text="post.text" link="#" less-str="read less" :max-chars="280"></read-more></p></b-col>
      </b-row>
      <hr>
      <b-row><b-col><p><b-button @click="reply = !reply">Reply</b-button>: <span v-if="post.reply.length"><b-button @click="replies = !replies">{{post.reply.length}}</b-button></span><span v-else>{{post.reply.length}}</span></p></b-col></b-row>
      <hr>
        <b-row v-if="reply">
            <b-col>
                <Reply :id="post._id" @reply="replyHandle"/>
            </b-col>
            <hr>
        </b-row>
        <b-row v-if="replies">
            <b-col>
                <Replies v-for="(reply, index) of post.reply" :key="index" :text="reply"/>
            </b-col>
        </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
import Reply from './Reply.vue'
import Replies from './Replies.vue'
export default {
    name: 'post',
    props: ['post', 'address'],
    data(){
        return {
            hide: this.$store.getters.hide,
            node: this.$store.getters.node,
            reply: false,
            replies: false,
            feedback: null,
            text: ''
        }
    },
    components: {
        Reply,
        Replies
    },
    computed: {
        addressHash(){
            return md5(this.address);
        }
    },
    methods: {
        replyHandle(e){
            this.$emit('reply', e);
        },
        sendData(){
            axios.post(this.node + '/posts/reply/' + this.post._id).then(res => {
                this.emit('reply', res.data);
                this.reply = false;
            }).catch(error => {
                this.feedback = 'there was an error, try again later';setTimeout(() => {this.feedback = null;}, 3000)
            });
        }
    }

}
</script>

<style>

</style>