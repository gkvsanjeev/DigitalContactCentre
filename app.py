from flask import Flask, render_template, request, jsonify
import urllib.request
import json
import os
import ssl

app = Flask(__name__)

# Allow self-signed certificates if necessary
def allowSelfSignedHttps(allowed):
    if allowed and not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None):
        ssl._create_default_https_context = ssl._create_unverified_context

allowSelfSignedHttps(True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    
    user_input = request.form['query']
    url = request.form['url']
    api_key = request.form['apikey']
    data = {'Query': user_input}
    body = str.encode(json.dumps(data))
    headers = {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + api_key)}

    req = urllib.request.Request(url, body, headers)

    try:
        response = urllib.request.urlopen(req)
        result = response.read()
        result_json = json.loads(result)
        
        answer = result_json.get('Output', 'No answer provided.')
        print(answer)
        return jsonify({'answer': answer})
    except urllib.error.HTTPError as error:
        return jsonify({'error': f"Request failed with status code: {error.code}"})

if __name__ == '__main__':
    app.run(debug=True)