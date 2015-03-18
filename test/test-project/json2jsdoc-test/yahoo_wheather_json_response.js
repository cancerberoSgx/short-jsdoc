 /* @module json2jsdoc_test1 this is a test of the tool json2jsdoc that generates jsdoc from the response of the service 

https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys


@class WeatherQuery
@property {WeatherQuery_query} query
@class WeatherQuery_query
@property {Number} count
@property {String} created
@property {String} lang
@property {WeatherQuery_query_results} results
@class WeatherQuery_query_results
@property {WeatherQuery_query_results_channel} channel
@class WeatherQuery_query_results_channel
@property {String} title
@property {String} link
@property {String} description
@property {String} language
@property {String} lastBuildDate
@property {String} ttl
@property {WeatherQuery_query_results_channel_location} location
@class WeatherQuery_query_results_channel_location
@property {String} city
@property {String} country
@property {String} region
@class WeatherQuery_query_results_channel_location
@property {WeatherQuery_query_results_channel_units} units
@class WeatherQuery_query_results_channel_units
@property {String} distance
@property {String} pressure
@property {String} speed
@property {String} temperature
@class WeatherQuery_query_results_channel_units
@property {WeatherQuery_query_results_channel_wind} wind
@class WeatherQuery_query_results_channel_wind
@property {String} chill
@property {String} direction
@property {String} speed
@class WeatherQuery_query_results_channel_wind
@property {WeatherQuery_query_results_channel_atmosphere} atmosphere
@class WeatherQuery_query_results_channel_atmosphere
@property {String} humidity
@property {String} pressure
@property {String} rising
@property {String} visibility
@class WeatherQuery_query_results_channel_atmosphere
@property {WeatherQuery_query_results_channel_astronomy} astronomy
@class WeatherQuery_query_results_channel_astronomy
@property {String} sunrise
@property {String} sunset
@class WeatherQuery_query_results_channel_astronomy
@property {WeatherQuery_query_results_channel_image} image
@class WeatherQuery_query_results_channel_image
@property {String} title
@property {String} width
@property {String} height
@property {String} link
@property {String} url
@class WeatherQuery_query_results_channel_image
@property {WeatherQuery_query_results_channel_item} item
@class WeatherQuery_query_results_channel_item
@property {String} title
@property {String} lat
@property {String} long
@property {String} link
@property {String} pubDate
@property {WeatherQuery_query_results_channel_item_condition} condition
@class WeatherQuery_query_results_channel_item_condition
@property {String} code
@property {String} date
@property {String} temp
@property {String} text
@class WeatherQuery_query_results_channel_item_condition
@property {String} description
@property {Array<String>} forecast
@property {WeatherQuery_query_results_channel_item_guid} guid
@class WeatherQuery_query_results_channel_item_guid
@property {String} isPermaLink
@property {String} content
@class WeatherQuery_query_results_channel_item_guid
@class WeatherQuery_query_results_channel_item
@class WeatherQuery_query_results_channel
@class WeatherQuery_query_results
@class WeatherQuery_query
*/
