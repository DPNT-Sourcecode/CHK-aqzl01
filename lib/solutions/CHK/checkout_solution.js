'use strict';

class CheckoutSolution {
    // skus is expected to be a string
    checkout(skus) {
        const pricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15]]
        );
        const counts = {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0
        }
        const skuList = skus.split("")
        for (const sku of skuList) {
            if 
            counts[sku.toUpperCase()]++;
        }
        let price = counts["C"] * pricing.get("C") + counts["D"] * pricing.get("D")
        const bulkDiscountA = Math.floor(counts["A"] / 3)
        if (bulkDiscountA > 0) {
            price += bulkDiscountA * 130
        } 
        price += (counts["A"] % 3) * pricing.get("A") 

        const bulkDiscountB = Math.floor(counts["B"] / 2)
        if (bulkDiscountA > 0) {
            price += bulkDiscountB * 45
        }
        price += (counts["B"] % 2) * pricing.get("B") 
        return price
    }
}

module.exports = CheckoutSolution;


