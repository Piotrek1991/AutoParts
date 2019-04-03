/**
 * Created by BRITENET on 25.03.2019.
 */

public class AutoParts_Basket {

    private static String userId;
    private static String userLoginName;
    private static List<User> users;
    private static Account account;

    public AutoParts_Basket() {
        account = new Account();
        userId = UserInfo.getUserId();
        userLoginName = UserInfo.getUserName();
    }

    @AuraEnabled
    public static Order createOrderFromBasket(String productId, Integer numberOfProducts) {
        userId = UserInfo.getUserId();
        userLoginName = UserInfo.getUserName();
        users = [SELECT Id, ContactId, Email, Username FROM User WHERE Username = :userLoginName LIMIT 1];
        account = selectAccount('0031t0000091WvLAAU');
//        account = selectAccount(users.get(0).ContactId);
        System.debug('account ' + account);
        System.debug('productId ' + productId);
        System.debug('numberOfProducts ' + numberOfProducts);

        Order order = new Order();
        List<Order> orders = getActualOrder();
        if (orders.isEmpty()) {
            order = createOrder(productId, numberOfProducts);
            System.debug('created order' + order);
        } else {
            updateOrder(orders.get(0), productId, numberOfProducts);
        }
        orders = getActualOrder();
        return orders.get(0);
    }

    private static List<Order> getActualOrder() {
        account = selectAccount('0031t0000091WvLAAU');
        return [SELECT Id, Status, OrderNumber, OrderItem__c, TotalAmount, Pricebook2Id FROM Order WHERE AccountId = :account.Id AND Status = 'Basket'];
    }

    @AuraEnabled
    public static Order selectActualOrder() {
        Order order = new Order();
        List<Order> orders = getActualOrder();
        if(!orders.isEmpty()){
           order = orders.get(0);
        }
        return order;
    }
    @AuraEnabled
    public static List<OrderItem> selectActualOrderItem() {
        return AutoParts_BasketDetail.selectActualOrderItem();
    }

    private static Order createOrder(String productId, Integer numberOfProducts) {
        Contract contract = createNewContract();
        Order order = new Order();
        order.AccountId = account.Id;
        order.ContractId = contract.Id;
        order.Pricebook2Id = AutoParts_CustomSearchController.searchForProductPrice(productId).get(0).Pricebook2Id;
        order.EffectiveDate = Date.today();
        order.Status = 'Basket';
        order.OrderItem__c = numberOfProducts;
        try {
            insert order;
        } catch (Exception ex) {
            System.debug('Failed with create order message: ' + ex.getMessage());
            System.debug('Failed with create order cause: ' + ex.getCause());
        }
        addOrderProductItem(order, productId, numberOfProducts);
        return order;
    }

    private static void updateOrder(Order order, String productId, Integer numberOfProducts) {
        order.OrderItem__c += numberOfProducts;
        try {
            upsert order;
            addOrderProductItem(order, productId, numberOfProducts);
        } catch (Exception ex){
            System.debug('Failed with update order message: ' + ex.getMessage());
            System.debug('Failed with update order cause: ' + ex.getCause());
        }
    }

    private static void addOrderProductItem(Order order, String productId, Integer numberOfProducts) {
        List<OrderItem> orderItems = new List<OrderItem>();
        List<OrderItem> orderItemsToInsert = new List<OrderItem>();
        orderItems = [SELECT Id, Product2Id, OrderId, Quantity, PricebookEntryId, UnitPrice FROM OrderItem WHERE OrderId = :order.Id AND Product2Id = :productId];

        if (orderItems.isEmpty()) {
            OrderItem newOrderItem = new OrderItem();
            newOrderItem.Product2Id = productId;
            newOrderItem.OrderId = order.Id;
            newOrderItem.Quantity = numberOfProducts;
            newOrderItem.PricebookEntryId = AutoParts_CustomSearchController.searchForProductPrice(productId).get(0).Id;
            newOrderItem.UnitPrice = AutoParts_CustomSearchController.searchForProductPrice(productId).get(0).Discount_Price__c;
            orderItemsToInsert.add(newOrderItem);
        } else {
            for (OrderItem orderItem : orderItems) {
                if (orderItem.Product2Id.equals(productId)) {
                    orderItem.Quantity += numberOfProducts;
                    orderItemsToInsert.add(orderItem);
                }
            }
        }

        try {
            upsert orderItemsToInsert;
        } catch (Exception ex) {
            System.debug('Failed upsert order item. Message' + ex.getMessage());
            System.debug('Failed upsert order item. Cause' + ex.getCause());
        }
    }

    private static Contract createNewContract() {
        Contract contract = new Contract();
        contract.AccountId = account.Id;
        contract.Status = 'Draft';
        contract.StartDate = Date.today();
        contract.ContractTerm = 12;
        try {
            insert contract;
        } catch (Exception ex) {
            System.debug('Failed with createNewContract' + ex.getMessage() + ex.getMessage());
        }
        contract = updateContract(contract);
        return contract;
    }

    private static Contract updateContract(Contract contract) {
        System.debug('updateContract' + contract);

        contract.Status = 'Activated';
        try {
            upsert contract;
        } catch (Exception ex) {
            System.debug('Failed with createNewContract' + ex.getMessage());
        }
        return contract;
    }

    private static Contact selectContact(String contactId) {
        List<Contact> contacts = [
                SELECT Name, Email, AccountId
                FROM Contact
                WHERE Id = :contactId
                LIMIT 1
        ];
        return contacts.get(0);
    }

    public static Account selectAccount(String contactId) {
        Contact contact = selectContact(contactId);
        String accountId = contact.AccountId;
        List<Account> accounts = [
                SELECT Id, Name
                FROM Account
                WHERE Id = :accountId
        ];
        return accounts.get(0);
    }
}