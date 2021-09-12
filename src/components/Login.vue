<template>
    <form id="startup-form" action="/" method="get">
        <label>User Name:<br /><input type="text" name="user_name" /> </label>
        <br />
        <label>Gameroom ID:<br /><input type="text" name="gameroom" /> </label>
        <br />
        <input class="submit" type="submit" value="submit" />
    </form>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
    props: {
        msg: String
    }
})
export default class HelloWorld extends Vue {
    msg!: string;
}
</script>
