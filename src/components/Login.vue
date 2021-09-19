<template>
    <form id="startup-form" action="/" method="get">
        <label>User Name:<br /><input type="text" name="user_name" v-model="userName" /></label>
        <br />
        <label>Gameroom ID:<br /><input type="text" name="gameroom" v-model="gameRoom" /></label>
        <br />
        <input class="submit" type="submit" value="submit" @click="connectToGame"/>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data () {
        return {
            userName: '',
            gameRoom: ''
        }
    },
    methods: {
        connectToGame (e: Event) {
            e.preventDefault()
            this.$socket.emit('new player', { userName: this.userName, gameRoom: this.gameRoom })
            this.$router.push('Game')
        }
    }
})
</script>
