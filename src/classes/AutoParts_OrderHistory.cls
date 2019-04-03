/**
 * Created by BRITENET on 27.03.2019.
 */

public class AutoParts_OrderHistory {

    @AuraEnabled
    public static List<Order> selectAllCreatedOrder() {
        Account account = AutoParts_Basket.selectAccount('0031t0000091WvLAAU');
        return [SELECT Id, Status, OrderNumber, OrderItem__c, EffectiveDate, TotalAmount, Pricebook2Id FROM Order WHERE AccountId = :account.Id AND Status != 'Basket' ORDER BY EffectiveDate DESC];
    }

    @AuraEnabled
    public static List<OrderItem> selectActualOrderItem(String orderId) {
        System.debug('orderId' + orderId);
        List<OrderItem> ordersItems = [SELECT Id, OrderId, Product2Id, Order.OrderNumber, Order.TotalAmount, Order.Status, Product2.Name, Quantity, UnitPrice, TotalPrice FROM OrderItem WHERE OrderId =:orderId];
        System.debug('ordersItems ' + ordersItems);

        return ordersItems;
    }

}