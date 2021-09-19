<template>
    <form id="startup-form" action="/" method="get">
        <label>User Name:<br /><input type="text" name="user_name" v-model="message" /></label>
        <br />
        <label>Gameroom ID:<br /><input type="text" name="gameroom" /></label>
        <br />
        <input class="submit" type="submit" value="submit" @click="connectToGame"/>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data () {
        return {
            userName: ''
        }
    },
    methods: {
        connectToGame () {
            this.$socket.emit('new player')
        }
    }
})
</script>
