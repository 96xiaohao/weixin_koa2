const request = require('request')
const R = require('ramda')

const http = ({ method = 'GET', url, body = {}, headers = {} }) => {
    headers = R.merge({ 'content-type': 'application/json' }, headers)
    // if (method.toUpperCase() === 'GET') {
    //     headers['Transfer-Encoding'] = 'chunked'
    // }
    const options = {
        method,
        url,
        headers,
        json: true
    }
    if (method.toUpperCase() !== 'GET') {
        options.body = body
    }
    return new Promise((resolve, reject) => {
        request(options, (err, response, resBody) => {
            if (err || response.statusCode >= 300) return reject(JSON.stringify(err || response.body))
            resolve({
                code: response.statusCode,
                body: ((result) => {                    
                    try {
                        result = JSON.parse(result)
                    } catch (e) {}
                    return result
                })(resBody)
            })
        })
    })
}

module.exports = http