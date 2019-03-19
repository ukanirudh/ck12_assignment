import React, { Component } from "react";
import ReactDOM from "react-dom";
import {renderSubsection, renderSubChapters, unMountUiAtId} from './chapterUtility'

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

  openSubsection = (e, id) => {
    const oldid = this.state.activeBookId
    document.getElementById(`${oldid}`) && unMountUiAtId(oldid)
    renderSubsection(id)
    this.setState({activeBookId: id})
  }

  displayMainChapters = (books, activeBookId) => {
    return books.map((book, index) => {
      const {title, id, childrenCount} = book
      return (
        <React.Fragment key={id}>
          <a
            href="#"
            onClick={(e) => this.openSubsection(e, id)}
            className="list-group-item list-group-item-action list-group-item-secondary main-chapters" >
            {`Chapter ${index+1} - ${title} (${childrenCount} Concepts)`}
          </a>
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
