import React, {Component} from 'react'
import PropTypes from 'prop-types';
import './ColorBar.css';

export default class ColorBar extends Component{
  static propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    nodes: PropTypes.array.isRequired,
    scrollPosition: PropTypes.number,
  }

  static defaultProps={
    scrollPosition: 0,
  }
  componentWillUpdate(nextProps){
    this.scrollBar.scrollTop = nextProps.scrollPosition;
    //console.log('ScrollBar scroll: ', nextProps.scrollPosition)
  }
  render(){
  	return(
  		<div className={this.props.className} ref={d => this.scrollBar = d}>
  			{this.props.nodes.map((node, index)=>{
  				var selector = node.level;
  				if (selector >= this.props.colors.length)selector = this.props.colors.length-1;
  				return (<div key={index} className='bar' style={{backgroundColor: this.props.colors[selector]}}/>)
  			})}
  		</div>
  		)
  }  
}