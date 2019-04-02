/**
 * Created by BRITENET on 20.03.2019.
 */

public with sharing class AutoParts_ProductImage {

    @AuraEnabled
    public static List<String> selectProfilePicture(String parentId) {
        System.debug('getProfilePicture parentId >> ' + parentId);
        List<String> contentDocumentId = new List<String>();
        List<String> contentDocumentURL = new List<String>();
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :parentId];
        for (ContentDocumentLink contentLink : contentDocumentLinks) {
            contentDocumentId.add(contentLink.ContentDocumentId);
        }
        List<ContentDistribution> contentDistributions = [SELECT ContentDownloadUrl FROM ContentDistribution WHERE ContentDocumentId IN :contentDocumentId];

        for(ContentDistribution contentDistribution : contentDistributions){
            contentDocumentURL.add(contentDistribution.ContentDownloadUrl );
        }
        System.debug('contentDocumentURL >> ' + contentDocumentURL);
        return contentDocumentURL;
    }

    @AuraEnabled
    public static void saveAttachment(Id parentId, String fileName, String base64Data, String contentType) {
        System.debug('saveAttachment');
        Attachment attachment = new Attachment();
        attachment.parentId = parentId;
        attachment.body = EncodingUtil.base64Decode(base64Data);
        attachment.name = fileName;
        attachment.contentType = contentType;
        Database.SaveResult results = Database.insert(attachment, false);


        List<Product2> products = [SELECT Id, Product_Image__c FROM Product2 WHERE Id =:parentId LIMIT 1];
        System.debug('products ' + products.get(0));

        products.get(0).Product_Image__c = results.Id;
        upsert products;
    }

    @AuraEnabled
    public static String addMainProductImage(String imageUrl, String parentId) {
        Product2 product2 = new Product2();
        product2.Id = parentId;
        product2.Product_Image__c = imageUrl;

        try {
            upsert product2;
        } catch (Exception ex) {
            System.debug('addMainProductImage >> ' + ex.getMessage());
        }
        return imageUrl;
    }

        @AuraEnabled
    public static List<Attachment> getProfilePicture(Id parentId) {
        System.debug('getProfilePicture parentId >> ' + parentId);
        List<Attachment> attachments = new List<Attachment>();
        attachments = [
                SELECT Id, Name, LastModifiedDate, ContentType
                FROM Attachment
                WHERE parentid = :ParentId AND ContentType IN ('image/png', 'image/jpeg', 'image/gif')
                ORDER BY LastModifiedDate DESC
                LIMIT 1
        ];
        System.debug('attachments >> ' + attachments);
        return attachments;
    }

    private static void addAttachmentToProduct(String recordId, String resultId) {
        List<Product2> products = [SELECT Id, Product_Image__c FROM Product2 WHERE Id = :recordId];
        for (Product2 product : products) {
            product.Product_Image__c = resultId;
        }

        try {
            upsert products;
        } catch (Exception ex) {
            System.debug('addAttachmentToProduct >> ' + ex.getMessage());
        }
    }
}