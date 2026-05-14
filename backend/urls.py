from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Fixed the .pk typo to .urls
    path('admin/', admin.site.urls), 
    path('api/', include('api.urls')),
]