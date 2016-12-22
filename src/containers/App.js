import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectGithub, selectStartDate, selectEndDate, fetchEventsIfNeeded, fetchEvents, invalidateGithub } from '../actions'
import Picker from '../components/Picker'
import Events from '../components/Events'
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';


class App extends Component {
  static propTypes = {
    selectedGithub: PropTypes.string.isRequired,
    selectedStartDate: PropTypes.string,
    selectedEndDate: PropTypes.string,
    events: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, selectedGithub, selectedStartDate, selectedEndDate } = this.props
    dispatch(fetchEventsIfNeeded(selectedGithub,
      selectedStartDate.toString(),
      selectedEndDate.toString()))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedGithub !== this.props.selectedGithub) {
      const { dispatch, selectedGithub, selectedStartDate, selectedEndDate } = nextProps
      dispatch(fetchEventsIfNeeded(selectedGithub,
        selectedStartDate.toString(),
        selectedEndDate.toString()))
    }
  }

  handleChange = nextGithub => {
    const { selectedStartDate, selectedEndDate } = this.props
    this.props.dispatch(selectGithub(nextGithub,
      selectedStartDate.toString(),
      selectedEndDate.toString()))
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { dispatch, selectedGithub, selectedStartDate, selectedEndDate } = this.props
    dispatch(invalidateGithub(selectedGithub,
      selectedStartDate.toString(),
      selectedEndDate.toString()))
    dispatch(fetchEventsIfNeeded(selectedGithub,
      selectedStartDate.toString(),
      selectedEndDate.toString()))
  }

  handleChangeStartDatePicker(nextStartDate) {
    const { selectedGithub, selectedEndDate } = this.props
    //this.props.startDate = nextStartDate;
    this.props.dispatch(selectStartDate(selectedGithub,
      nextStartDate.toString(),
      selectedEndDate.toString()))
    this.props.dispatch(fetchEvents(selectedGithub,
      nextStartDate.toString(),
      selectedEndDate.toString()))
  }

  handleChangeEndDatePicker(nextEndDate) {
    const { selectedGithub, selectedStartDate } = this.props
    //this.props.endDate = nextEndDate;
    this.props.dispatch(selectEndDate(selectedGithub,
      selectedStartDate.toString(),
      nextEndDate.toString()))
    this.props.dispatch(fetchEvents(selectedGithub,
      selectedStartDate.toString(),
      nextEndDate.toString()))     
  }

  render() {
    // if (this.props.startDate == null) {
    //   this.props.startDate = moment();
    // }
    // if (this.props.endDate == null) {
    //   this.props.endDate = moment();
    // }

    const { selectedGithub, selectedStartDate, selectedEndDate, events, isFetching, lastUpdated } = this.props
    const isEmpty = events.length === 0

    return (
      <div>
        <Picker value={selectedGithub}
                onChange={this.handleChange}
                options={[ 'events', 'commits' ]} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>

        <div className="datePicker section">
        <span className="datePicker title">Start Date</span>
          <DatePicker 
                  selected={moment(selectedStartDate)}
                  onChange={this.handleChangeStartDatePicker.bind(this)}
          />

        <span className="datePicker title">End Date</span>
        <DatePicker 
                selected={moment(selectedEndDate)}
                onChange={this.handleChangeEndDatePicker.bind(this)}
        />
        </div>

        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Events events={events} />
            </div>
        }

    </div>

    )
  }
}

const mapStateToProps = state => {
  const { selectedGithub, selectedStartDate, selectedEndDate, eventsByGithub } = state;
  var key = selectedGithub; // + "_" + selectedStartDate + "_" + selectedStartDate;
  const {
    isFetching,
    lastUpdated,
    items: events,
  } = eventsByGithub[key] || {
    isFetching: true,
    items: [],
  }

  return {
    selectedGithub,
    selectedStartDate: selectedStartDate.toString(),
    selectedEndDate: selectedEndDate.toString(),
    events,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
