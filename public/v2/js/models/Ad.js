define(["backbone"], function(Backbone) {
  return Backbone.Model.extend({
    initialize: function() {
      console.log('new AD model', this);
    },

    idAttribute: "_id",
    urlRoot: '/advertiser/ads'

  });
});