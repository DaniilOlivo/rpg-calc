from peewee import Model, CharField, BlobField, TextField
from .connection import db


class CoreGame (Model):
    id_controller = CharField()
    json_shandow = TextField()

    class Meta:
        database = db
