const axios = require('axios');
const cheerio = require('cheerio');

exports.getHTML = async (url) => {
    const { data } = await axios.get(url)
    return data
}

exports.getNews = async (html) => {
    const article = []
    const $ = cheerio.load(html)
    await $('.teaser', html).each((index, element) => {
        const title = $(element).children('.headline').text()
        // console.log(title)
        article.push(title)
    })
    return article
}
