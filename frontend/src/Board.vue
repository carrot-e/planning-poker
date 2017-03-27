<template>
    <div id="board">
        <div class="deck-container">
            <div class="users-online">
                <div v-for="user in users">
                    <div class="user">{{ user.name }}</div>
                </div>
            </div>
        </div>
        <div class="deck-container" v-if="currentTask">{{ currentTask }}</div>
        <div class="deck-container" v-if="!currentTask">
            <label>
                Enter task name:
                <input type="text" autofocus v-model="taskName">
            </label>
            <a @click.prevent="start">Done</a>
        </div>
        <div class="deck-container" v-if="currentTask && votes">
            <div v-for="vote in votes">
                <div class="user">{{ vote.user.name }}</div>
                <div class="card">{{ vote.card.name }}</div>
            </div>

            <div class="stop">
                <a class="" @click="stop">Next task</a>
            </div>
        </div>
    </div>
</template>

<script>
    var socket = io('http://localhost:4001');

    export default {
        name: 'board',
        data() {
            return {
                users: [],
                currentTask: '',
                taskName: '',
                votes: []
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

                socket.emit('task-statistics', {
                    taskName: this.currentTask,
                    votes: this.votes
                });
                socket.emit('stop-task', {
                    taskName: this.currentTask
                });
            }
        }
    }
</script>

<style lang="scss">

</style>
