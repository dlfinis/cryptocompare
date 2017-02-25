'use strict'
/* global fetch */

const baseUrl = 'https://min-api.cryptocompare.com/data/'

function fetchJSON (url) {
  return fetch(url)
    .then(res => res.json())
    .then(body => {
      if (body.Response === 'Error') throw body.Message
      return body
    })
}

function price (fsym, tsyms, tryConversion) {
  let url = `${baseUrl}price?fsym=${fsym}&tsyms=${tsyms}`
  if (tryConversion === false) url += '&tryConversion=false'
  return fetchJSON(url)
}

function priceMulti (fsyms, tsyms, tryConversion) {
  let url = `${baseUrl}pricemulti?fsyms=${fsyms}&tsyms=${tsyms}`
  if (tryConversion === false) url += '&tryConversion=false'
  return fetchJSON(url)
}

function priceFull (fsyms, tsyms, tryConversion) {
  let url = `${baseUrl}pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`
  if (tryConversion === false) url += '&tryConversion=false'
  // We want the RAW data, not the DISPLAY data:
  return fetchJSON(url).then(result => result.RAW)
}

function priceHistorical (fsym, tsyms, time, tryConversion) {
  if (!(time instanceof Date)) throw new Error('time parameter must be an instance of Date.')
  time = Math.floor(time.getTime() / 1000)
  let url = `${baseUrl}pricehistorical?fsym=${fsym}&tsyms=${tsyms}&ts=${time}`
  if (tryConversion === false) url += '&tryConversion=false'
  // The API returns json with an extra layer of nesting, so remove it
  return fetchJSON(url).then(result => result[fsym])
}

function topPairs (fsym, limit) {
  let url = `${baseUrl}top/pairs?fsym=${fsym}`
  if (limit) url += `&limit=${limit}`
  return fetchJSON(url).then(result => result.Data)
}

function topExchanges (fsym, tsym, limit) {
  let url = `${baseUrl}top/exchanges?fsym=${fsym}&tsym=${tsym}`
  if (limit) url += `&limit=${limit}`
  return fetchJSON(url).then(result => result.Data)
}

function histoDay (fsym, tsym, options) {
  options = options || {}
  if (options.timestamp) {
    if (!(options.timestamp instanceof Date)) throw new Error('options.timestamp must be an instance of Date.')
    options.timestamp = Math.floor(options.timestamp.getTime() / 1000)
  }
  let url = `${baseUrl}histoday?fsym=${fsym}&tsym=${tsym}`
  if (options.limit === 'none') url += '&allData=true'
  else if (options.limit) url += `&limit=${options.limit}`
  if (options.tryConversion === false) url += '&tryConversion=false'
  if (options.aggregate) url += `&aggregate=${options.aggregate}`
  if (options.timestamp) url += `&toTs=${options.timestamp}`
  return fetchJSON(url).then(result => result.Data)
}

module.exports = {
  price,
  priceMulti,
  priceFull,
  priceHistorical,
  topPairs,
  topExchanges,
  histoDay
}
