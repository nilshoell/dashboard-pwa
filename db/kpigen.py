#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ---------------------------------------------------------------------------
# ------------------------------ GENERATE KPIs ------------------------------
# ---------------------------------------------------------------------------

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
output_path = 'kpi.csv'

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

def generateVal(start, direction=True):
    change = value_day * (rnd.randint(8,15) / 10)
    if direction:
        return round(start + change,2)
    else:
        return round(start - change,2)

# ---------------------- GENERATION ----------------------
measures = []
measures.append([start_date.isoformat(), config['kpi'], start_value, config['scenario']])

for d in range(day_diff):
    date = start_date + dt.timedelta(days=d)
    last_val = measures[-1][2]
    r = rnd.randint(0,100)
    if value_day > 0 and r > 20:
        measures.append([date.isoformat(), config['kpi'], generateVal(last_val), config['scenario']])
    elif value_day > 0 and r <= 20:
        measures.append([date.isoformat(), config['kpi'], generateVal(last_val, False), config['scenario']])
    elif value_day <= 0 and r <= 20:
        measures.append([date.isoformat(), config['kpi'], generateVal(last_val, False), config['scenario']])
    elif value_day <= 0 and r > 20:
        measures.append([date.isoformat(), config['kpi'], generateVal(last_val), config['scenario']])


# ---------------------- OUTPUT ----------------------
with open(output_path, 'w', newline='') as f:
    write = csv.writer(f)
    write.writerows(measures)