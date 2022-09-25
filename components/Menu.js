import Link from 'next/link'
import { Box, Flex, Spinner, Text, Image, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function Menu() {
    const [menu, setMenu] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCat, setSelectedCat] = useState('')

    useEffect(() => {
        const loadMenu = async () => {
            const resCat = await fetch('/api/menu/categories')
            const { data: categoriesData } = await resCat.json()
            setCategories((prevState) => [...prevState, ...categoriesData])
            setSelectedCat(() => categoriesData[0].strCategory)

            const resMenu = await fetch(
                `/api/menu/getMenu?category=${categoriesData[0].strCategory}`
            )
            const { data: menuData } = await resMenu.json()
            setMenu((prevState) => [...prevState, ...menuData])
        }

        loadMenu()

        return () => {
            setMenu(() => [])
            setCategories(() => [])
            setSelectedCat(() => '')
        }
    }, [])

    const selectCategory = async (cat) => {
        setSelectedCat((prevState) => cat)
        const resMenu = await fetch(`/api/menu/getMenu?category=${cat}`)
        const { data: menuData } = await resMenu.json()
        setMenu((prevState) => [...menuData])
    }

    return (
        <Box
            minW='100vh'
            mx='auto'
            bg='gray.100'
            py='12'
            px={{ base: '4', lg: '8' }}
        >
            <Flex direction='column' gap='5'>
                <Flex
                    direction={{ sm: 'column', md: 'row', lg: 'row' }}
                    gap='3'
                    alignItems='center'
                    justifyContent='center'
                    wrap={{ sm: 'wrap', md: 'wrap', lg: 'nowrap' }}
                >
                    {categories &&
                        categories.map((cat, index) => (
                            <Button
                                colorScheme='green'
                                variant={
                                    selectedCat === cat.strCategory
                                        ? 'solid'
                                        : 'none'
                                }
                                key={index}
                                onClick={() => selectCategory(cat.strCategory)}
                            >
                                {cat.strCategory}
                            </Button>
                        ))}
                </Flex>
                {!menu.length ? (
                    <Flex
                        justifyContent='center'
                        alignItems='center'
                        height='100%'
                        width='100%'
                        position='fixed'
                    >
                        <Spinner />
                        &emsp;<Text>Loading Recipes...</Text>
                    </Flex>
                ) : (
                    <Flex
                        justifyContent='center'
                        alignItems='center'
                        gap={{ base: '10px', lg: '30px' }}
                        wrap='wrap'
                        direction={{ sm: 'column', md: 'row' }}
                    >
                        {menu.map((m, index) => (
                            <Link
                                key={index}
                                href={{
                                    pathname: '/menu/[id]',
                                    query: { id: m.idMeal }
                                }}
                            >
                                <a>
                                    <Box
                                        key={index}
                                        maxW='sm'
                                        borderWidth='1px'
                                        borderRadius='lg'
                                        overflow='hidden'
                                        boxShadow='lg'
                                        bg='white'
                                    >
                                        <Box boxSize='xs'>
                                            <Image
                                                src={m.strMealThumb}
                                                alt={m.strMeal}
                                                objectFit='cover'
                                            />
                                        </Box>
                                        <Box p='6'>
                                            <Text textAlign='center'>
                                                {m.strMeal}
                                            </Text>
                                        </Box>
                                    </Box>
                                </a>
                            </Link>
                        ))}
                    </Flex>
                )}
            </Flex>
        </Box>
    )
}
