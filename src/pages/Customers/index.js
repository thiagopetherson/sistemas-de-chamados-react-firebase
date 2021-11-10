
import { useState } from 'react'; // Importando o hook (states) do react
import './customers.css'; // Importando o CSS
import Title from '../../components/Title'; // Importando o componente de title
import Header from '../../components/Header'; // Importando o componente de header
import firebase from '../../services/firebaseConnection'

import { FiUser } from 'react-icons/fi'; // Importando o ícones da biblioteca
import { toast } from 'react-toastify' // Importando a biblioteca do Toastify

export default function Customers(){

  // Estados
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');


  // Função que cria um novo cliente
  const handleAdd = async (e) => {

    e.preventDefault();
    
    if (nomeFantasia != '' && cnpj != '' && endereco != '') {
      await firebase.firestore().collection('customers')
      .add({
        nomeFantasia: nomeFantasia,
        cnpj: cnpj, 
        endereco: endereco
      })
      .then(() => {
        setNomeFantasia("")
        setCnpj("")
        setEndereco("")
        toast.success("Empresa Cadastrada com Sucesso")
      })
      .catch((error) => {
        console.log(error)
        toast.success("Erro ao cadastrar o cliente. Tente novamente ou entre em contato com o suporte!")
      })
    } else {
      toast.error("Preencha todos os campos!")
    }
  }

  return(
    <div>
      <Header/>

    <div className="content">
      <Title name="Clientes">
        <FiUser size={25} />
      </Title>

      <div className="container">
        <form className="form-profile customers" onSubmit={handleAdd}>
          <label>Nome fantasia</label>
          <input type="text" placeholder="Nome da sua empresa" value={nomeFantasia} onChange={ (e) => setNomeFantasia(e.target.value) } />

          <label>CNPJ</label>
          <input type="text" placeholder="Seu CNPJ" value={cnpj} onChange={ (e) => setCnpj(e.target.value) } />

          <label>Endereço</label>
          <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={ (e) => setEndereco(e.target.value) } />

          <button type="submit">Cadastrar</button>

        </form>
      </div>

    </div>

    </div>
  )
}