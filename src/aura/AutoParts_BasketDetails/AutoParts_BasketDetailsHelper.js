/**
 * Created by BRITENET on 25.03.2019.
 */
({
    doInit: function(component) {
        let getActualOrderItemAction = component.get("c.selectActualOrderItem");
        getActualOrderItemAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                let tempList1 = response.getReturnValue();
                let tempList2 =JSON.parse(JSON.stringify(tempList1));
                component.set("v.orderItemList", tempList1);
                component.set("v.newOrder", tempList2);
             } else {
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                 console.log("getActualOrderItemAction Failed with state: " + state);
             }
        });
        $A.enqueueAction(getActualOrderItemAction);
    },

    doAddToBasket: function(component) {
        this.doInit(component);
    },

    doDeleteProduct: function(component, event) {
        let orderItemId = event.getSource().get("v.value");
        let allOrderItems = component.get("v.orderItemList");
        let quantityOrder;
        let orderId;
        allOrderItems.forEach(function (acc) {
            if(acc.Id === orderItemId) {
                console.log('accId' +acc.Id);
                quantityOrder = acc.Quantity;
                orderId = acc.OrderId;
            }
        })
        let deleteOrderItemAction = component.get("c.deleteOrderItem");
        deleteOrderItemAction.setParam("orderItemId",orderItemId);
        deleteOrderItemAction.setParam("orderId",orderId);
        deleteOrderItemAction.setParam("quantityOrder",quantityOrder);
        deleteOrderItemAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                 let tempList1 = response.getReturnValue();
                 let tempList2 =JSON.parse(JSON.stringify(tempList1));
                 component.set("v.orderItemList", tempList1);
                 component.set("v.newOrder", tempList2);
                 this.doRefreshBasket(component);
             } else {
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                 console.log("deleteOrderItemAction Failed with state: " + state);
             }
        });
        $A.enqueueAction(deleteOrderItemAction);
    },

    doBasketDetails: function(component) {
        this.doInit(component);
    },

    doRefreshBasket: function(component) {
        let deleteBasketEvent = $A.get("e.c:AutoParts_DeleteBasket");
        deleteBasketEvent.fire();
    },

    doRefreshProduct: function(component) {
        let originalOrderItemList = component.get("v.newOrder");
        let originalOrderItem;
        let changedOrderItemList = component.get("v.orderItemList");
        let changedOrderItem;
        let currentProductId = component.get("v.currentItemId");
        console.log("currentProductId " + currentProductId);

        originalOrderItemList.forEach(function (acc) {
            if(acc.Id === currentProductId) {
                originalOrderItem = acc;
                console.log('originalOrderItemList ' + originalOrderItem.Quantity);
            }
        })
        changedOrderItemList.forEach(function (acc) {
            if(acc.Id === currentProductId) {
                changedOrderItem = acc;
                console.log('changedOrderItem ' + changedOrderItem.Quantity);

            }
        })
        let difference = changedOrderItem.Quantity - originalOrderItem.Quantity;
        if(difference != 0){
             let addToBasketEvent = $A.get("e.c:AutoParts_AddProductToBasket");
             addToBasketEvent.setParam("productId", originalOrderItem.Product2Id);
             addToBasketEvent.setParam("productPrice", 0);
             addToBasketEvent.setParam("numberOfItem", difference);
             addToBasketEvent.fire();
        }
    },

    doCheckout: function(component) {
        let checkOutOrderAction = component.get("c.checkOutOrder");
        checkOutOrderAction.setParam('orderId', component.get("v.orderItemList")[0].OrderId);
        checkOutOrderAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                 this.doRefreshBasket(component);
                 component.set("v.orderItemList", []);
                 component.set("v.newOrder", []);
             } else {
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                 console.log("getActualOrderItemAction Failed with state: " + state);
             }
        });
        $A.enqueueAction(checkOutOrderAction);
    },

    doButtonQuantity: function(component, allOrderItems, oneOrderItem, changedQuantity) {
        allOrderItems.forEach(function (acc) {
            if(acc.Id === oneOrderItem.Id) {
                let tempQuantity = acc.Quantity + changedQuantity;
                acc.Quantity = tempQuantity;
            }
        })
        component.set("v.orderItemList", allOrderItems);
    },

    doShowToast: function(component, message, title, typeToast) {
        const toastComponent = component.find('toast');
        if (toastComponent) {
            toastComponent.showToast(message, title, typeToast);
        }
        else {
            console.error("'Toast Component' does not exist");
        }
    },
})