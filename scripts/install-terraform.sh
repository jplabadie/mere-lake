#!/bin/sh
set -eu
version=1.9.8
zip=terraform_${version}_linux_amd64.zip
url=https://releases.hashicorp.com/terraform/${version}/${zip}
expected=186e0145f5e5f2eb97cbd785bc78f21bae4ef15119349f6ad4fa535b83b10df8
curl -fsSL -o "/tmp/${zip}" "$url"
echo "${expected}  /tmp/${zip}" | sha256sum -c -
unzip -o "/tmp/${zip}" -d /tmp/terraform-bin
sudo mv /tmp/terraform-bin/terraform /usr/local/bin/terraform
terraform version
