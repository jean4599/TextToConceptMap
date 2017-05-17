import React, {Component} from 'react'
import {TextField} from 'material-ui'

const TEXT={
	'add-node':{
		hintText:"ex: Symbols, Different Map Segments",
		floatingLabelText:"Add a new concpet"
	},
	'edit-node':{
		hintText:"",
		floatingLabelText:"Edit the concpet"
	}
}
export default class InputBox extends Component{
	constructor(props){
		super(props);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onChange = this.onChange.bind(this);
		this.focusTextField = this.focusTextField.bind(this);
	}
	state={
		value:'',
	}
	static defaultProps={
    	mode: "add-node",
  	}
  	componentWillReceiveProps(nextPorps){
  		const {
  			mode,
  			nodeData,
  		}=nextPorps;
  		if(mode==='edit-node')this.setState({ value: nodeData.label})
  		if(mode==='add-node')this.setState({ value:'' })
  		// this.focusTextField();
  	}
	onKeyUp(e){
		if(e.keyCode === 13){//enter
			var node;
			switch(this.props.mode){
				case 'add-node': 
					node = this.props.nodeData;
					node.label = this.state.value;
					node.editable = true;
					this.props.handleNewNode(node);
					this.setState({value:''})
					//console.log('mode: add-node')
					break;
				case 'edit-node':
					node = this.props.nodeData;
					node.label = this.state.value;
					this.props.handleEditNode(node);
					this.setState({value:''})
					//console.log('mode: edit-node')
					break;
				default:
					break;
			}

		} 
	}
	onChange(e){
		this.setState({
			value: e.target.value,
		})
	}
	focusTextField(){
		console.log('focus')
		this.refs.textfield.focus()
	}
	render(){
		return (
			<TextField
			  className='textField'
			  style={this.props.style}
		      hintText={TEXT[this.props.mode].hintText}
		      floatingLabelText={TEXT[this.props.mode].floatingLabelText}
		      onKeyUp={this.onKeyUp}
		      onChange={this.onChange}
		      value={this.state.value}
		      ref='textfield'
		    />
			)
	}
}