import { useState, createContext, useEffect } from 'react'
import { supabaseClient } from '../utils/supabase'
import { useRouter } from 'next/router'

export const CurrentUserContext = createContext()
export const CurrentUserProvider = ({ children }) => {
    const router = useRouter()

    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        console.log('Second effect')
        const getCurrentUser = async () => {
            try {
                const {
                    data: { session },
                    error: sessionError
                } = await supabaseClient.auth.getSession()

                if (!session) {
                    setIsLoggedIn((prevState) => false)
                    setUser((prevState) => null)
                    throw 'User is not logged in'
                }

                const {
                    data: { user }
                } = await supabaseClient.auth.getUser(session?.access_token)

                if (!user) {
                    router.push('/')
                }

                setUser((prevState) => ({
                    ...prevState,
                    session: { ...session },
                    user_data: {
                        id: user?.id ? user?.id : session.user.id,
                        username: user?.username
                            ? user.username
                            : session?.user?.user_metadata?.name,
                        email: session?.user?.email,
                        avatar_url: user?.avatarurl
                            ? user?.avatarurl
                            : session?.user?.user_metadata?.avatar_url
                    }
                }))

                setIsLoggedIn((prevState) => true)

                if (router.pathname === '/signin') {
                    router.push('/')
                }

                setTimeout(() => {
                    setIsLoggedIn((prevState) => false)
                    setUser((prevState) => null)
                    removeTokenFromStorage()

                    if (router.pathname !== '/') {
                        router.push('/')
                    }
                }, session.expires_in * 1000)
            } catch (error) {
                console.log('Error getting current user: ', error)
            }
        }

        getCurrentUser()

        return () => {
            setIsLoggedIn((prevState) => false)
            setUser((prevState) => null)
        }
    }, [router, router.pathname])

    // useEffect(() => {
    //     console.log('First effect')
    //     const { data: authListener } = supabaseClient.auth.onAuthStateChange(
    //         async (event, session) => {
    //             switch (event) {
    //                 case 'SIGNED_IN':
    //                     setIsLoggedIn((prevState) => true)

    //                     await supabaseClient
    //                         .from('profiles')
    //                         .upsert({ id: session.user.id })

    //                     const { data, error } = await supabaseClient
    //                         .from('profiles')
    //                         .select('*')
    //                         .eq('id', session?.user?.id)
    //                         .single()

    //                     if (error) throw error

    //                     setUser((prevState) => ({
    //                         ...prevState,
    //                         session: { ...session },
    //                         user_data: {
    //                             id: data?.id ? data?.id : session.user.id,
    //                             username: data?.username
    //                                 ? data.username
    //                                 : session.user.user_metadata?.name,
    //                             email: session.user.email,
    //                             avatar_url: data?.avatarurl
    //                                 ? data?.avatarurl
    //                                 : session.user.user_metadata?.avatar_url
    //                         }
    //                     }))

    //                     if (!user) {
    //                         router.push('/')
    //                     }

    //                     break

    //                 case 'SIGNED_OUT':
    //                     setIsLoggedIn((prevState) => false)
    //                     setUser((prevState) => null)
    //                     removeTokenFromStorage()
    //                     if (router.pathname !== '/') {
    //                         router.push('/')
    //                     }

    //                     break
    //             }
    //         }
    //     )

    //     return () => {
    //         authListener?.subscription.unsubscribe()
    //         setIsLoggedIn((prevState) => false)
    //         setUser((prevState) => null)
    //     }
    // }, [router, router.pathname])

    // This effect is to check for unauthorized/ unauthenticated access to secure routes
    useEffect(() => {
        if (!isLoggedIn) {
            if (
                router.pathname === '/cart' ||
                router.pathname.startsWith('/checkout')
            )
                router.push('/')
        }
    }, [router, router.pathname])

    /** Log in via MagicLink
     * @param email user email
     */
    const handleLoginMagicLink = async ({ email }) => {
        const { error } = await supabaseClient.auth.signInWithOtp({ email })
        if (error) throw error
    }

    /** Log in via 3rd-party OAuth
     * @param provider 3rd-party provider (i.e, Google, Facebook)
     */
    const handleLoginOAuth = async ({ provider }) => {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider
        })
        if (error) throw error
    }

    /** Log user out and remove current session */
    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut()
        if (error) throw error

        setIsLoggedIn((prevState) => false)
        setUser((prevState) => null)
        removeTokenFromStorage()

        router.push('/')
    }

    /** Delete user account */
    const deleteUser = async () => {
        const { data, error } = await supabaseClient
            .from('profiles')
            .delete()
            .match({ id: user.user_data.id })

        if (error) throw Error(error)

        handleLogout()
    }

    /** Update user's avatar url */
    const handleUpdateAvatarUrl = async (avtFile) => {
        const avatarFile = avtFile
        const filename = generateId(10)

        const { data, error } = await supabaseClient.storage
            .from('avatars')
            .upload(filename, avatarFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) throw error

        const {
            data: { publicUrl }
        } = supabaseClient.storage.from('avatars').getPublicUrl(data?.path)

        await supabaseClient
            .from('profiles')
            .update({ avatarurl: publicUrl })
            .eq('id', user?.user_data?.id)

        setUser((prevState) => ({
            ...prevState,
            user_data: { ...prevState.user_data, avatar_url: publicUrl }
        }))
    }

    /** Update user's username */
    const handleUpdateUsername = async (username) => {
        const { error } = await supabaseClient
            .from('profiles')
            .update({ username })
            .eq('id', user?.user_data?.id)

        if (error) throw error

        setUser((prevState) => ({
            ...prevState,
            user_data: { ...prevState.user_data, username }
        }))
    }

    return (
        <CurrentUserContext.Provider
            value={{
                user,
                isLoggedIn,
                handleLoginMagicLink,
                handleLoginOAuth,
                handleLogout,
                deleteUser,
                handleUpdateAvatarUrl,
                handleUpdateUsername
            }}
        >
            {children}
        </CurrentUserContext.Provider>
    )
}

/**
 * Generate image id for Supabase
 * @param {int} imgLen
 * @returns
 */
const generateId = (imgLen) => {
    let result = ''

    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < imgLen; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }

    return result
}

/**
 * Remove user token from storage
 */
const removeTokenFromStorage = () => {
    // Retrieve the authentication session stored in localStorage
    let storageToken = Object.entries(localStorage)
        .map((entry) => entry[0])
        .filter(
            (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
        )[0]

    if (storageToken) localStorage.removeItem(storageToken)
}
