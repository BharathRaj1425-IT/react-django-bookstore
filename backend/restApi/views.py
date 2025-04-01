from rest_framework import generics
from .serializers import BookSerializer
from .models import BookModel

class BookGetPost(generics.ListCreateAPIView):
    queryset = BookModel.objects.all()
    serializer_class = BookSerializer

class BookPutDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookModel.objects.all()
    serializer_class = BookSerializer