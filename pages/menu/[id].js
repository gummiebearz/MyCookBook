import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import {
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Image,
    Flex,
    List,
    ListItem,
    ListIcon,
    Spinner,
    Icon,
    Alert,
    AlertIcon,
    AlertTitle
} from '@chakra-ui/react'
import { Navbar } from '../../components'
import { MdCheckCircle } from 'react-icons/md'
import { BsBasket3 } from 'react-icons/bs'
import { GoBook } from 'react-icons/go'
import { FaCheck } from 'react-icons/fa'
import { useContext, useState } from 'react'
import { ShoppingContext } from '../../context/ShoppingContext'

const fetcher = async (url) => {
    const res = await fetch(url)
    const data = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }

    return data
}

export default function MenuItem() {
    const [addedSuccess, setAddedSuccess] = useState(false)
    const [errMsg, setErrMsg] = useState(null)

    const { addItemToCart } = useContext(ShoppingContext)
    const { query } = useRouter()
    const { data, error } = useSWR(
        () => query.id && `/api/menu/${query.id}`,
        fetcher
    )

    const addToCart = () => {
        try {
            const meal = {
                id: data.idMeal,
                name: data.strMeal,
                price: data.strPrice,
                quantity: 1
            }

            addItemToCart(meal)
            setTimeout(() => {
                setAddedSuccess(() => true)
            }, 500)
        } catch (error) {
            setErrMsg((prevState) => error.message)
            setTimeout(() => {
                setErrMsg(() => null)
            }, 2500)
        }
    }

    if (error) return <div>{error.message}</div>
    if (!data)
        return (
            <Flex
                justifyContent='center'
                alignItems='center'
                height='100%'
                width='100%'
                position='fixed'
            >
                <Spinner />
                &emsp;<Text>Loading Recipe...</Text>
            </Flex>
        )

    return (
        <Box>
            <Navbar />
            <Box minW='100vh' py='12' px={{ base: '4', lg: '8' }}>
                <Flex
                    mt='10'
                    direction={{ sm: 'column', md: 'column', lg: 'row' }}
                    justifyContent='center'
                    alignItems={{ sm: 'center', lg: 'normal' }}
                    mx='auto'
                    gap='100px'
                >
                    <Box>
                        <Image
                            src={data.strMealThumb}
                            alt={data.strMeal}
                            boxSize={{ sm: '300px', md: '500px', lg: '600px' }}
                            objectFit='contain'
                        />
                    </Box>
                    <Flex maxW='500px' wrap='wrap' direction='column' gap='3'>
                        <Heading>{data.strMeal}</Heading>
                        <Flex
                            direction={{ sm: 'column', md: 'row' }}
                            wrap='wrap'
                            gap={{ sm: '5', md: '10' }}
                        >
                            <Heading size='sm'>
                                Category: {data.strCategory}
                            </Heading>
                            <Heading size='sm'>
                                Tags: {data.strTags ? data.strTags : 'N/A'}
                            </Heading>
                        </Flex>
                        <Heading size='sm'>
                            Drink:{' '}
                            {data.strDrinkAlternate
                                ? data.strDrinkAlternate
                                : 'N/A'}
                        </Heading>
                        <Stack mt='10' spacing={3}>
                            <Text>What's included in the recipe?</Text>
                            <List spacing={2}>
                                <ListItem>
                                    <ListIcon
                                        as={MdCheckCircle}
                                        color='green.500'
                                    />
                                    Detail instructions
                                </ListItem>
                                <ListItem>
                                    <ListIcon
                                        as={MdCheckCircle}
                                        color='green.500'
                                    />
                                    Cooking guide video
                                </ListItem>
                                <ListItem>
                                    <ListIcon
                                        as={MdCheckCircle}
                                        color='green.500'
                                    />
                                    List of SECRET ingredients!
                                </ListItem>
                            </List>
                            <Flex pt='5'>
                                <Button
                                    leftIcon={
                                        !addedSuccess ? <BsBasket3 /> : <></>
                                    }
                                    color='green.500'
                                    variant='solid'
                                    onClick={() => addToCart()}
                                    disabled={addedSuccess}
                                >
                                    {!addedSuccess ? (
                                        <>&nbsp; Add To Cart</>
                                    ) : (
                                        <Icon as={FaCheck} />
                                    )}
                                </Button>
                                &nbsp;
                                <Link href='/'>
                                    <Button
                                        leftIcon={<GoBook />}
                                        color='green.500'
                                        variant='outline'
                                    >
                                        &nbsp; View CookBook
                                    </Button>
                                </Link>
                            </Flex>
                            {errMsg && (
                                <Alert status='error'>
                                    <AlertIcon />
                                    <AlertTitle>{errMsg}</AlertTitle>
                                </Alert>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}
