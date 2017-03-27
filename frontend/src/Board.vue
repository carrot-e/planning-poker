<template>
    <div id="board">
        <div class="deck-container" v-if="!sessionClosed">
            <div class="users-online">
                <div v-for="user in users">
                    <div class="user">{{ user.userName }}</div>
                </div>
            </div>
        </div>
        <div class="deck-container" v-if="currentTask">{{ currentTask }}</div>
        <div class="deck-container" v-if="!currentTask && !sessionClosed">
            <label>
                Enter task name:
                <input type="text" autofocus v-model="taskName">
            </label>
            <a @click.prevent="start">Done</a>
        </div>
        <div class="deck-container" v-if="currentTask && votes">
            <div v-for="vote in votes">
                <div class="user">{{ vote.userName }}</div>
                <div class="card">{{ vote.card }}</div>
            </div>

            <div class="stop">
                <a class="" @click="stop">Next task</a>
            </div>
        </div>
        <div class="deck-container" v-if="!sessionClosed">
            <a class="" @click="close">Close session</a>
        </div>
        <div class="deck-container" v-if="sessionClosed">
            <div>Session closed</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'board',
        data() {
            return {
                users: [],
                currentTask: '',
                taskName: '',
                votes: [],
                sessionClosed: false
            }
        },
        methods: {
            start() {
                this.currentTask = this.taskName;
                this.taskName = '';
                this.votes = [];

                socket.emit('start-task', {
                    taskName: this.currentTask
                });
            },
            stop() {
                this.currentTask = '';
                this.votes = [];

                socket.emit('stop-task', {
                    taskName: this.currentTask
                });
            },
            close() {
                this.currentTask = '';
                this.sessionClosed = true;
                socket.emit('task-statistics', {});
            },
            _getNameByClientId(clientId) {
                for (var user of this.users) {
                    if (user.clientId == clientId) {
                        return user.userName;
                    }
                }
            }
        },
        created() {
            var that = this;
            socket.emit('board-created', {
                taskName: this.currentTask
            });

            socket.on('client-login', function(data) {
                console.log(data);
                that.users = data;
            });

            socket.on('client-vote', function(data) {
                console.log(data);
                data.userName = that._getNameByClientId(data.clientId);
                that.votes.push(data);
            });
        }
    }
</script>

<style lang="scss">

</style>
