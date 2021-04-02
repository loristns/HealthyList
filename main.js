// @ts-nocheck

const app = new Vue({
    el: '#app',
    data() {
        return {
            items: [],
            addMenuOpened: false,
            lastSearch: "",
            searchAnswer: [],
            currentItemInView: null
        };
    },

    computed: {
        score() {
            return computeScore(this.items);
        },

        healthMessage() {
            const score = this.score;

            if (this.items.length === 0) {
                return '-';
            } else if (score < 3) {
                return 'Mauvais';
            } else if (score  < 6) {
                return 'Moyen';
            } else {
                return 'Sain';
            }
        },

        nutriscore() {
            const score = computeNutriScore(this.items);

            if (score === 0) {
                return '-';
            } else if (score <= 2) {
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
        },

        advice() {
            return getAdvice(this.items);
        },

        color() {
            const score = this.score;

            if (this.items.length == 0) {
                return 'circle-grey';
            } else if (score < 3) {
                return 'circle-red';
            } else if (score  < 6) {
                return 'circle-yellow';
            } else {
                return 'circle-green';
            }
        },

        healthyItems() {
            return this.items.filter((item) => computeIndividualScore(item) >= 6);
        },

        middleItems() {
            return this.items.filter((item) => {
                const score = computeIndividualScore(item);
                return score < 6 && score > 3;
            });
        },

        badItems() {
            return this.items.filter((item) => computeIndividualScore(item) <= 3);
        },

        otherItems() {
            const printedItems = [
                ...this.healthyItems.map((item) => JSON.stringify(item)),
                ...this.middleItems.map((item) => JSON.stringify(item)),
                ...this.badItems.map((item) => JSON.stringify(item)),
            ];
            return this.items.filter((item) => !printedItems.includes(JSON.stringify(item)));
        }
    },

    methods: {
        saveToLocalStorage() {
            window.localStorage.setItem('items', JSON.stringify(this.items));
        },

        async searchProduct(event) {
            event.preventDefault();

            const result = await searchProductsByName(this.lastSearch);
            this.searchAnswer = result.slice(0, 20);
        },
        
        addToList(item) {
            this.items.push(item);
            this.addMenuOpened = false;

            this.saveToLocalStorage();
        },

        editItem(item) {
            this.currentItemInView = item;
        },

        toggleItemFromList() {
            this.items[this.items.indexOf(this.currentItemInView)].checked = !this.items[this.items.indexOf(this.currentItemInView)].checked;
            this.currentItemInView = null;
            this.saveToLocalStorage();
        },

        removeItemFromList() {
            this.items.splice(this.items.indexOf(this.currentItemInView), 1);
            this.currentItemInView = null;
            this.saveToLocalStorage();
        },

        clearList(){
            this.items = []
            this.saveToLocalStorage();

        },

        saveItem() {
            this.saveToLocalStorage();
            this.currentItemInView = null;
        },

        async scanCode(code) {
            if (this.addMenuOpened) {
                // requête api
                const item = await searchProductByBarcode(code);
                
                if (item === undefined){
                    Quagga.start();
                    return;
                }

                // ajoute le produit + ouvre la page de modif du produit
                this.addToList(item);
                this.editItem(item);
                Quagga.start();
            }
        }
    },

    created() {
        this.items = JSON.parse(window.localStorage.getItem('items') || '[]');
        
        this.$on('new-barcode-detected', this.scanCode);
    }
});

subscribeToScanner(app);