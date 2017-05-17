import React, { Component } from 'react';
import PropTypes from 'prop-types';
import vis from 'vis';
import InputBox from './InputBox';
import './Network.css';

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
	    this.addNode = this.addNode.bind(this);
	    this.prepareAddNode = this.prepareAddNode.bind(this);
	    this.editNode = this.editNode.bind(this);
	    this.prepareEditNode = this.prepareEditNode.bind(this);
	    this.getConceptMapData = this.getConceptMapData.bind(this)
  	}
	static propTypes = {
	    graphData: PropTypes.shape({
	      nodes: PropTypes.array,
	      edges: PropTypes.array,
	    }).isRequired,
	    options: PropTypes.shape({
	    	layout:PropTypes.shape({
	    		hierarchical:PropTypes.shape({
	    			enabled: PropTypes.bool,
	    			direction: PropTypes.string,
	    			levelSeparation: PropTypes.number,
	    			sortMethod: PropTypes.string,
	    			treeSpacing: PropTypes.number,
	    			parentCentralization: PropTypes.bool,
	    		}),
	    	})
	    }),
	    colors: PropTypes.arrayOf(PropTypes.string),
	    jumpToVideoTime: PropTypes.func,
	    className: PropTypes.string,
  	}
  	static defaultProps = {
	    options: {
	    	layout:{
	    		hierarchical:{
	      			enabled:true,
	      			direction: 'UD',
	      			levelSeparation: 50,
	      			sortMethod:'directed',
	      			treeSpacing:100,
	      			parentCentralization: true,
	      		},
	    	},
	    	physics: {
			    hierarchicalRepulsion: {
			      nodeDistance: 150,
			    }
			  },
	    	edges:{
	    		color:'#333333',
	    		chosen: false,
	    		arrows:{
	    			to: {enabled: true, scaleFactor:0.3, type:'arrow'},
	    		}
	    	},
	    	nodes:{
	    		shape:'box',
	    		size:50,
	    		chosen: false,
	    		widthConstraint: { maximum: 150},
	    	},
	    	locale: 'en',
		    locales:{
			  en: {
			    edit: 'Edit',
			    del: 'Delete selected',
			    back: 'Back',
			    addEdge: 'Add Link',
			    editEdge: 'Edit Link',
			    addNode: 'Add Concept',
			    addDescription: 'Click in an empty space to place a new concept.',
			    edgeDescription: 'Click on a node and drag the edge to another node to connect them.',
			    editEdgeDescription: 'Click on the control points and drag them to a node to connect to it.',
			    createEdgeError: 'Cannot link edges to a cluster.',
			    deleteClusterError: 'Clusters cannot be deleted.',
			    editClusterError: 'Clusters cannot be edited.'
			  }
			},
			manipulation:{
				deleteNode: false,
			}
	    },
	    linkphraseNodeOptions:{
	    	borderWidth:0,
	    	color: {
	    		background:'#ffffff'
	    	},
	    },
	    colors: ['#FFF282', '#7DB9D1', '#77FFA9', '#FF9393', '#FF9554'],
	  }
	state={
	  	myEdge:[],
	  	myNode:[],
	  	showInputBox:'none',
	  	clicks:0,
	  }
 	addEdge(edgeData, callback){
		if (edgeData.from === edgeData.to) {
	        var r = confirm("Do you want to connect the node to itself?");
	        if (r === true) {
	          callback(edgeData);
	        }
	      }
      else {
        let edges = this.state.myEdge;
        edges.push(edgeData);
       	this.setState({
       		myEdge:edges,
       	})
       	console.log('Add edge')
       	console.log(edgeData)
      }
	}
	prepareAddNode(nodeData,callback){
		if(nodeData){
			this.setState({showInputBox:'block', mode:'add-node', nodeData:nodeData})
		}
	}
	addNode(node){
		let nodes = this.state.myNode;
        nodes.push(node);
       	this.setState({
       		myNode:nodes,
       		showInputBox:'none'
       	})
       	console.log('Add node')
       	console.log(node)
	}
	prepareEditNode(nodeData){
		if(nodeData){
			this.setState({showInputBox:'block',mode:'edit-node', nodeData:nodeData})
		}
	}
	editNode(node){
		let nodes = this.state.myNode;
		for(var i=0; i<nodes.length; i++){
			if(nodes[i].id===node.id){
				nodes[i].label = node.label;
			}
		}
       	this.setState({
       		myNode:nodes,
       		showInputBox:'none'
       	})
       	console.log('Edit node: ')
       	console.log(node)
	}
	deleteEdge(data, callback){
		var edge = data.edges[0]
		if(edge){
			let edges = this.state.myEdge;
			var index = edges.findIndex(function(o){
			     return o.id === edge.id;
			})
			console.log('Delete edge: ', index)
	        edges.splice(index,1)
	       	this.setState({
	       		myEdge:edges,
	       	})
		}
	}
	getConceptMapData(){
		console.log('Get concept map data')
		return {nodes: this.nodes, edges:this.edges};
	}
  	componentDidMount() {
	   const {
	      graphData: {
	        nodes,
	        edges,
	      },
	      options,
	    } = this.props;
	    
	    options.manipulation.addEdge = this.addEdge;
	   	options.manipulation.deleteEdge = this.deleteEdge;
	   	options.manipulation.addNode = this.prepareAddNode;

	    this.nodes = this.preprocessNode(nodes)
	    this.nodes = new vis.DataSet(nodes);
	    this.edges = new vis.DataSet(edges);
	   	this.data={
				nodes: this.nodes,
				edges: this.edges
			}
	    this.network = new vis.Network(this.container, this.data, options);
	    this.network.storePositions();
	}
	componentWillUpdate(nextProps, nextState) {
	    const {
	      graphData: {
	        edges,
	        nodes,
	      },
	      options
	    } = nextProps;

	   	options.manipulation.addEdge = this.addEdge;
	   	options.manipulation.deleteEdge = this.deleteEdge;
	   	options.manipulation.addNode = this.prepareAddNode;

	    this.newNodes = nodes.concat(nextState.myNode);
	    this.prevNodes = this.nodes.get()

	    this.mergeNodes = mergeData(this.prevNodes, this.newNodes);
	    this.nodes = this.preprocessNode(this.mergeNodes)
	    this.nodes = new vis.DataSet(this.nodes)

	   	this.edges = edges.concat(nextState.myEdge)
	    this.edges = new vis.DataSet(this.edges);

		this.data={
				nodes: this.nodes,
				edges: this.edges
			}
		if(this.state.myNode.length>0){
			options.layout.hierarchical=false;
			options.physics.enabled=false;
		}
	    this.network = new vis.Network(this.container, this.data, options);
	    this.network.storePositions();
	    this.network.enableEditMode();
	    //Handle interaction
	    this.network.on("doubleClick", (params)=>{
	    	console.log('doubleClick')
	    	var nodeId = params['nodes'][0];
	    	const node = this.nodes.get(nodeId)

			if(node.time){
				
				console.log(node)
				this.props.jumpToVideoTime(node.time.played)
			}
	    })
	    this.network.on("dragEnd", (params)=>{
	    	this.network.storePositions();

	    });
	    this.network.on("selectNode", (params)=>{
	    	console.log('click node')

	    	var clicks = 0;
	    	var timeout;
	    	clicks++;
			if (clicks === 1) {
		      timeout = setTimeout(()=> {

		        const nodeId = params['nodes'][0];
		    	const node = this.nodes.get(nodeId)
		    	console.log(node)
		    	if(node.editable===true){
		    		console.log('prepare edit')
		    		this.prepareEditNode(node);
		    	}
		    	else{
		    		this.setState({showInputBox:'none'})
		    	}

		        clicks = 0;
		      }, 250);
		    } else {
		      clearTimeout(timeout);
		      
		      clicks = 0;
		    }

	    });
	    this.network.on('deselectNode', (params)=>{
	    	this.setState({showInputBox:'none'})
	    })
	}
	preprocessNode(nodes){
		let result = nodes.map((node, index)=>{
			//check if it is a link phrase
			if(node.label[0]==='-'){
				node.label = node.label.slice(1)
				node = Object.assign(node, this.props.linkphraseNodeOptions);
			}
			//check the level and modify color
			else if(node.level!=null){
				const colors = this.props.colors;
				if(node.level >= colors.length)node.color = colors[colors.length-1]
				else node.color = colors[node.level];
			}
			return node
		})
		return result
	}
	render(){
		return (
			<div className={this.props.className}>
				<div className={this.props.className} id='network' ref={container=>{this.container = container}} />
				<InputBox style={{	width:'300px',
									position: 'absolute',
									bottom: '10px',
									margin: '10px',
									display:this.state.showInputBox}}
						mode={this.state.mode}
						nodeData={this.state.nodeData}
						handleNewNode={this.addNode}
						handleEditNode={this.editNode}
						ref={input=>{this.inputBox = input}}/>
			</div>
			)
	}
}
