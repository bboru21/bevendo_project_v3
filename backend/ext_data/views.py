from datetime import datetime
from django.shortcuts import render
from django.http import (
    HttpResponseForbidden,
    JsonResponse,
)


from .calapi_inadiutorium_api import CalapiInadiutoriumDateAPI

def calapi_inadiutorium_api_tool(request):

    if not request.user.is_superuser:
        return HttpResponseForbidden()

    days = [d for d in range(1,32)]
    months = [m for m in range(1,13)]

    current_year = datetime.now().year
    years = [y for y in range(current_year, current_year+6)]

    if request.POST.get('submit'):
        month = request.POST.get('month')
        day = request.POST.get('day')
        year = request.POST.get('year')

        print(month, day, year)

    context = {
        'days': days,
        'months': months,
        'years': years,
    }
    return render(request, 'ext_data/calapi_inadiutorium_api_tool.html', context)


def calapi_inadiutorium_api_request(request):

    if not request.user.is_superuser:
        return HttpResponseForbidden()

    month = request.GET.get('month')
    day = request.GET.get('day')
    year = request.GET.get('year')

    data = CalapiInadiutoriumDateAPI().make_api_request(year, month=month, day=day)

    return JsonResponse(data)
