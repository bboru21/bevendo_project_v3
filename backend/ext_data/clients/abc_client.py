import requests
import logging
import time
import random
import json
from pathlib import Path
from django.conf import settings
from django.http import HttpResponse
from bs4 import BeautifulSoup


logger = logging.getLogger(__name__)


def cached_response(url, content, status_code=200):
    response = requests.Response()
    response.status_code = status_code
    response._content = content.encode('utf-8') if isinstance(content, str) else content
    response.url = url
    response.encoding = 'utf-8'
    response.reason = 'OK' if status_code == 200 else 'Not Found'
    return response


class ABCClient:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.session = requests.session()
        
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })

        # Initialize a flag to track if we've already visited the homepage
        self.homepage_visited = False
        self.homepage = "https://www.abc.virginia.gov/"

        self.cache_path = Path(__file__).resolve().parent.parent / 'clients' / '_cache' / 'abc_client'
        self.cache_response = settings.EXT_DATA_CLIENT_CACHE_RESPONSE

    def _make_request(self, url, headers={}, from_cache=True):
        
        response = None

        try:

            if from_cache:
                
                urlname = url.split('/')[-1]
                filepath = self.cache_path / f"{urlname}.html"

                if filepath.exists():

                    with open(filepath, 'r', encoding='utf-8') as f:
                        html_content = f.read()
                    
                    print(f"Returned cached response of {filepath}")
                    return cached_response(
                        url=filepath,
                        content=html_content,
                    )
                else:
                    return cached_response(
                        url=filepath,
                        content="Cached file not found",
                        status_code=404,
                    )
                
            if not self.homepage_visited:
                print("visiting homepage to establish session...")
                response = self.session.get(self.homepage)
                self.homepage_visited = True

                # Some sites set trap cookies to identify bots - check response for redirects
                if len(response.history) > 0:
                    print(f"Request was redirected: {response.history}")

                print(f"Cookies received: {self.session.cookies.get_dict()}")
                self.session.cookies.set('cookie_consent', 'accepted', domain='.abc.virginia.gov')

                # Add a delay after visiting homepage
                time.sleep(random.uniform(1,3))
            
            # set a proper referrer for this specific request
            headers = {
                'Referer': 'https://www.abc.virginia.gov/products',
                # Add any request-specific headers here
            }

            # Add cache-busting parameter
            cache_buster = f"{'&' if '?' in url else '?'}_={random.randint(1000000, 9999999)}"
            request_url = f"{url}{cache_buster}"

            print(f"Making request to {request_url}")
            response = self.session.get(request_url, headers=headers)
            
            # cache response
            if response.status_code == 200 and self.cache_response:
                
                urlname = url.split('/')[-1]
                filename = f'{urlname}.html'
                filepath = f'{self.cache_path}/{filename}'

                print(f"caching response as {filepath}")

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(response.text)

        except Exception as error:
            logger.error(f"Error making request to url {url}: {error}")

        return response
    

client = ABCClient()

def get_product_data(url, from_cache=False):

    data = None
    status_code = None

    resp = client._make_request(url, from_cache=from_cache)
    
    if resp:
        status_code = resp.status_code
        if resp.status_code != 200:
            print(f"url {url} returned response: {resp.status_code}: {resp.reason}, {resp.text}")
        else:
            
            try:
                soup = BeautifulSoup(resp.text, 'html.parser')
                product_data_div = soup.find(id="productData")
                data = json.loads(product_data_div["data-skus"])
            except Exception as error:
                print(f"error parsing data from {resp.url}: {error}")

    return {
        "product_data": data,
        "status_code": status_code,
        "url": url, 
    }
