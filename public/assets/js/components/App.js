import React, { Component } from "react";
import BookDetails from './BookDetails'
import ReactDOM from "react-dom";
import {subchaptersUtils} from '../utils'

const showChildren = ({chapterSections}) => {
  const chapters = chapterSections.map((section) => {
    const {title, id} = section
    return (
      <li className='list-group-item' key={id}>{title}</li>
    )
  })
  return (
    <ul className="list-group list-group-flush"> {chapters} </ul>
  )
}


const renderSubsectionUI = (chapterSections, currentid) => {
  ReactDOM.render(showChildren({chapterSections}), document.getElementById(`${currentid}`))
}

class App extends Component {
  componentWillMount () {
    this.setState({books: [], isSubsectionOpen: false, activeBookId: ''})
  }

  componentDidMount () {
    fetch('http://localhost:3000/api/book/maths')
    .then(response => response.json())
    .then(({response}) => this.setState({books: response}))
    .catch(error => console.log(error))
  }


  renderSubsection = (currentid) => {
    if (subchaptersUtils.getSubchapter(currentid)) {
      renderSubsectionUI(subchaptersUtils.getSubchapter(currentid), currentid)
    } else {
      fetch(`http://localhost:3000/api/book/maths/section/${currentid}`)
      .then(response => response.json())
      .then(({response}) => {
        const chapterSections = response[currentid]
        subchaptersUtils.setSuchapter(currentid, chapterSections)
        renderSubsectionUI(chapterSections, currentid)
      })
      .catch(error => console.log(error))
    }
  }

  openSubsection = (e, id) => {
    const oldid = this.state.activeBookId
    document.getElementById(`${oldid}`) && ReactDOM.unmountComponentAtNode(document.getElementById(`${oldid}`))
    this.renderSubsection(id)
    this.setState({activeBookId: id})
  }

  displayMainChapters = (books, activeBookId) => {
    return books.map((book) => {
      const {title, id, childrenCount} = book
      return (
        <React.Fragment key={id}>
          <a href="#" onClick={(e) => this.openSubsection(e, id)} className="list-group-item list-group-item-action list-group-item-primary">{title}</a>
          <div id={id}></div>
        </React.Fragment>
      )
    })
  }

  render () {
    const {books, activeBookId} = this.state
    return (
      <div className='container'>
        <h2>Maths Chapters</h2>
        <div className="list-group">{this.displayMainChapters(books, activeBookId)}</div>
      </div>
    )
  }
}

export default App;
