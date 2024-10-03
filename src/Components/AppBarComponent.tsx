import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import getUserRandom from '../Functions/Aleatorios/getUser';


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
                                Bienvenido {getUserRandom()}
                        </Typography>
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default AppBarComponent