export default async function handler(req, res) {
    const rapidApiUrl = process.env.RAPID_API_URL_CATEGORY
    const rapidApiKey = process.env.RAPID_API_KEY
    const rapidApiHost = process.env.RAPID_API_HOST
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost
        }
    }

    const response = await fetch(`${rapidApiUrl}`, options)
    const data = await response.json()

    res.send({ data: data?.categories })
}
