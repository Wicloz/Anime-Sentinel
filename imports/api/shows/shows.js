import SimpleSchema from 'simpl-schema';

// Schema
Schemas.Show = new SimpleSchema({
  name: {
    type: String
  },
  altNames: {
    type: Array,
    minCount: 1
  },
  'altNames.$': {
    type: String
  },
  description: {
    type: String,
    defaultValue: '',
    optional: true
  }
}, { tracker: Tracker });

// Collection
export const Shows = new Mongo.Collection('shows');
Shows.attachSchema(Schemas.Show);

if (Meteor.isServer) {
  Shows._ensureIndex({
    altNames: 'text',
    description: 'text'
  });
}

// Helpers
Shows.helpers({

});

// Queries
Shows.querySearch = function(query) {
  Schemas.animeSearch.validate({query});

  if (Meteor.isServer && query) {
    return Shows.find({
        $text: {
          $search: query
        }
      }, {
        fields: {
          score: {
            $meta: 'textScore'
          }
        }
      }
    );
  }

  else {
    return Shows.find({}, {
      sort: {
        textScore: -1,
        name: 1
      }
    });
  }
};