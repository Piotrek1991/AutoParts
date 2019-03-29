/**
 * Created by BRITENET on 27.03.2019.
 */
({
    doInit: function(component, event) {
        console.log("do Init33");
        let getActualOrderItemAction = component.get("c.selectActualOrderItem");
        getActualOrderItemAction.setParam("orderId", component.get("v.oneOrder.Id"))
        getActualOrderItemAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                component.set("v.orderItemList", response.getReturnValue());
             } else {
                 console.log("Add Product To Basket Failed with state: " + state);
             }
        });
        $A.enqueueAction(getActualOrderItemAction);
        console.log("do Init22");
    },
})