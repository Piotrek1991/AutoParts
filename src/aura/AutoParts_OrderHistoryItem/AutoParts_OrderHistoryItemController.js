/**
 * Created by BRITENET on 27.03.2019.
 */
({
   init: function(component, event, helper) {
       helper.doInit(component);
       console.log('init');
       helper.doInit(component, event);
   },

})