/**
 * Created by BRITENET on 19.03.2019.
 */
({
    doInit: function(component) {
        let recordId = component.get("v.simpleRecord").Id;
        let action = component.get("c.searchForProductPrice");
        action.setParams({productId: recordId});
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let productEntry = response.getReturnValue();
                let indexMax = productEntry.length - 1;
                component.set("v.productEntryList", productEntry);
                component.set("v.oneProductEntry", productEntry[0]);
                component.set("v.standardPrice", productEntry[indexMax].UnitPrice);
                component.set("v.discountPrice", productEntry[0].Discount_Price__c);
            } else{
                this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
            }
        });
        $A.enqueueAction(action);
    },

    doShowDetails: function(component, event) {
        let recordId = component.get("v.simpleRecord").Id;
        sessionStorage.setItem('showProductDetails--recordIds', recordId);
    },

    doAddToBasket: function(component, event) {
        let productId = event.getSource().get("v.value");
        let addToBasketEvent = $A.get("e.c:AutoParts_AddProductToBasket");
        addToBasketEvent.setParam("productId", productId);
        addToBasketEvent.setParam("productPrice", 0);
        addToBasketEvent.setParam("numberOfItem", 1);
        addToBasketEvent.fire();
        component.set("v.isOpenAddBasketModal", true);
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