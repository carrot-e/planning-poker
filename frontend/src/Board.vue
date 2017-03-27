<template>
    <div id="board" uk-grid>
        <div class="deck-container uk-width-1-3@m" v-if="!sessionClosed">
            <div class="">Join session:
                <a href="/#/login" target="_blank">http://elena.dev.techs.int:4001/#/login</a>
            </div>
            <ul class="users-online uk-list uk-margin uk-list-bullet">
                Users online:
                <li v-for="user in users">
                    <span uk-icon="icon: user"></span>
                    <span class="user">{{ user.userName }}</span>
                </li>
            </ul>
        </div>
        <hr>
        <div class="deck-container uk-h3" v-if="currentTask">{{ currentTask }}</div>
        <div class="deck-container" v-if="!currentTask && !sessionClosed">
            <form class="uk-form-stacked">
                <div class="uk-margin">
                    <label class="uk-form-label" for="task-input">Enter task name:</label>
                    <div class="uk-form-controls">
                        <input autofocus v-model="taskName" class="uk-input" id="task-input" type="text">
                    </div>
                </div>
                <div class="uk-margin">
                    <a @click.prevent="start" class="uk-button uk-button-primary">Done</a>
                </div>
            </form>
        </div>
        <div class="deck-container" v-if="currentTask && votes">
            <div v-for="vote in votes">
                <div class="uk-flex uk-flex-wrap">

                    <div class="user-voter">{{ vote.userName }}</div>
                    <div class="card uk-card uk-card-default uk-card-body uk-width-1-3@m uk-width-1-2@s uk-width-1-1@xs">
                        <h3 class="uk-card-title">{{ vote.card }}</h3>
                        <div class="uk-card-footer">{{ vote.description }}</div>
                    </div>
                </div>
            </div>

            <div class="stop">
                <a class="uk-button uk-button-primary" @click="stop">Next task</a>
            </div>
        </div>
        <div class="deck-container" v-if="!sessionClosed">
            <a class="uk-button uk-button-danger close-session" @click="close">Close session</a>
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
    .close-session {
        position: fixed;
        bottom: 10px;
        right: 10px
    }

</style>
