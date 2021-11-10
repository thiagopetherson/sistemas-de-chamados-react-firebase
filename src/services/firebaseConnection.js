import firebase from 'firebase/app' // Importando firebase
import 'firebase/auth' // Importando a parte de autenticação do firebase
import 'firebase/firestore' // Importando a parte de banco de dados do firebase
import 'firebase/storage' // Importando a parte do Storage do firebase


const firebaseConfig = {
    apiKey: "AIzaSyAoL-QRU5igZpqPmUewJBjD_9KGTJu1qTY",
    authDomain: "sistema-chamados-15c14.firebaseapp.com",
    projectId: "sistema-chamados-15c14",
    storageBucket: "sistema-chamados-15c14.appspot.com",
    messagingSenderId: "718504085456",
    appId: "1:718504085456:web:4f6a1c550552c2511d9bd5",
    measurementId: "G-7DCZQY6TV5"
};
  
// Verificando se tem uma conexão aberta (se tiver, nós não abrimos. Se não tiver, nós abrimos)
if(!firebase.apps.length){
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);    
}

export default firebase;