/**
 * Created by BRITENET on 20.03.2019.
 */
({
    doInit: function(component) {
        let idsJson = sessionStorage.getItem("customSearch--recordIds");
        let searchText = sessionStorage.getItem("customSearch--searchText");
        if (!$A.util.isUndefinedOrNull(idsJson)) {
          let ids = JSON.parse(idsJson);
          component.set('v.recordIds', ids);
        }
        if (!$A.util.isUndefinedOrNull(searchText)) {
          component.set('v.currentQuery', searchText);
        }
    },

    doSortBox: function(component) {
        let selectedValue = component.find("selectedSortBox").get("v.value");
        component.set("v.currentSort", selectedValue);
        let recordsId = component.get("v.recordIds");
        let action = component.get("c.selectBySortOrder");
        action.setParams({
            ids: recordsId,
            sortOrder: selectedValue
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                 let productsId = response.getReturnValue();
                 component.set("v.recordIds", productsId);
            } else{
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
            }
        });
        $A.enqueueAction(action);
    },

    doFiltersEvent: function(component, event) {
        let currentSortOrder = component.get("v.currentSort");
        let currentQuery = component.get("v.currentQuery");
        let selectedCheckBoxes = event.getParam("selectedCheckBoxes");
        let minPrice = event.getParam("minPrice");
        let maxPrice = event.getParam("maxPrice");
        component.set("v.currentSelectedCheckBoxes", selectedCheckBoxes);
        component.set("v.currentMinPrice", minPrice);
        component.set("v.currentMaxPrice", maxPrice);

        let recordsId = component.get("v.recordIds");
        let action = component.get("c.selectProductWithFilters");
        action.setParam("recordsId", recordsId);
        action.setParam("selectedCheckBoxes", selectedCheckBoxes);
        action.setParam("minPrice", minPrice);
        action.setParam("maxPrice", maxPrice);
        action.setParam("currentSortOrder", currentSortOrder);
        action.setParam("currentQuery", currentQuery);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let productsId = response.getReturnValue();
                component.set("v.recordIds", productsId);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
            }
        });
        $A.enqueueAction(action);
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