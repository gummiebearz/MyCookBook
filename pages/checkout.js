import { useRouter } from 'next/router'
import { Heading, Button, Icon, Flex, Highlight, Text } from '@chakra-ui/react'
import { GiSadCrab } from 'react-icons/gi'
import { IoBagCheckOutline } from 'react-icons/io5'
import { GoBook } from 'react-icons/go'
import { BiHappyHeartEyes } from 'react-icons/bi'
import { useContext } from 'react'
import { ShoppingContext } from '../context/ShoppingContext'

export default function CheckoutMsg() {
    const router = useRouter()
    const { query } = router

    const { clearCart } = useContext(ShoppingContext)

    if (query.canceled) {
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
                <Heading lineHeight='tall'>
                    <Highlight
                        query='transaction failed'
                        styles={{
                            px: '2',
                            py: '1',
                            rounded: 'full',
                            bg: 'red.100'
                        }}
                    >
                        Oops, transaction failed.
                    </Highlight>
                </Heading>
                <Flex>
                    <Button
                        leftIcon={<IoBagCheckOutline />}
                        variant='outline'
                        colorScheme='red'
                        onClick={() => router.push('/cart')}
                    >
                        Checkout again
                    </Button>
                    &nbsp;
                    <Button
                        leftIcon={<GoBook />}
                        variant='outline'
                        colorScheme='green'
                        onClick={() => router.push('/')}
                    >
                        View CookBook
                    </Button>
                </Flex>
            </Flex>
        )
    }

    if (query.success) {
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
                <Icon as={BiHappyHeartEyes} boxSize={100} />
                <Heading lineHeight='tall'>
                    <Highlight
                        query='transaction completed'
                        styles={{
                            px: '2',
                            py: '1',
                            rounded: 'full',
                            bg: 'green.100'
                        }}
                    >
                        Yay, transaction completed.
                    </Highlight>
                </Heading>
                <Heading size='md'>
                    <Highlight
                        query='email'
                        styles={{
                            px: '2',
                            py: '1',
                            rounded: 'full',
                            bg: 'green.100'
                        }}
                    >
                        Please check your email for confirmation!
                    </Highlight>
                </Heading>
                <Text textAlign='center'>
                    We look forward to seeing you again!
                </Text>
                <Button
                    leftIcon={<GoBook />}
                    variant='outline'
                    colorScheme='green'
                    onClick={() => {
                        clearCart()
                        router.push('/')
                    }}
                >
                    View CookBook
                </Button>
            </Flex>
        )
    }
}
