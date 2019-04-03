/**
 * Created by BRITENET on 25.03.2019.
 */
({
   init: function(component, event, helper) {
       helper.doInit(component);
   },

   clickGoToBasket: function(component, event, helper){
       let navEvt = $A.get('e.force:navigateToURL');
       if(navEvt){
           navEvt.setParams({url: '/basket'});
           navEvt.fire();
       }
   },
   clickShowModalBasket: function(component, event, helper){
       let isClose = component.get("v.displaySmallBasket");
       if(isClose){
           document.getElementById("cart").style = "background-color: white; width: 400px; border: 1px solid; display: block;"
           setTimeout(function(){ showAllDialog(); }, 1);
       function showAllDialog() {
           document.getElementById("cart").style = "background-color: white; width: 400px; height: 350px; border: 1px solid; display: block;";
       }
           component.set("v.displaySmallBasket", false);
       } else {
           document.getElementById("cart").style = "width: 400px; height: 50px;";
           component.set("v.displaySmallBasket", true);
       }
   },

   clickHideModalBasket: function(component, event, helper){
       document.getElementById("cart").style = "background-color: red;";
       component.set("v.displaySmallBasket", true);
   },

   handleAddToBasket: function(component, event, helper) {
       helper.doAddToBasket(component, event);
   },

   handleDeleteBasket: function(component, event, helper) {
       helper.doDeleteBasket(component);
   },

   overShowBasket: function(component, event, helper) {
       component.set("v.showBasket", true);
   },

   leaveShowBasket: function(component, event, helper) {
       component.set("v.showBasket", false);
   },
})