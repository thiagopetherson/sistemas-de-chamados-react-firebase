import { Switch } from 'react-router-dom'
import Route from './Route' // Importando o componente que terá a configuração das rotas

import SignIn from '../pages/SignIn' // Importando o componente para ser usado nas rotas
import SignUp from '../pages/SignUp' // Importando o componente para ser usado nas rotas
import Dashboard from '../pages/Dashboard' // Importando o componente para ser usado nas rotas
import Profile from '../pages/Profile' // Importando o componente para ser usado nas rotas
import Customers from '../pages/Customers' // Importando o componente para ser usado nas rotas
import New from '../pages/New' // Importando o componente para ser usado nas rotas

 // Abaixo, configuraremos as rotas
export default function Routes () {
    return (
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/register" component={SignUp} />
            <Route exact path="/dashboard" component={Dashboard} isPrivate />
            <Route exact path="/profile" component={Profile} isPrivate />
            <Route exact path="/customers" component={Customers} isPrivate />
            <Route exact path="/new" component={New} isPrivate />
            <Route exact path="/new/:idChamado" component={New} isPrivate />
        </Switch>
    )
}