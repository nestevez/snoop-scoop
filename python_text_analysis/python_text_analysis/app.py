"""
This script runs the application using a development server.
It contains the definition of routes and views for the application.
"""

from flask import Flask, jsonify, request, url_for
import requests
import json
import os
import re
import textcnn
import eval
import tensorflow as tf

app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('config.py')

# Make the WSGI interface available at the top level so wfastcgi can get it.
wsgi_app = app.wsgi_app


@app.route('/')
def hello():
    """Render a placeholder page."""
    return "This is an api. It is not meant for viewing."

@app.route('/api/analyze', methods=['POST'])
def analysis_controller():
    """Flow control for text analysis."""
    return jsonify(send_analyzed_text(analyze_text(recieve_policy(request))))


def recieve_policy(request):
    """Load json data from the extension's request."""
    data = request.get_json()
    text = data["text"]
    return text

#@app.route('/api/analyze', methods=['GET'])
#def check():
#    """Test that we hit the api."""
#    response = analyze_text("Testing sentence. Second sentence.")
#    print("response: ", response)
#    return response

def analyze_text(data):
    """
    Analyze incoming text with azure linguistic analysis.
    Data should be a string.
    """ 
    uri = "https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze?"
    payload = {
            "language": "en",
            "analyzerIds": ["08ea174b-bfdb-4e64-987e-602f85da7f72"],
            "text": data
        }
    headers = {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': app.config['AZURE_API_KEY']}
    response = requests.post(uri, json = payload, headers = headers)
    analyzed_text = json.loads(response.text)[0]['result']
    all_words = []
    for sentence in analyzed_text:
        for word in sentence['Tokens']:
            all_words.append(word['NormalizedToken'])
    show_words = all_words
    return analyzed_text
    

def send_analyzed_text(text):
    """Converts analyzed text into json and sends it to the machine learning models."""
    # TODO: import and connect machine learning module. Call relevent method here with text.
    # text is a list of words, reduced to normalized tokens.
    # should return a dictionary with ratings for each of the three criteria.
    feed_dict = " ".join(text) #this will be part of the expected input for each ML algorithim.
    return eval_notice(feed_dict)
    

if __name__ == '__main__':
    import os
    HOST = os.environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(os.environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT)
