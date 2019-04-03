/**
 * Created by BRITENET on 19.03.2019.
 */
({
    doInit: function(component) {
        let productId = component.get("v.recordId");
        component.set("v.productId", productId);
        let action = component.get("c.getProfilePicture");
        action.setParam("parentId", productId);
        action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === 'SUCCESS') {
            let allURL = response.getReturnValue();
            component.set("v.productURL", allURL);
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