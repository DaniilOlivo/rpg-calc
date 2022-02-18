from peewee import Model, CharField, BlobField
from .connection import db

class Character(Model):
    name = CharField()
    pickle = BlobField()

    class Meta:
        database = db
