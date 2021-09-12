<template>
<div class="form__wrapper">
    <Board />
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Board from '@/components/Board.vue' // @ is an alias to /src

@Options({
    components: {
        Board
    }
})
export default class Home extends Vue {}
</script>
