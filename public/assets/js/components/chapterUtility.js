import React from "react"
import ReactDOM from "react-dom"
import {subchaptersUtils} from '../utils'

export const statusToUiMapping = {
  'COMPLETE': {customClass: 'success', text: 'Completed'},
  'IN_PROGRESS': {customClass: 'warning', text: 'In Progress'},
  'NOT_STARTED': {customClass: 'danger', text: 'Not Started'}
}

export const renderSubChapters = ({chapterSections}) => {
  const chapters = chapterSections.map((section) => {
    const {title, id, status} = section
    const {customClass, text} = statusToUiMapping[status]
    return (
      <li className={`list-group-item list-group-item-${customClass} sub-chapters`} key={id}>
        {title}
        <span className='status-text'>{text}</span>
      </li>
    )
  })
  return (
    <ul className='list-group list-group-flush sub-chapters-container'> {chapters} </ul>
  )
}

const domRenderSubsectionUI = (chapterSections, currentid) => {
  ReactDOM.render(renderSubChapters({chapterSections}), document.getElementById(`${currentid}`))
}

const domRenderErrorStateUI = (message) => {
  console.log(message)
  ReactDOM.render(<div>{message}</div>, document.getElementById(`${currentid}`))
}

export const renderSubsection = (currentid) => {
  if (subchaptersUtils.getSubchapter(currentid)) {
    domRenderSubsectionUI(subchaptersUtils.getSubchapter(currentid), currentid)
  } else {
    fetch(`http://localhost:3000/api/book/maths/section/${currentid}`)
    .then(response => response.json())
    .then(({response, statusCode}) => {
      if (statusCode === 200 || statusCode === 204) {
        const chapterSections = response[currentid]
        subchaptersUtils.setSuchapter(currentid, chapterSections)
        domRenderSubsectionUI(chapterSections, currentid)
      } else if (statusCode === 404 || statusCode === 400) {
        console.log(response.message)
        domRenderErrorStateUI(response.message)
      }
    })
    .catch(error => {

    })
  }
}
