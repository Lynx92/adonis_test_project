'use strict'

/* Definimos constante para el modelo de User */
const User = use('App/Models/User');

class UserController {
    /* Funcion crear en la validacion, que loguea al usuario y lo devuelve a la pagina principal */
    async create({ request, response, auth}) {
        const user = await User.create(request.only(['username','email','password']));

        await auth.login(user);
        return response.redirect('/');
    }
    
    async login({ request, auth, response, session }) {
        const { email, password } = request.all();

        try {
            await auth.attempt(email, password);
            return response.redirect('/');
        } catch (error) {
            session.flash({loginError: 'Ey Chaval, ¿Tienes problemas de memoria?'})
            return response.redirect('/login');
        }
    }
}



module.exports = UserController