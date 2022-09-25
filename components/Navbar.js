import { Box, Flex, Highlight, Avatar, Button } from '@chakra-ui/react'
import NavLink from 'next/link'
import React, { useContext } from 'react'
import { CurrentUserContext } from '../context/CurrentUserContext'

import { GoBook } from 'react-icons/go'

export default function Navbar() {
    const { user, isLoggedIn, handleLogout } = useContext(CurrentUserContext)

    return (
        <Box height='100%' p='5' bg='gray.50'>
            <Box maxW='6xl' mx='auto'>
                <Flex
                    as='nav'
                    aria-label='Site Navigation'
                    align='center'
                    justify='space-between'
                >
                    <NavLink href='/'>
                        <Button
                            leftIcon={<GoBook />}
                            size='xs'
                            fontSize='2xl'
                            variant='none'
                        >
                            <Highlight
                                query='MyCookBook'
                                styles={{
                                    px: '2',
                                    py: '1',
                                    rounded: 'full',
                                    bg: 'green.100'
                                }}
                            >
                                MyCookBook
                            </Highlight>
                        </Button>
                    </NavLink>
                    <Flex direction='row' gap='5' align='center'>
                        <NavLink
                            href={`${isLoggedIn ? '/profile' : '/signin'}`}
                        >
                            <Avatar
                                as='button'
                                name={user?.user_data?.username} // use as a fallback mechanism if url is broken
                                size='sm'
                                src={
                                    isLoggedIn
                                        ? user?.user_data?.avatar_url
                                        : ''
                                }
                            />
                        </NavLink>
                        <NavLink href='/about'>
                            <Button
                                outline='none'
                                variant='none'
                                size='xs'
                                fontSize='sm'
                            >
                                About Us
                            </Button>
                        </NavLink>
                        <NavLink href='/contact'>
                            <Button
                                outline='none'
                                variant='none'
                                size='xs'
                                fontSize='sm'
                            >
                                Contact
                            </Button>
                        </NavLink>
                        {isLoggedIn && (
                            <>
                                <NavLink href='/cart'>
                                    <Button
                                        outline='none'
                                        variant='none'
                                        size='xs'
                                        fontSize='sm'
                                    >
                                        Cart
                                    </Button>
                                </NavLink>
                                <Button
                                    onClick={handleLogout}
                                    outline='none'
                                    variant='none'
                                    size='xs'
                                    fontSize='sm'
                                >
                                    Sign Out
                                </Button>
                            </>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}
