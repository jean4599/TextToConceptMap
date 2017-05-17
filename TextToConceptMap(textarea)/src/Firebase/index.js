import firebase from 'firebase'  

var config = {// Initialize Firebase
  apiKey: "AIzaSyC1d58OSc4suK3i3CGbNVcGHXxhZsRFGtA",
  authDomain: "teamoocer.firebaseapp.com",
  databaseURL: "https://teamoocer.firebaseio.com",
  projectId: "teamoocer",
  storageBucket: "teamoocer.appspot.com",
  messagingSenderId: "247904409932"
};
firebase.initializeApp(config);

export default firebase

export const REF = {
  Node: '/conceptMap/nodes',
  Link: '/conceptMap/links',
}

export const saveNode = (node)=>{
  if(node.level===undefined)node.level=null;
  if(node.time===undefined)node.time=null;
  firebase.database().ref(REF.Node).push({
    id: node.id,
    label: node.label,
    level: node.level,
    time: node.time,
    x:node.x,
    y:node.y,
  })
}

export const saveLink = (link)=>{
  console.log('Firebase save link:')
  console.log(link)
  firebase.database().ref(REF.Link).push({
    from: link.from,
    to: link.to,
  })
}