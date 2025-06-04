const SumSolution = require('./solutions/SUM/sum_solution');
const HelloSolution = require('./solutions/HLO/hello_solution');
const FizzBuzzSolution = require('./solutions/FIZ/fizz_buzz_solution');
const CheckoutSolution = require('./solutions/CHK/checkout_solution');
const RabbitHoleSolution = require('./solutions/RBT/rabbit_hole_solution');
const DemoRound1Solution = require('./solutions/DMO/demo_round1_solution');
const DemoRound2Solution = require('./solutions/DMO/demo_round2_solution');
const DemoRound3Solution = require('./solutions/DMO/demo_round3_solution');
const DemoRound4n5Solution = require('./solutions/DMO/demo_round4n5_solution');
const InventoryItem = require('./solutions/DMO/inventory_item');

class EntryPointMapping {
    constructor() {
        this.sumSolution = new SumSolution();
        this.helloSolution = new HelloSolution();
        this.fizzBuzzSolution = new FizzBuzzSolution();
        this.checkoutSolution = new CheckoutSolution();
        this.rabbitHoleSolution = new RabbitHoleSolution();
        this.demoRound1Solution = new DemoRound1Solution();
        this.demoRound2Solution = new DemoRound2Solution();
        this.demoRound3Solution = new DemoRound3Solution();
        this.demoRound4n5Solution = new DemoRound4n5Solution();
    }

    sum(...args) {
        return this.sumSolution.compute(...args);
    }

    hello(...args) {
        return this.helloSolution.hello(...args);
    }

    fizz_buzz(...args) {
        return this.fizzBuzzSolution.fizzBuzz(...args);
    }

    checkout(...args) {
        return this.checkoutSolution.checkout(...args);
    }

    rabbit_hole(...args) {
        return this.rabbitHoleSolution.rabbit_hole(...args);
    }

    increment(...args) {
        return this.demoRound1Solution.increment(...args);
    }

    to_uppercase(...args) {
        return this.demoRound1Solution.to_uppercase(...args);
    }

    letter_to_santa() {
        return this.demoRound1Solution.letter_to_santa();
    }

    count_lines(...args) {
        return this.demoRound1Solution.count_lines(...args);
    }

    array_sum(...args) {
        return this.demoRound2Solution.array_sum(...args);
    }

    int_range(...args) {
        return this.demoRound2Solution.int_range(...args);
    }

    filter_pass(...args) {
        return this.demoRound2Solution.filter_pass(...args);
    }

    inventory_add(inventoryItem, number) {
        const item = new InventoryItem(inventoryItem);
        return this.demoRound3Solution.inventory_add(item, number);
    }

    inventory_size() {
        return this.demoRound3Solution.inventory_size();
    }

    inventory_get(...args) {
        return this.demoRound3Solution.inventory_get(...args);
    }

    waves(...args) {
        return this.demoRound4n5Solution.waves(...args);
    }
}

module.exports = EntryPointMapping;
