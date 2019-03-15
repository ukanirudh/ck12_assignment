import React, { Component } from "react";

class App extends Component {

  componentWillMount () {
    this.setState({books: []})
  }

  componentDidMount () {
    fetch('http://localhost:3000/api/book/maths')
    .then(response => response.json())
    .then(data => this.setState({books: data}))
    .catch(error => console.log(error))
  }

  render () {
    const {books} = this.state
    return (
      books.map((book) => {
        const {title, id} = book
        return (<h2>{title}</h2>)
      })
    );
  }
}

export default App;
