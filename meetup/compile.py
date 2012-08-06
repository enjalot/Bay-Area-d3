
import json
import urllib2

#TODO: do this fo real
#i.e. write meetup api script to download things

f1 = open('members0_100.json', 'r')
f2 = open('members101_200.json', 'r')
f3 = open('members201_300.json', 'r')
f4 = open('members301_400.json', 'r')
f5 = open('members401_500.json', 'r')

r1 = json.load(f1)
r2 = json.load(f2)
r3 = json.load(f3)
r4 = json.load(f4)
r5 = json.load(f5)

members = r1["results"] + r2["results"] + r3["results"] + r4["results"] + r5["results"]

print len(members)

fm = open("members.json", 'w')
json.dump(members, fm)

