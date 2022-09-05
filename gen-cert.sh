#!/bin/bash

#Required
domain=$1
commonname=$domain

#Change to your company details
country=IN
state=Bihar
locality=Patna
organization=raindigi.com
organizationalunit=Engineering
email=saurabh@raindigi.com

#Optional
password=SecretePassword

if [ -z "$domain" ]
then
    echo "Argument not present."
    echo "Useage $0 [common name]"

    exit 99
fi

echo "Generating key request for $domain"

# Generate SSL/TLS certificates (valid for 365 days)

# openssl req -new -key ./certs/key.pem -out ./certs/csr.pem
openssl genrsa -out ./etc/ssl/certs/$domain-key.pem

echo "Creating CSR"
openssl req -new -key certs/$domain.pem -out certs/$domain-csr.pem -passin pass:$password \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"

openssl x509 -req -days 365 -in ./etc/ssl/certs/$domain-csr.pem -signkey ./etc/ssl/certs/$domain-key.pem -out ./etc/ssl/certs/$domain-cert.pem

#Generate a key
openssl genrsa -des3 -passout pass:$password -out ./etc/ssl/certs/$domain.key 2048 -noout

#Remove passphrase from the key. Comment the line out to keep the passphrase
echo "Removing passphrase from key"
openssl rsa -in etc/ssl/certs/$domain.key -passin pass:$password -out etc/ssl/certs/$domain.key

#Create the request
echo "Creating CSR"
openssl req -new -key ./etc/ssl/certs/$domain.key -out ./etc/ssl/certs/$domain.csr -passin pass:$password \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"

echo "---------------------------"
echo "-----Below is your CSR-----"
echo "---------------------------"
echo
cat etc/ssl/certs/$domain.csr

echo
echo "---------------------------"
echo "-----Below is your Key-----"
echo "---------------------------"
echo
cat ./etc/ssl/certs/$domain.key