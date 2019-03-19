import React from "react"
import ReactDOM from "react-dom"
import {subchaptersUtils} from '../utils'

export const statusToUiMapping = {
  'COMPLETE': {customClass: 'success', text: 'Completed'},
  'IN_PROGRESS': {customClass: 'warning', text: 'In Progress'},
  'NOT_STARTED': {customClass: 'danger', text: 'Not Started'}
}

const loadingContent = () => {
  return (
    <div className="text-center loading-container">
      <div className="spinner-border loading-icon" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

const displayError = (message) => {
  return (
    <li className="list-group-item list-group-item-danger sub-chapters">{message}</li>
  )
}
const mountLoadingUI = (currentid) => {
  ReactDOM.render(loadingContent(), document.getElementById(`${currentid}`))
}

export const unMountUiAtId = (mountId) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(`${mountId}`))
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

const domRenderErrorStateUI = (message, currentid) => {
  ReactDOM.render(displayError(message), document.getElementById(`${currentid}`))
}

const handleFetchSuccess = (response, currentid) => {
  const chapterSections = response[currentid]
  subchaptersUtils.setSuchapter(currentid, chapterSections)
  domRenderSubsectionUI(chapterSections, currentid)
}

const handleFetchFailure = ({message}, currentid) => {
  unMountUiAtId(currentid)
  domRenderErrorStateUI(message, currentid)
}

export const renderSubsection = (currentid) => {
  if (subchaptersUtils.getSubchapter(currentid)) {
    domRenderSubsectionUI(subchaptersUtils.getSubchapter(currentid), currentid)
  } else {
    mountLoadingUI(currentid)
    fetch(`http://localhost:3000/api/book/maths/section/${currentid}`)
    .then(response => response.json())
    .then(({response, statusCode}) => {
      unMountUiAtId(currentid)
      if (statusCode === 200 || statusCode === 204) {
        handleFetchSuccess(response, currentid)
      } else if (statusCode === 404 || statusCode === 400) {
        handleFetchFailure(response, currentid)
      }
    })
    .catch(error => {})
  }
}
