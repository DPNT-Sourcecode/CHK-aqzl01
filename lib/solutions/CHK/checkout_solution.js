'use strict';

class CheckoutSolution {
    
    #standardPricing = new Map([
            ["A", 50], ["B", 30], 
            ["C", 20], ["D", 15],
            ["E", 40], ["F", 10],
            ["G", 20], ["H", 10],
            ["I", 35], ["J", 60],
            ["K", 80], ["L", 90],
            ["M", 15], ["N", 40],
            ["O", 10], ["P", 50],
            ["Q", 30], ["R", 50],
            ["S", 30], ["T", 20],
            ["U", 40], ["V", 50],
            ["W", 20], ["X", 90],
            ["Y", 10], ["Z", 50],
        ]
        );
    #skuCatalogue = new Set(this.#standardPricing.keys())

    #bulkDiscountsSkus = new Set("A", "B", "E", "F", "H", "K", "N", "P", "Q", "R", "U", "V") 

    #buyNGetMSkus = new Map([
        // schema: boughtSKU, [receivedSKU, buyN, getM]
        ["E", ["B", 2, 1]],
        ["F", ["F", 2, 1]],
        ["N", ["M", 3, 1]],
        ["R", ["Q", 3, 1]],
        ["U", ["U", 3, 1]],
    ])

    #pricingFactory({
        sku, 
        bulkThreshold = undefined, 
        discountedPrice = undefined, 
        subthresholdPricing = undefined,
        buyNGetMHandler = undefined
    }) {
        return (itemCount) => {
            if (itemCount <= 0) return 0; 

            if (buyNGetMSameItem) {
                const [buyN, getM] = buyNGetMSameItem
                const dealSize = buyN + getM
                const eligibleInstances = Math.floor(itemCount / dealSize)
                const leftovers = itemCount % dealSize
                const billableItems = eligibleInstances * buyN + Math.min(leftovers, buyN)
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
    
    #deductions(counts, receivedSku, threshold) {
        // removed the conditional part of the BuyNGetM deal
        return (itemCount) => {
            const applicableDeductions = Math.floor(itemCount / threshold)
            if (applicableDeductions <= 0) return
            counts[receivedSku] = Math.max(0, counts[receivedSku] - applicableDeductions)
        }
    }

    #getStandardPrices() {
        // only populate entries where there's no special deal for a sku
        const standardSkus = this.#skuCatalogue
            .difference(this.#bulkDiscountsSkus)
            .difference(new Set(this.#buyNGetMSkus.keys()))
        return standardSkus.values().map(sku => [sku, this.#pricingFactory({sku})])
    }

    #getBuyNGetMDeals(counts) {
        this.#buyNGetMSkus.entries().map(([boughtSku, deal]) => {
            const [receivedSku, buyN, _] = deal
            return [boughtSku, this.#pricingFactory({
                sku: boughtSku,
                buyNGetMHandler: this.#deductions(counts, receivedSku, buyN)
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
            ...this.#getBuyNGetMDeals(),
            ["A", this.#pricingFactory({
                sku: "A", bulkThreshold: 5, discountedPrice: 200,
                subthresholdPricing: this.#pricingFactory({sku: "A", bulkThreshold: 3, discountedPrice: 130})
            })],
            ["B", this.#pricingFactory({sku: "B", bulkThreshold: 2, discountedPrice: 45})],
            ["F", this.#pricingFactory({sku: "F", buyNGetMSameItem: [2,1]})],
            ["H", this.#pricingFactory({sku: "H", bulkThreshold: 10, discountedPrice: 80,
                subthresholdPricing: this.#pricingFactory({sku: "H", bulkThreshold: 5, discountedPrice: 45}) 
            })],
            ["K", this.#pricingFactory({sku: "K", bulkThreshold: 2, discountedPrice: 150})],
            ["P", this.#pricingFactory({sku: "P", bulkThreshold: 5, discountedPrice: 200})],
            ["Q", this.#pricingFactory({sku: "Q", bulkThreshold: 3, discountedPrice: 80})],
            ["V", this.#pricingFactory({sku: "V", bulkThreshold: 3, discountedPrice: 130, 
                subthresholdPricing: this.#pricingFactory({sku: "V", bulkThreshold: 2, discountedPrice: 90})
            })]
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
