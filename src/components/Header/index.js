
import { useContext } from 'react'; // Importando o context do React
import './header.css';
import { AuthContext } from '../../contexts/auth'; // Importando o nosso context
import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom'; // Importando o link do React Router Dom
import { FiHome, FiUser, FiSettings } from "react-icons/fi"; // Importando a lib do React Icons

export default function Header(){
  const { user } = useContext(AuthContext); // Setando o estado do usuário

  return(
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl == null ? avatar : user.avatarUrl } alt="Foto avatar" />
      </div>

      <Link to="/dashboard">
        <FiHome color="#FFF" size={24} />
        Chamados
      </Link>
      <Link to="/customers">
        <FiUser color="#FFF" size={24} />
        Clientes
      </Link>    
      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Configurações
      </Link>           
    </div>
  )
}