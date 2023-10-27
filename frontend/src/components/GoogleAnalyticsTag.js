import Script from 'next/script';

const GoogleAnalyticsTag = () => (
  <>
    {/* Google tag (gtag.js) */}
    <Script
      id="google-tag-manager"
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
    />
    <Script
      id="google-data-layer"
      strategy="lazyOnload"
    >
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
      `}
    </Script>
  </>
);

export default GoogleAnalyticsTag;