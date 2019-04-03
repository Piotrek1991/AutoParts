/**
 * Created by BRITENET on 25.03.2019.
 */
({
   init: function(component, event, helper) {
       helper.doInit(component);
   },

   handleAddToBasket: function(component, event, helper) {
       helper.doAddToBasket(component);
   },

   clickDeleteProduct: function(component, event, helper) {
       helper.doDeleteProduct(component, event);
   },
   clickRefreshProduct: function(component, event, helper) {
       helper.doRefreshProduct(component);
   },

   refreshBasketDetails: function(component, event, helper) {
       helper.doBasketDetails(component);
   },

   clickCheckout: function(component, event, helper) {
       helper.doCheckout(component);
   },

   clickButtonDown: function(component, event, helper) {
       let oneOrderItem;
       let orderItemId = event.getSource().get("v.value");
       let allOrderItems = component.get("v.orderItemList");
       allOrderItems.forEach(function (onePosition1) {
           if(onePosition1.Id === orderItemId) {
              oneOrderItem = onePosition1;
           }
       })
       if(oneOrderItem.Quantity > 1){
           helper.doButtonQuantity(component, allOrderItems, oneOrderItem, -1);
       } else{
            console.log('do nothing');
       }
   },

   clickButtonInput: function(component, event, helper) {
        let selectedSection = event.currentTarget;
        let orderItemId = selectedSection.dataset.id;
        console.log('orderItemId aa ' + orderItemId);
        component.set("v.currentItemId", orderItemId);
        let allOrderItems = component.get("v.orderItemList");
        allOrderItems.forEach(function (onePosition1) {
            if(onePosition1.Id === orderItemId) {
               oneOrderItem = onePosition1;
               console.log("oneOrderItem quantity" +oneOrderItem.Quantity );
            }
        })
   },
   changeButtonInput: function(component, event, helper) {
       console.log('aaa');
        let orderItemId = component.get("v.currentItemId");
        let allOrderItems = component.get("v.orderItemList");
        allOrderItems.forEach(function (onePosition1) {
            if(onePosition1.Id === orderItemId) {
               oneOrderItem = onePosition1;
               console.log("oneOrderItem quantity" +oneOrderItem.Quantity );
            }
        })
   },

   clickButtonUp: function(component, event, helper) {
       let oneOrderItem;
       let orderItemId = event.getSource().get("v.value");
       let allOrderItems = component.get("v.orderItemList");
       allOrderItems.forEach(function (onePosition1) {
           if(onePosition1.Id === orderItemId) {
              oneOrderItem = onePosition1;
           }
       })
       if(oneOrderItem.Quantity < 100){
           helper.doButtonQuantity(component, allOrderItems, oneOrderItem, 1);
       } else{
           console.log('do nothing');
       }
   },
})