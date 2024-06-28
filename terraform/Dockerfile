FROM hashicorp/terraform:1.9.0

RUN apk add --no-cache bash curl git

# Install Terragrunt
RUN curl -Lo /usr/local/bin/terragrunt https://github.com/gruntwork-io/terragrunt/releases/download/v0.59.6/terragrunt_linux_amd64 && \
    chmod +x /usr/local/bin/terragrunt

RUN echo 'alias tf="terragrunt"' >> ~/.bashrc

WORKDIR /workspace

ENTRYPOINT ["bash"]

