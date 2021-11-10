// Esse route é um componente 
import { useContext } from 'react' // Importando o context do react
import { Route, Redirect } from 'react-router-dom' // Importando o Route e Redirect do react router dom
import { AuthContext } from '../contexts/auth' // Importando o context que criamos


export default function RouteWrapper ({
    component: Component, // Componente
    isPrivate, // Para verificar se a rota é privada ou não
    ...rest // Repassando todo o resto e colocando aqui
}){
    const { signed, loading } = useContext(AuthContext) // Pegando o signed do nosso Context  

    // Para retornar o loading
    if (loading) {
        return (
            <div></div>
        )
    }

    // Se ele não está logado e a rota dele é privada
    if (!signed && isPrivate) {
        return <Redirect to="/" /> // Redirecionamos para a área de login
    }

    // Se ele está logado e a rota não é privada
    if (signed && !isPrivate) {
        return <Redirect to="/dashboard" /> // Redirecionamos para a área de login
    }

    return (
        <Route 
            {...rest}
            render={ props => (
                <Component {...props} /> // Renderizamos o componente e passamos as propriedades dele
            )}
        />
    )
}