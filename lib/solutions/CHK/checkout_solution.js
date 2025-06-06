'use strict';

class CheckoutSolution {
    
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40], ["F", 10],
            ["G", 20], ["H", 10],
            ["I", 35], ["J", 60],
            ["K", 70], ["L", 90],
            ["M", 15], ["N", 40],
            ["O", 10], ["P", 50],
            ["Q", 30], ["R", 50],
            ["S", 20], ["T", 20],
            ["U", 40], ["V", 50],
            ["W", 20], ["X", 17],
            ["Y", 20], ["Z", 21],
        ]
        );

    #buyNGetMCrossSkus = new Map([
        // schema: boughtSKU, [receivedSKU, buyN, getM]
        ["E", ["B", 2, 1]],
        ["N", ["M", 3, 1]],
        ["R", ["Q", 3, 1]],
    ])
    
    #buyNGetMSameSkus = new Map([
        // schema: boughtSKU, [buyN, getM]
            ["F", [2, 1]],
            ["U", [3, 1]],
    ])

    #groupDiscountSkus = new Set(["S", "T", "X", "Y", "Z"])

    // evaluate the buyNGetM deals first
    #skuCatalogue = new Set([
        ...this.#buyNGetMCrossSkus.keys(), 
        ...this.#buyNGetMSameSkus.keys(),
        ...this.#standardPricing.keys()]
    )

    #bulkDiscountsSkus = new Set("A", "B", "H", "K", "P", "Q", "V") 

    #pricingFactory({
        sku, 
        bulkThreshold = undefined, 
        discountedPrice = undefined, 
        subthresholdPricing = undefined,
        buyNGetMSameDeal = undefined
    }) {
        return (itemCount) => {
            if (itemCount <= 0) return 0; 

            let effectiveCount = itemCount

            if (buyNGetMSameDeal) {
                // handle same sku deductions
                const [buyN, getM] = buyNGetMSameDeal
                const groupSize = buyN + getM
                const totalMs = Math.floor(effectiveCount / groupSize) * getM
                effectiveCount = itemCount - totalMs
            }

            let individualInstances = effectiveCount
            let bulkPricingInstances = 0
            if (bulkThreshold && discountedPrice) {
                bulkPricingInstances = Math.floor(effectiveCount / bulkThreshold) 
                individualInstances = effectiveCount % bulkThreshold 
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
    
    #getStandardPrices() {
        // only populate entries where there's no special deal for a sku
        const standardSkus = this.#skuCatalogue
            .difference(this.#bulkDiscountsSkus)
            .difference(new Set(this.#buyNGetMSameSkus.keys()))
        return standardSkus.values().map(sku => [sku, this.#pricingFactory({sku})])
    }

    #getBuyNGetMSameDeals() {
        return this.#buyNGetMSameSkus.entries().map(([boughtSku, deal]) => {
            return [boughtSku, this.#pricingFactory({
                sku: boughtSku,
                buyNGetMSameDeal: deal
            })]
        })
    }

    // skus is expected to be a string
    checkout(skus) {
        const counts = Object.fromEntries(
            this.#skuCatalogue.values().map(value => ([value, 0]))
        )

        const pricing = new Map([
            ...this.#getStandardPrices(),
            ...this.#getBuyNGetMSameDeals(),
            ["A", this.#pricingFactory({
                sku: "A", bulkThreshold: 5, discountedPrice: 200,
                subthresholdPricing: this.#pricingFactory({sku: "A", bulkThreshold: 3, discountedPrice: 130})
            })],
            ["B", this.#pricingFactory({sku: "B", bulkThreshold: 2, discountedPrice: 45})],
            ["H", this.#pricingFactory({sku: "H", bulkThreshold: 10, discountedPrice: 80,
                subthresholdPricing: this.#pricingFactory({sku: "H", bulkThreshold: 5, discountedPrice: 45}) 
            })],
            ["K", this.#pricingFactory({sku: "K", bulkThreshold: 2, discountedPrice: 120})],
            ["P", this.#pricingFactory({sku: "P", bulkThreshold: 5, discountedPrice: 200})],
            ["Q", this.#pricingFactory({sku: "Q", bulkThreshold: 3, discountedPrice: 80})],
            ["V", this.#pricingFactory({sku: "V", bulkThreshold: 3, discountedPrice: 130, 
                subthresholdPricing: this.#pricingFactory({sku: "V", bulkThreshold: 2, discountedPrice: 90})
            })]
        ])

        const groupDiscountCounts = Object.fromEntries(
            this.#groupDiscountSkus.values().map(value => ([value, 0]))
        )

        // count the number of items of each
        for (const sku of skus.split("")) {
            if (!this.#skuCatalogue.has(sku)) return -1;
            if (this.#groupDiscountSkus.has(sku)) groupDiscountCounts[sku]++
            counts[sku]++;
        }


        let checkoutValue = 0

        // deduct count where cross sku deal applies
        for (const [boughtSku, [receivedSku, buyN]] of this.#buyNGetMCrossSkus.entries()) {
            const itemCount = counts[boughtSku]
            const applicableDeductions = Math.floor(itemCount / buyN)
            counts[receivedSku] = Math.max(0, counts[receivedSku] - applicableDeductions)
        }

        for (const sku of this.#skuCatalogue.values()) {
            const fn = pricing.get(sku)
            const skuCost = fn(counts[sku])
            checkoutValue += skuCost
        }
        return checkoutValue
    }
}

module.exports = CheckoutSolution;

