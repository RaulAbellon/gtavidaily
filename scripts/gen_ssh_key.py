#!/usr/bin/env python3
"""Genera un par de claves SSH RSA para deploy key."""
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import os

# Generar clave privada RSA 4096 bits
print("Generando par de claves RSA 4096 bits...")
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=4096,
)

# Serializar clave privada en formato OpenSSH
private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.OpenSSH,
    encryption_algorithm=serialization.NoEncryption(),
)

# Serializar clave pública en formato OpenSSH
public_ssh = private_key.public_key().public_bytes(
    encoding=serialization.Encoding.OpenSSH,
    format=serialization.PublicFormat.OpenSSH,
)

# Añadir comment a la clave pública
public_line = public_ssh.decode().strip() + " sandbox-push-gta-vi-daily\n"

# Guardar archivos
os.makedirs("/home/z/.ssh", exist_ok=True)
with open("/home/z/.ssh/gta_vi_daily_deploy", "wb") as f:
    f.write(private_pem)
os.chmod("/home/z/.ssh/gta_vi_daily_deploy", 0o600)

with open("/home/z/.ssh/gta_vi_daily_deploy.pub", "w") as f:
    f.write(public_line)

print("✅ Claves generadas en /home/z/.ssh/")
print()
print("=" * 70)
print("CLAVE PÚBLICA (copia TODO esto, incluyendo ssh-rsa y el comment):")
print("=" * 70)
print(public_line)
print("=" * 70)
