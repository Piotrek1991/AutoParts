/**
 * Created by BRITENET on 27.03.2019.
 */
({
    doInit: function(component) {
        let getActualOrderItemAction = component.get("c.selectActualOrderItem");
        getActualOrderItemAction.setParam("orderId", component.get("v.oneOrder.Id"))
        getActualOrderItemAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                component.set("v.orderItemList", response.getReturnValue());
             } else {
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                 console.log("Select Actual Order Item Failed with state: " + state);
             }
        });
        $A.enqueueAction(getActualOrderItemAction);
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