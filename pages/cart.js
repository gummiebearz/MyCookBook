import Link from 'next/link'
import { useContext, useRef } from 'react'
import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Icon,
    Button,
    IconButton,
    Alert,
    AlertIcon,
    useDisclosure,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialog
} from '@chakra-ui/react'
import { Navbar } from '../components'

import { ShoppingContext } from '../context/ShoppingContext'

import { GiSadCrab } from 'react-icons/gi'
import { BiTrash } from 'react-icons/bi'
import { GoBook } from 'react-icons/go'

export default function Cart() {
    const { cart, removeItemFromCart, clearCart, createCheckoutSession } =
        useContext(ShoppingContext)

    // Checkout button
    const {
        isOpen: isOpenCheckout,
        onOpen: onOpenCheckout,
        onClose: onCloseCheckout
    } = useDisclosure()

    // Clear items button
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onClose: onCloseDelete
    } = useDisclosure()

    const cancelRefCheckout = useRef()
    const cancelRefClearCart = useRef()

    const calculateSubTotal = () => {
        let subTotal = 0
        if (cart.length) {
            subTotal = cart
                .map((item) => item.price)
                .reduce((prevSum, currentPrice) => prevSum + currentPrice)
        }

        return subTotal
    }

    if (!cart.length)
        return (
            <Flex
                justifyContent='center'
                alignItems='center'
                direction='column'
                gap='3'
                height='100%'
                width='100%'
                position='fixed'
            >
                <Icon as={GiSadCrab} boxSize={100} />
                <Heading>Cart Empty</Heading>
                <Link href='/'>
                    <a>
                        <Button variant='link' colorScheme='green'>
                            Check our CookBook!
                        </Button>
                    </a>
                </Link>
            </Flex>
        )

    return (
        <Box>
            <Navbar />
            <Box
                py='12'
                minW='100vh'
                mx={{ base: '50px', sm: '50px', md: '50px', lg: '150px' }}
            >
                <Box
                    my='10'
                    textAlign={{ sm: 'center', md: 'center', lg: 'left' }}
                >
                    <Link href='/'>
                        <Button
                            leftIcon={<GoBook />}
                            color='green.500'
                            variant='link'
                        >
                            &nbsp; View CookBook
                        </Button>
                    </Link>
                </Box>
                <Heading textAlign={{ sm: 'center', md: 'center', lg: 'left' }}>
                    Your Cart
                </Heading>
                <Flex
                    mt='20px'
                    direction={{
                        base: 'column',
                        sm: 'column-reverse',
                        md: 'column-reverse',
                        lg: 'row'
                    }}
                    wrap='wrap'
                    justifyContent='space-between'
                    alignItems={{ sm: 'center', md: 'center', lg: 'baseline' }}
                    gap={{ sm: '50px', md: '50px', lg: '20px' }}
                >
                    <Stack direction='column' spacing='10px'>
                        {cart.map((item, index) => (
                            <Flex
                                key={index}
                                direction='row'
                                alignItems='center'
                                gap='5'
                            >
                                <IconButton
                                    aria-label='Remove from cart'
                                    colorScheme='red'
                                    icon={<BiTrash />}
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => removeItemFromCart(item.id)}
                                />
                                <Heading size='sm'>{item.name}</Heading>-
                                <Text>${item.price.toFixed(2)}</Text>
                            </Flex>
                        ))}
                    </Stack>

                    <Flex
                        direction='column'
                        gap='20px'
                        alignItems={{
                            sm: 'center',
                            md: 'center',
                            lg: 'flex-end'
                        }}
                    >
                        <Stack bg='green.100' px='30' py='5' border='1px'>
                            <Stack
                                direction='row'
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Heading size='sm'>Total Recipes: </Heading>
                                <Text>{cart.length}</Text>
                            </Stack>
                            <Stack
                                direction='row'
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Heading size='sm'>Subtotal: </Heading>
                                <Text>${calculateSubTotal().toFixed(2)}</Text>
                            </Stack>
                            <Stack
                                direction='row'
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Heading size='sm'>Taxes: </Heading>
                                <Text>Applicable taxes may apply</Text>
                            </Stack>
                            <Alert status='warning' variant='left-accent'>
                                <AlertIcon />
                                Please note that prices are displayed in CAD.
                            </Alert>
                        </Stack>

                        <Flex direction='row' alignItems='center' gap='2'>
                            <Button
                                variant='outline'
                                colorScheme='red'
                                onClick={onOpenDelete}
                            >
                                Empty Cart
                            </Button>
                            <AlertDialog
                                isOpen={isOpenDelete}
                                leastDestructiveRef={cancelRefClearCart}
                                onClose={onCloseDelete}
                                motionPreset='slideInBottom'
                                isCentered
                            >
                                <AlertDialogOverlay>
                                    <AlertDialogContent>
                                        <AlertDialogHeader
                                            fontSize='lg'
                                            fontWeight='bold'
                                        >
                                            Clear All Items
                                        </AlertDialogHeader>

                                        <AlertDialogBody>
                                            Are you sure? This action cannot be
                                            reversed.
                                        </AlertDialogBody>

                                        <AlertDialogFooter>
                                            <Button
                                                ref={cancelRefClearCart}
                                                onClick={onCloseDelete}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                colorScheme='red'
                                                onClick={() => clearCart()}
                                                ml={3}
                                            >
                                                Empty
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>

                            <Button
                                variant='outline'
                                colorScheme='green'
                                onClick={onOpenCheckout}
                            >
                                Checkout
                            </Button>
                            <AlertDialog
                                isOpen={isOpenCheckout}
                                leastDestructiveRef={cancelRefCheckout}
                                onClose={onCloseCheckout}
                                motionPreset='slideInBottom'
                                isCentered
                            >
                                <AlertDialogOverlay>
                                    <AlertDialogContent>
                                        <AlertDialogHeader
                                            fontSize='lg'
                                            fontWeight='bold'
                                        >
                                            Checkout Your Items
                                        </AlertDialogHeader>

                                        <AlertDialogBody>
                                            Want to checkout? Or shop a little
                                            more?
                                        </AlertDialogBody>

                                        <AlertDialogFooter>
                                            <Button
                                                ref={cancelRefCheckout}
                                                onClick={onCloseCheckout}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                colorScheme='green'
                                                onClick={() =>
                                                    createCheckoutSession()
                                                }
                                                ml={3}
                                            >
                                                Checkout
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}
