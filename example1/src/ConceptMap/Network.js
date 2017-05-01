import React, { Component } from 'react';
import PropTypes from 'prop-types';
import vis from 'vis'

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
	    //colors: PropTypes.arrayOf(PropTypes.string),
	    className: PropTypes.string,
  	}
  	static defaultProps = {
	    options: {
	    	layout:{
	    		hierarchical:{
	      			enabled:true,
	      			direction: 'UD',
	      			levelSeparation: 50,
	      			sortMethod:'hubsize',
	      			treeSpacing:100,
	      			parentCentralization: false
	      		},
	    	}
	    },
	    linkphraseNodeOptions:{
	    	borderWidth:0,
	    	color: {
	    		background:'#ffffff'
	    	}
	    },
	    //colors: ['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF'],
	  }
  	componentDidMount() {
	   const {
	      graphData: {
	        nodes,
	        edges,
	      },
	      options,
	      //colors,
	    } = this.props;
	    //this.nodes = this.changePropertyOnLinkphrase(nodes)
	    this.nodes = new vis.DataSet(nodes);
	    this.edges = new vis.DataSet(edges);
	    this.data={
			nodes: this.nodes,
			edges: this.edges
		}
	    this.network = new vis.Network(this.container, this.data, options);
	}
	componentWillUpdate(nextProps) {
	    const {
	      graphData: {
	        edges,
	        nodes,
	      },
	    } = nextProps;

	    this.newNodes = nodes;
	    this.prevNodes = this.nodes.get()
	    this.mergeNodes = mergeData(this.prevNodes, this.newNodes);
	    this.nodes = this.changePropertyOnLinkphrase(this.mergeNodes)
	    this.nodes = new vis.DataSet(this.nodes)

	    this.edges = new vis.DataSet(edges);
		this.data={
			nodes: this.nodes,
			edges: this.edges
		}
		
	    this.network = new vis.Network(this.container, this.data, this.props.options);
	    this.network.storePositions()

	}
	changePropertyOnLinkphrase(nodes){
		let result = nodes.map((node, index)=>{
			if(node.label[0]==='-'){
				node.label = node.label.slice(1)
				let newNode = Object.assign(node, this.props.linkphraseNodeOptions);
				return newNode;
			}
			else return node
		})
		return result
	}
	render(){
		return (
			<div className={this.props.className} id='network' ref={container=>{this.container = container}} />
			)
	}
}
