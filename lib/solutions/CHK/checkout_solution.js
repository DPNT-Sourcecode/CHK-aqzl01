'use strict';

class CheckoutSolution {
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40]]
        );
    #skuCatalogue = new Set(["A", "B", "C", "D", "E"])

    #pricingFactory(sku, bulkThreshold = Infinity, discountedPrice = Infinity, subthresholdPricing = undefined) {
        return (itemCount) => {
            const bulkPricingInstances = Math.floor(itemCount / bulkThreshold)
            const individualInstances = itemCount - (bulkPricingInstances * bulkThreshold)
            let price = 0
            // handle larger dividends first
            if (bulkPricingInstances > 0) {
                price += bulkPricingInstances * discountedPrice
            }
            // recursive
            if (subthresholdPricing) {
                price += subthresholdPricing?.(individualInstances) || 0
            } else {
                price += individualInstances * this.#standardPricing[sku]
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
        const pricing = new Map([
            ["A", this.#pricingFactory("A", 5, 200,
                this.#pricingFactory("A", 3, 130)
            )],
            ["B", this.#pricingFactory("B", 2, 45)],
            ["C", this.#pricingFactory("C")],
            ["D", this.#pricingFactory("D")],
            // not sure if checkout value is value of goods, or cost
            ["E", this.#pricingFactory("E", 2, 110)], // 110 in cart value
        ])
        for (const sku of skus.split("")) {
            if (!this.#skuCatalogue.has(sku)) return -1;
            counts[sku]++;
        }

        let checkoutValue = 0
        for (const [sku, number] of Object.entries(counts)) {
            const skuCost = pricing.get(sku)(number)
            console.log(sku, number, skuCost)
            checkoutValue += skuCost
        }
        return checkoutValue
    }
}

module.exports = CheckoutSolution;

