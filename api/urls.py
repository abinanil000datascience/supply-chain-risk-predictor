from django.urls import path
from . import views

urlpatterns = [
    path('predict_delivery/', views.predict_delivery, name='predict_delivery'),
    path('signup/', views.signup_user, name='signup'),
    path('login/', views.login_user, name='login'),
]