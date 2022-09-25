import {
    Input,
    FormControl,
    FormLabel,
    Button,
    Box,
    Alert,
    AlertIcon,
    Text,
    Flex,
    Avatar,
    Stack,
    Image,
    useDisclosure,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialog
} from '@chakra-ui/react'
import { CurrentUserContext } from '../context/CurrentUserContext'
import { useState, useRef, useContext, createRef } from 'react'
import { Navbar } from '../components'

export default function Profile() {
    const {
        user,
        isLoggedIn,
        handleUpdateAvatarUrl,
        handleUpdateUsername,
        deleteUser
    } = useContext(CurrentUserContext)

    // Clear items button
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onClose: onCloseDelete
    } = useDisclosure()
    const cancelRefClearCart = useRef()

    const [username, setUsername] = useState(
        isLoggedIn ? user?.user_data?.username : ''
    )

    const [error, setError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleFile = async (event) => {
        try {
            setIsUploading((prevState) => true)
            await handleUpdateAvatarUrl(event.target.files[0])
        } catch (error) {
            setIsUploading((prevState) => false)
            setError((prevState) => error)
        } finally {
            setIsUploading((prevState) => false)
            setError((prevState) => null)
        }
    }

    const handleUpdateUser = async (event) => {
        event.preventDefault()

        try {
            setIsLoading((prevState) => true)
            await handleUpdateUsername(username)
        } catch (error) {
            setIsLoading((prevState) => false)
            setError((prevState) => error)
        } finally {
            setIsLoading((prevState) => false)
            setError((prevState) => null)
        }
    }

    return (
        <Box>
            <Navbar />
            <Box mt='20' maxW='xl' mx='auto'>
                <Flex align='center' justify='center' direction='column'>
                    {user && (
                        <Image
                            src={user?.user_data?.avatar_url}
                            objectFit='cover'
                            alt={user?.user_data?.username}
                            boxSize='200px'
                            borderRadius='full'
                        />
                    )}
                    <FormControl id='avatar-file'>
                        <FormLabel
                            htmlFor='avatar-file'
                            my='5'
                            borderRadius='2xl'
                            borderWidth='1px'
                            textAlign='center'
                            py='1'
                            px='5'
                            size='sm'
                            fontSize='sm'
                            shadow='base'
                        >
                            {isUploading
                                ? 'Uploading...'
                                : 'Upload Your Profile Picture'}
                        </FormLabel>
                        <Input
                            type='file'
                            hidden
                            id='avatar-file'
                            multiple={false}
                            disabled={isUploading}
                            onChange={handleFile}
                            accept='image/png, image/jpeg'
                        />
                    </FormControl>
                    {error && (
                        <Alert status='error' mb='6'>
                            <AlertIcon />
                            <Text textAlign='center'>{error}</Text>
                        </Alert>
                    )}
                </Flex>
                <Stack
                    borderWidth='1px'
                    borderRadius='lg'
                    overflow='hidden'
                    p={5}
                    mt='5'
                    spacing='4'
                    as='form'
                    onSubmit={handleUpdateUser}
                >
                    <FormControl id='email' isRequired isReadOnly>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type='email'
                            value={isLoggedIn ? user?.user_data?.email : ''}
                            isDisabled={true}
                        />
                    </FormControl>
                    <FormControl id='username' isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder='Add your username here'
                            type='text'
                            value={username}
                            onChange={(event) =>
                                setUsername((prevState) => event.target.value)
                            }
                        />
                    </FormControl>
                    <Box pt='2' textAlign='right'>
                        <Button
                            variant='outline'
                            colorScheme='red'
                            onClick={onOpenDelete}
                        >
                            Delete Account
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
                                        Delete Your Account
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
                                            onClick={() => deleteUser()}
                                            ml={3}
                                        >
                                            Delete
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                        &nbsp;
                        <Button
                            colorScheme='teal'
                            type='submit'
                            isLoading={isLoading}
                        >
                            Update
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}
