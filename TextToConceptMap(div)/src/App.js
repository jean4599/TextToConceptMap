import React, { Component } from 'react';
import Text from './Text';
import Error from './Error';
import ConceptMap from './ConceptMap';
import {saveNode, saveLink, REF} from './Firebase';
import firebase from 'firebase'  
import {toArray} from './utils'
import parse, { getGraphData } from './parse';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.setText = this.setTree.bind(this);
  }
  state = {
    tree: {
      nodes: [],
      edges: [],
    },
    error: false,
  }
  componentWillMount() {
    firebase.database().ref(REF.Node).once('value').then((snapshot)=>{
      const nodes = toArray(snapshot.val());
      console.log(nodes)
      firebase.database().ref(REF.Link).once('value').then((snapshot)=>{
        const edges = toArray(snapshot.val());
        this.setState({
          tree: {
            nodes: nodes,
            edges: edges
          }
        })
      })
      
    })
  }

  setTree(text) {
    try {
      const trees = parse(text, '\t');
      const tree = getGraphData(trees);
      // console.log(JSON.stringify(tree));
      this.setState({
        tree,
        error: null,
      });
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  }
  saveGraph(graphData){
    for(var i=0; i< graphData.nodes.length; i++){
      saveNode(graphData.nodes[i])
    }
    for(i=0; i< graphData.edges.length; i++){
      saveLink(graphData.edges[i])
    }
  }
  render() {
    return (
      <div className="App" >
        <Text className="input-text" setText={this.setText} />
        <RaisedButton label="Save my concept map" onClick={()=>this.saveGraph(this.state.tree)}/>
        <ConceptMap className="output" graphData={this.state.tree} />
        <Error isActive={this.state.error} text={this.state.error} />
      </div>
    );
  }
}

export default App;
