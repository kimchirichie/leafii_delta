from pymongo import MongoClient
import time

client = MongoClient('mongodb://127.0.0.1:3001/meteor')
db = client.meteor
data = []
for i in db.users.find():
	data = data + [i]
data_temp = data[0]
id_temp = (data_temp.get("profile").get("firstName")+" "+data_temp.get("profile").get("lastName"))
# print id_temp