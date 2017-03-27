<template>
    <div id="deck">
        <div class="deck-container" v-if="userName">
            You logged in as {{ userName }}
        </div>
        <div class="deck-container" v-show="!isShowDeck && !selectedCard.name && !sessionStatistics.length">
            Waiting for task...
        </div>
        <div class="deck-container" v-show="isShowDeck">
            <div class="task-name">{{ taskName }}</div>
            <div v-for="card in deck" @click="vote(card)">
                {{ card.name }}
            </div>
        </div>
        <div class="deck-container" v-show="!isShowDeck && selectedCard.name">
            <div class>Your SP estimate is: {{ selectedCard.name }}</div>
        </div>
        <div class="deck-container" v-if="sessionStatistics.length">
            <div class="">Your session statistics:</div>
            <div v-for="data in sessionStatistics">
                {{ data.task }} : {{ data.card }}
            </div>
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
                    task: this.taskName
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
