'use strict'
/**
 * @brief Convert a mode instance into data structure used for indexing.
 *
 * @param indexUid - This is will equal to model's name
 * @param data {Array|Object} - The data to convert. Conversion will use
 * the static method `toSearchIndex` defined in the model definition
 *
 * @return {Array|Object} - Converted or mapped data
 */
function transformEntries(collection, data) {
  console.log({ collection, data })
  const model = strapi.models[collection]
  const mapFunction = model.toSearchIndex
  if (!(mapFunction instanceof Function)) {
    return data
  }
  if (Array.isArray(data)) {
    data.map(mapFunction)
    return data.map(mapFunction)
  }
  return mapFunction(data)
}

/**
 * @param  {string} collection - Name of the collection
 */
function isCollectionACompositeIndex(collection) {
  const model = strapi.models[collection]
  // console.log('col', strapi.models[collection])
  const isCompositeIndex = !!model.isUsingCompositeIndex
  return isCompositeIndex
}

async function numberOfRowsInCollection(collection) {
  return (
    strapi.services[collection].count && strapi.services[collection].count()
  )
}

function getMultiEntriesCollections() {
  const services = strapi.services
  return Object.keys(services).filter(type => {
    return services[type].count
  })
}

async function fetchRowBatch({ start, limit, collection }) {
  return await strapi.services[collection].find({
    _limit: limit,
    _start: start,
  })
}

module.exports = {
  fetchRowBatch,
  transformEntries,
  isCollectionACompositeIndex,
  numberOfRowsInCollection,
  getMultiEntriesCollections,
}
