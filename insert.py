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
    # print(type(line))
    id = int(line.split("id:")[1][:-1].strip())
    line = line.replace('"', '""')
    # line = line.replace("'", "''")
    query = f'insert into strings (text, orig_id) values ("{line}", {id});'
    try:
        cur.execute(query)
    except Exception as e:
        print("failed query (", e, "):", query)
        exit({"this is atest": 1})

con.commit()
con.close()