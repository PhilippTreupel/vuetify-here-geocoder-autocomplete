# Copyright 2019 HERE Europe B.V
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
# documentation files (the "Software"), to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
# to permit persons to whom the Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of
# the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
# WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
# OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from sys import argv, stderr, exit
from json import dumps
import logging
import http.client
http.client.HTTPConnection.debuglevel = 1

logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger('requests.packages.urllib3')
requests_log.propagate = True
requests_log.setLevel(logging.DEBUG)

try:
    from requests_oauthlib import OAuth1
except ImportError as e:
    raise ImportError(f'{e.msg}\nPackage available at https://pypi.org/project/requests-oauthlib')

try:
    from requests import get, post, HTTPError
except ImportError as e:
    raise ImportError(f'{e.msg}\nPackage available at https://pypi.org/project/requests')

usage = """Usage:
    hgs_access_test.py <key-id> <key_secret>
"""

search_query = 'https://discover.search.hereapi.com/v1/discover?at=52.521,13.3807&q=berlin'

# 1. Retrieve token
try:
    data = {
        'grantType': 'client_credentials',
        'clientId': argv[1],
        'clientSecret': argv[2]
        }
except IndexError:
    stderr.write(usage)
    exit(1)

response = post(
    url='https://account.api.here.com/oauth2/token',
    auth=OAuth1(argv[1], client_secret=argv[2]) ,
    headers= {'Content-type': 'application/json'},
    data=dumps(data)).json()

try:
    token = response['accessToken']
    token_type = response['tokenType']
    expire_in = response['expiresIn']
except KeyError as e:
    print(dumps(response, indent=2))
    exit(1)

# 2. Use it in HERE Geocoding And Search query header
headers = {'Authorization': f'{token_type} {token}'}
search_results = dumps(get(search_query, headers=headers).json(), indent=2)
print(f'token:\n{token}')
print(f'token_type:\n{token_type}')
print(f'expire_in:\n{expire_in}')
print(f'headers:\n{headers}')
print(f'results:\n{search_results}')