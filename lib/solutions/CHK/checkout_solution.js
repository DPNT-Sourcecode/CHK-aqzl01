'use strict';

class CheckoutSolution {
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40]]
        );
    #skuCatalogue = new Set(["A", "B", "C", "D", "E"])

    #pricingFactory({
        sku, 
        bulkThreshold = undefined, 
        discountedPrice = undefined, 
        subthresholdPricing = undefined,
        counts = undefined,
        deductions = undefined, //TS use discriminated unions
    }) {
        return (itemCount) => {
            if (deductions) {
                deductions(itemCount)
            }
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
            ["A", this.#pricingFactory({
                sku: "A", bulkThreshold: 5, discountedPrice: 200,
                subthresholdPricing: this.#pricingFactory("A", 3, 130)
            })],
            ["B", this.#pricingFactory({sku: "B", bulkThreshold: 2, discountedPrice: 45})],
            ["C", this.#pricingFactory({sku: "C"})],
            ["D", this.#pricingFactory({sku: "D"})],
            // if E % 2 > 0, deduct a B from counts
            ["E", this.#pricingFactory({sku: "E", 
                deductions: this.#deductions("B", 2, counts)
            })],
        ])
        for (const sku of skus.split("")) {
            if (!this.#skuCatalogue.has(sku)) return -1;
            counts[sku]++;
        }

        let checkoutValue = 0
        for (const [sku, number] of Object.entries(counts)) {
            const fn = pricing.get(sku)
            console.log(sku, number)
            if (number < 1) continue
            const skuCost = fn(number)
            console.log(sku, skuCost)
            checkoutValue += skuCost
        }
        return checkoutValue
    }
}

module.exports = CheckoutSolution;






