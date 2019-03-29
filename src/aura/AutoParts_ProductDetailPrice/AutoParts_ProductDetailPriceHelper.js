({
    doInit: function(component, event) {
        let productId = component.get("v.recordId");
        let action = component.get("c.searchForProductPrice");
        action.setParams({productId: productId});
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
            let productEntry = response.getReturnValue();
            let indexMax = productEntry.length - 1;
            component.set("v.productEntryList", productEntry);
            component.set("v.standardPrice", productEntry[indexMax].UnitPrice);
            component.set("v.discountPrice", productEntry[0].UnitPrice);
          }
        });
        $A.enqueueAction(action);
    },

    doButtonAmount: function(component, event, count) {
        let amount = component.get("v.amountProduct");
        let amountInt = parseInt(amount) + count;
        component.set("v.amountProduct", amountInt);
    },

    doAddToBasket: function(component, event, count) {

        let productId = component.get("v.recordId");
        console.log("productId " + productId);
        let productPrice = component.get("v.productEntry.UnitPrice");
        console.log("productPrice " + productPrice);
        let quantity = component.get("v.amountProduct");
        console.log("quantity" + quantity);
        let addToBasketEvent = $A.get("e.c:AutoParts_AddProductToBasket");
        addToBasketEvent.setParam("productId", productId);
        addToBasketEvent.setParam("productPrice", productPrice);
        addToBasketEvent.setParam("numberOfItem", quantity);
        addToBasketEvent.fire();
    },
})