/**
 * Created by BRITENET on 19.03.2019.
 */
({
    doInit: function(component, event) {
        let productId = sessionStorage.getItem("showProductDetails--recordIds");
        let action = component.get("c.getProfilePicture");
        action.setParam("parentId", productId);
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
            let allURL = response.getReturnValue();
            component.set("v.productURL", allURL);
          }
        });
        $A.enqueueAction(action);
    },
})