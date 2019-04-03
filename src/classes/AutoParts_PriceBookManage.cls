/**
 * Created by BRITENET on 27.03.2019.
 */

public with sharing class AutoParts_PriceBookManage {



    @AuraEnabled
    public static List<String> getAllCategories() {
        return AutoParts_ResultsFilters.getAllCategories();
    }

    @AuraEnabled
    public static List<String> doAddNewDiscountCallout(String typeDiscount, Decimal discount, String category, String priceBookId) {
        List<String> categories = new List<String>();
        categories.add(category);

        List<Pricebook2> standardPricebook = [SELECT Id, IsStandard FROM Pricebook2 WHERE IsStandard = true];
        String standardPriceBookId = standardPricebook.get(0).Id;

        List<PricebookEntry> pricebookEntriesToInsert = new List<PricebookEntry>();

        List<String> allProducts = selectAllProduct(categories);

        List<PricebookEntry> resultsEntryProducts = selectEntryProducts(allProducts, standardPriceBookId);

        if (typeDiscount.equalsIgnoreCase('Cash discount')) {
            for (PricebookEntry oneProduct : resultsEntryProducts) {
                oneProduct.Id = null;
                oneProduct.Pricebook2Id = priceBookId;
                if (oneProduct.UnitPrice <= discount) {
                    oneProduct.Discount_by_cash__c = oneProduct.UnitPrice - 1;
                } else {
                    oneProduct.Discount_by_cash__c = discount;
                }
                pricebookEntriesToInsert.add(oneProduct);
            }
        } else if (typeDiscount.equalsIgnoreCase('Percentage discount')) {
            for (PricebookEntry oneProduct : resultsEntryProducts) {
                oneProduct.Id = null;
                oneProduct.Discount_by_percent__c = discount;
                oneProduct.Pricebook2Id = priceBookId;
                pricebookEntriesToInsert.add(oneProduct);
            }
        }

        try {
            upsert pricebookEntriesToInsert;
        } catch (Exception ex) {
            System.debug('Failed with insert Product Entry message: ' + ex.getMessage());
            System.debug('Failed with insert Product Entry message: ' + ex.getCause());
        }
        return null;
    }

    private static List<String> selectAllProduct(List<String> productCategory) {
        return AutoParts_CustomSearchController.searchForIds('', productCategory);
    }

    public static List<PricebookEntry> selectEntryProducts(List<String> allProducts, String priceBookId) {
        List<PricebookEntry> resultsEntryProducts = new List<PricebookEntry>();
        if (allProducts.isEmpty()) {
            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice, Product2.Name,
                            Product2.Family, Discount_by_cash__c, Discount_by_percent__c,
                            Discount_Price__c
                    FROM PricebookEntry
                    WHERE Pricebook2Id = :priceBookId AND Product2.IsActive = true
                    ORDER BY Product2.Name ASC
            ];
        } else {
            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice
                    FROM PricebookEntry
                    WHERE Product2Id IN :allProducts AND Pricebook2Id = :priceBookId AND Product2.IsActive = true
            ];
        }
        System.debug('resultsEntryProducts' + resultsEntryProducts);
        return resultsEntryProducts;
    }




    @AuraEnabled
    public static void selectActualProducts(String priceBookId) {


    }
}