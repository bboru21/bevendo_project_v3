import requests
import logging
import datetime
import calendar

logger = logging.getLogger(__name__)


class CalapiInadiutoriumAPI():
    '''
        Calapi Inadiutorium API
        http://calapi.inadiutorium.cz/
    '''
    base_url = 'http://calapi.inadiutorium.cz/api/v0/en/calendars'
    calendar = '/general-en'

    def make_api_request(self, endpoint):
        url = f'{self.base_url}{self.calendar}{endpoint}'
        logger.debug(f'making api request to {url}')

        response = requests.get(url)
        if response.status_code != 200:
            return None

        return self.handle_api_response(response)

    def handle_api_response(self, response):
        data = response.json()
        return data


class CalapiInadiutoriumDateAPI(CalapiInadiutoriumAPI):

    def make_api_request(self, year, month=None, day=None):
        segments = []
        segments.append(str(year))
        if month:
            segments.append(str(month))
            if day:
                segments.append(str(day))

        endpoint = f'/{"/".join(segments)}'

        return super().make_api_request(endpoint)


    def get_liturgical_days_by_date_range(self, start_date=None, end_date=None):

        start_date = datetime.datetime.now() if not start_date else start_date
        end_date = start_date + datetime.timedelta(days=7) if not end_date else end_date

        results = []
        delta = datetime.timedelta(days=1)

        while start_date <= end_date:
            data = self.make_api_request(
                year=start_date.year,
                month=start_date.month,
                day=start_date.day,
            )
            results.append(data)
            start_date += delta

        return { 'results': results, 'total_results': len(results) }


    def get_liturgical_days_by_month(self, month=None, year=None):

        results = []

        month = datetime.datetime.now().month if not month else month
        year = datetime.datetime.now().year if not year else year

        (_, last_day) = calendar.monthrange(year, month)

        start_date = datetime.date.fromisoformat(f'{year}-{month}-01')
        end_date = datetime.date.fromisoformat(f'{year}-{month}-{last_day}')

        data = self.get_liturgical_days_by_date_range(start_date, end_date)
        results = data['results']

        return { 'results': results, 'total_results': len(results) }


    def get_liturgical_days_by_year(self, year=None):
        results = []

        year = datetime.datetime.now().year if not year else year

        start_date = datetime.date.fromisoformat(f'{year}-01-01')
        end_date = datetime.date.fromisoformat(f'{year}-12-31')

        data = self.get_liturgical_days_by_date_range(start_date, end_date)
        results = data['results']

        return { 'results': results, 'total_results': len(results) }

    def get_liturgical_days_by_years(self, year, num_years):
        results = []

        max_year = year+(num_years-1)
        while year <= max_year:
            data = self.get_liturgical_days_by_year(year)
            results += data['results']
            year += 1

        return { 'results': results }
