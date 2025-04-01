from django.db import models

class BookModel(models.Model):
    name = models.CharField(max_length=50)
    writer = models.CharField(max_length=100)
    year = models.CharField(max_length=50)
    main_contents = models.TextField()

    def __str__(self):
        return self.name