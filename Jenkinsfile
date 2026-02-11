pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh '''
                  set -eux

                  # Make BuildKit output visible (less "silent")
                  export DOCKER_BUILDKIT=1
                  export BUILDKIT_PROGRESS=plain

                  # Keep Jenkins log alive during long builds
                  ( while true; do echo "[keepalive] build running..."; sleep 20; done ) &
                  KEEPALIVE_PID=$!

                  docker compose build --no-cache || docker compose build

                  kill $KEEPALIVE_PID || true
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                  set -eux

                  echo "Stopping old containers (if any)..."
                  docker rm -f db_c backend_c frontend_c 2>/dev/null || true

                  echo "Bringing stack down (safe)..."
                  docker compose down --remove-orphans || true

                  echo "Starting new containers..."
                  docker compose up -d

                  echo "Running containers:"
                  docker ps
                '''
            }
        }
    }
}
