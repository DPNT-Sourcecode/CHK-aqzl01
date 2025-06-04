'use strict';

class CheckoutSolution {
    
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40], ["F", 10]]
        );
    #skuCatalogue = new Set(["A", "B", "C", "D", "E", "F"])

    #pricingFactory({
        sku, 
        bulkThreshold = undefined, 
        discountedPrice = undefined, 
        subthresholdPricing = undefined,
        buyNGetMSameItem = undefined
    }) {
        return (itemCount) => {
            if (itemCount <= 0) return 0; 

            if (buyNGetMSameItem) {
                const [buyN, getM] = buyNGetMSameItem
                const eligibleInstances = Math.floor(itemCount / buyN)
                const leftovers = itemCount % buyN
                const billableItems = eligibleInstances * getM + leftovers
                return billableItems * this.#standardPricing.get(sku)
            }
            let individualInstances = itemCount
            let bulkPricingInstances = 0
            if (bulkThreshold && discountedPrice) {
                bulkPricingInstances = Math.floor(itemCount / bulkThreshold) 
                individualInstances = itemCount % bulkThreshold 
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
            "F": 0
        }
        const pricing = new Map([
            ["A", this.#pricingFactory({
                sku: "A", bulkThreshold: 5, discountedPrice: 200,
                subthresholdPricing: this.#pricingFactory({sku: "A", bulkThreshold: 3, discountedPrice:130})
            })],
            ["B", this.#pricingFactory({sku: "B", bulkThreshold: 2, discountedPrice: 45})],
            ["C", this.#pricingFactory({sku: "C"})],
            ["D", this.#pricingFactory({sku: "D"})],
            // if E % 2 > 0, deduct a B from counts
            ["E", this.#pricingFactory({sku: "E"})],
            ["F", this.#pricingFactory({sku: "F", buyNGetMSameItem: [2,1]})],
        ])
        for (const sku of skus.split("")) {
            if (!this.#skuCatalogue.has(sku)) return -1;
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


