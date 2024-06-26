// ************ Require's ************ //
const express = require('express');
const path = require('node:path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const cors = require('cors');

const userLoggedMiddleware = require('./middlewares/app-middlewares/userLoggedMiddleware')


// ************ express() - (don't touch) ************ //
const app = express();


// ************ Middlewares - (don't touch) ************ //
app.use( express.static('public') );
app.use(express.urlencoded( { extended: false} ));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session( { secret: 'lumina', resave: false, saveUninitialized: false } ));
app.use(userLoggedMiddleware.userLogged);
app.use(cors());


// ************ Template Engine - (don't touch) ************ //
const viewsPath = ['views', 'views/index', 'views/products', 'views/users',];
const generatePathViews = (dirs) => {return dirs.map( dir => path.join(__dirname, dir) )};
app.set('views', generatePathViews(viewsPath));
app.set('view engine', 'ejs');


// ************ Server Configuration and Startup ************ //
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
});


// ************ Route System require and use() ************ //
const productRoutes = require('./routes/productRoutes');
const shoppingCartRoutes = require('./routes/shoppingCartRoutes');
const userRouter = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');

app.use('/', homeRoutes);
app.use('/products', productRoutes);
app.use('/cart', shoppingCartRoutes);
app.use('/users', userRouter);

// ************ API's Route System require and use() ************ //
const apiUsersRouter = require('./routes/api/users');
const apiProductsRouter = require('./routes/api/products');
const apiOrdersRouter = require('./routes/api/orders');
app.use('/api/users', apiUsersRouter);
app.use('/api/products', apiProductsRouter);
app.use('/api/orders', apiOrdersRouter);
// ************ 404 Not Found Route System ************ //
app.use((req, res, next) => {
    res.status(404).render('status/notFound', { url: req.originalUrl });
});