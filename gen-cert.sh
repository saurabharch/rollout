#!/bin/bash

# Required
domain="localhost"
commonname="$domain"

# Change to your company details
country="IN"
state="Bihar"
locality="patna"
organization="rollout.io"
organizationalunit="Engineering"
email="saurabh@rollout.io"

# Optional
password="SecretePassword"

if [ -z "$domain" ]; then
    echo "Argument not present."
    echo "Usage $0 [common name]"
    exit 99
fi

echo "Generating key request for $domain"

# Generate SSL/TLS certificates (valid for 365 days)
mkdir -p certificates
openssl genrsa -out "./certificates/$domain-key.pem" 2048
openssl req -new -key "./certificates/$domain-key.pem" -out "./certificates/$domain-csr.pem" -passin pass:"$password" \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"

openssl x509 -req -days 365 -in "./certificates/$domain-csr.pem" -signkey "./certificates/$domain-key.pem" -out "./certificates/$domain-cert.pem"

# Generate a key
openssl genrsa -des3 -passout pass:"$password" -out "./certificates/$domain.key" 2048

# Remove passphrase from the key. Comment the line out to keep the passphrase
echo "Removing passphrase from key"
openssl rsa -in "./certificates/$domain.key" -passin pass:"$password" -out "./certificates/$domain.key"

# Create the request
echo "Creating CSR"
openssl req -new -key "./certificates/$domain.key" -out "./certificates/$domain.csr" -passin pass:"$password" \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"

# Generate certificate
openssl x509 -req -days 365 -in "./certificates/$domain-csr.pem" -signkey "./certificates/$domain.key" -out "./certificates/$domain-cert.pem"

# Rename the certificate file to have a .crt extension
mv "./certificates/$domain-cert.pem" "./certificates/$domain.crt"

echo "---------------------------"
echo "-----Below is your CSR-----"
echo "---------------------------"
echo
cat "./certificates/$domain-csr.pem"

echo
echo "---------------------------"
echo "-----Below is your Key-----"
echo "---------------------------"
echo
cat "./certificates/$domain.key"

echo
echo "---------------------------"
echo "-----Below is your CRT-----"
echo "---------------------------"
echo
cat "./certificates/$domain.crt"
