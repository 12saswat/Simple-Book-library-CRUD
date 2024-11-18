from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status
from .models import Books
from .serializer import BookSerializers



@api_view(['GET'])
def get_books(req):
  books=Books.objects.all()
  serializedData=BookSerializers(books,many=True)
  return Response(serializedData.data)


@api_view(['POST'])
def create_books(req):
 data=req.data
 serializerData=BookSerializers(data=data)
 
 if serializerData.is_valid():
   serializerData.save()
   return Response(serializerData.data,status=status.HTTP_201_CREATED)
 return Response(serializerData.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT','DELETE'])
def Book_details(req,pk):
  try:
    book=Books.objects.get(pk = pk)
  except Books.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)
  
  if req.method == 'DELETE':
    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)  
  
  elif req.method == 'PUT':
     data=req.data
     serializerData=BookSerializers(book,data=data)
     if serializerData.is_valid():
        serializerData.save()
        return Response(serializerData.data)   
     return Response(serializerData.errors,status=status.HTTP_400_BAD_REQUEST)
   

    
  
