// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
	const previewQuery = event.queryStringParameters.agilitypreview
	const channelID = event.queryStringParameters.AgilityChannelID
	const lang = event.queryStringParameters.lang

	const path = event.path.substring ("/.netlify/functions/redirect".length)

	const baseURL = "https://agilitycms-uat.azurewebsites.net"
	const gatsbyURL = "https://agility-website-gatsby-1445577254.gtsb.io"

	let redirectUrl = "";

	//if not Gatsby
	redirectUrl = `${baseURL}${path}?agilitypreviewkey=${ encodeURIComponent(previewQuery) }`


	//https://agilitycms-preview.netlify.app/.netlify/functions/redirect/product/why-agility?AgilityChannelID=1&lang=en-ca&agilitypreviewkey=%2b8njrinSYiOFEXvr1SdYXZ8B4P8WNLaRwQojpCY%2beeJP4U2OZlBUWyQADkWl22ipb%2bavkFT%2fkQE95I0cDRB%2f5Q%3d%3d&agilityts=20200427111501
    return {
      statusCode: 302,
      body: `Redirect to ${redirectUrl}`,
      // // more keys you can return:
    headers: { "location": redirectUrl},
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
