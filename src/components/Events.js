import React, { PropTypes } from 'react'

const Events = ({events}) => (
  <table>
  <tbody>
    {events.map((event, i) =>
      <tr key={i}>
      <td><span className='mecell name'>{event.repo.name}</span></td>
      <td><span className='mecell type'>{event.type}</span></td>
      <td><span className='mecell action'>{event.payload.action}</span></td>
      <td><span className='mecell url'><a href={event.actor.url} target="_blank">{event.actor.url}</a></span></td>
      <td><span className='mecell date'>{event.created_at}</span></td>

      </tr>
    )}
    </tbody>
  </table>
)

const Events_orginal = ({events}) => (
  <ul>
    {events.map((event, i) =>
      <li key={i}>
      <span className='mecell name'>{event.repo.name}</span>
      <span className='mecell type'>{event.type}</span>
      <span className='mecell action'>{event.payload.action}</span>
      <span className='mecell url'><a href={event.actor.url} target="_blank">{event.actor.url}</a></span>
      <span className='mecell date'>{event.created_at}</span>

      </li>
    )}
  </ul>
)


Events.propTypes = {
  events: PropTypes.array.isRequired
}

export default Events
