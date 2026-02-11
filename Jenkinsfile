pipeline {
    agent any

    options {
        timestamps()
        durabilityHint('PERFORMANCE_OPTIMIZED')
    }

    environment {
        DOCKER_BUILDKIT = "1"
        BUILDKIT_PROGRESS = "plain"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                // retry whole build once if npm/network fails
                retry(2) {
                    sh '''
                      set -euo pipefail

                      # Keep Jenkins log alive during long docker builds
                      ( while true; do echo "[keepalive] docker build running..."; sleep 20; done ) &
                      KEEPALIVE_PID=$!
                      trap 'kill $KEEPALIVE_PID 2>/dev/null || true' EXIT

                      # IMPORTANT: do NOT use --no-cache (it forces npm to re-download every time)
                      docker compose build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                  set -euo pipefail

                  echo "Bringing stack down (safe)..."
                  docker compose down --remove-orphans || true

                  echo "Starting (with rebuild if needed)..."
                  docker compose up -d --build

                  echo "Running containers:"
                  docker compose ps
                '''
            }
        }
    }

    post {
        always {
            sh '''
              echo "Disk usage:"
              df -h || true

              echo "Docker usage:"
              docker system df || true
            '''
        }
    }
}
