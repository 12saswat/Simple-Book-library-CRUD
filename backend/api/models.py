from django.db import models

class Books(models.Model):
  
  title=models.CharField(max_length=30)
  price=models.IntegerField()
  
def __str__(self):
    return self.name
  
