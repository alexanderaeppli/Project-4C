<template>
    <div class="content__wrapper">
        <button id="reset_btn" @click="this.$socket.emit('test')">RESET GAME</button>
        <div id="enemy__wrapper">
            <div id="enemy__wrapper_inner"></div>
        </div>
        <div class="content__inner">
            <div id="deck">Draw Card</div>
            <div id="stack__inventory"></div>
        </div>
        <div id="player__inventory"></div>
    </div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client'

export default {
    props: {
        socket: Socket
    },
    data () {
        return {
            socket: this.$socket
        }
    },
    methods: {
        test () : void {
            
        }
    }
}
</script>

<style>
</style>
