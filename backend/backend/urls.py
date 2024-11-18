
# from django.contrib import admin
from django.contrib import admin as django_admin

from django.urls import path,include
from api import *

urlpatterns = [
    path('admin/', django_admin.site.urls),
    path('api/', include('api.urls'))
]
