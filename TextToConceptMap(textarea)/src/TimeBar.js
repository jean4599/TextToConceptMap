import React, {Component} from 'react'
import Time from './Time'
import './TimeBar.css'

export default class TimeBar extends Component{
	render(){
		return (
			<div className={this.props.className}>
				{this.props.timeQueue.map((time,index)=>{
					return <Time className='time' key={index} seconds={time.duration}/>
				})}
			</div>
			)
	}
}
