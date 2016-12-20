import { combineReducers } from 'redux'
import moment from 'moment';

import {
  SELECT_GITHUB, SELECT_STARTDATE, SELECT_ENDDATE, INVALIDATE_GITHUB,
  REQUEST_EVENTS, RECEIVE_EVENTS
} from '../actions'

const selectedGithub = (state = 'events', action) => {
  switch (action.type) {
    case SELECT_GITHUB:
      return action.github
    default:
      return state
  }
}

const selectedStartDate = (state = moment(), action) => {
  switch (action.type) {
    case SELECT_STARTDATE:
      return action.startDate.toString()
    default:
      return state
  }
}

const selectedEndDate = (state = moment(), action) => {
  switch (action.type) {
    case SELECT_ENDDATE:
      return action.endDate.toString()
    default:
      return state
  }
}


const sortAndFilterEvents = (events,startDate,endDate)  => {
  var startDateUtc = (new Date(startDate)).getTime(),
      endDateUtc = (new Date(endDate)).getTime(),
      _events = events.sort(
        function(a,b) { 
          //console.log(a,b);
          if (!a.created_at_utc)
            a.created_at_utc = new Date(a.created_at).getTime(); 
          if (!b.created_at_utc)
            b.created_at_utc = new Date(b.created_at).getTime(); 
//          return ((new Date(a.created_at)).getTime() - ((new Date(b.created_at)).getTime())); 
          return (a.created_at_utc - b.created_at_utc); 
        }
      );
  _events = _events.filter(
        function(a) {
          return (a.created_at_utc>=startDateUtc && a.created_at_utc<=endDateUtc);
        }
  );
  var _uniqueEvents = _events.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  });

  return _uniqueEvents;
}


const events = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_GITHUB:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_EVENTS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: function() {
          /* Experimental caching code */
          if (!state.cachedItems) {
            state.cachedItems = state.items;
          }
          state.cachedItems = state.cachedItems.concat(action.events);
          var _uniqueCachedItems = state.cachedItems.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
          });
          state.cachedItems = _uniqueCachedItems;

          /* cache aside, let's do a destructive concat + filter */
          var _combined = state.items.concat(action.events);
          _combined = sortAndFilterEvents(_combined, action.startDate, action.endDate)
          console.log("Assigning items to ", _combined);
          return _combined;
        }(),
//        items: action.events,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const eventsByGithub = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_GITHUB:
    case RECEIVE_EVENTS:
    case REQUEST_EVENTS:
      return {
        ...state,
        [action.github]: events(state[action.github], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  eventsByGithub,
  selectedGithub,
  selectedStartDate,
  selectedEndDate
})

export default rootReducer
