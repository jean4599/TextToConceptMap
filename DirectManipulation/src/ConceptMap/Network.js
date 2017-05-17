import React, { Component } from 'react';
import vis from 'vis';
import PropTypes from 'prop-types';
import './Network.css';
import {arraysEqual} from '../utils'
import {propTypes, defaultProps} from './parameters';

const mergeData = (prev, next) => {
  next.forEach((node) => {
    const prevNode = prev.find(prevNodesEl => prevNodesEl.id === node.id);
    if (prevNode) {
      node.x = prevNode.x; // eslint-disable-line
      node.y = prevNode.y; // eslint-disable-line
      node.px = prevNode.px; // eslint-disable-line
      node.py = prevNode.py; // eslint-disable-line
      node.fixed = prevNode.fixed; // eslint-disable-line
    }
  });
  return next;
};

export default class Network extends Component {
	constructor(props) {
	    super(props);
	    this.addEdge = this.addEdge.bind(this);
	    this.deleteEdge = this.deleteEdge.bind(this);
	    this.deleteNode = this.deleteNode.bind(this);
	    this.addNode = this.addNode.bind(this);
	    this.editNode = this.editNode.bind(this);
	    this.editEdge = this.editEdge.bind(this);
	    this.addEdgeMode = this.addEdgeMode.bind(this)
  	}
	static propTypes = propTypes;
	static defaultProps = defaultProps;

	state={
	  	myEdge:[],
	  	myNode:[],
	  	showInputBox:'none',
	  	clicks:0,
	  }
 	addEdge(edgeData, callback){
 		this.setState({
 			dragging: true,
 		})
 		let edges = this.state.edges;
		if (edgeData.from !== edgeData.to) {
	        edges.add(edgeData);
	       	this.setState({
	       		edges:edges,
	       	})
	    }
      	this.props.endEditEdgeMode();
	}
	addNode(node){
		let nodes = this.state.nodes;
		let time = this.props.getTimeStamp(); //add timestamp of the current video play time
		node.time = time;
        nodes.add(node);
        
       	this.setState({
       		nodes:nodes,
       	})
       	console.log('Finish add node')
	}
	editNode(node){
		let nodes = this.state.nodes;
		nodes.update(node);
       	this.setState({
       		nodes:nodes,
       	})
       	this.props.prepareAddNode();
       	console.log('Finish edit node')
	}
	editEdge(edge){
		let edges = this.state.edges;
		edges.update(edge);
		this.setState({
			edges:edges,
		})
		this.props.prepareAddNode();
		console.log(edge)
		console.log('Finish edit edge')
	}
	deleteEdge(edge){
		let edges = this.state.edges;
		edges.remove(edge.id);
		this.setState({
			edges:edges,
		})
		this.props.prepareAddNode();
		console.log(edge)
		console.log('Finish delete edge')
	}
	deleteNode(node){
		let nodes = this.state.nodes;
		nodes.remove(node.id);
       	this.setState({
       		nodes:nodes,
       	})
       	this.props.prepareAddNode();
       	console.log('Finish edit node')
	}
	addEdgeMode(){
		this.network.addEdgeMode();
	}
  	componentDidMount() {
	   const {
	      graphData: {
	        nodes,
	        edges,
	      },
	      options,
	    } = this.props;
	    
	    this.nodes = this.preprocessNode(nodes)
	    this.nodes = new vis.DataSet(nodes);
	    this.edges = new vis.DataSet(edges);

	    this.setState({
	    	nodes:this.nodes,
	    	edges:this.edges,
	    })

	   	this.data={
				nodes: this.nodes,
				edges: this.edges
			}
	    this.network = new vis.Network(this.container, this.data, options);
	    this.network.enableEditMode();

	    //Handle interaction
	    this.network.on("doubleClick", (params)=>{
	    	console.log('doubleClick')
	    	var nodeId = params['nodes'][0];
	    	const node = this.nodes.get(nodeId)

			if(node.time){				
				this.props.jumpToVideoTime(node.time.played)
			}
	    })
	    this.network.on("dragEnd", (params)=>{
	    	this.network.storePositions();
	    	this.setState({
	    		dragging:false,
	    		nodes :this.nodes,
	    	})
	    });
	    this.network.on("dragStart",(params)=>{
	    	this.setState({dragging:true})
	    })
	    
	    this.network.on("click", (params)=>{
	    	console.log('click')
	    	var clicks = 0;
	    	var timeout;
	    	clicks++;
			if (clicks === 1) {
		      timeout = setTimeout(()=> {
		        if(params['nodes'].length > 0){ // If click the node, then edit mode
		        	const nodeId = params['nodes'][0];
		        	const node = this.nodes.get(nodeId)
		        	console.log('network editNode: ')
		        	console.log(node)
			    	if(node){
			    		this.props.prepareEditNode(node);
			    	}
		        }
		        else if(params['edges'].length > 0){
		        	const edgeId = params['edges'][0];
		        	const edge = this.edges.get(edgeId)
		        	if(edge){
		        		this.props.prepareEditEdge(edge);
		        	}
		        }
		        else{ //If click edge or canvas
		        	this.props.prepareAddNode();
		        }
		    	
		        clicks = 0;
		      }, 250);
		    } else { // is double click
		      clearTimeout(timeout);
		      this.setState({mode:'add-node'})		      
		      clicks = 0;
		    }
	    });
	}
	shouldComponentUpdate(nextProps, nextState){
		if ((nextState.dragging) || (nextProps.editingEdge && this.props.editingEdge)) return false;
		else return true;
	}
	componentWillReceiveProps(nextProps){
		const {
	      graphData: {
	        edges,
	        nodes,
	      },
	      videoTime,
	    } = nextProps;
	    if(!arraysEqual(nodes,this.props.graphData.nodes)){
	    	console.log('new props nodes')
	    	this.nodes.update(nodes.concat(this.state.nodes.get()));
	    	this.setState({
	    		nodes: this.nodes,
	    	})
	    }
	    if(!arraysEqual(edges,this.props.graphData.edges)){
	    	console.log('new props edges')
	    	this.edges.update(edges.concat(this.edges.get()));
	    	this.setState({
		    	edges: this.edges,
		    })
	    }
	}
	componentWillUpdate(nextProps, nextState) {
		const{
			videoTime,
	    } = nextProps;
	    
	    this.nodes = this.preprocessNode(nextState.nodes.get(), videoTime);
	    this.nodes = new vis.DataSet(this.nodes)

	   	this.edges = nextState.edges;
	    //this.edges = new vis.DataSet(this.edges);

		this.data={
				nodes: this.nodes,
				edges: this.edges
			}
    	const focus = this.network.getViewPosition();
    	const scale = this.network.getScale();

	    this.network.setData(this.data)
	    if(nextProps.editingEdge){
	    	
	    	this.network.setOptions({
	    		manipulation:{
	    			enabled: true,
	    			addEdge: this.addEdge,
	    		}
	    	})	
	    	this.network.addEdgeMode();
	    }else{
	    	this.network.setOptions({
	    		manipulation:{
	    			enabled: false,
	    		}
	    	})	  
	    }
	    
	    this.network.moveTo({position:focus, scale: scale, animation: false})

	}
	preprocessNode(nodes, videoTime){
		let result = nodes.map((node, index)=>{
			// //check if it is a link phrase
			// if(node.label[0]==='-'){
			// 	node.label = node.label.slice(1)
			// 	node = Object.assign(node, this.props.linkphraseNodeOptions);
			// }
			// //check the level and modify color
			// else if(node.level!=null){
			// 	const colors = this.props.colors;
			// 	if(node.level >= colors.length)node.color = colors[colors.length-1]
			// 	else node.color = colors[node.level];
			// }
			////check the node time
			if(node.time.duration <= videoTime){
				node.color = '#FF7E45';

			}else node.color = '#939393';
			return node;
		})
		if(result) return result
		else return [];
	}
	render(){
		return (
				<div className={this.props.className} id='network' ref={container=>{this.container = container}} />
			)
	}
}