from flask import Flask
import easyocr

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World'

@app.route('/ai/ocr')
def ocr():
    path = "test.png"
    reader = easyocr.Reader(['ko', 'en'])
    result = reader.readtext(path, detail = 0)
    output = ""
    for x in result:
        output += (x + " ")

    output.replace('    ','  ')
    return output

if __name__ == '__main__':
    app.run(debug=True)
