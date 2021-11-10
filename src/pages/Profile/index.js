
import { useState, useContext } from 'react'; // Importando o Estado e o Context
import './profile.css';
import Header from '../../components/Header'; // Importando o Header
import Title from '../../components/Title'; // Importando o Title
import avatar from '../../assets/avatar.png'; // Importando imagem padrão do usuário
import firebase from '../../services/firebaseConnection' // Importando o banco de dados do Firebase
import { toast } from 'react-toastify' // Importando a biblioteca do Toastify

import { AuthContext } from '../../contexts/auth'; // Importando o nosso context

import { FiSettings, FiUpload } from 'react-icons/fi'; // Importando a lib dos ícones

export default function Profile(){
  const { user, signOut, setUser, storageUser} = useContext(AuthContext); // Pegando os estados que foram passados pelo nosso context

  // Se tem um user vindo da autenticação então pegaremos o user.nome
  const [nome, setNome] = useState(user && user.nome);

  // Se tem um user vindo da autenticação então pegaremos o user.email e setaremos no estado
  const [email, setEmail] = useState(user && user.email);

  // Se tem um user vindo da autenticação então pegaremos o user.avatar e setaremos no estado
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

  // Esse estado é criado para quando for enviado uma imagem, então esse imagem seja salva em um estado separado
  const [imageAvatar, setImageAvatar] = useState(null);


  // Funcção que faz o upload da imagem
  const handleUpdateWithImage = async (e) => {
    const currentUid = user.uid

    const uploadImage = await firebase.storage()
    .ref(`images/${currentUid}/${imageAvatar.name}`) // Criaremos uma pasta para cada usuário lá no Firebase
    .put(imageAvatar)
    .then( async () => {
      // O storage.ref serve para pegar a url da imagem que foi armazenada no Firebase
        await firebase.storage()
        .ref(`images/${currentUid}`) // o parâmetro do ref é o caminho que acessaremos no firebase
        .child(imageAvatar.name).getDownloadURL() // Pegando a url da imagem (lá do firebase) com o child e o getDownloadURL do Firebase
        .then( async (url) => {
          let urlFoto = url // Armazenando a url na variável

          // Aqui, nós atualizaremos a url da imagem no campo da nossa tabela (collection) 'users' no Firebase
          await firebase.firestore().collection('users')
          .doc(user.uid)
          .update({
            avatarUrl: urlFoto,
            nome: nome
          })       
          .then(() => {
          // Atualizando nosso estado do context e o localStorage
          let data = {
            ...user,
            avatarUrl: urlFoto,
            nome: nome
          }

          setUser(data) // Estado do context
          storageUser(data) // localStorage

          toast.success('Dados atualizados com sucesso!') // Chamando o alerta
          })
        })
    }).catch((error) => {
      console.log(error)
      toast.error('Houve um erro. Os dados não foram atualizados!') // Chamando o alerta
    })
    
  }

  // Função que mostra uma prévia da imagem antes de enviá-la
  const handlePreviewImage = (e) => {

    // Verificando se o arquivo realmente veio (pois, só entra aqui se for fazer a troca da imagem)
    if(e.target.files[0]) {

      const image = e.target.files[0]

      // Verificando o tipo do arquivo
      if(image.type == 'image/jpeg' || image.type == 'image/jpg' || image.type == 'image/png') {

        setImageAvatar(image) // Setando o estado que guarda a imagem
        setAvatarUrl(URL.createObjectURL(e.target.files[0])) // Criamos uma URL para a imagem e setamos no estado avatarUrl (que é o estado feito para armazenar essa URL)

      } else {
       
        toast.error('Erro no formato do arquivo. Envie uma imagem do tipo jpeg, jpg ou png.') // Chamando o alerta
        setImageAvatar(null)
        return null
        
      }

    }    

  }


  // Função criada para editar os dados do usuário
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Verificando se foi enviada alguma imagem (se entrar no else if, é pq foi enviado uma imagem)
    if ( imageAvatar == null && nome != "" ) {

      // Usamos o método update, do firebase, para alterar os dados do usuário no banco do firebase
      await firebase.firestore().collection('users')
      .doc(user.uid)
      .update({
        nome: nome      
      }).then((retorno) => {
        // Setando os novos dados no state do context e no localStorage
        let data = {
          ...user,
          nome: nome
        }

        setUser(data) // estado do context
        storageUser(data) // localStorage (que também vem do context)

      }).catch((error) => {
        
      })

    } else if (imageAvatar != null && nome != "") {
       // Chamando a função que faz o upload da Imagem
       handleUpdateWithImage()
    }

  } 


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Meu perfil">
          <FiSettings size={25} />
        </Title>


        <div className="container">
          <form className="form-profile" onSubmit={handleUpdate}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>
              
              <input type="file" accept="image/*" onChange={handlePreviewImage} /><br/>
              { avatarUrl == null ? 
                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario" />
                :
                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
              }
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />     

            <button type="submit">Salvar</button>       

          </form>
        </div>

        <div className="container">
            <button className="logout-btn" onClick={ () => signOut() } >
               Sair
            </button>
        </div>

      </div>
    </div>
  )
}