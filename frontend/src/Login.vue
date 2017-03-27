<template>
    <div id="login">
        <div class="deck-container">
            <label>
                Your name is:
                <input type="text" autofocus v-model="userName">
            </label>
            <a @click.prevent="login">Done</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                userName: ''
            }
        },
        methods: {
            login() {
                socket.emit('client-login', {
                    userName: this.userName
                });

                this.$router.push('/deck');
            }
        }
    }
</script>

<style lang="scss">

</style>
