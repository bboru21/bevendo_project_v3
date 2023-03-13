from django import template

register = template.Library()

def _get_red_green(score):
    red = 200-(score*2)
    green = (score*2)
    return ( red, green )

@register.filter
def get_price_score_color(score):
    (red, green) = _get_red_green(score)
    return 'rgb({},{},0)'.format(red, green)

@register.filter
def get_price_score_border_color(score):
    (red, green) = _get_red_green(score)
    red = red-30
    green = green-30
    return 'rgb({},{},0)'.format(red, green)