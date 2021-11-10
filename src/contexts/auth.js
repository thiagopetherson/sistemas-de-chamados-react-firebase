// Context de Autenticação do Usuário
import { useState, createContext, useEffect } from 'react' // Importando os Hooks e o Context do react
import firebase from '../services/firebaseConnection' // Importando a conexão do Firebase
import { toast } from 'react-toastify' // Importando a biblioteca do Toastify

import { FiUser } from 'react-icons/fi'; // Importando o ícones da biblioteca

export const AuthContext = createContext({}) // Criando o context

function AuthProvider({ children }) {

    const [user, setUser] = useState(null) // Estado que seta o usuário
    const [loadingAuth, setLoadingAuth] = useState(false) // Loading da autenticação
    const [loading, setLoading] = useState(true) // Loading Geral

    // Quando carregar o component
    useEffect(() => {

        // Função que faz a autenticação do usuário (vê se está logado, seta, etc...)
        const loadStorage = () =>  {
             // Pegando o usuário do localStorage
             const storageUser = localStorage.getItem('user') 

             // Verificando se tem um usuário logado
             if (storageUser) {
                setUser(JSON.parse(storageUser)) // Setando o usuário, com dados do localSorage, no estado
                setLoading(false) // Setando o estado do loading como false
             }

             setLoading(false) // Setando o estado do loading como false
        }

        loadStorage() // Chamando a função

    }, [])

    // Função para logar o usuário
    const signIn = async (email, password) => {
        
        setLoadingAuth(true) // colocando o loading

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value) => {

            // uid do usuário que está se logando
            let uid = value.user.uid

            // pegando os dados do usuário que está se logando
            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get()
            
            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                email: value.user.email,
                avatarUrl: userProfile.data().avatar
            }

            setUser(data) // Setando no estado
            storageUser(data) // Salvando no localStorage (chamando a função que faz isso)
            setLoadingAuth(false) // Tirando o loading

            toast.success('Bem vindo de volta') // Chamando o alerta 

        }).catch((error) => {
            console.log(error)
            toast.error('Opss. Tivemos um erro') // Chamando o alerta 
            setLoadingAuth(false) // Tirando o loading
        })

    }

    // Função para cadastrar o usuário
    const signUp = async (email, password, nome) => {
        setLoadingAuth(true) // Rodando o loading
        
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            // Pegando os dados do usuário retornado da criação com auth e agora, abaixo, cadastraremos (outros dados) na tabela users do firebase
            let uid = value.user.uid

            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome: nome, 
                avatarUrl: null,
            })
            .then(() => {
                // Depois do usuário cadastrado, vamos setál-lo no estado
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null
                }

                setUser(data) // Setando no estado
                storageUser(data) // Salvando no localStorage (chamando a função que faz isso)
                setLoadingAuth(false) // Tirando o loading

                toast.success('Bem vindo a plataforma') // Chamando o alerta 

            })
            .catch((error) => {
                console.log(error)
                toast.error('Opss. Tivemos um erro') // Chamando o alerta 
                setLoadingAuth(false) // Tirando o loading               

            })
        })
    }

    // Função para salvar um usuário no localStorage
    const storageUser = (data) => {
        localStorage.setItem('user', JSON.stringify(data))
    }

    // Função para deslogar o usuário
    const signOut = async () => {

        await firebase.auth().signOut() // Deslogando o usuário com o método do firebase
        localStorage.removeItem('user') // Limpando o localStorage
        setUser(null) // Limpando o estado do usuário

    }


    // O !! converte o que está dentro da variável para booleano (ou seja, se tiver algo converte true, e se não, para false)
    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, signUp, signOut, signIn, loadingAuth, setUser, storageUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
