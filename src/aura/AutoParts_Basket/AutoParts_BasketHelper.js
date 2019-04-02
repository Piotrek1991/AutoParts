/**
 * Created by BRITENET on 25.03.2019.
 */
({
    doInit: function(component) {
        let getActualOrderItemAction = component.get("c.selectActualOrderItem");
        getActualOrderItemAction.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.orderItemList", response.getReturnValue());
                this.doRefreshBasketDetail(component);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                console.log("Add Product To Basket Failed with state: " + state);
            }
        });
        $A.enqueueAction(getActualOrderItemAction);

        let getActualOrderAction = component.get("c.selectActualOrder");
        getActualOrderAction.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.order", response.getReturnValue());
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                console.log("GetActualOrderAction Failed with state: " + state);
            }
        });
        $A.enqueueAction(getActualOrderAction);
    },

    doAddToBasket: function(component, event) {
        let productId = event.getParam("productId");
        let numberOfItem = event.getParam("numberOfItem");
        let quantity = component.get("v.totalItemInBasket") + numberOfItem;
        component.set("v.totalItemInBasket", quantity);

        let addProductToBasket = component.get("c.createOrderFromBasket");
        addProductToBasket.setParam("productId", productId);
        addProductToBasket.setParam("numberOfProducts", numberOfItem);
        addProductToBasket.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.order", response.getReturnValue());
                this.doInit(component);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                console.log("Add Product To Basket Failed with state: " + state);
            }
        });
        $A.enqueueAction(addProductToBasket);
    },

    doDeleteBasket: function(component) {
        this.doInit(component);
        this.doRefreshBasketDetail(component);
    },

    doRefreshBasketDetail: function(component) {
        let refreshBasketEvent = $A.get("e.c:AutoParts_RefreshBasketDetails");
        refreshBasketEvent.setParam('totalAmount', component.get("v.order.TotalAmount"))
        refreshBasketEvent.fire();
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