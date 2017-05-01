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
  firebase.database().ref(REF.Node).push({
    id: node.id,
    label: node.label,
    level: node.level,
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