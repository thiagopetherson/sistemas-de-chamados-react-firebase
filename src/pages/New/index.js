
import { useState, useEffect, useContext } from 'react' // Importando os hooks (inclusive o context do react)
import firebase from '../../services/firebaseConnection' // Importando a conexão do Firebase
import { useHistory, useParams } from 'react-router-dom' // Importando o useHistory e useParams (para usarmos os parâmetros das rotas)
import Header from '../../components/Header'; // Chamando o componente do Header
import Title from '../../components/Title'; // Chamando o componente do Title
import { AuthContext } from '../../contexts/auth' // Chamando nosso context

import './new.css'; // Chamando o CSS
import { FiPlusCircle } from 'react-icons/fi' // Chamando a lib dos ícones
import { toast } from 'react-toastify' // Importando a biblioteca do Toastify

export default function New(){

  const { idChamado } = useParams() // Pegando os parâmetros da rota
  const history = useHistory() // Com o history, podemos navegar o usuário para um determinado local

  const [assunto, setAssunto] = useState('Suporte') // Por padrão, o assunto sempre será suporte
  const [status, setStatus] = useState('Aberto') // Por padrão, o status sempre será aberto
  const [complemento, setComplemento] = useState('') // estado do complemento

  const [loadCustomers, setLoadCustomers] = useState(true) // Estado com o loading
  const [customers, setCustomers] = useState([]) // Nesse estado armazenaremos os clientes
  const [customerSelected, setCustomerSelected] = useState(0) // Nesse estado armazenaremos o cliente selecionado

  const [idCustomer, setIdCustomer] = useState(false) // Estado que diz que queremos ou não editar o chamado

  const { user } = useContext(AuthContext) // Chamando nosso Context que tem os dados do usuário

  // Chamando o context useEffect (para quando carregar a página)
  useEffect(() => {
    const loadCustomers = async () => {

      // Buscando os clientes no banco de dados do Firebase
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot) => {

        let lista = []

        // Percorrendo os itens que foram retornados da consulta ao banco de dados
        snapshot.forEach( (item) => {
          lista.push({
            id: item.id,
            nomeFantasia: item.data().nomeFantasia
          })
        })

        // Verificando se foi retornado algum cliente
        if (lista.length == 0) {
          console.log('Nenhuma empresa encontrada')
          setCustomers([ {id: '1', nome: 'Freela'} ]) // Passaremos isso, para no caso de nenhuma empresa encontrada, colocaremos um cliente fictício
          setLoadCustomers(false) // Tirando o loading
          return
        }

        setCustomers(lista) // Colocando os clientes (que vieram da busca no banco) na nossa lista
        setLoadCustomers(false) // Tirando o loading
       
        // Verificando se quer cadastrar ou cadaseditartrar (esse id vem dos parâmetros da rota) - Quando clicamos no botão "editar chamado"
        if (idChamado) {
          loadId(lista)
        }

      })
      .catch((error) => {
        console.log('Deu algum erro: ', error)
        setLoadCustomers(false) // Tirando o loading
        setCustomers([ {id: '1', nome: ''} ]) // Passaremos isso, para no caso de erro, colocar um valor fictício na seleção dos clientes
      })

    }

    loadCustomers()

  },[idChamado])

  // Pegando o item da lista que tem aquele id
  const loadId = async (lista) => {
    // Buscando o item (chamado), no banco de dados, com aquele ID que veio como parâmetro da rota
    await firebase.firestore().collection('chamados').doc(idChamado)
    .get()
    .then((snapshot) => { // Retorno da consulta

      // Vamos atribuir os valores aos campos do formulário (para realizarmos a edição)  
      setAssunto(snapshot.data().assunto) // Setando o campo assunto
      setStatus((snapshot.data().status)) // Setando o campo status
      setComplemento((snapshot.data().complemento)) // Setando o campo complemento
      
      // Pegando o cliente que tem o id igual ao id do cliente que está no chamado 
      let index = lista.findIndex(item => item.id === snapshot.data().clienteId ); // O findIndex é um método do JavaScript que faz uma busca com base em uma condição passada pra ele
      // Setando o Cliente
      console.log(index)
      setCustomerSelected(index)
      // Dizendo que queremos editar o chamado
      setIdCustomer(true)

    })
    .catch((error) => {
      console.log("Houve um erro no ID passado: ", error)
      setIdCustomer(false)
    })
  }

  // Método de registrar um novo chamado
  const handleRegister = async (e) => {
    e.preventDefault();  

    // Se o idCustomer (id do cliente) estiver setado, então significa que queremos editar
    if (idCustomer) {
      // Fazendo o update do chamado no banco de dados
      await firebase.firestore().collection('chamados')
      .doc(idChamado)
      .update({      
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(() => {
        toast.success('Chamado Atualizado com Sucesso!')
  
        // Zerando (limpando) os campos do form        
        setCustomerSelected(0)
        setComplemento('')
        // Mandando o usuário para a rota do Dashboard
        history.push('/dashboard')
  
      })
      .catch((error) => {
        console.log(error)
        toast.error('Erro ao atualizar os dados do chamado. Tente mais tarde!', error)
      })
      
      return
    }


    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(() => {
      toast.success('Chamado criado com sucesso!')

      // Zerando (limpando) os campos do form
      setComplemento('')
      setCustomerSelected(0)

    })
    .catch((error) => {
      console.log(error)
      toast.error('Erro ao registrar. Tente mais tarde!')
    })
    
  }

  // Essa função faz com que quando mudar um valor no select, nós pegaremos o valor e setamos no estado assunto
  const handleChangeSelect = (e) => {
    setAssunto(e.target.value)
  }

  // Essa função faz com que quando mudar um valor no input radio, nós pegaremos o valor e setamos no estado status (isso definirá o option selecionado)
  const handleOptionChange = (e) => {
    setStatus(e.target.value)
  }

  // Essa função é chamada quando trocamos de cliente no select e setar o cliente selecionado
  const handleChangeCustomers = (e) => {
    setCustomerSelected(e.target.value)
  }


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">

          <form className="form-profile"  onSubmit={handleRegister} >
            
            <label>Cliente</label>

            {/* Parte do Loading */}
            {loadCustomers ? (

              <input type="text" disabled={true} value='Carregando Clientes...' />

            ): (

              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>

            )}           

            <label>Assunto</label>
            <select value={ assunto } onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input 
              type="radio"
              name="radio"
              value="Aberto"
              onChange={handleOptionChange}
              checked={ status == "Aberto" }
              />
              <span>Em Aberto</span>

              <input 
              type="radio"
              name="radio"
              value="Progresso"
              onChange={handleOptionChange}
              checked={ status == "Progresso" }
              />
              <span>Progresso</span>

              <input 
              type="radio"
              name="radio"
              value="Atendido"
              onChange={handleOptionChange}
              checked={ status == "Atendido" }
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)."
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />
            
            <button type="submit">Registrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}