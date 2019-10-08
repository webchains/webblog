<template>
  <b-container>
      <b-row v-if="address">
          <b-col><p v-if="hide">{{hashAddress}}</p><p v-else>{{address}}</p></b-col>
      </b-row>
      <b-row>
          <b-col>
              <b-form @submit.prevent="onSubmit">
                <b-input-group prepend="Title" class="mt-3" size="sm">
                    <b-form-input v-model="title" placeholder="type title here, limit 100 characters"></b-form-input>
                </b-input-group>
                <b-form-textarea v-model="text" placeholder="type your post" class="my-1"></b-form-textarea>
                <b-form-file v-model="media" class="my-1"></b-form-file>
                <b-input-group prepend="Private Key" class="mt-3" size="sm">
                    <b-form-input v-model="main" placeholder="type or paste key here"></b-form-input>
                </b-input-group>
                <b-button type="submit" class="my-1">submit</b-button>
              </b-form>
              <p v-if="feedback">{{feedback}}</p>
          </b-col>
      </b-row>
      <b-row v-if="posts && posts.docs.length">
          <b-col>
              <hr>
              <p>Results: <b-button @click="limit = 10" class="mx-1">10</b-button><b-button @click="limit = 25" class="mx-1">25</b-button><b-button @click="limit = 50" class="mx-1">50</b-button><b-button @click="limit = 75" class="mx-1">75</b-button><b-button @click="limit = 100" class="mx-1">100</b-button></p>
              <hr>
          </b-col>
      </b-row>
      <b-row v-if="posts">
          <b-col v-if="posts.docs.length">
              <Post v-for="post of posts.docs" :key="post._id" :address="address" @reply="getPost" :post="post"/>
              <b-pagination v-model="page" :total-rows="posts.total" :per-page="limit" align="fill"></b-pagination>
          </b-col>
          <b-col v-else>
              <p>no posts yet</p>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import md5 from 'md5'
import axios from 'axios'
import Post from '../components/Post.vue'
export default {
    name: 'index',
    props: ['address'],
    computed: {
        hashAddress(){
            return md5(this.address);
        }
    },
    created(){
        this.getPosts();
    },
    data(){
        return {
            node: this.$store.getters.node,
            hide: this.$store.getters.hide,
            main: '',
            text: '',
            media: '',
            title: '',
            page: 1,
            limit: 10,
            posts: null,
            feedback: null
        }
    },
    components: {
        Post
    },
    watch: {
        data(){
            this.getPosts();
        },
        limit(){
            this.getPosts();
        }
    },
    methods: {
        getPost(e){
            axios.get(this.node + '/posts/' + e).then(res => {
                this.loopPost(res.data);
            }).catch(error => {
                console.log(error);
            });
        },
        loopPost(data){
            for(let i = 0;i < this.posts.docs.length;i++){
                if(this.posts.docs[i]._id === data._id){
                    this.posts.docs[i] = data;
                    break;
                }
            }
        },
        onSubmit(){
            if(!this.main || !this.title || this.title.length > 100 || !this.text && !this.media){
                this.feedback = 'something is empty or incorrect';
                setTimeout(() => {this.feedback = null;}, 3000);
            } else {
                let bodyFormData = new FormData();
                bodyFormData.append('main', this.main);
                bodyFormData.append('title', this.title);
                if(this.text){
                    bodyFormData.append('text', this.text);
                }
                if(this.media){
                    bodyFormData.append('media', this.media);
                }
                this.sendPost(bodyFormData);
            }
        },
        sendPost(data){
            axios.post(this.node + '/posts', data).then(res => {
                this.text = '';
                this.media = '';
                this.title = '';
                this.main = '';
                this.feedback = 'post was submitted';
                setTimeout(() => {this.feedback = null;}, 3000);
                this.getPosts();
            }).catch(error => {
                console.log(error);
                this.feedback = 'error while submitting post, try again later';
                setTimeout(() => {this.feedback = null;}, 3000);
            });
        },
        getPosts(){
            axios.get(this.node + '/posts/' + this.page + '/' + this.limit).then(res => {
                console.log(res)
                this.posts = res.data;
            }).catch(error => {
                console.log(error);
            });
        }
    }
}
</script>

<style>

</style>