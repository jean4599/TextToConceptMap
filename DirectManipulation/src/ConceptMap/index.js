import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Network from './Network';
import InputBox from './InputBox';
import RaisedButton from 'material-ui/RaisedButton';
import LinkIcon from 'material-ui/svg-icons/action/trending-flat';

var buttonLabel={}
if(navigator.appVersion.indexOf("Win")!==-1){buttonLabel['add-edge']='Add link (ctrl+shif)'}
else if(navigator.appVersion.indexOf("Mac")!==-1){buttonLabel['add-edge']='Add link (cmd+shif)'}
buttonLabel['delete-edge']='Delete link';
buttonLabel['delete-node']='Delete node';

export default class ConceptMap extends Component {
	constructor(props) {
	    super(props);
		this.addNode = this.addNode.bind(this);
		this.editNode = this.editNode.bind(this);
		this.editEdge = this.editEdge.bind(this);
		this.prepareAddNode = this.prepareAddNode.bind(this);
		this.prepareEditNode = this.prepareEditNode.bind(this);
		this.prepareEditEdge = this.prepareEditEdge.bind(this);
		this.startEditEdgeMode = this.startEditEdgeMode.bind(this);
		this.endEditEdgeMode = this.endEditEdgeMode.bind(this);
		this.deleteNode = this.deleteNode.bind(this);
		this.deleteEdge = this.deleteEdge.bind(this);
	}
	componentDidMount(){
		//shortcut 
		document.addEventListener('keydown', (e)=>{
	        if((navigator.appVersion.indexOf("Win")!==-1 && e.shiftKey && e.ctrlKey) ||
	        	(navigator.appVersion.indexOf("Mac")!==-1 && e.shiftKey && e.metaKey)){
	        	console.log('shift press')
	          	this.startEditEdgeMode();
	        }        
		})
		document.addEventListener('keyup', (e)=>{
			if((navigator.appVersion.indexOf("Win")!==-1 && e.shiftKey && e.ctrlKey) ||
	        	(navigator.appVersion.indexOf("Mac")!==-1 && e.shiftKey && e.metaKey)){
		        	console.log('shift press')
		          	this.endEditEdgeMode();
		        }
		})

	}
	state={
		mode: 'add-node',
		showInputBox:'none',
	}
	prepareAddNode(){
		this.setState({showInputBox:'block', mode:'add-node'})
	}
	prepareEditNode(nodeData){
		if(nodeData){
			this.setState({showInputBox:'block',mode:'edit-node', nodeData:nodeData})
		}
	}
	prepareEditEdge(edgeData){
		if(edgeData){
			this.setState({showInputBox:'block',mode:'edit-edge', edgeData:edgeData})
		}
	}
	addNode(node){
		this.network.addNode(node)
	}
	editNode(node){
		this.network.editNode(node)
	}
	editEdge(edge){
		this.network.editEdge(edge)
	}
	startEditEdgeMode(){
		console.log('start adding edge mode!')
		this.setState({editingEdge:true})
	}
	endEditEdgeMode(){
		console.log('finish adding edge mode')
		this.setState({editingEdge:false})
	}
	deleteNode(){
		console.log('deleteNode')
		this.network.deleteNode(this.state.nodeData)
	}
	deleteEdge(){
		console.log('deleteEdge')
		this.network.deleteEdge(this.state.edgeData)
	}
	render(){
		return (
			<div className={this.props.className}>
				<div style={{width:'100%', height:'95%'}}>
			        <Network className={this.props.className}
						ref={network=>{this.network = network}}
						graphData={this.props.graphData} colors={this.props.color} 
						prepareAddNode={this.prepareAddNode} 
						prepareEditNode={this.prepareEditNode}
						prepareEditEdge={this.prepareEditEdge}
						jumpToVideoTime={this.props.jumpToVideoTime}
	            		getTimeStamp={this.props.getTimeStamp}
	            		videoTime={this.props.videoTime}
	            		editingEdge={this.state.editingEdge}
	            		endEditEdgeMode={this.endEditEdgeMode}/>
	            </div>
            	<div style={{width:'100%', height:'5%'}}>
					<InputBox style={{	width:'200px',
									height: '65px',
									position: 'absolute',
									bottom: '10px',
									left: '10px'}}
						mode={this.state.mode}
						nodeData={this.state.nodeData}
						edgeData={this.state.edgeData}
						handleNewNode={this.addNode}
						handleEditNode={this.editNode}
						handleEditEdge={this.editEdge}
						ref={input=>{this.inputBox = input}}/>
					<RaisedButton style={{
									position: 'absolute',
									bottom: '10px',
									right: '10px',
									display: (this.state.mode==='add-node')?'block':'none'
									}}
						labelStyle={{textTransform:'none'}}
				      label={buttonLabel['add-edge']}
				      labelPosition="after"
				      primary={true}
				      disabled={this.state.editingEdge}
				      onClick={this.startEditEdgeMode}/>
			      <RaisedButton style={{
								position: 'absolute',
								bottom: '10px',
								right: '10px',
								display: (this.state.mode==='edit-node')?'block':'none'
								}}
					labelStyle={{textTransform:'none'}}
			      	label={buttonLabel['delete-node']}
			      	labelPosition="after"
			      	secondary={true}
			      	onClick={this.deleteNode}/>
			      <RaisedButton style={{
								position: 'absolute',
								bottom: '10px',
								right: '10px',
								display: (this.state.mode==='edit-edge')?'block':'none'
								}}
					labelStyle={{textTransform:'none'}}
			      	label={buttonLabel['delete-edge']}
			      	labelPosition="after"
			      	secondary={true}
			      	onClick={this.deleteEdge}/>
			      </div>
		    </div>
			)
	}
}
					