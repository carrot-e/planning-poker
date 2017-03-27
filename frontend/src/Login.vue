<template>
    <div id="login" uk-grid>
        <form class="uk-form-stacked">
            <div class="uk-margin">
                <label class="uk-form-label" for="login-input">Your name is:</label>
                <div class="uk-form-controls">
                    <input autofocus v-model="userName" class="uk-input" id="login-input" type="text">
                </div>
            </div>
            <div class="uk-margin">
                <a @click.prevent="login" class="uk-button uk-button-primary">Done</a>
            </div>
        </form>
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
