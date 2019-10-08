<template>
  <b-container v-if="post">
      <b-row v-if="address">
          <b-col><p v-if="hide">{{hashAddress}}</p><p v-else>{{address}}</p></b-col>
      </b-row>
      <b-row>
          <b-col>
              <p><b-button :to="{name: 'index'}">Home</b-button></p>
          </b-col>
      </b-row>
      <b-row>
          <b-col><p>post:{{post.title}}</p></b-col>
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
          <b-col><p>{{post.text}}</p></b-col>
      </b-row>
      <hr>
      <b-row><b-col><p><b-button @click="reply = !reply">Reply</b-button>: <span v-if="post.reply.length"><b-button @click="replies = !replies">{{post.reply.length}}</b-button></span><span v-else>{{post.reply.length}}</span></p></b-col></b-row>
      <hr>
        <b-row v-if="reply">
            <b-col>
        <b-form @submit.prevent="handleData">
            <b-form-textarea id="textarea" v-model="text" placeholder="Enter a reply..." rows="3" max-rows="6"></b-form-textarea>
            <b-button type="submit">submit</b-button>
        </b-form>
        <p v-if="feedback">{{feedback}}</p>
            </b-col>
            <hr>
        </b-row>
        <b-row v-if="replies">
            <b-col>
                <b-row v-for="(reply, index) of post.reply" :key="index"><b-col><p>{{reply}}</p></b-col></b-row>
            </b-col>
        </b-row>
  </b-container>
  <b-container v-else>
      <b-row>
          <b-col>
              <p>loading post</p>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
export default {
    name: 'permalink',
    props: ['address'],
    created(){
        this.getPost();
    },
    computed: {
        hashAddress(){
            return md5(this.address);
        }
    },
    data(){
        return {
            hide: this.$store.getters.hide,
            node: this.$store.getters.node,
            reply: false,
            replies: false,
            feedback: null,
            postid: this.$route.params.postid,
            post: null,
            text: ''
        }
    },
    methods: {
        getPost(){
            axios.get(this.node + '/posts/' + this.postid).then(res => {
                this.post = res.data;
            }).catch(error => {
                console.log(error);
            });
        },
        handleData(){
            if(!this.text){
                this.feedback = 'reply is empty';
                setTimeout(() => {this.feedback = null;}, 3000);
            } else {
                this.sendData(this.text);
            }
        },
        sendData(data){
            axios.post(this.node + '/posts/reply/' + this.post._id, {text: data}).then(res => {
                this.reply = false;
                this.getPost();
            }).catch(error => {
                this.feedback = 'there was an error, try again later';setTimeout(() => {this.feedback = null;}, 3000);
            });
        }
    }

}
</script>

<style>

</style>