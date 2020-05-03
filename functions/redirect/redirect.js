// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
	try {
		const AgilityPreview = event.queryStringParameters.AgilityPreview
		const previewQuery = event.queryStringParameters.agilitypreviewkey
		const channelID = event.queryStringParameters.AgilityChannelID
		const lang = event.queryStringParameters.lang
		const ContentID = event.queryStringParameters.ContentID;

		const path = event.path.substring("/.netlify/functions/redirect".length)

		const baseURL = "https://agilitycms-uat.azurewebsites.net"
		const gatsbyURL = "https://agility-website-gatsby-1445577254.gtsb.io"



		//if not Gatsby
		let redirectUrl = `${baseURL}${path}?agilitypreviewkey=${encodeURIComponent(previewQuery)}`

		//gatsby
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
		) {
			redirectUrl = `${gatsbyURL}${path}`

			//include the contentid for detail previews...
			if (ContentID > 0) {
				redirectUrl = `${redirectUrl}?ContentID=${ContentID}`
			}
		}


		//LIVE MODE
		if (AgilityPreview == "0") {
			redirectUrl = `https://agilitycms.com${path}`
		}


		return {
			statusCode: 302,
			body: `Redirect to ${redirectUrl}`,

			headers: { "location": redirectUrl },
			// isBase64Encoded: true,
		}
	} catch (err) {
		return { statusCode: 500, body: err.toString() }
	}
}
