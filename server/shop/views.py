from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth.models import User
from .models import Floor, Apartment, Partition

from rest_framework.response import Response
from rest_framework import status

from rest_framework.response import Response
from rest_framework import status

# dashboard
from rest_framework.views import APIView
from django.db.models import Sum

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    FloorSerializer, 
    ApartmentSerializer,
    ApartmentCreateSerializer,
    PartitionSerializer,
    PartitionCreateSerializer,
)


# Create your views here.
def home(request):
    data = {
        'message': 'Welcome to Py_Shoping!'
    }
    
    return JsonResponse(data)


# Authentication - Register
@api_view(['POST'])
@permission_classes([AllowAny])

def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
      
        return Response({"message":"User Created Successfully", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get currently logged-in user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    serializer = UserSerializer(request.user)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )



# Dashboard 
class DashboardStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        apartments_count = Apartment.objects.count()

        partitions_count = Partition.objects.count()

        # apartment_price = (
        #     Apartment.objects
        #     .filter(complete=True)
        #     .aggregate(total=Sum("price"))["total"]
        #     or 0
        # )
        apartment_price = (
            Apartment.objects
            .aggregate(total=Sum("price"))["total"]
            or 0
        )
                

        partition_price = (
            Partition.objects
            .aggregate(total=Sum("price"))["total"]
            or 0
        )

        total_price = apartment_price + partition_price

        return Response({
            "apartments_count": apartments_count,
            "partitions_count": partitions_count,
            "apartment_price": apartment_price,
            "partition_price": partition_price,
            "total_price": total_price,
        })



# Add a new floor
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_floor_view(request):

    serializer = FloorSerializer(data=request.data)

    if serializer.is_valid():
        floor = serializer.save()

        return Response(
            {
                "message": "Floor created successfully",
                "floor": FloorSerializer(floor).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# Get all floors
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def floors_view(request):

    floors = Floor.objects.all()

    serializer = FloorSerializer(floors, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

#Get all apartments
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_apartments_view(request):

    apartments = Apartment.objects.all()

    serializer = ApartmentSerializer(apartments, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

#Add a new apartment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_apartment_view(request):

    serializer = ApartmentCreateSerializer(data=request.data)

    if serializer.is_valid():

        apartment = serializer.save()

        return Response(
            {
                "message": "Apartment created successfully",
                "apartment": ApartmentSerializer(apartment).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

# Delete apartment
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_apartment_view(request, apartment_id):
    try:
        apartment = Apartment.objects.get(id=apartment_id)

        apartment.delete()

        return Response(
            {
                "message": "Apartment deleted successfully"
            },
            status=status.HTTP_204_NO_CONTENT
        )

    except Apartment.DoesNotExist:
        return Response(
            {
                "error": "Apartment not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


#Fetch all partitions: 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_apartments_partitions(request, apartment_id):

    partitions = Partition.objects.filter(
        apartment_id=apartment_id
    )

    serializer = PartitionSerializer(
        partitions,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

# Create a new Partition
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_partition(request):

    serializer = PartitionCreateSerializer(
        data=request.data
    )

    if serializer.is_valid():

        partition = serializer.save()

        return Response(
            {
                "message": "Partition Created Successfully",
                "partition": PartitionSerializer(partition).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )



# Delete Partition 
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_partition(request, partition_id):

    try:
        partition = Partition.objects.get(
            id=partition_id
        )
    except Partition.DoesNotExist:

        return Response(
            {
                "message": "Partition not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    partition.delete()

    return Response(
        {
            "message": "Partition Deleted Successfully"
        },
        status=status.HTTP_204_NO_CONTENT
    )



