'use strict';

class CheckoutSolution {
    
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40]]
        );
    #skuCatalogue = ["E", "A", "B", "C", "D"]

    #pricingFactory({
        sku, 
        bulkThreshold = undefined, 
        discountedPrice = undefined, 
        subthresholdPricing = undefined,
    }) {
        return (itemCount) => {
            if (itemCount <= 0) return 0; 
            let individualInstances = itemCount
            let bulkPricingInstances = 0
            if (bulkThreshold && discountedPrice) {
                bulkPricingInstances = Math.floor(itemCount / bulkThreshold) 
                individualInstances = itemCount - (bulkPricingInstances * bulkThreshold) 
            } 
            let price = 0
            // handle larger dividends first
            if (bulkPricingInstances > 0) {
                price += bulkPricingInstances * discountedPrice
            }
            // recursive
            if (subthresholdPricing) {
                price += subthresholdPricing?.(individualInstances) || 0
            } else {
                price += individualInstances * this.#standardPricing.get(sku)
            }

            return price
        }
    }
    
    #deductions(counts) {
        const applicableDeductions = Math.floor(counts["E"] / 2)
        counts["B"] = Math.max(0, counts["B"] - applicableDeductions)
    }

    // skus is expected to be a string
    checkout(skus) {
        const counts = {
            "E": 0, // need to find out way to resolve BNGOFs first
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0,
        }
        const pricing = new Map([
            ["A", this.#pricingFactory({
                sku: "A", bulkThreshold: 5, discountedPrice: 200,
                subthresholdPricing: this.#pricingFactory("A", 3, 130)
            })],
            ["B", this.#pricingFactory({sku: "B", bulkThreshold: 2, discountedPrice: 45})],
            ["C", this.#pricingFactory({sku: "C"})],
            ["D", this.#pricingFactory({sku: "D"})],
            // if E % 2 > 0, deduct a B from counts
            ["E", this.#pricingFactory({sku: "E"})],
        ])
        for (const sku of skus.split("")) {
            if (!new Set(this.#skuCatalogue).has(sku)) return -1;
            counts[sku]++;
        }

        let checkoutValue = 0
        this.#deductions(counts)
        for (const sku of this.#skuCatalogue.values()) {
            const fn = pricing.get(sku)
            const skuCost = fn(counts[sku])
            checkoutValue += skuCost
        }
        return checkoutValue
    }
}

module.exports = CheckoutSolution;



