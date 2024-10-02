import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const AppBarComponent = () => {

    return (
        <Box sx={{ flexGrow: 1, mb: 2 }}>
            <AppBar position="static" sx={{ backgroundColor: '#606676', borderRadius: 1.5, margin: 0, padding: '20px', fontStyle: 'normal' }} >
                <Toolbar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{ fontSize: '2em', fontWeight: 'bold', fontFamily: 'Noto Sans, sans-serif', color: '#FFFF', fontStyle: 'normal' }}
                            className='h1-nm-app'>
                            React Notes❤️
                        </Typography>

                        <Typography
                            sx={{ fontSize: '1.5em', fontWeight: 400, fontFamily: 'Noto Sans, sans-serif' , color: '#FFFF', fontStyle: 'normal' }}>
                            ¡Bienvenidos al emocionante mundo de React Moderno!
                            En este curso, te sumergirás en las últimas tecnologías y mejores prácticas
                            para construir aplicaciones web de vanguardia. Aprenderás a dominar React, TypeScript y Vite,
                            herramientas esenciales para el desarrollo web actual. Desarrollarás habilidades prácticas para crear aplicaciones
                            interactivas, eficientes y escalables, preparándote para enfrentar los desafíos del mercado laboral y construir un futuro
                            brillante en el mundo del desarrollo web. ¡Prepárate para un viaje lleno de aprendizaje y creatividad!
                        </Typography>
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default AppBarComponent