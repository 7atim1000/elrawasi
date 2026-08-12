from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Floor, Apartment, Partition

class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source='profile.image', read_only=True)
    # The source='profile.image' comes from the relationship between User and Profile
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'image', 'role']
    
# This serializer is only used to return user data.


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    image = serializers.ImageField(
        write_only=True,
        required=False
    )

    role = serializers.ChoiceField(
        choices=['user', 'vendor'],
        default='user'
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'image', 'role']
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Passwords do not match!')
        
        return data

    def create(self, validated_data):
        # username = validated_data['username']
        # email = validated_data.get('email', '')
        # password = validated_data['password']
        # user = User.objects.create_user(username=username, email=email, password=password)
        
        validated_data.pop('password2')

        # retrieve image and type from validated_data:
        # Notic use pop to accept image , type (extra fields)
        image = validated_data.pop('image', None)
        user_role = validated_data.pop('role', 'user')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )

        Profile.objects.create(
            user=user,
            image=image,
            role=user_role,
        )

        return user


    

# Floor Serializer

class FloorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Floor
        fields = ['id', 'name']




# Apartment Get Serializer
class ApartmentSerializer(serializers.ModelSerializer):
    floor_name = serializers.CharField(source='floor.name', read_only=True)

    class Meta:
        model = Apartment
        fields = [
            'id',
            'name',
            'floor',
            'floor_name',
            'status',
            'partitions',
            'complete',
            'partitions_no',
            'monthly',
            'daily',
            'price',
            'balance',
        ]



# Apartment Create Serializer
class ApartmentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Apartment
        fields = [
            'name',
            'floor',
            'status',
            'partitions',
            'complete',
            'partitions_no',
            'monthly',
            'daily',
            'price',
            'balance',
        ]

    def validate(self, data):

        # If partitions is False, partitions_no should be 0
        if not data.get('partitions', False):
            data['partitions_no'] = 0

        # Apartment should have either monthly or daily pricing
        if data.get('monthly') and data.get('daily'):
            raise serializers.ValidationError(
                "Apartment cannot be both monthly and daily."
            )

        # If every apartment must have either monthly or daily pricing, I would change the validation to:
        # if data.get('monthly') == data.get('daily'):
        #     raise serializers.ValidationError(
        #         "Apartment must be either monthly or daily."
        #     )

        return data


# Partitions Fetch Serializer
class PartitionSerializer(serializers.ModelSerializer):
    apartment_name = serializers.CharField(
        source='apartment.name',
        read_only=True
    )

    class Meta:
        model = Partition
        fields = [
            'id',
            'name',
            'apartment',
            'apartment_name',
            'daily',
            'monthly',
            'price',
            'balance',
        ]

# Partitions Fetch Serializer
class PartitionCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partition
        fields = [
            'name',
            'apartment',
            'daily',
            'monthly',
            'price',
            'balance',
        ]

    def validate(self, data):

        if data.get('daily') and data.get('monthly'):
            raise serializers.ValidationError(
                "A partition cannot be both daily and monthly."
            )

        if not data.get('daily') and not data.get('monthly'):
            raise serializers.ValidationError(
                "Please select daily or monthly."
            )

        return data
