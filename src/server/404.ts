const render404Page = (appConstant: any, error: any = null, statusCode = 500): string => `
      <!DOCTYPE html>
      <html itemscope itemtype="http://schema.org/WebPage" lang="en">

      <head>
          <title>Fastify | Not Found Page</title>
          <meta name="robots" content="noindex, follow">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <style>

      body {
          padding: 0;
          margin: 0;
          font-family: "futura-medium";
          font-weight: normal;
          line-height: 1.5;
          color: #0a0a0a;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
      }

      body {
          overflow-x: hidden;
      }

      body::-webkit-scrollbar {
          width: 6px;
      }

      body::-webkit-scrollbar-track {
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
          -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
          border-radius: 10px;
      }

      body::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.7);
          -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.7);
      }
      .header-container{
          width: 100%;
          background-color: white;
          border-bottom: 1px solid #e8e8e8;
      }
      .section-conatiner{
          width: 100%;
          background-color: white;
      }
      #page-404 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 auto;
          flex-direction: column;
          margin: 24px 16px;
          margin-top: 0;
          box-sizing: border-box;
      }
      #page-404 .error-img{
          display: flex;
          align-items: center;
          height: 100%;
      }
      #page-404 .error-img img {
          width: 100%;
          height: auto;
          margin-bottom: 32px;
          margin-top: 24px;
          max-width: 400px;
          min-height: 400px;
      }
      #page-404 .text-container {
          text-align: center;
      }

      #page-404 .server-err {
         font-size: 20px;
         line-height: 28px;
         font-family: "futura-medium";
         margin-bottom: 12px;
      }
      #page-404 h1 {
          color: #2E054E;
          margin-top: 0px;
          font-family: "futura-medium";
          font-size: 20px;
          font-style: normal;
          line-height: 28px;
          text-align: center;
          margin-bottom: 12px;
          font-weight: 400;
      }

      #page-404.truebil h1 {
          color: #172752;
      }

      #page-404 h2 {
          font-size: 16px;
          line-height: 22px;
          color: #888;
          font-family: "futura-book";
          margin-bottom: 58px;
          margin-top: 0;
          font-weight: 400;
      }

      #page-404 .home-page-btn {
          text-align: center;
          border-radius: 6px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 16px;
      }

      #page-404 .home-page-btn a, .try-again {
          background: #ED264F;
          font-size: 14px !important;
          color: #fff;
          padding: 14px 38px;
          border-radius: 6px;
          font-family: "futura-heavy";
          white-space: nowrap;
          text-transform: uppercase;
          cursor: pointer;
      }
      #page-404.truebil .try-again {
          background: #00bbff;
      }
      #page-404.truebil .try-again:hover {
          background-color: #00aceb;
      }
      #page-404 .try-again:hover {
          background-color: #e6123e;
      }

      #page-404 .home:hover {
          background-color: rgba(232,232,232,0.6);
      }

      #page-404 .home-page-btn .home {
          background-color: #F2F3F5;
          color: #2E054E;
      }
      #page-404.truebil .home-page-btn .home {
          background-color: #ebeff5;
          color: #172752;
      }
      .error-page-header{
              display: flex;
              justify-content: space-between;
              padding: 16px 48px 16px 32px;
              box-sizing: border-box;
              align-items: center;
              margin: 0 auto;
              min-width: 978px;
              max-width: 1248px;
              width: 100%;
          }
          .btn-section{
              font-size: 18px;
              font-family: "futura-heavy";
          }
          .btn-section  a {
              color: #2E054E;
              text-decoration: none;
              margin-left: 32px;
          }
          .btn-section.truebil  a {
              color: #172752;
          }
           .spinny-logo{
               display: flex;
               margin-left: 32px;
           }
           .spinny-logo img{
              width: 140px;
           }

      #page-404 .home-page-btn a:visited {
          text-decoration: none;
      }

      #page-404 .home-page-btn a:link {
          text-decoration: none;
      }

      #page-404 .home-page-btn a:hover {
          text-decoration: none;
      }

      #page-404 .home-page-btn a:active {
          text-decoration: none;
      }

      @media only screen and (max-width: 60em) {
          .error-page-header{
              padding: 12px 16px;
              min-width: unset;
              max-width: unset;
          }
          .btn-section{
              font-size: 16px;
              font-family: "futura-demi";
          }
          .btn-section  a {
              margin-left: 16px;
          }
          .spinny-logo{
              margin-left: 0px;
          }
             .spinny-logo img{
              width: 90px;
           }
           #page-404 .error-img img {
          min-height: calc(100vw - 48px);
          max-width: unset;
          }

      }
  </style>

  <body>
        <div class="header-container">
          <div class="error-page-header">
              <a href="/" class="spinny-logo">
                  <img src="https://d308ljkq6e62o1.cloudfront.net/img/H94p_sysS3OMd2UUgsuUYA/raw/file.jpg"/>
              </a>
              <div class="btn-section">
              <a href="/sell-used-car/">SELL</a>
              <a href="/used-cars/s/">BUY</a>
          </div>
          </div>
      </div>
      <div class="section-conatiner">
          <section id="page-404">
          <div class="error-img">
          <img src=${
											statusCode === 500
												? "https://d308ljkq6e62o1.cloudfront.net/oth/f7mH6yDDR1ymczI_L%2B4J0Q/raw/file.gif"
												: "https://d308ljkq6e62o1.cloudfront.net/oth/aH6U7C0tRyOrTDGKXqlV6A/raw/file.gif"
										} />
          </div>
          <div class="text-container">
              ${statusCode === 500 ? `<div class="server-err">Server error</div>` : ""}
              <h1 class="text-center">${
															statusCode === 500
																? "Looks like our mechanics are in the process of servicing the site."
																: "Sorry, the page you're looking for doesn't exist."
														}</h1>
              <h2>${statusCode === 500 ? "Please try again in some time." : "Take a U-turn to get back on the right track."}</h2>
              <div class="home-page-btn">
                  <a onclick="handlHomePageClick()" class="home">Go Home</a>
                  <div onclick="reload()" class="try-again">Try Again</div>
              </div>
          </div>
      </section>
      </div>
          <script type="text/javascript" defer="true">
                  window.googleAnalyticsId = '${appConstant.googleAnalyticsId}';
                  window.ga4measurementId = '${appConstant.ga4measurementId}';
                  (() => {
                      const error = "404 | ${(error || "").toString()}";
                      if(error && typeof window !== undefined) {
                          if (typeof window.Sentry !== 'undefined') {
                              const catchErr = "Error occurs - " + error;
                              window.Sentry.captureException(catchErr);
                          }
                          window.dataLayer.push({
                              event: "dataLayerGenericEvent",
                              category: 'Error',
                              action: window.location.href,
                              label: error,
                          })
                          window.dataLayer.push({
                              event: "genericGA4Event",
                              eventName: "web_error",
                              eventCategory: "page_error_404",
                              componentTitle: window.location.href,
                              componentSubTitle: error
                          })
                      }
                  })()

                  function handlHomePageClick() {
                      if (window && window.ReactNativeWebView) {
                          const data = {action: "openHomepage", data: {}}
                          window.ReactNativeWebView.postMessage(JSON.stringify(data));
                      }
                      window.location.href = "/";
                  }
          </script>
      </body>
  <script>
      function reload() {
          window.location.reload(true)
      }
  </script>
      </html>
      `;

export default render404Page;
