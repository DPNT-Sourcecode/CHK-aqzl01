'use strict';

class CheckoutSolution {
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40]]
        );
    #skuCatalogue = new Set(["A", "B", "C", "D", "E"])

    #pricingFactory(sku, bulkThreshold = Infinity, discountedPrice = Infinity) {
        return (itemCount) => {
            const bulkPricingInstances = Math.floor(itemCount / bulkThreshold)
            const individualInstances = itemCount - (bulkPricingInstances * bulkThreshold)
            let price = individualInstances * this.#standardPricing[sku]
            if (bulkPricingInstances > 0) {
                price += bulkPricingInstances * discountedPrice
            }
            return price
        }
    }
    
    // skus is expected to be a string
    checkout(skus) {
        const counts = {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0,
            "E": 0,
        }
        const bulkPricing = new Map([
            ["A", this.#pricingFactory("A", 3, 130)],
            ["A", this.#pricingFactory("A", 5, 200)],
            ["B", this.#pricingFactory("B", 2, 45)],
            // not sure if checkout value is value of good, or cost
            ["E", this.#pricingFactory("E", 2, 0)], 
        ])
        for (const sku of skus.split("")) {
            if (!this.#skuCatalogue.has(sku)) return -1;
            counts[sku]++;
        }

        return price
    }
}

module.exports = CheckoutSolution;

