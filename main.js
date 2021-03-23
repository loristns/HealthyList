// @ts-nocheck

const app = new Vue({
    el: '#app',
    data() {
        return {
            items: []
        };
    },

    computed: {
        score() {
            return computeScore(this.items);
        },

        healthMessage() {
            const score = this.score;

            if (score < 3) {
                return 'Mauvais';
            } else if (score  < 6) {
                return 'Moyen';
            } else {
                return 'Sain';
            }
        },

        nutriscore() {
            const score = this.score;

            if (score <= 2) {
                return 'E';
            } else if (score  <= 4) {
                return 'D';
            } else if (score <= 6) {
                return 'C';
            } else if (score <= 8) {
                return 'B';
            } else {
                return 'A';
            }
        }

        // todo: advice()
    },

    methods: {
        search: async () => {
            await searchProductsByName('oréo');
        }
    },

    created() {
        searchProductsByName('soupe')
            .then((items) => this.items = items);
    }
});
