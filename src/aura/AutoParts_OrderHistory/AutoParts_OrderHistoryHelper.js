/**
 * Created by BRITENET on 27.03.2019.
 */
({
    doInit: function(component) {
        let getActualOrderAction = component.get("c.selectAllCreatedOrder");
        getActualOrderAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                component.set("v.orderList", response.getReturnValue());
             } else {
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                 console.log("Add Product To Basket Failed with state: " + state);
             }
        });
        $A.enqueueAction(getActualOrderAction);
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