import React, {Component} from 'react'
import {TextField} from 'material-ui'

const TEXT={
	'add-node':{
		hintText:"ex: water",
		floatingLabelText:"Add a new concpet"
	},
	'edit-node':{
		hintText:"",
		floatingLabelText:"Edit the concpet"
	},
	'edit-edge':{
		hintText:"",
		floatingLabelText:"Edit the link"
	}
}
export default class InputBox extends Component{
	constructor(props){
		super(props);
		this.onKeyUp = this.onKeyUp.bind(this);
		//this.onChange = this.onChange.bind(this);
		this.focusTextField = this.focusTextField.bind(this);
		this.getNewPosition  = this.getNewPosition.bind(this);
	}
	state={
		value:'',
		x: 10,
		y: 10,
	}
	static defaultProps={
    	mode: "add-node",
  	}
  	componentWillUpdate(nextPorps){
  		const {
  			mode,
  			nodeData,
  			edgeData,
  		}=nextPorps;

  		switch(mode){
  			case 'edit-node':
  				console.log('edit:', nodeData.label)
  				this.textfield.getInputNode().value = nodeData.label;
  				break;
  			case 'add-node':
  				this.textfield.getInputNode().value = '';
  				break;
  			case 'edit-edge':
  				let label = edgeData.label;
  				if(!label) label='';
  				this.textfield.getInputNode().value = label;
  				break;
  		}
  		this.focusTextField();
  	}
  	shouldComponentUpdate(nextProps, nextState){
  		if(nextProps.mode !== this.props.mode || nextProps.nodeData !== this.props.nodeData || nextProps.edgeData !== this.props.edgeData)return true
  			else return false
  	}
	onKeyUp(e){
		if(e.keyCode === 13){//enter
			var node;
			var edge;
			switch(this.props.mode){
				case 'add-node': 
					var p = this.getNewPosition();
					node = {x: p.x, y: p.y}
					node.label = this.textfield.getValue();
					node.editable = true;
					this.props.handleNewNode(node);
					this.textfield.getInputNode().value = '';
					break;
				case 'edit-node':
					node = this.props.nodeData;
					node.label = this.textfield.getValue();
					this.props.handleEditNode(node);
					this.textfield.getInputNode().value = '';
					break;
				case 'edit-edge':
					edge = this.props.edgeData;
					edge.label = this.textfield.getValue();
					this.props.handleEditEdge(edge);
					this.textfield.getInputNode().value = '';
					break;
				default:
					break;
			}

		} 
	}
	// onChange(e){
	// 	this.setState({
	// 		value: e.target.value,
	// 	})
	// }
	focusTextField(){
		//console.log('focus')
		this.textfield.focus()
	}
	getNewPosition(){
		var x = this.state.x;
		var y = this.state.y;
		if(x<300){
			x += 50;
		}else{
			x = 10;
			y += 50;
		}
		this.setState({
			x:x,
			y:y
		})
		return {x:x, y:y}
	}
	render(){
		return (
			<TextField
			  className='textField'
			  style={this.props.style}
		      hintText={TEXT[this.props.mode].hintText}
		      floatingLabelText={TEXT[this.props.mode].floatingLabelText}
		      onKeyUp={this.onKeyUp}
		      floatingLabelFixed={true}
		      onChange={this.onChange}
		      ref={t=>{this.textfield = t}}
		    />
			)
	}
}