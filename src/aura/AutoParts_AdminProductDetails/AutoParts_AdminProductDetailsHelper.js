/**
 * Created by BRITENET on 02.04.2019.
 */
({
    doInit: function(component) {
        let getImageAction = component.get("c.selectProfilePicture");
        getImageAction.setParam("parentId", component.get("v.recordId"));
        getImageAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                component.set("v.productFiles", response.getReturnValue());
                this.switchSpinner(component, false);
             } else {
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                 console.log("Init selectProfilePicture Failed with state: " + state);
             }
        });
        $A.enqueueAction(getImageAction);
        this.switchSpinner(component, true);
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

    doFileCheckbox: function(component, event) {
        console.log('fawfwafafa');
        let selectedSection = event.currentTarget;
        let index1 = parseInt(selectedSection.dataset.index);
        let i = 0;
        let allAcc = component.get("v.productFiles");
        allAcc.forEach(function (acc) {
            if(i != index1) {
                document.getElementById(i).classList.remove("changeMe");
            } else {
                component.set("v.selectedFile", acc);
                document.getElementById(i).classList.add("changeMe");
            }
        ++i;
        })
    },

    doAddMainImage: function(component) {
        let imageUrl = component.get("v.selectedFile");
        if(imageUrl){
        let addMainImageAction = component.get("c.addMainProductImage");
        addMainImageAction.setParam("imageUrl", imageUrl);
        addMainImageAction.setParam("parentId", component.get("v.recordId"));
        addMainImageAction.setCallback(this, function(response) {
             let state = response.getState();
             if (state === "SUCCESS") {
                 component.find("service").reloadRecord(true);
                 this.switchSpinner(component, false);
                 this.doShowToast(component, 'Main image was changed', 'Success' , 'Success');
             } else {
                 this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                 console.log("addMainImage Failed with state: " + state);
             }
        });
        $A.enqueueAction(addMainImageAction);
        this.switchSpinner(component, true);
        } else{
            this.doShowToast(component, 'Please select any image', 'warning' , 'warning');
        }
    },

    switchSpinner : function(component, status) {
        const spinnerComponent = component.find('spinner');
        if (spinnerComponent) {
            spinnerComponent.switchSpinner(status);
        } else {
            console.error("'spinner' does not exist");
        }
    },
})