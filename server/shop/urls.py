from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', views.home),

    # Authentication
    path('register/', views.register_view),
    path('me/', views.me_view),

    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Dashboard
    path(
    "dashboard/stats/",
    views.DashboardStatsView.as_view(),
    ),
    #Because DashboardStatsView inherits from APIView, your URL should normally use .as_view().
    
    

    # Floors
    path('floors/', views.floors_view),
    path('floors/add/', views.add_floor_view),

     # Apartments
    path('apartments/', views.get_apartments_view),
    path('apartments/add/', views.add_apartment_view),
    path(
    'apartments/<int:apartment_id>/delete/',
    views.delete_apartment_view,
    name='delete_apartment'
),

   # Partitions
   path(
        'apartments/<int:apartment_id>/partitions/',
        views.get_apartments_partitions,
    ),

    path(
        'partitions/add/',
        views.add_partition,
    ),

    path(
        'partitions/<int:partition_id>/delete/',
        views.delete_partition,
    ),

]