<template>
  <b-row>
      <b-col>
        <b-form @submit.prevent="sendData">
            <b-form-textarea id="textarea" v-model="text" placeholder="Enter a reply..." rows="3" max-rows="6"></b-form-textarea>
            <b-button type="submit">submit</b-button>
        </b-form>
        <p v-if="feedback">{{feedback}}</p>
      </b-col>
  </b-row>
</template>

<script>
export default {
    name: 'reply',
    props: ['id'],
    data(){
        return {
            text: '',
            feedback: null
        }
    },
    methods: {
        sendData(){
            axios.post(this.node + '/posts/reply/' + this.id).then(res => {
                this.emit('reply', this.id);
            }).catch(error => {
                this.feedback = 'there was an error, try again later';setTimeout(() => {this.feedback = null;}, 3000)
            });
        }
    }
}
</script>

<style>

</style>template>