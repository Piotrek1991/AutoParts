/**
 * Created by BRITENET on 20.03.2019.
 */
({
    init: function(component, event, helper) {
        helper.doInit(component);
    },

    clickButtonDown: function(component, event, helper) {
        let amount = component.get("v.amountProduct");
        if(amount > 1){
            helper.doButtonAmount(component, -1);
        }
    },

    clickButtonUp: function(component, event, helper) {
        let amount = component.get("v.amountProduct");
        if(amount < 100){
            helper.doButtonAmount(component, 1);
        }
    },

    clickAddToBasket: function(component, event, helper) {
        helper.doAddToBasket(component);
    },
})