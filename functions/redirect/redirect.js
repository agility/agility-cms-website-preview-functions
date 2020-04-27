// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
	const previewQuery = event.queryStringParameters.agilitypreviewkey
	const channelID = event.queryStringParameters.AgilityChannelID
	const lang = event.queryStringParameters.lang

	const path = event.path.substring ("/.netlify/functions/redirect".length)

	const baseURL = "https://agilitycms-uat.azurewebsites.net"
	const gatsbyURL = "https://agility-website-gatsby-1445577254.gtsb.io"


	//if not Gatsby
	let redirectUrl = `${baseURL}${path}?agilitypreviewkey=${ encodeURIComponent(previewQuery) }`

	if (
		path === "/home"
		|| path.indexOf("/product/pricing") != -1
      || path.indexOf("/partners/become-a-partner") != -1
      || path.indexOf("/contact-us/chat-sales") != -1

      || path.indexOf("/resources/posts") != -1
      || path.indexOf("/resources/events") != -1
      || path.indexOf("/resources/agileliving") != -1

      || path === "/community"
      || path === "/community/"
      || path.indexOf("/community/events") != -1
      || path.indexOf("/community/agileliving") != -1

      //footer links
      || path.indexOf("/privacy-policy") != -1
      || path.indexOf("/customer-agreement") != -1
      || path.indexOf("/service-level-agreement") != -1
      || path.indexOf("/gdpr") != -1
	  || path.indexOf("/security") != -1

	  //landing page
      || path.indexOf("/try-agility-headless-cms-lp") != -1
	)  {
		redirectUrl = `${gatsbyURL}${path}`
	}


	//https://agilitycms-preview.netlify.app/.netlify/functions/redirect/home?AgilityChannelID=1&lang=en-ca&agilitypreviewkey=%2b8njrinSYiOFEXvr1SdYXZ8B4P8WNLaRwQojpCY%2beeJP4U2OZlBUWyQADkWl22ipb%2bavkFT%2fkQE95I0cDRB%2f5Q%3d%3d&agilityts=20200427112306
	//https://agilitycms-preview.netlify.app/.netlify/functions/redirect/partners?AgilityChannelID=1&lang=en-ca&agilitypreviewkey=%2b8njrinSYiOFEXvr1SdYXZ8B4P8WNLaRwQojpCY%2beeJP4U2OZlBUWyQADkWl22ipb%2bavkFT%2fkQE95I0cDRB%2f5Q%3d%3d&agilityts=20200427112123
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
