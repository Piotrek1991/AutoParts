public class AutoParts_PriceBookProducts {

    @AuraEnabled
    public static List<PricebookEntry> getAllPricebookEntry(String priceBookId) {
        return AutoParts_PriceBookManage.selectEntryProducts(new List<String>(), priceBookId);
    }

    @AuraEnabled
    public static void deleteOrderProduct(String orderItemId) {
        PricebookEntry pricebookEntry = new PricebookEntry();
        pricebookEntry.Id = orderItemId;
        delete pricebookEntry;
    }

    @AuraEnabled
    public static void editOrderProductItem(PricebookEntry currentOrderItem) {
        upsert currentOrderItem;
    }

    @AuraEnabled
    public static List<PricebookEntry> getNotRelatedProduct(String priceBookId) {
        List<Pricebook2> standardPricebook = [SELECT Id, IsStandard FROM Pricebook2 WHERE IsStandard = true];
        String standardPriceBookId = standardPricebook.get(0).Id;
        List<PricebookEntry> currentProductEntryInPriceBook = getAllPricebookEntry(priceBookId);
        List<String> productsEntryIds = new List<String>();
        for (PricebookEntry pricebookEntry : currentProductEntryInPriceBook) {
            productsEntryIds.add(pricebookEntry.Product2Id);
        }
        List<PricebookEntry> availableProductEntry = [
                SELECT Product2Id, Pricebook2Id, UnitPrice, Product2.Name,
                        Product2.Family
                FROM PricebookEntry
                WHERE Product2Id NOT IN :productsEntryIds AND Pricebook2Id = :standardPriceBookId AND Product2.IsActive = true
        ];
        return availableProductEntry;
    }

    @AuraEnabled
    public static void addNewProductToPriceBook(List<String> selectedProductIds, String priceBookId) {
        List<PricebookEntry> pricebookEntriesToInsert = new List<PricebookEntry>();
        List<Pricebook2> standardPricebook = [SELECT Id, IsStandard FROM Pricebook2 WHERE IsStandard = true];
        String standardPriceBookId = standardPricebook.get(0).Id;
        List<PricebookEntry> pricebookEntries = AutoParts_PriceBookManage.selectEntryProducts(selectedProductIds, standardPriceBookId);
        System.debug('addNewProductToPriceBook >> ' + pricebookEntries);
        for (PricebookEntry oneProductEntry : pricebookEntries) {
            oneProductEntry.Id = null;
            oneProductEntry.Pricebook2Id = priceBookId;
            pricebookEntriesToInsert.add(oneProductEntry);
        }

        try {
            upsert pricebookEntriesToInsert;
        } catch (Exception ex) {
            System.debug('Failed with add new Product Entry message: ' + ex.getMessage());
            System.debug('Failed with add new Product Entry message: ' + ex.getCause());
        }
    }
}