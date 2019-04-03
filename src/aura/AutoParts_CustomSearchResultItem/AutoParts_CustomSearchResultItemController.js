({
  init: function(component, event, helper) {
      helper.doInit(component);
  },

  clickShowDetails: function(component, event, helper) {
      helper.doShowDetails(component);
  },

  clickAddToBasket: function(component, event, helper) {
      helper.doAddToBasket(component, event);
  },

  clickCloseBasketModal: function(component, event, helper) {
      component.set("v.isOpenAddBasketModal", false);
  },

  clickGoToBasket: function(component, event, helper){
      let navEvt = $A.get('e.force:navigateToURL');
      if(navEvt){
          navEvt.setParams({url: '/basket'});
          navEvt.fire();
      }
  },
})