FROM eclipse-temurin:21.0.9_10-jdk
ARG KOTLIN_VERSION=2.1.10
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl unzip \
    && curl --fail --location --retry 3 \
       "https://github.com/JetBrains/kotlin/releases/download/v${KOTLIN_VERSION}/kotlin-compiler-${KOTLIN_VERSION}.zip" \
       -o /tmp/kotlin.zip \
    && curl --fail --location --retry 3 \
       "https://github.com/JetBrains/kotlin/releases/download/v${KOTLIN_VERSION}/kotlin-compiler-${KOTLIN_VERSION}.zip.sha256" \
       -o /tmp/kotlin.sha256 \
    && echo "$(cat /tmp/kotlin.sha256)  /tmp/kotlin.zip" | sha256sum -c - \
    && unzip -q /tmp/kotlin.zip -d /opt \
    && chmod -R a+rX /opt/kotlinc \
    && rm -rf /tmp/kotlin.zip /tmp/kotlin.sha256 /var/lib/apt/lists/*
ENV PATH="/opt/kotlinc/bin:${PATH}"
RUN kotlinc -version
