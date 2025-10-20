import { Router } from 'express';  //Llamamos solo al modulo router que se encuentra en express
import usuarioRoutes from "./routesUsuarios.js";
import requerimientoRouter from './routesRequerimientos.js';
import loginRouter from './routeLogin.js'
const router = Router();

router.get('/', (req, res) => res.render('index')); 
router.use(usuarioRoutes); // aquí conectas todas las rutas de usuarios
router.use(requerimientoRouter); // aquí conectas todas las rutas de requerimientos
router.use(loginRouter)



export default router; //exportamos el router para usarlo en app.js