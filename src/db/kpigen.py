#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ---------------------------------------------------------------------------
# ------------------------------ GENERATE KPIs ------------------------------
# ---------------------------------------------------------------------------
# alias kpid='echo $RANDOM | md5sum | awk "{print $1}" | head -c 12'

# Utilities
import argparse
import datetime as dt
import csv
import random as rnd
import json

# ---------------------- CONFIG VARS ----------------------

# Program info
prog_version = "0.0.1"
prog_date = "2021-05-04"
prog_description = "Generate CSVs to import into a DB."

# Programm config vars
output_path = 'src/db/sql.csv'
csv_path = 'src/db/kpi.csv'
partners = [1001,1002,1004,1005,1003,1004,1005,1006,1007,1005,1008,1009,1010,1008,1009,1010]
products = [1004,1005,1006,1007,1005,1009,1008,1009,1010,1011,1012,1013,1014,1012,1013,1014]

# ---------------------- CLI PARSER ----------------------

parser = argparse.ArgumentParser(description=prog_description)
parser.add_argument('-o', '--output', help='Output file for generated data', default=output_path)
parser.add_argument('-c', '--config', help='A filepath with the config', type=argparse.FileType('r'))
parser.add_argument('-V', '--version', help='Print the version information', action='store_true')

# Parse command line
args = parser.parse_args()

if args.version:
    print(prog_description)
    print("Version: " + str(prog_version) + " (" + str(prog_date) + ")")
    exit()

# Set the vars
config = json.load(args.config)
output_path = args.output

# ---------------------- SETUP ----------------------

edate = config['end_date'].split("-")
sdate = config['start_date'].split("-")
end_date = dt.date(int(edate[0]), int(edate[1]), int(edate[2]))
start_date = dt.date(int(sdate[0]), int(sdate[1]), int(sdate[2]))
# Python > 3.7
# end_date = dt.date.fromisoformat(config['end_date'])
# start_date = dt.date.fromisoformat(config['start_date'])
end_value = config['end_value']
start_value = config['start_value']

day_diff = (end_date - start_date).days
value_diff = end_value - start_value
value_day = round((value_diff / day_diff), 4)

if config["calculated"]:
    input_1 = "src/db/kpis/sales_volume_ac.csv"
    input_2 = "src/db/kpis/sales_price_ac.csv"
    with open(input_1) as f:
        content_1 = f.readlines()
    with open(input_2) as f:
        content_2 = f.readlines()
    vals_1 = []
    vals_2 = []
    for line in content_1:
        vals_1.append(int(line.split(",")[7].strip("'")))
    for line in content_2:
        vals_2.append(int(line.split(",")[5].strip("'")))

def generateVal(start, index):
    if config['calculated'] and vals_2[index] > 0:
        return vals_1[index] * vals_2[index]
    elif config['calculated']:
        return 0
    
    if value_diff < 70:
        change = rnd.randint(start_value, end_value)
        return round(change)
    else:
        change = rnd.randint(-5,5) / 100 * value_diff
        return round(start + change)

def generateSQL(date, value):
    string = "'" + date.isoformat() + "',"
    string += "'" + config['kpi'] + "',"
    string += str(value) + ","
    if config['rand_dims']:
        string += "'" + str(rnd.choice(partners)) + "',"
        string += "'" + str(rnd.choice(products)) + "',"
    string += "'" + config['scenario'] + "'"
    return string

# ---------------------- GENERATION ----------------------
measures = []
measures_csv = []

if config['rand_dims']:
    sql_start = "INSERT INTO `measures` (`timestamp`, `kpi`, `value`, `partner`, `product`, `scenario`) VALUES ("
else:
    sql_start = "INSERT INTO `measures` (`timestamp`, `kpi`, `value`, `scenario`) VALUES ("

sql_end = ");\n"

measures.append(sql_start + generateSQL(start_date, start_value) + sql_end)
measures_csv.append([start_date.isoformat(), start_value])

value = start_value
index = 0

for d in range(day_diff):
    date = start_date + dt.timedelta(days=d)
    r = rnd.randint(0,100)
    sql_vals = ""
    if value_day > 0 and r > 20:
        value = generateVal(value, index)
    elif value_day > 0 and r <= 20:
        value = generateVal(value, index)
    elif value_day <= 0 and r <= 20:
        value = generateVal(value, index)
    elif value_day <= 0 and r > 20:
        value = generateVal(value, index)
    measures.append(sql_start + generateSQL(date, value) + sql_end)
    measures_csv.append([date.isoformat(), value])
    index += 1


# ---------------------- OUTPUT ----------------------
# f=open(csv_path,'w')
# f.writelines(measures_csv)
# f.close()

with open(csv_path, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(measures_csv)

exit()