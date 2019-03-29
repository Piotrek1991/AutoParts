/**
 * Created by BRITENET on 19.03.2019.
 */

public class AutoParts_CustomSearchController {

    @AuraEnabled
    public static List<String> searchForIds(String query, List<String> category) {
        List<Product2> resultsProducts = new List<Product2>();
        String newSearchText = '' + query + '%';
        if (!category.isEmpty()) {
            resultsProducts = [SELECT Id FROM Product2 WHERE Name LIKE :newSearchText AND Family IN :category AND IsActive = true];
        } else {
            String queryDataBase = 'SELECT Id FROM Product2 WHERE Name LIKE \'' + query + '%\' AND IsActive = true ORDER BY Name';
            resultsProducts = resultsProducts = Database.query(queryDataBase);
        }
        List<String> ids = new List<String>();
        for (Product2 product : resultsProducts) {
            ids.add(product.Id);
        }
        return ids;
    }

    @AuraEnabled
    public static List<PricebookEntry> searchForProductPrice(String productId) {
        String queryDataBase = 'SELECT Id, Name, Product2Id, UnitPrice FROM PricebookEntry WHERE Product2Id = \'' + productId + '\' ORDER BY UnitPrice';
        List<PricebookEntry> resultsProducts = Database.query(queryDataBase);
        System.debug('resultsProducts' + resultsProducts);
        return resultsProducts;
    }

    @AuraEnabled
    public static List<String> selectBySortOrder(List<String> ids, String sortOrder) {
        List<String> result = new List<String>();
        if (sortOrder.equalsIgnoreCase('Name DESC')) {
            System.debug('Name DESC');
            result = selectByNameDescending(ids);
        } else if (sortOrder.equalsIgnoreCase('Name ASC')) {
            System.debug('Name ASC');

            result = selectByNameAscending(ids);
        } else if (sortOrder.equalsIgnoreCase('PriceLow')) {
            System.debug('PriceLow');

            result = selectByPriceLow(ids);
        } else if (sortOrder.equalsIgnoreCase('PriceHigh')) {
            System.debug('PriceHigh');

            result = selectByPriceHigh(ids);
        }
        return result;
    }

    @AuraEnabled
    public static List<String> selectByPriceLow(List<String> ids) {
        List<String> result = new List<String>();
        List<AggregateResult> pricebookEntries = [
                SELECT MIN(UnitPrice) unitPr, Product2Id
                FROM PricebookEntry
                WHERE Product2Id IN :ids
                GROUP BY Product2Id
                ORDER BY MIN(UnitPrice) ASC NULLS LAST
        ];
        for (AggregateResult pricebookEntry : pricebookEntries) {
            String tempId = (String) pricebookEntry.get('Product2Id');
            result.add(tempId);
        }
        return result;
    }

    @AuraEnabled
    public static List<String> selectByPriceHigh(List<String> ids) {
        List<String> result = new List<String>();
        List<AggregateResult> pricebookEntries = [
                SELECT MIN(UnitPrice) unitPr, Product2Id
                FROM PricebookEntry
                WHERE Product2Id IN :ids
                GROUP BY Product2Id
                ORDER BY MIN(UnitPrice) DESC NULLS LAST
        ];
        for (AggregateResult pricebookEntry : pricebookEntries) {
            String tempId = (String) pricebookEntry.get('Product2Id');
            result.add(tempId);
        }
        return result;
    }

    @AuraEnabled
    public static List<String> selectByNameAscending(List<String> ids) {
        List<String> result = new List<String>();
        List<Product2> products = [
                SELECT Name, Id
                FROM Product2
                WHERE Id IN :ids
                ORDER BY Name ASC NULLS LAST
        ];
        for (Product2 prod : products) {
            result.add(prod.Id);
        }
        return result;
    }

    @AuraEnabled
    public static List<String> selectByNameDescending(List<String> ids) {
        List<String> result = new List<String>();
        List<Product2> products = [
                SELECT Name, Id
                FROM Product2
                WHERE Id IN :ids
                ORDER BY Name DESC NULLS LAST
        ];
        for (Product2 prod : products) {
            result.add(prod.Id);
        }
        return result;
    }
    @AuraEnabled
    public static List<String> selectProductWithFilters(List<String> recordsId, List<String> selectedCheckBoxes, String currentSortOrder,
            Integer minPrice, Integer maxPrice, String currentQuery) {

        System.debug('minPrice' + minPrice);
        System.debug('maxPrice' + maxPrice);
        Integer minPriceToQuery = 0;
        Integer maxPriceToQuery = 100000000;
        if (maxPrice != null) {
            maxPriceToQuery = maxPrice;
        } else {
            maxPriceToQuery = 100000000;
        }
        if (minPrice != null) {
            minPriceToQuery = minPrice;
        } else {
            minPriceToQuery = 0;
        }
        List<String> productsIds = searchForIds(currentQuery, selectedCheckBoxes);
        List<PricebookEntry> pricebookEntries = [
                SELECT Id, Product2Id, Product2.Name
                FROM PricebookEntry
                WHERE Product2Id IN :productsIds
                AND UnitPrice >= :minPriceToQuery
                AND UnitPrice <= :maxPriceToQuery
                AND Pricebook2Id = '01s1t000003wsOrAAI'
                ORDER BY Name DESC
        ];

        List<String> result = new List<String>();
        for (PricebookEntry pricebookEntry : pricebookEntries) {
            String tempId = (String) pricebookEntry.get('Product2Id');
            result.add(tempId);
        }
        List<String> productsAfterSort = selectBySortOrder(result, currentSortOrder);

        return productsAfterSort;
    }

    @AuraEnabled
    public static List<String> getProfilePicture(String parentId) {
        return AutoParts_ProductImage.selectProfilePicture(parentId);
    }

    @AuraEnabled
    public static void saveAttachment (Id parentId, String fileName, String base64Data, String contentType) {
        AutoParts_ProductImage.saveAttachment(parentId, fileName, base64Data, contentType);
    }
}