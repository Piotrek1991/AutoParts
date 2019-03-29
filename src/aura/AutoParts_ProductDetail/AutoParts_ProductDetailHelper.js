/**
 * Created by BRITENET on 19.03.2019.
 */
({
    doInit: function(component, event) {
        let productId = sessionStorage.getItem("showProductDetails--recordIds");

        component.set("v.productId", productId);
//        component.set("v.queryA", 'https://autoparts-dev-ed--c.documentforce.com/sfc/dist/version/download/?oid=00D1t000000smhl&ids=0681t000003TRmm&d=%2Fa%2F1t000000TQh4%2FuijrBP7p3V95RjTKOSLMLiMUjuYGpvWlCcJO_gsDltA&asPdf=false');
        component.set("v.queryA", 'https://autoparts-dev-ed.my.salesforce.com/sfc/dist/version/download/?oid=00D1t000000smhl&ids=0681t000003TRmm&d=%2Fa%2F1t000000TQh4%2FuijrBP7p3V95RjTKOSLMLiMUjuYGpvWlCcJO_gsDltA&asPdf=false');

        let action = component.get("c.getProfilePicture");
        action.setParam("parentId", productId);
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
            let allURL = response.getReturnValue();
            console.log('allURL' + allURL);
            component.set("v.productURL", allURL);
          }
        });
        $A.enqueueAction(action);


    },

    doRecordUpdated: function(component, event) {
        var eventParams = event.getParams();
        if(eventParams.changeType === "LOADED") {
           // record is loaded (render other component which needs record data value)
            console.log("Record is loaded successfully.");
            console.log("You loaded a record in " +
                        component.get("v.simpleRecord.Industry"));
        } else if(eventParams.changeType === "CHANGED") {
            // record is changed
        } else if(eventParams.changeType === "REMOVED") {
            // record is deleted
        } else if(eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving, or deleting the record
        }
    }
})