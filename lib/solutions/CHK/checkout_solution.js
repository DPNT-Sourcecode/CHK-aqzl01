'use strict';

class CheckoutSolution {
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40]]
        );
    #skuCatalogue = new Set(["A", "B", "C", "D", "E"])

    #pricingFactory(sku, bulkThreshold, discountedPrice) {
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
            ["E", this.#pricingFactory("E", 2, )],
        ])
        for (const sku of skus.split("")) {
            if (!this.#skuCatalogue.has(sku)) return -1;
            counts[sku]++;
        }

        let price = counts["C"] * pricing.get("C") + counts["D"] * pricing.get("D")
        const bulkDiscountA = Math.floor(counts["A"] / 3)
        if (bulkDiscountA > 0) {
            price += bulkDiscountA * 130
            price += (counts["A"] % 3) * pricing.get("A") 
        } else {
            price += counts["A"] * pricing.get("A") 
        }

        const bulkDiscountB = Math.floor(counts["B"] / 2)
        if (bulkDiscountB > 0) {
            price += bulkDiscountB * 45
            price += (counts["B"] % 2) * pricing.get("B") 
        } else {
            price += counts["B"] * pricing.get("B") 
        }
        return price
    }
}

module.exports = CheckoutSolution;


