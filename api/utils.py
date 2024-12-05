from PIL import Image, ImageDraw, ImageFont
import qrcode
import pandas as pd
import os
from werkzeug.utils import secure_filename
from web3 import Web3
import base64
from io import BytesIO
from blockchain import abi, address

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
contract = w3.eth.contract(address=address, abi=abi)


def generate_certificate(
    template: str,
    filename: str,
    field: str,
    font_size: int,
    x: int,
    y: int,
    qr_code: str,
    qr_size: int,
    qr_x: int,
    qr_y: int,
) -> None:
    names = get_elements(f"../uploads/csv/{filename}", field)
    if not os.path.exists(f"../uploads/generated/{template}"):
        os.makedirs(f"../uploads/generated/{template}")
    for name in names:
        img = Image.open(f"../uploads/templates/{template}")
        draw = ImageDraw.Draw(img)
        font = ImageFont.truetype("OpenSans-Regular.ttf", font_size)
        qr_code = Web3.solidity_keccak(["string", "string"], [name, template]).hex()
        qr = qrcode.make(qr_code, box_size=qr_size, border=0)
        _, _, w, h = draw.textbbox((0, 0), text=name, font=font)
        draw.text((x - w / 2, y - h / 2), name, font=font, fill=(0, 0, 0))
        img.paste(qr, (int(qr_x), int(qr_y)))
        filename = f"../uploads/generated/{template}/{secure_filename(name)}.png"
        img.save(filename)
        try:
            contract.functions.generateCertificate(name, template).transact(
                {"from": "0xB12Dbe2733b81E51f202eA4BDE2fEF8174a7e428"}
            )
        except:
            continue


def test_certificate(
    name: str,
    template: str,
    font_size: int,
    x: int,
    y: int,
    qr_code: str,
    qr_size: int,
    qr_x: int,
    qr_y: int,
) -> str:
    img = Image.open(f"../uploads/templates/{template}")
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("OpenSans-Regular.ttf", font_size)
    qr = qrcode.make(qr_code, box_size=qr_size, border=0)
    _, _, w, h = draw.textbbox((0, 0), text=name, font=font)
    draw.text((x - w / 2, y - h / 2), name, font=font, fill=(0, 0, 0))
    img.paste(qr, (int(qr_x), int(qr_y)))
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    # contract.functions.generateCertificate(name, "").transact(
    #     {"from": "0xc8387e91f1E6fC8BF072dE7ba50660d3B2A3DdDe"}
    # )
    return base64.b64encode(buffered.getvalue())


def verify_certificate(certificate_id: str) -> dict:
    response = {}
    try:
        candidate_name, template = contract.functions.getCertificate(
            certificate_id
        ).call()
        response["candidate_name"] = candidate_name
        response["template"] = template
        response["verified"] = True
    except:
        response["verified"] = False
    return response


def write_name(name: str, font_size: int, x: int, y: int, template: str) -> str:
    img = Image.open(f"../uploads/templates/{template}")
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("OpenSans-Regular.ttf", font_size)
    _, _, w, h = draw.textbbox((0, 0), text=name, font=font)
    print(x, y)
    draw.text((x - w / 2, y - h / 2), name, font=font, fill=(0, 0, 0))
    filename = f"../uploads/generated.png"
    img.save(filename)
    return filename


def add_qr_code(template: str, qr_code: str, qr_size: int, x: int, y: int) -> str:
    print(qr_size)
    img = Image.open(f"../uploads/generated.png")
    qr = qrcode.make(qr_code, box_size=qr_size, border=0)
    img.paste(qr, (int(x), int(y)))
    filename = f"../uploads/generated.png"
    img.save(filename)
    return filename


def get_name_dim(name: str, font_size: int) -> dict:
    img = Image.new("RGB", (100, 100), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("OpenSans-Regular.ttf", font_size)
    _, _, w, h = draw.textbbox((0, 0), name, font=font)
    print(w, h)
    return {"w": w, "h": h}


def get_qr_code_dim(qr_code: str) -> dict:
    qr = qrcode.make(qr_code, box_size=10, border=0)
    return {"w": qr.height, "h": qr.height}


def get_fields(filename: str) -> list:
    df = pd.read_csv(filename)
    return df.columns.tolist()


def get_elements(filename: str, field: str) -> list:
    df = pd.read_csv(filename)
    return df[field].tolist()
