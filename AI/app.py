from flask import Flask, request;
import easyocr
from werkzeug.utils import secure_filename;
app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World'

@app.route('/ai/ocr', methods=['POST'])
def ocr():
    file = request.files['file']
    file.save('./tmp/' + secure_filename(file.filename));
    path = './tmp/' + secure_filename(file.filename);
    
    reader = easyocr.Reader(['ko', 'en'])
    result = reader.readtext(path, detail = 0)
    output = ""
    for x in result:
        output += (x + " ")

    output.replace('    ','  ')
    return output

if __name__ == '__main__':
    app.run(debug=True)
