import { Modal, IconButton, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { Close, AccountCircle, PersonAdd, Save } from '@mui/icons-material';
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';

const ModelLogging = forwardRef((prop, ref) => {
    const [open, setOpen] = useState(false);
    const [saveToBrowser, setSaveToBrowser] = useState(false);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    
    const handleClose = () => setOpen(false);

    // Check if user has previously saved preference
    useEffect(() => {
        const savedPref = localStorage.getItem('cartLoginReminder');
        if (savedPref === 'true') {
            setSaveToBrowser(true);
        }
    }, []);

    // Handle save to browser toggle
    const handleSaveToBrowser = () => {
        const newValue = !saveToBrowser;
        setSaveToBrowser(newValue);
        
        if (newValue) {
            localStorage.setItem('cartLoginReminder', 'true');
            setShowSaveMessage(true);
        } else {
            localStorage.removeItem('cartLoginReminder');
        }
    };

    // Close the save message
    const handleCloseMessage = () => {
        setShowSaveMessage(false);
    };

    // Handle login action
    const handleLogin = () => {
        console.log('Login clicked');
        // Add your login logic here
        handleClose();
    };

    // Handle register action
    const handleRegister = () => {
        console.log('Register clicked');
        // Add your register logic here
        handleClose();
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
                <Box className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    {/* Header */}
                    <Box className="flex items-center justify-between p-6 border-b border-gray-100">
                        <Typography variant="h5" className="font-bold text-gray-800">
                            Please Sign In
                        </Typography>
                        <IconButton 
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                            size="small"
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Content */}
                    <Box className="p-6">
                        <Box className="flex items-center justify-center mb-6">
                            <Box className="bg-blue-50 p-4 rounded-full">
                                <AccountCircle className="text-blue-500" style={{ fontSize: 60 }} />
                            </Box>
                        </Box>
                        
                        <Typography variant="body1" className="text-center text-gray-600 mb-8">
                            To add items to your cart, please log in or create an account. 
                            This will allow you to save your cart and access it from any device.
                        </Typography>

                        {/* Save to browser option */}
                        <Box className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                            <Box className="flex items-center">
                                <Save className="text-gray-500 mr-3" />
                                <Box>
                                    <Typography variant="body2" className="font-medium text-gray-700">
                                        Remember my preference
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-500">
                                        {saveToBrowser 
                                            ? "Saved locally in your browser"
                                            : "Clear browsing data will remove this"
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant={saveToBrowser ? "contained" : "outlined"}
                                size="small"
                                onClick={handleSaveToBrowser}
                                className={`rounded-full ${saveToBrowser ? 'bg-green-500 hover:bg-green-600' : ''}`}
                            >
                                {saveToBrowser ? 'Saved' : 'Save'}
                            </Button>
                        </Box>

                        {/* Action Buttons */}
                        <Box className="flex flex-col space-y-4">
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleLogin}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-md"
                                startIcon={<AccountCircle />}
                            >
                                Log In to Your Account
                            </Button>
                            
                            <Button
                                variant="outlined"
                                fullWidth
                                size="large"
                                onClick={handleRegister}
                                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-xl font-semibold"
                                startIcon={<PersonAdd />}
                            >
                                Create New Account
                            </Button>
                        </Box>

                        {/* Footer note */}
                        <Typography variant="caption" className="text-center text-gray-500 block mt-6">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </Typography>
                    </Box>
                </Box>
            </Modal>

            {/* Save confirmation message */}
            <Snackbar 
                open={showSaveMessage} 
                autoHideDuration={4000} 
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseMessage} 
                    severity="info" 
                    className="w-full"
                >
                    Preference saved locally. Clear browser data to reset.
                </Alert>
            </Snackbar>
        </>
    );
});

export default ModelLogging;