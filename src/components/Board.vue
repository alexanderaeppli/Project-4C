<template>
    <div class="content__wrapper">
        <button id="reset_btn">RESET GAME</button>
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
import { Options, Vue } from 'vue-class-component'

export default class Board extends Vue {
}
</script>

<style>
</style>
