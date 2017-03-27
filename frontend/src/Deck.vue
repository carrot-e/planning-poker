<template>
    <div id="deck" uk-grid>
        <div class="deck-container" v-if="userName">
            You logged in as {{ userName }}
        </div>
        <div class="deck-container" v-show="!isShowDeck && !selectedCard.name && !sessionStatistics.length">
            Waiting for task...
        </div>
        <div class="deck-container" v-show="isShowDeck">
            <div class="task-name uk-h3">{{ taskName }}</div>
            <div class="uk-flex uk-flex-wrap uk-margin">
                <div v-for="card in deck" @click="vote(card)" class="card uk-card uk-card-default uk-card-body uk-width-1-3@m uk-width-1-2@s uk-width-1-1@xs">
                    <h3 class="uk-card-title">{{ card.name }}</h3>
                    <div class="uk-card-footer">{{ card.description }}</div>
                </div>
            </div>
        </div>
        <div class="deck-container" v-show="!isShowDeck && selectedCard.name">
            <div class="task-name uk-h3">{{ taskName }}</div>
            <div class>Your SP estimate is: {{ selectedCard.name }}</div>
        </div>
        <div class="deck-container" v-if="sessionStatistics.length">
            <div class="uk-h3">Your session statistics:</div>
            <table class="uk-table">
                <tbody>
                    <tr v-for="data in sessionStatistics">
                        <td>{{ data.task }}</td>
                        <td>{{ data.card }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'deck',
        data() {
            return {
                isShowDeck: false,
                selectedCard: {name: '', description: ''},
                taskName: '',
                userName: '',
                deck: [
                    {name: 'XXS', description: 'up to 2 hours'},
                    {name: 'XS', description: 'up to 8 hours'},
                    {name: 'S', description: 'up to 2 days'},
                    {name: 'M', description: 'up to 5 days'},
                    {name: 'L', description: 'up to 10 days'},
                    {name: 'XL', description: 'more than 10 days'},
                    {name: '∞', description: '...'},
                ],
                sessionStatistics: []
            }
        },
        methods: {
            vote(card) {
                socket.emit('client-vote', {
                    card: card.name,
                    task: this.taskName,
                    description: card.description
                });
                this.isShowDeck = false;
                this.selectedCard = card;
            }
        },
        created() {
            var that = this;
            socket.on('start-task', function(data) {
                console.log(data);
                that.isShowDeck = true;
                that.selectedCard = {};
                that.taskName = data.taskName;
            });

            socket.on('client-login', function(data) {
                that.userName = data.userName; // TODO
            });

            socket.on('task-statistics', function(data) {
                console.log(data);
                that.selectedCard = {};
                that.sessionStatistics = data;
                that.isShowDeck = false;
            });
        }
    }
</script>

<style lang="scss">

</style>
