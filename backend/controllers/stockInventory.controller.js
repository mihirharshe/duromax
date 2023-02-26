const { stockInventoryModel } = require("../models/stockInventory.model")


const saveStockInventory = async (boqId, productionId, bucketDetails) => {
    if(!currentStock)
        currentStock = new stockInventoryModel({
            productionId,
            boqId,
            availableBuckets: []
        });
    
    bucketDetails.forEach(async (bucket) => {
        const idx = currentStock.availableBuckets.findIndex(bkt => bkt.bktId == bucket.bktId);
        if(idx == -1) {
            const availableBkt = currentStock.availableBuckets[idx];
            availableBkt.totalBktNo += bucket.bktNo;
            availableBkt.totalBktQty += bucket.bktQty;
        } else {
            const availableBkt = {
                bktId: bucket.bktId,
                totalBktNo: bucket.bktNo,
                totalBktQty: bucket.bktQty
            };
            currentStock.availableBuckets.push(availableBkt);
        }

        await currentStock.save(); 
    })
}

module.exports = { saveStockInventory }