
import './dashboard.css'; // Chamando o CSS
import { useState, useEffect } from 'react'; // Chamando o hook do estado e o useEffect

import Header from '../../components/Header'; // Chamando o componente do Header
import Title from '../../components/Title'; // Chamando o componente do Title
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'; // Importando a lib dos ícones
import { Link } from 'react-router-dom'; // Importando o Link do React Router  Dom
import firebase from '../../services/firebaseConnection' // Importando o banco de dados do firebase
import Modal from '../../components/Modal' // Importando o componente do modal

import { format } from 'date-fns' // Importando a biblioteca de formatação de datas




export default function Dashboard(){

  const [chamados, setChamados] = useState([]); // criando o estado dos chamados
  const [loading, setLoading] = useState(true); // criando o estado do loading
  const [loadingMore, setLoadingMore] = useState(false); // criando o estado que 
  const [isEmpty, setIsEmpty] = useState(false); // criando o estado que verifica se a lista está vazia
  const [lastItems, setLastItems] = useState(); // armazena o último item da lista de chamados
  const [showPostModal, setShowPostModal] = useState(false) // Estado que define se vai mostrar ou não o modal
  const [detail, setDetail] = useState() // Esse estado armazenará os detalhes de cada chamado



  useEffect(() => {

    // Função que busca os chamados
    const loadChamados = async () => {

      // fazendo o busca
      await firebase.firestore().collection('chamados').orderBy('created', 'desc').limit(5)
      .get()
      .then((snapshot) => {

        updateState(snapshot)

      })
      .catch((error) => {
        console.log("Deu algum erro: ". error)
        setLoadingMore(false)
      })

      setLoading(false)

    }

    loadChamados()

    return () => {

    }
  }, [])
  

  // Função que faz a organização da listagem dos dados
  const updateState = async (snapshot) => {
    
    // Verificando se houve retorno da busca
    const isCollectionEmpty = snapshot.size == 0

    if(!isCollectionEmpty) {
      let lista = []

      snapshot.forEach((item) => {
        lista.push({
          id: item.id,
          assunto: item.data().assunto,
          cliente: item.data().cliente,
          clienteId: item.data().clienteId,
          created: item.data().created,
          createdFormated: format(item.data().created.toDate(), 'mm/dd/yyyy'),
          status: item.data().status,
          complemento: item.data().complemento          
        })
      })

      const lastItem = snapshot.docs[snapshot.docs.length -1] // Pegando o último item do snapshot
      
      // Setando a lista de chamados (aqui é pego os que vem do banco e também os novos (caso o usuário tenha adicionado algum))
      setChamados(chamados => [...chamados, ...lista])
      // Setando o último item
      setLastItems(lastItem)

    } else {
      // Se a lista estiver vazia
      setIsEmpty(true)
    }

    setLoadingMore(false)

  }


  // Função que busca mais dados para a lista
  const handleMore = async () => {
    setLoadingMore(true)
    // Faremos com que seja buscado os items após os último item que foi renderizado
    // Exemplo: O último item tem o id 5, então agora será buscado o 6,7,8,9,10
    await firebase.firestore().collection('chamados').orderBy('created', 'desc').startAfter(lastItems).limit(5)
    .get()
    .then((snapshot) => {
      // Pegando os dados que já existem e mais os items que buscamos agora
      updateState(snapshot)
    })
  }

  // Função que recebe os dados de cada item da lista para colocar em um modal
  const togglePostModal = (item) => {
    setShowPostModal(!showPostModal) // Trocando de true para false, ou seja, fechando e abrindo o modal
    setDetail(item)
  }


  // Para o caso dos dados ainda não terem sido carregados
  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Atendimentos">
            <FiMessageSquare size={25} />

            <div className="container dashboard">
              <span>Buscando Chamados...</span>
            </div>
          </Title>
        </div>
      </div>        
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length == 0 ? (
          /* Quando não houver chamados */
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        )  : (
          /* Quando houver chamados */
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody> 

                {/* Renderizando a lista */}
                {chamados.map((item, index) => {
                  return(
                    <tr key={index}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormated}</td>
                      <td data-label="#">
                        <button className="action" style={{backgroundColor: '#3583f6' }} onClick={ () => togglePostModal(item) }>
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`}>
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}   

              </tbody>
            </table>
               
            {/* Busca mais registros para a lista */}
            
            { loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3> }
            { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore} >Buscar Mais</button> }

          </>   
        )}

      </div>

      {showPostModal && (
          <Modal 
            conteudo={detail}
            close={togglePostModal}
          />
      )}

    </div>
  )
}