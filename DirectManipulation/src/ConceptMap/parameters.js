import PropTypes from 'prop-types';
export const propTypes = {
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
	    getTimeStamp: PropTypes.func,
	    className: PropTypes.string,
	    videoTime: PropTypes.number,
  	}
export const defaultProps = {
	    options: {
	    	layout:{
	    		hierarchical:{
	      			enabled:false,
	      			direction: 'UD',
	      			levelSeparation: 50,
	      			sortMethod:'directed',
	      			treeSpacing:100,
	      			parentCentralization: true,
	      		},
	    	},
	    	physics: false,
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
			    addEdge: 'Add Link (shoutcut: "Shift")',
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
			manipulation:false,
			interaction:{
				keyboard:{
					enabled: true,
				}
			},
			interaction:{
				keyboard:{
					enabled: true,
				},
				selectConnectedEdges:false,
			}
	    },
	    linkphraseNodeOptions:{
	    	borderWidth:0,
	    	color: {
	    		background:'#ffffff'
	    	},
	    },
	    colors: ['#FFF282', '#7DB9D1', '#77FFA9', '#FF9393', '#FF9554'],
	    videoTime: 0,
	  }
