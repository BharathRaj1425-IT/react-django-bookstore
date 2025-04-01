from django.urls import path
from .views import BookGetPost, BookPutDelete

urlpatterns = [
    path('books/', BookGetPost.as_view(), name='book-getpost'),
    path('books/<int:pk>', BookPutDelete.as_view(), name='book-putdelete')
]