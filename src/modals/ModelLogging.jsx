import { Modal, IconButton, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { Close, AccountCircle, PersonAdd } from '@mui/icons-material';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModelLogging = forwardRef((prop, ref) => {
    const [open, setOpen] = useState(false);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const navigate = useNavigate(); // Use the useNavigate hook
    
    const handleClose = () => setOpen(false);

    // Handle login action
    const handleLogin = () => {
        console.log('Login clicked');
        handleClose();
        navigate('/login'); // Use navigate function (lowercase)
    };

    // Handle register action
    const handleRegister = () => {
        console.log('Register clicked');
        handleClose();
        navigate('/login'); // Use navigate function (lowercase)
    };

    useImperativeHandle(ref, () => ({
        handleOpen: () => setOpen(true)
    }));

    return (
        <>
            <Modal 
                open={open}
                onClose={handleClose}
                className='flex items-center justify-center p-4'
            >
                <Box className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                    {/* Header with gradient */}
                    <Box 
                        className="flex items-center justify-between p-6"
                        sx={{
                            background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)'
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            className="font-bold text-white"
                        >
                            Welcome Back
                        </Typography>
                        <IconButton 
                            onClick={handleClose}
                            className="text-white hover:bg-white/20"
                            size="small"
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Content */}
                    <Box className="p-6">
                        <Box className="flex items-center justify-center mb-6">
                            <Box 
                                className="p-4 rounded-full"
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
                                }}
                            >
                                <AccountCircle 
                                    className="text-gray-800" 
                                    style={{ fontSize: 60 }} 
                                />
                            </Box>
                        </Box>
                        
                        <Typography 
                            variant="h6" 
                            className="text-center text-gray-800 font-semibold mb-3"
                        >
                            Sign in to continue
                        </Typography>
                        
                        <Typography 
                            variant="body1" 
                            className="text-center text-gray-600 mb-8"
                        >
                            Please sign in to your account to access your personalized experience and continue where you left off.
                        </Typography>

                        {/* Action Buttons */}
                        <Box className="flex flex-col space-y-4">
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleLogin}
                                sx={{
                                    background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 10px 25px rgba(185, 28, 28, 0.3)'
                                    },
                                    transition: 'all 0.3s ease',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    textTransform: 'none'
                                }}
                                startIcon={<AccountCircle />}
                            >
                                Sign In to Your Account
                            </Button>
                            
                            <Button
                                variant="outlined"
                                fullWidth
                                size="large"
                                onClick={handleRegister}
                                sx={{
                                    border: '2px solid #b91c1c',
                                    color: '#b91c1c',
                                    '&:hover': {
                                        background: 'rgba(185, 28, 28, 0.08)',
                                        border: '2px solid #dc2626',
                                        transform: 'translateY(-1px)'
                                    },
                                    transition: 'all 0.3s ease',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    textTransform: 'none'
                                }}
                                startIcon={<PersonAdd />}
                            >
                                Create New Account
                            </Button>
                        </Box>

                        {/* Divider with text */}
                        <Box className="flex items-center my-8">
                            <Box className="flex-1 border-t border-gray-200"></Box>
                            <Typography 
                                variant="body2" 
                                className="mx-4 text-gray-500"
                            >
                                Or continue with
                            </Typography>
                            <Box className="flex-1 border-t border-gray-200"></Box>
                        </Box>

                        {/* Social login options */}
                        <Box className="grid grid-cols-2 gap-3 mb-6">
                            <Button
                                variant="outlined"
                                fullWidth
                                className="border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-medium"
                            >
                                Google
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                className="border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-medium"
                            >
                                Apple
                            </Button>
                        </Box>

                        {/* Footer note */}
                        <Typography 
                            variant="caption" 
                            className="text-center text-gray-500 block mt-8 pt-6 border-t border-gray-100"
                        >
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                            <br />
                            Need help? <span className="text-[#b91c1c] cursor-pointer hover:underline">Contact Support</span>
                        </Typography>
                    </Box>
                </Box>
            </Modal>

            {/* Simple message snackbar */}
            <Snackbar 
                open={showSaveMessage} 
                autoHideDuration={3000} 
                onClose={() => setShowSaveMessage(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSaveMessage(false)} 
                    severity="info"
                    sx={{
                        background: '#b91c1c',
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: 'white'
                        }
                    }}
                >
                    Session saved successfully
                </Alert>
            </Snackbar>
        </>
    );
});

export default ModelLogging;