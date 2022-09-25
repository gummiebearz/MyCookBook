import '../styles/globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import theme from '../utils/theme'

import { CurrentUserProvider } from '../context/CurrentUserContext'
import { ShoppingProvider } from '../context/ShoppingContext'

function MyApp({ Component, pageProps }) {
    return (
        <CurrentUserProvider>
            <ShoppingProvider>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </ShoppingProvider>
        </CurrentUserProvider>
    )
}

export default MyApp
