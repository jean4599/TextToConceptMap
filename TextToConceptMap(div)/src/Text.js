import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
};

export default class Text extends Component {
  static propTypes = {
    setText: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount(){
    this.area.contentEditable = true;
  }
  onChange() {
    this.props.setText(ReactDOM.findDOMNode(this.area).innerHTML);
  }

  onKeyDown(e) {
    if (e.keyCode === KEY_CODES.TAB) {
      console.log('keydown TAB')
      e.preventDefault();  // this will prevent us from tabbing out of the editor

      // now insert four non-breaking spaces for the tab key
      var area = this.area;
      var text = area.innerHTML;
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      range.collapse(true);

      var tabNode = document.createTextNode("\t");
      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode); 
      sel.removeAllRanges();
      sel.addRange(range);

      this.onChange();
    }
    if(e.keyCode === KEY_CODES.ENTER){
      console.log('keydown ENTER')
      e.preventDefault();

      var area = this.area;
      var text = area.innerHTML;
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      range.collapse(true);

      var tabNode = document.createTextNode("\n\t");
      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode); 
      sel.removeAllRanges();
      sel.addRange(range);

      this.onChange();
    }
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={(input) => { this.area = input; }}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      >
      </div>);
  }
}
