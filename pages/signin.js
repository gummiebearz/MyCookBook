import {
    Alert,
    AlertIcon,
    Box,
    Button,
    chakra,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    IconButton,
    Flex
} from '@chakra-ui/react'
import { useState, useContext } from 'react'
import { CurrentUserContext } from '../context/CurrentUserContext'
import { FcGoogle } from 'react-icons/fc'

export default function SignIn() {
    const { handleLoginOAuth, handleLoginMagicLink } =
        useContext(CurrentUserContext)

    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState(null)

    const handleFormSubmission = async (event) => {
        event.preventDefault()
        setIsLoading((prevState) => true)
        setError((prevState) => null)

        try {
            await handleLoginMagicLink({ email })
            setIsSubmitted((prevState) => true)
        } catch (error) {
            setError((prevState) => error)
        } finally {
            setIsLoading((prevState) => false)
            setError((prevState) => null)
        }
    }

    const handleOAuth = async () => {
        try {
            await handleLoginOAuth({ provider: 'google' })
        } catch (error) {
            setError((prevState) => error)
        } finally {
            setError((prevState) => null)
        }
    }

    return (
        <Box minW='100vh' py='12' px={{ base: '4', lg: '8' }}>
            <Box maxW='md' mx='auto'>
                <Heading textAlign='center' m='6'>
                    Authentication
                </Heading>
                {error && (
                    <Alert status='error' mb='6'>
                        <AlertIcon />
                        <Text textAlign='center'>{error}</Text>
                    </Alert>
                )}
                <Box
                    py='8'
                    px={{ base: '4', md: '10' }}
                    shadow='base'
                    rounded={{ sm: 'lg' }}
                    bg='white'
                >
                    {isSubmitted ? (
                        <Heading size='md' textAlign='center' color='gray.600'>
                            Please check {email} for login link
                        </Heading>
                    ) : (
                        <chakra.form onSubmit={handleFormSubmission}>
                            <Stack spacing={6}>
                                <FormControl id='email'>
                                    <FormLabel>Email address</FormLabel>
                                    <Input
                                        name='email'
                                        type='email'
                                        autoComplete='email'
                                        required
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                (prevState) =>
                                                    event.target.value
                                            )
                                        }
                                    />
                                </FormControl>
                                <Button
                                    type='submit'
                                    colorScheme='teal'
                                    size='md'
                                    fontSize='md'
                                    isLoading={isLoading}
                                >
                                    Sign in
                                </Button>
                                <Flex
                                    direction='row'
                                    alignItems='center'
                                    gap='3'
                                >
                                    <Text>Or sign in with:</Text>
                                    <IconButton
                                        aria-label='Google OAuth'
                                        icon={<FcGoogle />}
                                        onClick={() => handleOAuth()}
                                    />
                                </Flex>
                            </Stack>
                        </chakra.form>
                    )}
                </Box>
                <Box mt='5'>
                    <div>
                        <small>
                            We verify your email every time you log in to
                            prevent data being tampered or stolen. We will send
                            you a confirmation email when you first sign in
                            using your email.
                        </small>
                    </div>
                    <div>
                        <small>
                            Or, you can sign in with third-party providers. We
                            currently support Google authentication.
                        </small>
                    </div>
                </Box>
            </Box>
        </Box>
    )
}
