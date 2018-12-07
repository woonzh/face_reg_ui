#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Dec  6 13:57:59 2018

@author: zhenhao
"""

from flask import Flask, render_template
from flask_cors import CORS
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)
CORS(app)

@app.route('/')
def hello():
    return render_template('index2.html')

if __name__ == '__main__':
     app.run(debug=True, host='localhost', port=9000)