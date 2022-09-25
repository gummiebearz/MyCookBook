const generatePrice = () => {
    const min = Math.ceil(5)
    const max = Math.ceil(20)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const handler = async (req, res) => {
    const rapidApiUrl = process.env.RAPID_API_URL_LOOKUP
    const rapidApiKey = process.env.RAPID_API_KEY
    const rapidApiHost = process.env.RAPID_API_HOST
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost
        }
    }

    const response = await fetch(
        `${rapidApiUrl}?i=${req.query.menuItem}`,
        options
    )
    const data = await response.json()
    const meal = {
        ...data?.meals[0],
        strPrice: generatePrice()
    }

    res.json(meal)
}

export default handler
