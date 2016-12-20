export const REQUEST_EVENTS = 'REQUEST_EVENTS'
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS'
export const SELECT_GITHUB = 'SELECT_GITHUB'
export const SELECT_STARTDATE = 'SELECT_STARTDATE'
export const SELECT_ENDDATE = 'SELECT_ENDDATE'
export const INVALIDATE_GITHUB = 'INVALIDATE_GITHUB'

export const selectGithub = (github, startDate, endDate) => ({
  type: SELECT_GITHUB,
  github,
  startDate,
  endDate
})

export const selectStartDate = (github, startDate, endDate) => ({
  type: SELECT_STARTDATE,
  github,
  startDate,
  endDate
})

export const selectEndDate = (github, startDate, endDate) => ({
  type: SELECT_ENDDATE,
  github,
  startDate,
  endDate
})

export const invalidateGithub = (github, startDate, endDate) => ({
  type: INVALIDATE_GITHUB,
  github,
  startDate,
  endDate
})

export const requestEvents = (github, startDate, endDate) => ({
  type: REQUEST_EVENTS,
  github,
  startDate,
  endDate
})


export const receiveEvents = (github, startDate, endDate, json) => ({
  type: RECEIVE_EVENTS,
  github,
//  events: json.data.children.map(child => child.data),
  events: function() {
    var _events = json.map(child => child);
    return _events;
  }(),
  startDate,
  endDate,
  receivedAt: Date.now()
})

// const fetchEventsPaged = (github, startDate, endDate, page)=> dispatch => {
//   dispatch(requestEvents(github,startDate,endDate))
//   return fetch(`https://api.github.com/${github}?page=${page}`)
//     .then(response => response.json())
//     .then(json => dispatch(receiveEvents(github, startDate, endDate, json)))
// }
var _prefetched = false;

export const fetchEvents = (github, startDate, endDate)=> dispatch => {
  dispatch(requestEvents(github,startDate,endDate))
  if (!_prefetched) {
    _prefetched = true;
    fetch(`https://api.github.com/${github}?page=1`)
      .then(response => response.json())
      .then(json => dispatch(receiveEvents(github, startDate, endDate, json)))
    fetch(`https://api.github.com/${github}?page=2`)
      .then(response => response.json())
      .then(json => dispatch(receiveEvents(github, startDate, endDate, json)))
  }
  return fetch(`https://api.github.com/${github}`)
    .then(response => response.json())
    .then(json => dispatch(receiveEvents(github, startDate, endDate, json)))
}

const shouldFetchEvents = (state, github, startDate, endDate) => {
  var key = github; // + "_" + startDate + "_" + endDate;
  const events = state.eventsByGithub[key]
  if (!events) {
    return true
  }
  if (events.isFetching) {
    return false
  }
  return events.didInvalidate
}

export const fetchEventsIfNeeded = (github, startDate, endDate) => (dispatch, getState) => {
  if (shouldFetchEvents(getState(), github, startDate, endDate)) {
    return dispatch(fetchEvents(github, startDate, endDate))
  }
}
