import sys
import sqlite3

if len(sys.argv) < 2:
    print("need argument")
    exit(1)

lines = []
with open(sys.argv[1], 'r') as f:
    for line in f:
        lines.append(line.strip())

con = sqlite3.connect('data.db')
cur = con.cursor()

for line in lines:
    query = f'insert into strings (text) values ("{line}");'
    cur.execute(query)

con.commit()
con.close()