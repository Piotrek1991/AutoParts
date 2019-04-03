({
    init: function(component, event, helper) {
        helper.doInit(component);
    },

    clickSortBox: function(component, event, helper) {
        helper.doSortBox(component);
    },

    handleFiltersEvent: function(component, event, helper) {
        helper.doFiltersEvent(component, event);
    },

})