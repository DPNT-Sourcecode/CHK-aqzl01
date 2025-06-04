'use strict';

class CheckoutSolution {
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40]]
        );
    #skuCatalogue = new Set(["A", "B", "C", "D", "E"])

    #pricingFactory(
        sku, 
        bulkThreshold = undefined, 
        discountedPrice = undefined, 
        subthresholdPricing = undefined
    ) {
        return (itemCount) => {
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
    
    #deductions(sku, threshold, counts) {
        return (itemCount) => {
            const eligibleDeductions = Math.floor(itemCount / threshold)
            counts[sku] -= eligibleDeductions
        }
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
            ["A", this.#pricingFactory("A", 5, 200,
                this.#pricingFactory("A", 3, 130)
            )],
            ["B", this.#pricingFactory("B", 2, 45)],
            ["C", this.#pricingFactory("C")],
            ["D", this.#pricingFactory("D")],
            // if E % 2 > 0, deduct a B from counts
            ["E", this.#pricingFactory("E", 2, 110, 
                this.#deductions("C", 2, counts)
            )],
        ])
        for (const sku of skus.split("")) {
            if (!this.#skuCatalogue.has(sku)) return -1;
            counts[sku]++;
        }

        let checkoutValue = 0
        for (const [sku, number] of Object.entries(counts)) {
            const fn = pricing.get(sku)
            if (number < 1) continue
            const skuCost = fn(number)
            console.log(sku, skuCost)
            checkoutValue += skuCost
        }
        return checkoutValue
    }
}

module.exports = CheckoutSolution;


