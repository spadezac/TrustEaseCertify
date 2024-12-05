import os
from flask import Flask, send_from_directory, request, jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures.file_storage import FileStorage
import hashlib
import json
from flask_cors import CORS, cross_origin
from web3 import Web3
from utils import (
    w3,
    generate_certificate,
    test_certificate,
    verify_certificate,
    get_name_dim,
    get_qr_code_dim,
    get_fields,
    get_elements,
)

UPLOAD_FOLDER = "../uploads"
ALLOWED_MIMETYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"]

app = Flask(__name__, static_folder="../client/dist")
cors = CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["CORS_HEADERS"] = "Content-Type"


# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


def allowed_file(file: FileStorage):
    return file.mimetype in ALLOWED_MIMETYPES


@app.route("/api/upload-template", methods=["POST"])
@cross_origin()
def api():
    if "template" not in request.files:
        return {"error": "No file part"}
    file = request.files["template"]
    if file.filename == "":
        return {"error": "No selected file"}
    if file and allowed_file(file):
        filename = secure_filename(file.filename)
        contents = file.read()
        hash = hashlib.md5(contents).hexdigest()
        with open(
            os.path.join(
                app.config["UPLOAD_FOLDER"],
                "templates",
                f"{hash}.{filename.split('.')[-1]}",
            ),
            "wb",
        ) as f:
            f.write(contents)
        return {"success": True}
    else:
        return {"error": "Invalid file type"}


@app.route("/api/get-templates", methods=["GET"])
@cross_origin()
def get_templates():
    templates = os.listdir(os.path.join(app.config["UPLOAD_FOLDER"], "templates"))
    return {"templates": templates}


@app.route("/api/template/<template>", methods=["GET"])
@cross_origin()
def get_template(template):
    return send_from_directory(
        os.path.join(app.config["UPLOAD_FOLDER"], "templates"), template
    )


@app.route("/api/test/<template>", methods=["GET"])
@cross_origin()
def get_test_files(template):
    return send_from_directory(app.config["UPLOAD_FOLDER"], template)


@app.route("/api/test-certificate", methods=["POST"])
@cross_origin()
def test_certificate_app():
    print(request.json["csv"])
    name = get_elements(
        os.path.join(app.config["UPLOAD_FOLDER"], "csv", request.json["csv"]),
        request.json["name"],
    )
    name = name[0]
    font_size = request.json["font_size"]
    nx = request.json["nx"]
    ny = request.json["ny"]
    qr_code = Web3.keccak(text="").hex()
    qr_size = request.json["qr_size"] if "qr_size" in request.json else 10
    qx = request.json["qx"]
    qy = request.json["qy"]
    template = request.json["template"]
    file = test_certificate(name, template, font_size, nx, ny, qr_code, qr_size, qx, qy)
    return {"success": True, "file": f'data:image/png;base64,{file.decode("utf-8")}'}


@app.route("/api/generate-certificate", methods=["POST"])
@cross_origin()
def generate_certificate_app():
    csv = request.json["csv"]
    field = request.json["name"]
    font_size = request.json["font_size"]
    nx = request.json["nx"]
    ny = request.json["ny"]
    qr_code = Web3.keccak(text="").hex()
    qr_size = request.json["qr_size"]
    qx = request.json["qx"]
    qy = request.json["qy"]
    template = request.json["template"]
    generate_certificate(
        template, csv, field, font_size, nx, ny, qr_code, qr_size, qx, qy
    )
    return {"success": True}


@app.route("/api/verify-certificate/<certificate_id>", methods=["GET"])
@cross_origin()
def verify_certificate_app(certificate_id):
    if not certificate_id:
        return {"error": "No certificate ID provided"}
    elif not w3.is_encodable("bytes32", certificate_id):
        return {"error": "Invalid certificate ID"}
    try:
        return jsonify(verify_certificate(certificate_id))
    except Exception as e:
        print(e)


@app.route("/api/get-name-dim", methods=["POST"])
@cross_origin()
def getnamedim():
    name = get_elements(
        os.path.join(app.config["UPLOAD_FOLDER"], "csv", request.json["csv"]),
        request.json["name"],
    )
    name = name[0]
    font_size = request.json["font_size"]
    return {"success": True, "dim": get_name_dim(name, font_size)}


@app.route("/api/get-qr-code-dim", methods=["POST"])
@cross_origin()
def getqrcodedim():
    qr_code = Web3.keccak(text="").hex()
    return {"success": True, "dim": get_qr_code_dim(qr_code)}


@app.route("/api/upload-csv", methods=["POST"])
@cross_origin()
def upload_csv():
    if "csv" not in request.files:
        return {"error": "No file part"}
    file = request.files["csv"]
    if file.filename == "":
        return {"error": "No selected file"}
    if file and file.mimetype == "text/csv":
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], "csv", filename))
        return {"success": True}
    else:
        return {"error": "Invalid file type"}


@app.route("/api/get-csv", methods=["GET"])
@cross_origin()
def get_csv():
    csvs = []
    csv_names = os.listdir(os.path.join(app.config["UPLOAD_FOLDER"], "csv"))
    for i in csv_names:
        csv = {}
        csv["name"] = i
        csv["fields"] = get_fields(os.path.join(app.config["UPLOAD_FOLDER"], "csv", i))
        csvs.append(csv)
    return {"csvs": csvs}


if __name__ == "__main__":
    app.run(use_reloader=True, port=5000, threaded=True)
